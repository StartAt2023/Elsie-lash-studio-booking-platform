import { v2 as cloudinary } from "cloudinary";

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

function ensureConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

/**
 * @param {Buffer} buffer
 * @returns {Promise<{ url: string; publicId: string }>}
 */
export async function uploadImageBuffer(buffer) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }
  ensureConfig();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "elsie-lash-gallery",
        resource_type: "image",
      },
      (err, result) => {
        if (err) return reject(err);
        if (!result?.secure_url || !result?.public_id) {
          return reject(new Error("Cloudinary upload returned no URL"));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/**
 * @param {string} publicId
 */
export async function destroyImage(publicId) {
  if (!publicId || !isCloudinaryConfigured()) return;
  ensureConfig();
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.error("[cloudinaryService] destroy failed:", err.message || err);
  }
}
