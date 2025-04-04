import { NextRequest } from 'next/server';
import formidable from 'formidable';
import { readFile } from 'fs/promises';

// Required for form parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
    }

    // Simulate analysis
    const result = {
      aiProbability: Math.floor(Math.random() * 100),
      photoshopProbability: Math.floor(Math.random() * 100),
      originalProbability: Math.floor(Math.random() * 100),
      extraData: 'Possible manipulation around the eyes',
    };

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
