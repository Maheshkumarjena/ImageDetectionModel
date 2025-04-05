import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import uploadToCloudinary from '../../../../lib/cloudinary';
import ImageResult from "../../../../models/ImageResults"
import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import connectToDB from '../../../../lib/mongodb';
// import { Image } from 'cloudinary/types/v2';
import { imageAnalysis } from '../../../../lib/imageAnalysis';

console.log("🔁 API Route Initialized: /api/analyze");

const uploadDir = path.join(process.cwd(), './public/temp');
console.log("📂 Temp Upload Directory:", uploadDir);
fs.mkdirSync(uploadDir, { recursive: true });
console.log("✅ Upload directory ensured");

function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export async function POST(req: NextRequest) {
  console.log("📩 POST request received");

  try {
    const formData = await req.formData();
    console.log("✅ FormData extracted");

    const file = formData.get('image') as File;

    if (!file) {
      console.error("❌ No file found in formData");
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log("📸 File found:", file.name);

    const bytes = await file.arrayBuffer();
    console.log("📥 File buffer extracted");

    const buffer = Buffer.from(bytes);
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    console.log("💾 Saving file to:", filePath);
    fs.writeFileSync(filePath, buffer);
    console.log("✅ File written locally");

    if (typeof connectToDB === 'function') {
      await connectToDB();
    } else {
      console.error("❌ connectToDB is not a function");
      throw new Error("Database connection failed");
    }
    console.log("✅ MongoDB connected");

    const cloudinaryUrl = await uploadToCloudinary(filePath);
    console.log("☁️ Uploaded to Cloudinary:", cloudinaryUrl);
    let analysis;
    const handleAnalysis = async () => {
      analysis = await imageAnalysis(cloudinaryUrl);
      console.log("🔍 Final AI Type:", analysis); // You'll get the actual value here
    };
    await handleAnalysis()

    console.log("ai generated--------------<>>>>", analysis)
    const fakeResult = {
      label: 'AI-generated',
      confidence: 0,
      aiProbability: (analysis.ai_generated)*100,
      photoshopProbability: Math.random() * 100,
      originalProbability:(100-((analysis.ai_generated)*100)),
      extraData: 'Simulated prediction data',
    };

    console.log("🧠 Analysis result prepared");

    const saved = await ImageResult.create({
      imageUrl: cloudinaryUrl,
      ...fakeResult,
    });
    console.log("💾 Result saved to MongoDB:", saved._id);

    return NextResponse.json({
      ...fakeResult,
      imageUrl: cloudinaryUrl,
      _id: saved._id,
    });
  } catch (err: any) {
    console.error("🔥 ERROR during analysis:", err.message || err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  } finally {
    try {
      const allFiles = fs.readdirSync(uploadDir);
      console.log("🧹 Temp files before cleanup:", allFiles);

      const latestFile = allFiles.sort((a, b) => fs.statSync(path.join(uploadDir, b)).mtime.getTime() - fs.statSync(path.join(uploadDir, a)).mtime.getTime())[0];
      const latestFilePath = path.join(uploadDir, latestFile);

      if (fs.existsSync(latestFilePath)) {
        fs.unlinkSync(latestFilePath);
        console.log("🧹 Temp file deleted:", latestFilePath);
      }
    } catch (cleanupErr) {
      console.warn("⚠️ Cleanup failed:", cleanupErr);
    }
  }
}
