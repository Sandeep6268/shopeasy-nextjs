// lib/cloudinary-upload.ts
import cloudinary, { UploadApiResponse } from '@/lib/cloudinary';

export interface UploadOptions {
  folder?: string;
  transformation?: any[];
}

export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<UploadApiResponse> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      base64String,
      {
        folder: options.folder || 'ecommerce-products',
        transformation: options.transformation || [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
          { format: 'auto' }
        ]
      },
      (error: any, result: UploadApiResponse | undefined) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error('Upload failed: No result returned'));
        }
      }
    );
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error: any, result: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}