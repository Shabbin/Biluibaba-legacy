import multer, { StorageEngine, FileFilterCallback, Multer } from 'multer';
import { Request } from 'express';

type FileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void;

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpg',
  'image/jpeg',
  'application/pdf',
];

/**
 * Creates a multer instance with the provided storage configuration
 * and file filter for allowed file types
 */
const createUploader = (storage: StorageEngine): Multer => {
  const fileFilter: FileFilter = (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only .png, .jpg, .jpeg and .pdf formats are allowed!'));
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
  });
};

export default createUploader;
