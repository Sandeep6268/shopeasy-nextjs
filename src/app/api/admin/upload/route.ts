// app/api/admin/upload/route.ts - UPDATED FOR CLOUDINARY
import { NextRequest, NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary-upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadedUrls: string[] = [];
    const uploadResults: any[] = [];

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      try {
        const result = await uploadToCloudinary(file, {
          folder: 'ecommerce-products',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'auto' }
          ]
        });

        uploadedUrls.push(result.secure_url);
        uploadResults.push({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          bytes: result.bytes
        });

        console.log('Uploaded to Cloudinary:', result.secure_url);

      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        continue; // Skip this file and continue with others
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json({ 
        error: 'No valid image files uploaded or all uploads failed' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      message: 'Files uploaded successfully to Cloudinary',
      urls: uploadedUrls,
      details: uploadResults
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}