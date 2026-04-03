import type { Session, Settings } from '../App';

interface StatusBarProps {
  session: Session | undefined;
  settings: Settings;
  isProcessing: boolean;
}

export function StatusBar({ session, settings, isProcessing }: StatusBarProps) {
  return (
    <div className="relative z-30 flex items-center justify-between px-3 md:px-6 py-2 border-t border-[#1a1f2e] bg-[#0d1117]/90 backdrop-blur-sm text-xs font-mono">
      {/* Left side */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-[#ffb800] animate-pulse' : 'bg-[#00ff9d]'}`} />
          <span className="text-[#5c6370] hidden sm:inline">{isProcessing ? 'Processing...' : 'Ready'}</span>
        </div>

        {session && (
          <span className="text-[#3d4450] hidden md:inline">
            {session.messages.length} message{session.messages.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Center - model indicator (mobile-friendly) */}
      <div className="flex items-center gap-2">
        <span className="text-[#5c6370]">Model:</span>
        <span className="text-[#00ff9d]">{settings.model}</span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${settings.sandboxMode ? 'bg-[#ffb800]' : 'bg-[#5c6370]'}`} />
          <span className="text-[#5c6370]">{settings.sandboxMode ? 'Sandbox' : 'Live'}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${
            settings.autoApprove === 'full-auto' ? 'bg-[#ff5f56]' :
            settings.autoApprove === 'auto-edit' ? 'bg-[#ffb800]' :
            'bg-[#00ff9d]'
          }`} />
          <span className="text-[#5c6370] hidden md:inline capitalize">{settings.autoApprove.replace('-', ' ')}</span>
        </div>

        <span className="text-[#3d4450] border-l border-[#1a1f2e] pl-2 md:pl-4">
          x86_64
        </span>
      </div>
    </div>
  );
}
