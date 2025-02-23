import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const uploadToCloudinary = async (filePath: string): Promise<string> => {
  try {
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
    const apiKey = process.env.CLOUDINARY_API_KEY; // ✅ Required even for unsigned uploads

    if (!uploadPreset || !apiKey || !process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error(
        "Missing Cloudinary credentials in environment variables."
      );
    }

    // Create form data for the request
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("upload_preset", uploadPreset);
    formData.append("api_key", apiKey); // ✅ Required even for unsigned uploads

    // Make the API call to Cloudinary
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: formData.getHeaders(),
    });

    // Delete the temporary file after upload
    fs.unlinkSync(filePath);

    // Return the uploaded file URL
    console.log("new url from cloudinary", response.data.secure_url);
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};

export default uploadToCloudinary;
