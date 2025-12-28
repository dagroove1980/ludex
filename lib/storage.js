import { put } from '@vercel/blob';

export async function uploadPDF(file, userId, filename) {
  const blob = await put(`pdfs/${userId}/${filename}`, file, {
    access: 'public',
    contentType: 'application/pdf',
  });
  return blob.url;
}

export async function uploadImage(file, gameId) {
  const blob = await put(`og-images/${gameId}.jpg`, file, {
    access: 'public',
    contentType: 'image/jpeg',
  });
  return blob.url;
}

