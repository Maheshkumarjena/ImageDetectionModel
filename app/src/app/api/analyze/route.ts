import { NextRequest, NextResponse } from 'next/server';
import { imageAnalysis } from '../../../../lib/imageAnalysis';
import connectToDB from '../../../../lib/mongodb';
import uploadToCloudinary from '../../../../lib/cloudinary';
import ImageResult from '../../../../models/ImageResults';

console.log("🔁 API Route Initialized: /api/analyze");

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log("📥 File buffer created");

    // Connect to MongoDB
    if (typeof connectToDB === 'function') {
      await connectToDB();
      console.log("✅ MongoDB connected");
    } else {
      throw new Error("❌ connectToDB is not a function");
    }

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(buffer, file.name);
    console.log("☁️ Uploaded to Cloudinary:", cloudinaryUrl);

    // Analyze image using your ML model
    const analysis: any = await imageAnalysis(cloudinaryUrl);
    console.log("🔍 AI Analysis:", analysis);

    // Simulated results (replace with real values if needed)
    const fakeResult = {
      label: 'AI-generated',
      confidence: 0,
      aiProbability: (analysis?.ai_generated || 0) * 100,
      photoshopProbability: Math.random() * 100,
      originalProbability: 100 - ((analysis?.ai_generated || 0) * 100),
      extraData: 'Simulated prediction data',
    };

    console.log("🧠 Analysis result prepared");

    // Save to MongoDB
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
  }
}
