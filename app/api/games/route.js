import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getUserGames } from '@/lib/sheets';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const games = await getUserGames(session.user.id);
    return Response.json({ games });
  } catch (error) {
    console.error('Get games error:', error);
    console.error('Error stack:', error.stack);
    return Response.json(
      { 
        error: 'Failed to fetch games', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

