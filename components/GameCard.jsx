'use client';

import Link from 'next/link';

export default function GameCard({ game }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Link href={`/game/${game.gameId}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer">
        {game.ogImageUrl && (
          <img
            src={game.ogImageUrl}
            alt={game.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{game.title}</h3>
        <div className="flex items-center justify-between">
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(game.status)}`}>
            {game.status}
          </span>
          {game.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(game.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

