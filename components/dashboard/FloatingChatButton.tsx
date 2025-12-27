'use client';

import { MessageCircle } from 'lucide-react';

export const FloatingChatButton = () => {
  return (
    <button
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-500 text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-600 hover:shadow-xl"
      aria-label="Open chat"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
};
