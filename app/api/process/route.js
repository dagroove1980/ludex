import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getGameById, updateGame } from '@/lib/sheets';
import { extractTextFromPDF } from '@/lib/pdfProcessor';
import { processGameRules } from '@/lib/aiProcessor';
import axios from 'axios';

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

    if (game.status === 'completed') {
      return Response.json({ message: 'Already processed', game });
    }

    try {
      // Download PDF
      const pdfResponse = await axios.get(game.pdfUrl, {
        responseType: 'arraybuffer',
      });
      const pdfBuffer = Buffer.from(pdfResponse.data);

      // Extract text
      const pdfText = await extractTextFromPDF(pdfBuffer);

      // Process with AI
      const processed = await processGameRules(game.title, pdfText);

      // Update game in Sheets
      await updateGame(gameId, session.user.id, {
        status: 'completed',
        sections: processed.sections || [],
        strategyTips: processed.strategyTips || [],
        quickStart: processed.quickStart || {},
        updatedAt: new Date().toISOString(),
      });

      return Response.json({
        success: true,
        gameId,
        status: 'completed',
      });
    } catch (error) {
      console.error('Processing error:', error);
      
      // Update with error status
      await updateGame(gameId, session.user.id, {
        status: 'error',
        errorMessage: error.message,
        updatedAt: new Date().toISOString(),
      });

      return Response.json(
        { error: 'Processing failed', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Process route error:', error);
    return Response.json(
      { error: 'Failed to process game', details: error.message },
      { status: 500 }
    );
  }
}

