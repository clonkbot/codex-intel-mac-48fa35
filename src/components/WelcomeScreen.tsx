interface WelcomeScreenProps {
  onNewSession: () => void;
}

export function WelcomeScreen({ onNewSession }: WelcomeScreenProps) {
  const features = [
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: 'Code Generation',
      description: 'Generate code from natural language descriptions'
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'File Operations',
      description: 'Read, write, and modify files with approval prompts'
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Shell Commands',
      description: 'Execute terminal commands safely in sandbox mode'
    },
    {
      icon: (
        <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Sandbox Mode',
      description: 'Preview all changes before they are applied'
    }
  ];

  const quickCommands = [
    { cmd: '/help', desc: 'Show available commands' },
    { cmd: '/model', desc: 'Change AI model' },
    { cmd: '/settings', desc: 'Open settings' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="max-w-2xl w-full text-center">
        {/* Logo and title */}
        <div className="mb-8 md:mb-12">
          <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-gradient-to-br from-[#00ff9d] to-[#00cc7d] flex items-center justify-center shadow-2xl shadow-[#00ff9d]/30 animate-glow">
            <span className="text-[#0a0e14] font-bold text-2xl md:text-3xl font-mono">&gt;_</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-3">
            <span className="text-[#00ff9d]">Codex</span>
            <span className="text-[#c5c8c6]"> CLI</span>
          </h1>
          <p className="text-[#5c6370] text-sm md:text-base">
            AI-powered coding assistant for Intel Mac
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 md:mt-3">
            <span className="px-2 py-1 bg-[#1a1f2e] rounded text-xs text-[#5c6370] font-mono">x86_64</span>
            <span className="px-2 py-1 bg-[#1a1f2e] rounded text-xs text-[#5c6370] font-mono">macOS</span>
            <span className="px-2 py-1 bg-[#00ff9d]/10 text-[#00ff9d] rounded text-xs font-mono">Intel</span>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-4 md:p-5 bg-[#0d1117] border border-[#1a1f2e] rounded-xl hover:border-[#00ff9d]/30 transition-all duration-300 text-left group"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[#1a1f2e] group-hover:bg-[#00ff9d]/10 flex items-center justify-center mb-3 transition-colors">
                <span className="text-[#5c6370] group-hover:text-[#00ff9d] transition-colors">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-semibold text-[#c5c8c6] mb-1">
                {feature.title}
              </h3>
              <p className="text-xs md:text-sm text-[#5c6370]">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quick commands */}
        <div className="mb-8 md:mb-10">
          <p className="text-xs text-[#5c6370] uppercase tracking-wider mb-3 md:mb-4">Quick Commands</p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {quickCommands.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-2 bg-[#1a1f2e] rounded-lg text-xs md:text-sm"
              >
                <code className="text-[#00ff9d] font-mono">{item.cmd}</code>
                <span className="text-[#5c6370] hidden sm:inline">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onNewSession}
          className="inline-flex items-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#00ff9d] to-[#00cc7d] hover:from-[#00cc7d] hover:to-[#00ff9d] text-[#0a0e14] font-semibold text-sm md:text-base rounded-xl transition-all duration-300 shadow-lg shadow-[#00ff9d]/30 hover:shadow-[#00ff9d]/50 hover:scale-105 min-h-[48px]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Start New Session</span>
        </button>

        <p className="mt-4 md:mt-6 text-xs text-[#3d4450]">
          Press <kbd className="px-1.5 py-0.5 bg-[#1a1f2e] rounded text-[#5c6370] mx-1">Cmd + N</kbd> anytime to start a new session
        </p>
      </div>
    </div>
  );
}
