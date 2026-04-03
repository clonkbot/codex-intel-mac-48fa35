import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import type { Session, Settings } from '../App';
import { MessageBubble } from './MessageBubble';

interface TerminalProps {
  session: Session;
  onSendMessage: (content: string) => void;
  isProcessing: boolean;
  settings: Settings;
}

export function Terminal({ session, onSendMessage, isProcessing, settings }: TerminalProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session.messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [session.id]);

  const handleSubmit = () => {
    if (!input.trim() || isProcessing) return;

    setHistory(prev => [...prev, input]);
    setHistoryIndex(-1);
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp' && !e.shiftKey) {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown' && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0e14] overflow-hidden">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 space-y-4 scrollbar-thin">
        {session.messages.length === 0 && (
          <div className="text-center py-12 md:py-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1f2e] rounded-full text-sm text-[#5c6370] mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>New Session Started</span>
            </div>
            <p className="text-[#3d4450] text-xs md:text-sm font-mono">
              Type a command or describe what you want to build...
            </p>
          </div>
        )}

        {session.messages.map((message, idx) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLatest={idx === session.messages.length - 1}
          />
        ))}

        {isProcessing && session.messages[session.messages.length - 1]?.role === 'assistant' && (
          <div className="flex items-center gap-2 text-[#00ff9d] text-sm font-mono pl-4">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="animate-pulse">Processing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-[#1a1f2e] bg-[#0d1117]/80 backdrop-blur-sm p-3 md:p-4">
        <div className="flex items-start gap-2 md:gap-3 max-w-4xl mx-auto">
          <div className="flex-shrink-0 mt-2 md:mt-3">
            <span className="text-[#00ff9d] font-mono text-sm md:text-base font-bold">&gt;</span>
          </div>

          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a command or describe your task..."
              className="w-full bg-[#1a1f2e] border border-[#2a2f3e] rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-[#c5c8c6] placeholder-[#3d4450] font-mono focus:outline-none focus:border-[#00ff9d]/50 focus:ring-1 focus:ring-[#00ff9d]/20 resize-none transition-all min-h-[44px] md:min-h-[48px]"
              rows={1}
              disabled={isProcessing}
              style={{
                height: 'auto',
                minHeight: input.includes('\n') ? '80px' : '44px'
              }}
            />

            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              {settings.sandboxMode && (
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-[#ffb800]/10 text-[#ffb800] text-xs rounded font-mono">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Sandbox
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isProcessing}
            className="flex-shrink-0 p-2 md:p-3 bg-[#00ff9d] hover:bg-[#00cc7d] disabled:bg-[#1a1f2e] disabled:text-[#3d4450] text-[#0a0e14] rounded-lg transition-all duration-200 shadow-lg shadow-[#00ff9d]/20 hover:shadow-[#00ff9d]/30 disabled:shadow-none min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isProcessing ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] md:text-xs text-[#3d4450]">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#1a1f2e] rounded text-[#5c6370]">Enter</kbd>
            <span>Send</span>
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#1a1f2e] rounded text-[#5c6370]">Shift+Enter</kbd>
            <span>New line</span>
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#1a1f2e] rounded text-[#5c6370]">/help</kbd>
            <span>Commands</span>
          </span>
        </div>
      </div>
    </div>
  );
}
