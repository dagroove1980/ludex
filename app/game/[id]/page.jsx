'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AuthButton from '@/components/AuthButton';
import ChatInterface from '@/components/ChatInterface';

export default function GamePage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const gameId = params?.id;
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rules');
  const [processingImage, setProcessingImage] = useState(false);

  useEffect(() => {
    if (!session) {
      router.push('/');
      return;
    }

    const fetchGame = async () => {
      try {
        const res = await fetch(`/api/games/${gameId}`);
        if (res.status === 404) {
          router.push('/');
          return;
        }
        const data = await res.json();
        setGame(data);
      } catch (error) {
        console.error('Failed to fetch game:', error);
      } finally {
        setLoading(false);
      }
    };

    if (gameId) {
      fetchGame();

      // Poll every 2 seconds if processing
      if (game?.status === 'processing') {
        const interval = setInterval(fetchGame, 2000);
        return () => clearInterval(interval);
      }
    }
  }, [session, gameId, router, game?.status]);

  const handleGenerateImage = async () => {
    setProcessingImage(true);
    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: gameId }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGame((prev) => ({ ...prev, ogImageUrl: data.imageUrl }));
      }
    } catch (error) {
      console.error('Failed to generate image:', error);
    } finally {
      setProcessingImage(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              ← Back to Library
            </button>
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start gap-6">
            {game.ogImageUrl ? (
              <img
                src={game.ogImageUrl}
                alt={game.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-4xl">🎲</span>
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{game.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    game.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : game.status === 'processing'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {game.status}
                </span>
                {!game.ogImageUrl && (
                  <button
                    onClick={handleGenerateImage}
                    disabled={processingImage}
                    className="px-4 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    {processingImage ? 'Generating...' : 'Generate Image'}
                  </button>
                )}
              </div>
              {game.pdfUrl && (
                <a
                  href={game.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 text-sm"
                >
                  Download Original PDF
                </a>
              )}
            </div>
          </div>
        </div>

        {game.status === 'processing' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800">
              Processing your rulebook... This may take a few minutes.
            </p>
          </div>
        )}

        {game.status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Error: {game.errorMessage || 'Failed to process rulebook'}
            </p>
          </div>
        )}

        {game.status === 'completed' && (
          <>
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex space-x-8">
                {['rules', 'strategy', 'quickstart', 'chat'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === 'rules' && (
                <div className="space-y-6">
                  {game.sections && game.sections.length > 0 ? (
                    game.sections.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {section.title}
                        </h3>
                        <p className="text-gray-700 whitespace-pre-wrap">{section.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No sections available</p>
                  )}
                </div>
              )}

              {activeTab === 'strategy' && (
                <div className="space-y-4">
                  {game.strategyTips && game.strategyTips.length > 0 ? (
                    game.strategyTips.map((tip, idx) => (
                      <div key={idx} className="border-l-4 border-indigo-500 pl-4">
                        <div className="text-sm font-medium text-indigo-600 mb-1">
                          {tip.category}
                        </div>
                        <p className="text-gray-700">{tip.tip}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No strategy tips available</p>
                  )}
                </div>
              )}

              {activeTab === 'quickstart' && game.quickStart && (
                <div className="space-y-6">
                  {game.quickStart.setup && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup</h3>
                      <p className="text-gray-700">{game.quickStart.setup}</p>
                    </div>
                  )}
                  {game.quickStart.firstTurn && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">First Turn</h3>
                      <p className="text-gray-700">{game.quickStart.firstTurn}</p>
                    </div>
                  )}
                  {game.quickStart.keyRules && game.quickStart.keyRules.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Key Rules</h3>
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {game.quickStart.keyRules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="h-[600px]">
                  <ChatInterface gameId={gameId} />
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

