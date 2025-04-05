// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import { MongoClient } from 'mongodb';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import { load } from 'timm';
import * as torch from 'torch-node';

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({ storage: multer.memoryStorage() });

// MongoDB Connection
const uri = 'mongodb://localhost:27017/'; // Replace with your MongoDB connection string
const client = new MongoClient(uri);

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('image_detection_db').collection('image_uploads');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

// Load the model
const model = load('vit_medium_patch16_224', { pretrained: false, numClasses: 2 });
const modelPath = './ai_image_detector_hf/pytorch_model.bin';
model.loadStateDict(torch.load(modelPath));
model.eval();

const imageProcessor = torch.node.transforms.compose([
    torch.node.transforms.resize(224),
    torch.node.transforms.centerCrop(224),
    torch.node.transforms.toTensor(),
    torch.node.transforms.normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
]);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    upload.single('image')(req as any, res as any, async (err: any) => {
      if (err) {
        return res.status(500).json({ error: 'Error uploading image' });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No image provided' });
        }

        const imageBuffer = req.file.buffer;

        const processedImage = sharp(imageBuffer).resize(224, 224).toBuffer();
        const imageTensor = imageProcessor(torch.node.readImageBuffer(await processedImage)).unsqueeze(0);

        const output = model(imageTensor);
        const probabilities = torch.nn.functional.softmax(output, 1).tolist()[0];

        const imageData = {
          filename: req.file.originalname,
          real_probability: probabilities[0],
          fake_probability: probabilities[1],
          upload_timestamp: new Date().toISOString(),
          image_data: imageBuffer.toString('base64'),
        };

        const collection = await connectToDatabase();
        await collection.insertOne(imageData);

        res.json({ message: 'Image uploaded and processed successfully' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}