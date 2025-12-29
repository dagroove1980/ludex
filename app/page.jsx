'use client';

import { useSession } from 'next-auth/react';
import AuthButton from '@/components/AuthButton';
import UploadForm from '@/components/UploadForm';
import GameCard from '@/components/GameCard';
import { useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';

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
    <div className="relative flex min-h-screen w-full flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-[#302839] bg-white/80 dark:bg-[#141118]/80 backdrop-blur-md">
        <div className="px-4 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 rounded bg-primary text-white">
              <span className="material-symbols-outlined text-[20px]">extension</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Ludex
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {status !== 'loading' && <AuthButton />}
            {/* Mobile Menu Icon */}
            <button className="md:hidden text-gray-500 dark:text-gray-300">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {status === 'loading' ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        ) : !session ? (
          /* Unauthenticated / Hero State */
          <section className="relative w-full overflow-hidden bg-[#141118]">
            {/* Abstract Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-300 text-xs font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                New: Multi-language support added
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 max-w-3xl leading-tight">
                Turn{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                  PDFs
                </span>{' '}
                into Play
              </h1>
              <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Stop flipping through pages. Upload your rulebook and let our AI
                companion answer your questions instantly during game night.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => signIn('google')}
                  className="flex items-center justify-center gap-3 h-12 px-8 rounded-lg bg-white text-black font-bold hover:bg-gray-100 transition-colors"
                >
                  <img
                    alt="Google Logo"
                    className="w-5 h-5"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJNpidaH6fstdeQBzhsP5DkVuGJRgZc-Qyjmi3HYlSpCNiJU1_7Uvyeg96XMHVuR2p1agZo18tirDTY73zWRzeGh5bdj4PBSV36R_tavVnSr8-3aD1muPxaV7ggWa0HymXrOvlzsTaRogqWpvqp_mXRTFerOE6WvZxA2ZgEocC8QPfODThqzXpAE28SPljg7AiZ2OgtzdIlHUWUMyUffxjDdfZSavAKdpg6IvLL6lilZinH9W1ddnJgcQnOhVCXBNTd1bhusvBxEs"
                  />
                  <span>Sign in with Google</span>
                </button>
                <button className="flex items-center justify-center h-12 px-8 rounded-lg bg-[#302839] text-white font-semibold hover:bg-[#3c3247] transition-colors border border-[#473b54]">
                  View Demo
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* Authenticated Dashboard */
          <section className="w-full flex-1 bg-background-light dark:bg-background-dark py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">
              {/* Upload Area */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                    Quick Upload
                  </h2>
                  <button className="text-sm text-primary hover:text-primary-hover font-medium">
                    View Supported Formats
                  </button>
                </div>
                <UploadForm />
              </div>

              {/* Library Grid */}
              <div className="flex flex-col gap-6">
                {/* Library Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
                      Your Library
                    </h2>
                    {games.length > 0 && (
                      <span className="px-2.5 py-0.5 rounded-full bg-gray-200 dark:bg-[#302839] text-xs font-bold text-gray-700 dark:text-gray-300">
                        {games.length}
                      </span>
                    )}
                  </div>
                  {games.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
                          search
                        </span>
                        <input
                          className="h-10 pl-10 pr-4 rounded-lg bg-white dark:bg-[#1e1726] border border-gray-200 dark:border-[#302839] text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                          placeholder="Search games..."
                          type="text"
                        />
                      </div>
                      <button className="flex items-center justify-center size-10 rounded-lg border border-gray-200 dark:border-[#302839] bg-white dark:bg-[#1e1726] text-gray-500 hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">filter_list</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Grid */}
                {loading ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    Loading games...
                  </div>
                ) : games.length === 0 ? (
                  <div className="flex flex-col items-center justify-center bg-transparent rounded-xl border-2 border-dashed border-gray-300 dark:border-[#302839] hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-[#1e1726]/50 transition-all cursor-pointer min-h-[250px] group">
                    <div className="size-12 rounded-full bg-gray-100 dark:bg-[#302839] flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors text-gray-400">
                      <span className="material-symbols-outlined">add</span>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      No games yet. Upload your first PDF rulebook above!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                      <GameCard key={game.gameId} game={game} />
                    ))}
                    {/* Add New Card */}
                    <div className="flex flex-col items-center justify-center bg-transparent rounded-xl border-2 border-dashed border-gray-300 dark:border-[#302839] hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-[#1e1726]/50 transition-all cursor-pointer min-h-[250px] group">
                      <div className="size-12 rounded-full bg-gray-100 dark:bg-[#302839] flex items-center justify-center mb-3 group-hover:bg-primary group-hover:text-white transition-colors text-gray-400">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Add another game
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
