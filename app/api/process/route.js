import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getGameById, updateGame } from '@/lib/sheets';
import { extractTextFromPDF } from '@/lib/pdfProcessor';
import { processGameRules } from '@/lib/aiProcessor';
import axios from 'axios';

export const maxDuration = 60; // 60 seconds - Vercel Hobby limit is 10s, but we'll try

export async function POST(request) {
  try {
    console.log('Processing request received');
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      console.error('Unauthorized: No session');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId } = await request.json();
    if (!gameId) {
      console.error('Missing gameId');
      return Response.json({ error: 'Game ID required' }, { status: 400 });
    }

    console.log('Processing game:', gameId);

    // Get game and verify ownership
    const game = await getGameById(gameId, session.user.id);
    if (!game) {
      console.error('Game not found:', gameId);
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    if (game.status === 'completed') {
      console.log('Game already processed:', gameId);
      return Response.json({ message: 'Already processed', game });
    }

    try {
      console.log('Downloading PDF from:', game.pdfUrl);
      // Download PDF
      const pdfResponse = await axios.get(game.pdfUrl, {
        responseType: 'arraybuffer',
        timeout: 30000, // 30 second timeout
      });
      const pdfBuffer = Buffer.from(pdfResponse.data);
      console.log('PDF downloaded, size:', pdfBuffer.length);

      console.log('Extracting text from PDF...');
      // Extract text
      const pdfText = await extractTextFromPDF(pdfBuffer);
      console.log('Text extracted, length:', pdfText.length);

      console.log('Checking OpenAI API key...');
      console.log('OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY);
      if (process.env.OPENAI_API_KEY) {
        console.log('OPENAI_API_KEY prefix:', process.env.OPENAI_API_KEY.substring(0, 15) + '...');
      } else {
        throw new Error('OPENAI_API_KEY environment variable is not set');
      }

      console.log('Processing with AI...');
      // Process with AI
      const processed = await processGameRules(game.title, pdfText);
      console.log('AI processing complete');

      console.log('Updating game in Sheets...');
      // Update game in Sheets
      await updateGame(gameId, session.user.id, {
        status: 'completed',
        sections: processed.sections || [],
        strategyTips: processed.strategyTips || [],
        quickStart: processed.quickStart || {},
        updatedAt: new Date().toISOString(),
      });

      console.log('Game processing completed successfully:', gameId);
      return Response.json({
        success: true,
        gameId,
        status: 'completed',
      });
    } catch (error) {
      console.error('Processing error:', error);
      console.error('Error stack:', error.stack);
      
      // Update with error status
      try {
        await updateGame(gameId, session.user.id, {
          status: 'error',
          errorMessage: error.message,
          updatedAt: new Date().toISOString(),
        });
      } catch (updateError) {
        console.error('Failed to update error status:', updateError);
      }

      return Response.json(
        { error: 'Processing failed', details: error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Process route error:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      { error: 'Failed to process game', details: error.message },
      { status: 500 }
    );
  }
}

