import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
import { log } from "console";


dotenv.config();
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CloudinaryUploadFile = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFilePath);
    
    return response;
  } catch (error) {
    console.error("Upload failed", error);
    // Remove local file and provide a callback function to handle the error
    fs.unlink(localFilePath, (err) => {
      if (err) {
        console.error("Failed to delete local file", err);
      } else {
        console.log("Local file deleted successfully");
      }
    });
    return null; // remove local file
  }
};

export { CloudinaryUploadFile };
