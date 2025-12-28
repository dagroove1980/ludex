import { put } from '@vercel/blob';

export async function uploadPDF(file, userId, filename) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set. Please create a Blob store in Vercel Dashboard → Storage.');
    }
    
    const blob = await put(`pdfs/${userId}/${filename}`, file, {
      access: 'public',
      contentType: 'application/pdf',
    });
    return blob.url;
  } catch (error) {
    console.error('Blob upload error:', error);
    if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      throw error;
    }
    throw new Error(`Failed to upload PDF to blob storage: ${error.message}`);
  }
}

export async function uploadImage(file, gameId) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error('BLOB_READ_WRITE_TOKEN environment variable is not set. Please create a Blob store in Vercel Dashboard → Storage.');
    }
    
    const blob = await put(`og-images/${gameId}.jpg`, file, {
      access: 'public',
      contentType: 'image/jpeg',
    });
    return blob.url;
  } catch (error) {
    console.error('Blob image upload error:', error);
    if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
      throw error;
    }
    throw new Error(`Failed to upload image to blob storage: ${error.message}`);
  }
}

