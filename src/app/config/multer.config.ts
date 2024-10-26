import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./coudinary.config";
import multer from "multer";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
});

export const multerUpload = multer({ storage });
