'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function GameCard({ game, onDelete, onImageUpdate }) {
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showMenu]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/games/${game.gameId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete game');
      }

      // Call parent's onDelete callback to refresh the list
      if (onDelete) {
        onDelete(game.gameId);
      } else {
        // Fallback: reload the page
        router.refresh();
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Failed to delete game: ${error.message}`);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
      setShowMenu(false);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setShowMenu(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`/api/games/${game.gameId}/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to upload image');
      }

      const data = await res.json();

      // Call parent's onImageUpdate callback to refresh the game
      if (onImageUpdate) {
        onImageUpdate(game.gameId, data.imageUrl);
      } else {
        // Fallback: reload the page
        router.refresh();
      }
    } catch (error) {
      console.error('Image upload error:', error);
      alert(`Failed to upload image: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
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
    <>
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
            <div className="relative" ref={menuRef}>
              <button
                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                disabled={isDeleting || isUploading}
              >
                <span className="material-symbols-outlined text-[20px]">
                  more_vert
                </span>
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 z-50 w-48 bg-white dark:bg-[#302839] rounded-lg shadow-lg border border-gray-200 dark:border-[#473b54] overflow-hidden">
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#3c3247] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <div className="size-4 border-2 border-slate-400/30 border-t-slate-600 dark:border-gray-500/30 dark:border-t-gray-300 rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">
                          image
                        </span>
                        Upload Image
                      </>
                    )}
                  </button>
                  <button
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowConfirm(true);
                    }}
                    disabled={isDeleting || isUploading}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    Delete Game
                  </button>
                </div>
              )}
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
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
      
      {/* Confirmation Dialog - Outside Link to prevent navigation issues */}
      {showConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowConfirm(false);
          }}
        >
          <div
            className="bg-white dark:bg-[#302839] rounded-xl p-6 max-w-md mx-4 shadow-xl border border-gray-200 dark:border-[#473b54]"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              Delete Game?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{game.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#3c3247] rounded-lg transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowConfirm(false);
                }}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleDelete();
                }}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">
                      delete
                    </span>
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}





