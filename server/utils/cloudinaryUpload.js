import streamifier from 'streamifier';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';

export const uploadBufferToCloudinary = (buffer, { folder, resourceType = 'image' }) => {
  if (!isCloudinaryConfigured()) {
    const err = new Error(
      'Media upload is not configured yet. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in server/.env.'
    );
    err.statusCode = 503;
    return Promise.reject(err);
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export const destroyCloudinaryAsset = async (publicId, resourceType = 'image') => {
  if (!publicId || !isCloudinaryConfigured()) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.warn('Failed to destroy cloudinary asset', publicId, err.message);
  }
};
