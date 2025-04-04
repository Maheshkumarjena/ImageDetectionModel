// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface AnalysisResult {
  aiProbability: number;
  photoshopProbability: number;
  originalProbability: number;
  extraData?: string;
}

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = formidable({
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    multiples: false,
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResult | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { files } = await parseForm(req);
    const imageFile = files.image?.[0] || files.image;

    if (!imageFile || Array.isArray(imageFile)) {
      return res.status(400).json({ error: 'No valid image uploaded' });
    }

    // Simulated analysis logic (replace with real model/api call)
    const simulatedResult: AnalysisResult = {
      aiProbability: Math.floor(Math.random() * 100),
      photoshopProbability: Math.floor(Math.random() * 100),
      originalProbability: Math.floor(Math.random() * 100),
      extraData: 'Possible manipulation around the eyes',
    };

    return res.status(200).json(simulatedResult);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error while processing image' });
  }
}
