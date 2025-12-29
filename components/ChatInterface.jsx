'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

export default function ChatInterface({ gameId }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId,
          message: currentInput,
          conversationId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setMessages(data.messages);
      setConversationId(data.conversationId);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex-1 overflow-hidden relative w-full flex flex-col bg-slate-50 dark:bg-surface-dark/30 md:border-x border-gray-200 dark:border-white/5">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto scrollbar-default p-6 space-y-8 pb-32">
        {messages.length === 0 && (
          <div className="text-center py-8 opacity-60">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-3">
              <span className="material-symbols-outlined text-3xl">smart_toy</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              Ludex AI is ready to help.
            </p>
            <p className="text-xs text-slate-400 dark:text-gray-500 mt-1">
              Ask about setup, turn structure, or winning conditions.
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto justify-end' : ''
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="size-8 rounded-full bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-white text-[16px]">
                  smart_toy
                </span>
              </div>
            )}
            <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
              <div className="flex items-center gap-2">
                {msg.role === 'user' && (
                  <>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      You
                    </span>
                  </>
                )}
                {msg.role === 'assistant' && (
                  <>
                    <span className="text-xs font-bold text-slate-700 dark:text-gray-300">
                      Ludex AI
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-gray-500">
                      {formatTime(msg.timestamp)}
                    </span>
                  </>
                )}
              </div>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'rounded-tr-none bg-primary text-white shadow-md shadow-primary/10'
                    : 'rounded-tl-none bg-white dark:bg-[#302839] text-slate-700 dark:text-gray-200 border border-gray-100 dark:border-white/5'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
            {msg.role === 'user' && (
              <div
                className="size-8 rounded-full bg-slate-200 dark:bg-gray-700 flex items-center justify-center shrink-0 overflow-hidden"
                style={{
                  backgroundImage: session?.user?.image
                    ? `url("${session.user.image}")`
                    : 'linear-gradient(to bottom right, #7f13ec, #9333ea)',
                  backgroundSize: 'cover',
                }}
              />
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 max-w-3xl opacity-50">
            <div className="size-8 rounded-full bg-gradient-to-br from-primary to-purple-800 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-[16px]">
                smart_toy
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-[#302839] border border-gray-100 dark:border-white/5 w-24 flex items-center gap-1">
                <div
                  className="size-1.5 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0s' }}
                />
                <div
                  className="size-1.5 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
                <div
                  className="size-1.5 bg-slate-400 dark:bg-gray-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0.4s' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent pt-12">
        <form
          onSubmit={handleSend}
          className="relative flex items-end gap-2 p-2 rounded-xl bg-white dark:bg-[#241a30] border border-gray-200 dark:border-[#3c3247] shadow-lg shadow-black/5 dark:shadow-black/20 ring-1 ring-transparent focus-within:ring-primary transition-all"
        >
          <button
            type="button"
            className="p-2 text-slate-400 dark:text-gray-500 hover:text-primary dark:hover:text-white transition-colors rounded-lg"
          >
            <span className="material-symbols-outlined text-[24px]">add_circle</span>
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            placeholder="Ask a question about the rules..."
            rows={1}
            className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 text-sm focus:ring-0 resize-none py-3 max-h-32 scrollbar-hide"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              className="material-symbols-outlined text-[20px] block rotate-90"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              navigation
            </span>
          </button>
        </form>
        <p className="text-center text-[10px] text-slate-400 dark:text-gray-600 mt-2">
          Ludex can make mistakes. Check original PDF for critical rulings.
        </p>
      </div>
    </div>
  );
}





