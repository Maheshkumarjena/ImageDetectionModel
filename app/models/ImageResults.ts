import mongoose from 'mongoose';

const ImageResultSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  label: { type: String, required: true },
  confidence: { type: Number, required: true },
  aiProbability: { type: Number },
  photoshopProbability: { type: Number },
  originalProbability: { type: Number },
  extraData: { type: String }
}, { timestamps: true });

export default mongoose.models.ImageResult || mongoose.model('ImageResult', ImageResultSchema);
