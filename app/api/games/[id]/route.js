import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { getGameById } from '@/lib/sheets';

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const game = await getGameById(id, session.user.id);
    
    if (!game) {
      return Response.json({ error: 'Game not found' }, { status: 404 });
    }

    return Response.json(game);
  } catch (error) {
    console.error('Get game error:', error);
    return Response.json(
      { error: 'Failed to fetch game', details: error.message },
      { status: 500 }
    );
  }
}

