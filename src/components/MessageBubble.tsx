import type { Message } from '../App';

interface MessageBubbleProps {
  message: Message;
  isLatest: boolean;
}

export function MessageBubble({ message, isLatest }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const formatContent = (content: string) => {
    // Simple markdown-like parsing for code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, i) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).split('\n');
        const language = lines[0].trim() || 'text';
        const code = lines.slice(1).join('\n');

        return (
          <div key={i} className="my-3 rounded-lg overflow-hidden border border-[#2a2f3e]">
            <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1f2e] border-b border-[#2a2f3e]">
              <span className="text-xs text-[#00ff9d] font-mono">{language}</span>
              <button
                onClick={() => navigator.clipboard.writeText(code)}
                className="text-xs text-[#5c6370] hover:text-[#00ff9d] transition-colors"
              >
                Copy
              </button>
            </div>
            <pre className="p-3 bg-[#0d1117] overflow-x-auto">
              <code className="text-xs md:text-sm text-[#c5c8c6] font-mono whitespace-pre">{code}</code>
            </pre>
          </div>
        );
      }

      // Handle inline formatting
      return (
        <span key={i} className="whitespace-pre-wrap break-words">
          {part.split(/(\*\*[\s\S]*?\*\*)/g).map((segment, j) => {
            if (segment.startsWith('**') && segment.endsWith('**')) {
              return <strong key={j} className="text-[#ffb800] font-semibold">{segment.slice(2, -2)}</strong>;
            }
            return segment.split(/(`[^`]+`)/g).map((inline, k) => {
              if (inline.startsWith('`') && inline.endsWith('`')) {
                return (
                  <code key={k} className="px-1.5 py-0.5 bg-[#1a1f2e] rounded text-[#00ff9d] font-mono text-xs md:text-sm">
                    {inline.slice(1, -1)}
                  </code>
                );
              }
              return inline;
            });
          })}
        </span>
      );
    });
  };

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-[#ffb800]/10 border border-[#ffb800]/20 rounded-lg text-sm text-[#ffb800]">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`
        max-w-[90%] md:max-w-[80%] lg:max-w-[70%] rounded-2xl px-3 md:px-4 py-2 md:py-3
        ${isUser
          ? 'bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[#00ff9d]'
          : 'bg-[#1a1f2e] border border-[#2a2f3e] text-[#c5c8c6]'
        }
        ${isLatest && message.status === 'pending' ? 'animate-pulse' : ''}
      `}>
        {/* Role indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-5 h-5 md:w-6 md:h-6 rounded-md flex items-center justify-center text-xs font-mono
            ${isUser ? 'bg-[#00ff9d]/20 text-[#00ff9d]' : 'bg-[#5c6370]/20 text-[#5c6370]'}
          `}>
            {isUser ? 'U' : 'AI'}
          </div>
          <span className="text-xs text-[#5c6370]">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {message.status === 'pending' && (
            <span className="flex items-center gap-1 text-xs text-[#ffb800]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffb800] animate-pulse" />
              typing...
            </span>
          )}
        </div>

        {/* Content */}
        <div className="text-sm md:text-base leading-relaxed font-mono">
          {formatContent(message.content)}
        </div>
      </div>
    </div>
  );
}
