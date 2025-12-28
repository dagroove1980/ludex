'use client';

import { useSession } from 'next-auth/react';
import AuthButton from '@/components/AuthButton';
import UploadForm from '@/components/UploadForm';
import GameCard from '@/components/GameCard';
import { useEffect, useState } from 'react';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export default function Home() {
  const { data: session, status } = useSession();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const fetchGames = async () => {
        try {
          const res = await fetch('/api/games');
          const data = await res.json();
          setGames(data.games || []);
        } catch (error) {
          console.error('Failed to fetch games:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchGames();
      // Poll every 5 seconds for updates
      const interval = setInterval(fetchGames, 5000);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">🎲 Ludex</h1>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {status === 'loading' ? (
          <div className="text-center py-12">Loading...</div>
        ) : !session ? (
          <div className="max-w-md mx-auto mt-12">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Ludex
              </h2>
              <p className="text-gray-600 mb-6">
                AI-powered board game rulebook companion. Turn PDFs into Play.
              </p>
              <AuthButton />
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload New Game
              </h2>
              <UploadForm />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Your Games
              </h2>
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading games...</div>
              ) : games.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No games yet. Upload your first PDF rulebook above!
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {games.map((game) => (
                    <GameCard key={game.gameId} game={game} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
