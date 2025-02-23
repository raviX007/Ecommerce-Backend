// Import required modules
import express, { Request, Response } from "express";
import multer from "multer";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file handling
const upload = multer({ dest: "uploads/" });

// POST endpoint to handle file upload and additional text parameters
app.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      // Extract text parameters from the request body
      const { param1, param2, param3, param4 } = req.body;

      // Ensure the file and all parameters are present
      if (!req.file || !param1 || !param2 || !param3 || !param4) {
        return res.status(400).json({ error: "Missing file or parameters" });
      }

      // Prepare data for Cloudinary upload
      const filePath = path.join(__dirname, req.file.path);
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
      const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // Unsigned upload preset

      // Create form data for the request
      const formData = new FormData();
      formData.append("file", fs.createReadStream(filePath));
      formData.append("upload_preset", uploadPreset);

      // Make the API call to Cloudinary
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: formData.getHeaders(),
      });

      // Delete the temporary file after upload
      fs.unlinkSync(filePath);

      // Extract the uploaded file URL from the response
      const uploadedFileUrl = response.data.secure_url;

      // Return the uploaded file URL and additional parameters
      res.json({
        uploadedFileUrl,
        param1,
        param2,
        param3,
        param4,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "File upload failed" });
    }
  }
);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
