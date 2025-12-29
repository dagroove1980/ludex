import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getGameById, updateGame } from '@/lib/sheets';
import { searchGameImage } from '@/lib/imageCrawler';
import axios from 'axios';
import { uploadImage } from '@/lib/storage';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId } = await request.json();
    if (!gameId) {
      return Response.json({ error: 'Game ID required' }, { status: 400 });
    }

    // Get game and verify ownership
    const game = await getGameById(gameId, session.user.id);
    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    // Search for image
    const imageUrl = await searchGameImage(game.title);
    
    if (imageUrl) {
      // Download and upload to our storage
      try {
        const imageResponse = await axios.get(imageUrl, {
          responseType: 'arraybuffer',
        });
        const imageBuffer = Buffer.from(imageResponse.data);
        const contentType = imageResponse.headers['content-type'] || 'image/jpeg';
        const uploadedUrl = await uploadImage(imageBuffer, gameId, contentType);
        
        // Update game
        await updateGame(gameId, session.user.id, {
          ogImageUrl: uploadedUrl,
        });

        return Response.json({ imageUrl: uploadedUrl });
      } catch (error) {
        console.error('Image upload error:', error);
        // Fall through to return original URL or null
      }
    }

    return Response.json({ 
      imageUrl: imageUrl || null,
      message: imageUrl ? 'Image found' : 'No image found',
    });
  } catch (error) {
    console.error('Image route error:', error);
    return Response.json(
      { error: 'Failed to generate image', details: error.message },
      { status: 500 }
    );
  }
}





