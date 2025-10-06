// app/api/admin/upload/delete/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteFromCloudinary } from '@/lib/cloudinary-upload';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get('publicId');

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    await deleteFromCloudinary(publicId);

    return NextResponse.json({ 
      message: 'Image deleted successfully from Cloudinary'
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}