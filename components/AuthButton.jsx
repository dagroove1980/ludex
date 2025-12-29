'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="px-4 py-2 text-gray-600 dark:text-gray-400">Loading...</div>
    );
  }

  if (session) {
    return (
      <div className="hidden md:flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-[#302839]">
        <div className="flex flex-col items-end mr-1">
          <span className="text-sm font-semibold leading-none text-slate-900 dark:text-white">
            {session.user?.name || session.user?.email?.split('@')[0] || 'User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Pro Member
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="relative group cursor-pointer"
        >
          <div
            className="size-10 rounded-full bg-cover bg-center border-2 border-transparent group-hover:border-primary transition-colors"
            style={{
              backgroundImage: session.user?.image
                ? `url("${session.user.image}")`
                : 'linear-gradient(to bottom right, #7f13ec, #9333ea)',
            }}
          />
          <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-[#141118] rounded-full" />
        </button>
      </div>
    );
  }

  return (
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
  );
}





