import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// Optional: You can remove this if you no longer want to log the keys
console.log("cloudinary config:", process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET);

cloudinary.config({ 
  cloud_name: 'diiopqo1y', 
  api_key: '556316231398198',
  api_secret: "tFVVkEkNjKlic2gKQCRU6PsMROk"
});

export const uploadToCloudinary = async (localFilePath: string): Promise<string> => {
  try {
    if (!localFilePath) {
      throw new Error('File path is required');
    }

    const fileName: string = path.basename(localFilePath, path.extname(localFilePath));

    const response: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
      public_id: `app/${fileName}`,
    });

    console.log('Uploaded URL:', response.secure_url);
    return response.secure_url;
  } catch (error: any) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Cloudinary upload failed:', error.message || error);
    throw error;
  }
};

export default uploadToCloudinary;
