import multer, { StorageEngine } from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure the uploads directory exists
const uploadDir: string = path.join(process.cwd(), './public/temp');
fs.mkdirSync(uploadDir, { recursive: true });

const storage: StorageEngine = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void): void {
    cb(null, uploadDir);
  },
  filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void): void {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export { upload };
