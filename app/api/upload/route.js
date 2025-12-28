import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createGame } from '@/lib/sheets';
import { uploadPDF } from '@/lib/storage';
import { extractTitleFromFilename } from '@/lib/pdfProcessor';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return Response.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Upload PDF to storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const pdfUrl = await uploadPDF(buffer, session.user.id, file.name);

    // Extract title from filename
    const title = extractTitleFromFilename(file.name);

    // Create game record
    const gameId = await createGame({
      title,
      userId: session.user.id,
      pdfUrl,
      pdfFileName: file.name,
    });

    // Trigger processing (async) - use internal URL in production
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    console.log('Triggering processing for game:', gameId);
    fetch(`${baseUrl}/api/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameId }),
    })
    .then(res => {
      if (!res.ok) {
        console.error('Processing trigger failed:', res.status, res.statusText);
        return res.text().then(text => {
          console.error('Processing error response:', text);
        });
      }
      console.log('Processing triggered successfully');
    })
    .catch(err => {
      console.error('Failed to trigger processing:', err);
      console.error('Error details:', err.message, err.stack);
    });

    return Response.json({
      gameId,
      status: 'processing',
      title,
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      { 
        error: 'Failed to upload file', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

