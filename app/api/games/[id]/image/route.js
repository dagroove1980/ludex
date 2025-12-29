import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { getGameById, updateGame } from '@/lib/sheets';
import { uploadImage } from '@/lib/storage';

export async function POST(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    
    // Verify game ownership
    const game = await getGameById(id, session.user.id);
    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to blob storage
    const imageUrl = await uploadImage(buffer, id, file.type);

    // Update game with new image URL
    await updateGame(id, session.user.id, {
      ogImageUrl: imageUrl,
    });

    return Response.json({ 
      success: true,
      imageUrl 
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return Response.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}

