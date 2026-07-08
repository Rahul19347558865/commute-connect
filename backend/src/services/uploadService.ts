import cloudinary from '../config/cloudinary.js';

/**
 * UploadService - Dedicated service isolating image upload streaming
 * calls to Cloudinary.
 */
export class UploadService {
  /**
   * Uploads an avatar image buffer directly to Cloudinary.
   * Performs cropping transformations to optimize image size.
   */
  static async uploadAvatar(fileBuffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      // Create Cloudinary upload stream
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'commute_connect_avatars',
          allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
          transformation: [
            { width: 300, height: 300, crop: 'thumb', gravity: 'face', zoom: '0.75' },
          ],
        },
        (error, result) => {
          if (error) {
            return reject(new Error(`Cloudinary upload failed: ${error.message}`));
          }
          if (!result) {
            return reject(new Error('Cloudinary upload failed: Empty response.'));
          }
          resolve(result.secure_url);
        }
      );

      // Write stream buffer
      uploadStream.end(fileBuffer);
    });
  }
}
