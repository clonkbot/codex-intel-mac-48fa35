import type { Session } from '../App';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession
}: SidebarProps) {
  return (
    <aside className="h-full w-full bg-[#0d1117] border-r border-[#1a1f2e] flex flex-col">
      {/* New session button */}
      <div className="p-4">
        <button
          onClick={onNewSession}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#00ff9d]/10 to-[#00cc7d]/10 hover:from-[#00ff9d]/20 hover:to-[#00cc7d]/20 border border-[#00ff9d]/30 hover:border-[#00ff9d]/50 rounded-xl text-[#00ff9d] font-medium transition-all duration-200 group"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>New Session</span>
        </button>
      </div>

      {/* Sessions list */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1">
        <div className="px-2 py-2 text-xs text-[#5c6370] uppercase tracking-wider font-semibold">
          Sessions ({sessions.length})
        </div>

        {sessions.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[#1a1f2e] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#3d4450]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm text-[#5c6370]">No sessions yet</p>
            <p className="text-xs text-[#3d4450] mt-1">Start a new session to begin</p>
          </div>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              className={`
                group relative flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${activeSessionId === session.id
                  ? 'bg-[#00ff9d]/10 border border-[#00ff9d]/20'
                  : 'hover:bg-[#1a1f2e] border border-transparent'
                }
              `}
              onClick={() => onSelectSession(session.id)}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                ${activeSessionId === session.id ? 'bg-[#00ff9d]/20' : 'bg-[#1a1f2e]'}
              `}>
                <svg className={`w-4 h-4 ${activeSessionId === session.id ? 'text-[#00ff9d]' : 'text-[#5c6370]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${activeSessionId === session.id ? 'text-[#00ff9d]' : 'text-[#c5c8c6]'}`}>
                  {session.name}
                </p>
                <p className="text-xs text-[#5c6370] truncate">
                  {session.messages.length} messages · {session.createdAt.toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={e => { e.stopPropagation(); onDeleteSession(session.id); }}
                className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#ff5f56]/10 rounded-lg transition-all"
              >
                <svg className="w-4 h-4 text-[#ff5f56]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Bottom info */}
      <div className="p-4 border-t border-[#1a1f2e]">
        <div className="flex items-center gap-3 px-3 py-2 bg-[#1a1f2e]/50 rounded-xl">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00ff9d] to-[#00cc7d] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#0a0e14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[#5c6370]">Intel Mac Client</p>
            <p className="text-[10px] text-[#3d4450]">v1.0.0 · x86_64</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
