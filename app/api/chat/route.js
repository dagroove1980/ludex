import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getGameById, getConversation, createOrUpdateConversation } from '@/lib/sheets';
import { chatAboutGame } from '@/lib/aiProcessor';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { gameId, message, conversationId } = await request.json();
    
    if (!gameId || !message) {
      return Response.json({ error: 'Game ID and message required' }, { status: 400 });
    }

    // Get game and verify ownership
    const game = await getGameById(gameId, session.user.id);
    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    // Get or create conversation
    let conversation = conversationId 
      ? await getConversation(gameId, session.user.id)
      : null;

    const messages = conversation?.messages || [];
    
    // Add user message
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    messages.push(userMessage);

    // Get AI response
    const aiResponse = await chatAboutGame(
      game.title,
      game.sections,
      game.strategyTips,
      game.quickStart,
      messages.slice(0, -1), // History without the new user message
      message
    );

    // Add AI response
    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };
    messages.push(aiMessage);

    // Update conversation in Sheets
    const updatedConversationId = await createOrUpdateConversation(
      gameId,
      session.user.id,
      messages
    );

    return Response.json({
      conversationId: updatedConversationId,
      message: aiMessage,
      messages,
    });
  } catch (error) {
    console.error('Chat error:', error);
    return Response.json(
      { error: 'Failed to process chat', details: error.message },
      { status: 500 }
    );
  }
}





