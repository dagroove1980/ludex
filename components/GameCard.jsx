'use client';

import Link from 'next/link';

export default function GameCard({ game }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-semibold">
            Ready
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-semibold">
            <span className="size-1.5 rounded-full bg-yellow-500 animate-pulse" />
            Processing
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-500/10 text-gray-600 dark:text-gray-400 text-xs font-semibold">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Just now';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Link href={`/game/${game.gameId}`}>
      <div className="group relative flex flex-col bg-white dark:bg-[#1e1726] rounded-xl overflow-hidden border border-gray-200 dark:border-[#302839] hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5 cursor-pointer">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-[#2a2235]">
          {game.ogImageUrl ? (
            <>
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${game.ogImageUrl}")` }}
              />
              {game.status === 'processing' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-[2px]">
                  <div className="size-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3" />
                  <p className="text-white font-medium text-sm tracking-wide">
                    AI Parsing...
                  </p>
                </div>
              )}
              {game.status === 'completed' && (
                <div className="absolute bottom-2 right-2 size-8 bg-black/50 hover:bg-primary rounded-lg flex items-center justify-center backdrop-blur-sm text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    play_arrow
                  </span>
                </div>
              )}
              {game.status === 'error' && (
                <div className="absolute inset-0 bg-cover bg-center opacity-50 grayscale transition-transform duration-500 group-hover:scale-105" />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-600">
                extension
              </span>
            </div>
          )}
          {game.status === 'error' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-red-500">
                error_outline
              </span>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">
              {game.title}
            </h3>
            <button
              className="text-gray-400 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
          </div>
          <div className="flex items-center justify-between mt-1">
            {getStatusBadge(game.status)}
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(game.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}





