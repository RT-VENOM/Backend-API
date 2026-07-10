import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine the folder based on the route (e.g., profiles vs recipes)
    const folderName = req.baseUrl.includes("profile")
      ? "cookbook_profiles"
      : "cookbook_recipes";

    return {
      folder: folderName,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      transformation: [{ width: 1200, crop: "limit" }], // Optimize large images
    };
  },
});

export const upload = multer({ storage });
