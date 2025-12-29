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
      const interval = setInterval(() => {
        if (game?.status === 'processing') {
          fetchGame();
        }
      }, 2000);
      return () => clearInterval(interval);
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours === 1) return '1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!game) {
    return null;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen flex flex-col font-display text-slate-900 dark:text-white overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-[#302839] px-6 py-3 bg-white dark:bg-[#141118] shrink-0 z-20">
        <div className="flex items-center gap-4 text-slate-900 dark:text-white">
          <div className="size-8 flex items-center justify-center bg-primary rounded-lg text-white">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              casino
            </span>
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Ludex</h2>
        </div>
        <div className="flex flex-1 justify-end gap-6 items-center">
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push('/')}
              className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors"
            >
              Library
            </button>
            <button className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">
              Upload
            </button>
            <button className="text-slate-600 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-medium transition-colors">
              Profile
            </button>
          </nav>
          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden md:block" />
          <AuthButton />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        {/* Breadcrumbs & Header Section */}
        <div className="flex-shrink-0 px-6 pt-6 pb-2 max-w-7xl mx-auto w-full">
          {/* Breadcrumbs */}
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-white text-sm font-medium mb-6 transition-colors group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Back to Library
          </button>

          {/* Game Hero */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end mb-6">
            {/* Cover Image */}
            <div className="relative shrink-0 group">
              {game.ogImageUrl ? (
                <div
                  className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-cover bg-center shadow-lg shadow-black/40 ring-1 ring-white/10"
                  style={{ backgroundImage: `url("${game.ogImageUrl}")` }}
                />
              ) : (
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-gray-200 dark:bg-[#2a2235] flex items-center justify-center shadow-lg shadow-black/40 ring-1 ring-white/10">
                  <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600">
                    extension
                  </span>
                </div>
              )}
              {/* Status Badge overlaid on mobile */}
              {game.status === 'completed' && (
                <div className="absolute -top-2 -right-2 md:hidden">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-500 text-xs font-bold">Ready</span>
                  </div>
                </div>
              )}
            </div>

            {/* Info & Actions */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {game.title}
                    </h1>
                    {game.status === 'completed' && (
                      <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                        <div className="size-2 rounded-full bg-green-500" />
                        <span className="text-green-500 text-xs font-bold uppercase tracking-wider">
                          Ready to Play
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-500 dark:text-gray-400 text-sm flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      Imported {formatDate(game.createdAt)}
                    </span>
                    {game.pdfUrl && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">description</span>
                        PDF
                      </span>
                    )}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  {game.pdfUrl && (
                    <a
                      href={game.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#302839] hover:bg-gray-50 dark:hover:bg-[#3c3247] text-slate-700 dark:text-white text-sm font-medium transition-colors border border-gray-200 dark:border-white/5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[20px]">download</span>
                      <span className="hidden sm:inline">Original PDF</span>
                    </a>
                  )}
                  {!game.ogImageUrl && (
                    <button
                      onClick={handleGenerateImage}
                      disabled={processingImage}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#302839] hover:bg-gray-50 dark:hover:bg-[#3c3247] text-slate-700 dark:text-white text-sm font-medium transition-colors border border-gray-200 dark:border-white/5 shadow-sm disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[20px]">image</span>
                      <span className="hidden sm:inline">
                        {processingImage ? 'Generating...' : 'Regenerate Art'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {game.status === 'processing' && (
          <div className="px-6 mb-4">
            <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-400">
                Processing your rulebook... This may take a few minutes.
              </p>
            </div>
          </div>
        )}

        {game.status === 'error' && (
          <div className="px-6 mb-4">
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-400">
                Error: {game.errorMessage || 'Failed to process rulebook'}
              </p>
            </div>
          </div>
        )}

        {game.status === 'completed' && (
          <>
            {/* Tab Navigation */}
            <div className="flex-shrink-0 px-6 border-b border-gray-200 dark:border-[#302839] bg-white/50 dark:bg-[#141118]/50 backdrop-blur-sm z-10 sticky top-0">
              <div className="max-w-7xl mx-auto w-full">
                <nav
                  aria-label="Tabs"
                  className="flex gap-8 overflow-x-auto scrollbar-hide"
                >
                  {['rules', 'strategy', 'quickstart', 'chat'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`border-b-2 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                        activeTab === tab
                          ? 'border-primary text-primary dark:text-white font-bold'
                          : 'border-transparent text-slate-500 dark:text-gray-400 hover:text-primary dark:hover:text-white'
                      }`}
                    >
                      {tab === 'chat' ? (
                        <span className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">
                            chat_spark
                          </span>
                          Chat
                        </span>
                      ) : (
                        tab.charAt(0).toUpperCase() + tab.slice(1)
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden relative w-full max-w-7xl mx-auto flex flex-col bg-slate-50 dark:bg-surface-dark/30 md:border-x border-gray-200 dark:border-white/5">
              {activeTab === 'rules' && (
                <div className="flex-1 overflow-y-auto scrollbar-default p-6">
                  {game.sections && game.sections.length > 0 ? (
                    <div className="space-y-8 max-w-3xl">
                      {game.sections.map((section, idx) => (
                        <div key={idx} className="space-y-3">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                            {section.title}
                          </h3>
                          <p className="text-slate-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No sections available</p>
                  )}
                </div>
              )}

              {activeTab === 'strategy' && (
                <div className="flex-1 overflow-y-auto scrollbar-default p-6">
                  {game.strategyTips && game.strategyTips.length > 0 ? (
                    <div className="space-y-6 max-w-3xl">
                      {game.strategyTips.map((tip, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-white dark:bg-[#302839] border-l-4 border-primary"
                        >
                          <div className="text-sm font-bold text-primary dark:text-primary-300 mb-2">
                            {tip.category}
                          </div>
                          <p className="text-slate-700 dark:text-gray-300">{tip.tip}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No strategy tips available</p>
                  )}
                </div>
              )}

              {activeTab === 'quickstart' && (
                <div className="flex-1 overflow-y-auto scrollbar-default p-6">
                  {game.quickStart && (
                    <div className="space-y-8 max-w-3xl">
                      {game.quickStart.setup && (
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            Setup
                          </h3>
                          <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                            {game.quickStart.setup}
                          </p>
                        </div>
                      )}
                      {game.quickStart.firstTurn && (
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            First Turn
                          </h3>
                          <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
                            {game.quickStart.firstTurn}
                          </p>
                        </div>
                      )}
                      {game.quickStart.keyRules && game.quickStart.keyRules.length > 0 && (
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                            Key Rules
                          </h3>
                          <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-gray-300">
                            {game.quickStart.keyRules.map((rule, idx) => (
                              <li key={idx} className="leading-relaxed">{rule}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="flex-1 overflow-hidden">
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
