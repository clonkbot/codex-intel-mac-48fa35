import { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal } from './components/Terminal';
import { Sidebar } from './components/Sidebar';
import { StatusBar } from './components/StatusBar';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  status?: 'pending' | 'complete' | 'error';
}

export interface Session {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
}

export interface Settings {
  model: string;
  apiKey: string;
  autoApprove: 'suggest' | 'auto-edit' | 'full-auto';
  sandboxMode: boolean;
}

function App() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    model: 'o4-mini',
    apiKey: '',
    autoApprove: 'suggest',
    sandboxMode: true,
  });

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const createNewSession = useCallback(() => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      name: `Session ${sessions.length + 1}`,
      messages: [],
      createdAt: new Date(),
    };
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setSidebarOpen(false);
  }, [sessions.length]);

  const deleteSession = useCallback((id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(null);
    }
  }, [activeSessionId]);

  const simulateResponse = useCallback((userMessage: string): string => {
    const responses: Record<string, string> = {
      'help': `Available commands:
  /help     - Show this help message
  /clear    - Clear the current session
  /model    - Change the model
  /settings - Open settings

Tips:
  - Use natural language to describe what you want to build
  - Ask for code reviews, refactoring, or explanations
  - Request file operations with approval prompts`,
      'model': `Current model: ${settings.model}
Available models:
  - o4-mini (fast, efficient)
  - o3 (balanced)
  - gpt-4.1 (powerful)`,
    };

    if (userMessage.startsWith('/')) {
      const cmd = userMessage.slice(1).toLowerCase();
      return responses[cmd] || `Unknown command: ${userMessage}`;
    }

    // Simulate AI responses
    const aiResponses = [
      `I understand you want to: "${userMessage}"

Let me analyze this request...

\`\`\`typescript
// Here's a suggested implementation
function solution() {
  // Your code here
  console.log("Processing request...");
}
\`\`\`

Would you like me to:
1. Write this to a file?
2. Explain the approach?
3. Suggest improvements?`,
      `Analyzing your request: "${userMessage}"

I can help with that! Here are my suggestions:

**Option A:** Quick implementation
- Fast to implement
- Good for prototyping

**Option B:** Robust solution
- Better error handling
- Production-ready

Which approach would you prefer?`,
      `Got it! Working on: "${userMessage}"

\`\`\`bash
# Executing in sandbox mode
$ npm install dependencies
$ creating file structure...
\`\`\`

[Sandbox Mode: ON] All changes will be previewed before applying.

Ready to proceed?`,
    ];

    return aiResponses[Math.floor(Math.random() * aiResponses.length)];
  }, [settings.model]);

  const sendMessage = useCallback(async (content: string) => {
    if (!activeSessionId || isProcessing) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
      status: 'complete',
    };

    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? { ...s, messages: [...s.messages, userMessage] }
        : s
    ));

    setIsProcessing(true);

    // Simulate AI processing
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      status: 'pending',
    };

    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? { ...s, messages: [...s.messages, assistantMessage] }
        : s
    ));

    // Simulate streaming response
    const fullResponse = simulateResponse(content);
    let currentContent = '';

    for (let i = 0; i < fullResponse.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 20));
      currentContent += fullResponse[i];

      setSessions(prev => prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: s.messages.map(m =>
                m.id === assistantMessage.id
                  ? { ...m, content: currentContent }
                  : m
              )
            }
          : s
      ));
    }

    setSessions(prev => prev.map(s =>
      s.id === activeSessionId
        ? {
            ...s,
            messages: s.messages.map(m =>
              m.id === assistantMessage.id
                ? { ...m, status: 'complete' }
                : m
            )
          }
        : s
    ));

    setIsProcessing(false);
  }, [activeSessionId, isProcessing, simulateResponse]);

  return (
    <div className="h-screen w-screen bg-[#0a0e14] text-[#c5c8c6] overflow-hidden flex flex-col font-sans relative">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
           style={{
             backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,157,0.03) 1px, rgba(0,255,157,0.03) 2px)',
             backgroundSize: '100% 2px'
           }}
      />

      {/* Vignette */}
      <div className="pointer-events-none fixed inset-0 z-40"
           style={{
             background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
           }}
      />

      {/* Header */}
      <header className="relative z-30 flex items-center justify-between px-3 md:px-6 py-3 border-b border-[#1a1f2e] bg-[#0d1117]/90 backdrop-blur-sm">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 hover:bg-[#1a1f2e] rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-[#00ff9d] to-[#00cc7d] flex items-center justify-center shadow-lg shadow-[#00ff9d]/20">
              <span className="text-[#0a0e14] font-bold text-sm md:text-base font-mono">&gt;_</span>
            </div>
            <h1 className="text-base md:text-lg font-semibold tracking-tight">
              <span className="text-[#00ff9d]">Codex</span>
              <span className="text-[#5c6370] ml-1 hidden sm:inline">for Intel Mac</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#1a1f2e] rounded-full text-xs">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse" />
            <span className="text-[#5c6370]">Model:</span>
            <span className="text-[#00ff9d] font-mono">{settings.model}</span>
          </div>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-[#1a1f2e] rounded-lg transition-colors group"
          >
            <svg className="w-5 h-5 text-[#5c6370] group-hover:text-[#00ff9d] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative z-20">
        {/* Sidebar - Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          transform transition-transform duration-300 ease-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          w-64 md:w-64 lg:w-72
        `}>
          <Sidebar
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelectSession={(id) => { setActiveSessionId(id); setSidebarOpen(false); }}
            onNewSession={createNewSession}
            onDeleteSession={deleteSession}
          />
        </div>

        {/* Terminal area */}
        <main className="flex-1 flex flex-col min-w-0">
          {activeSession ? (
            <Terminal
              session={activeSession}
              onSendMessage={sendMessage}
              isProcessing={isProcessing}
              settings={settings}
            />
          ) : (
            <WelcomeScreen onNewSession={createNewSession} />
          )}
        </main>
      </div>

      {/* Status bar */}
      <StatusBar
        session={activeSession}
        settings={settings}
        isProcessing={isProcessing}
      />

      {/* Footer */}
      <footer className="relative z-30 text-center py-2 border-t border-[#1a1f2e] bg-[#0d1117]/50">
        <p className="text-[10px] md:text-xs text-[#3d4450] tracking-wide">
          Requested by <span className="text-[#5c6370]">@web-user</span> · Built by <span className="text-[#5c6370]">@clonkbot</span>
        </p>
      </footer>

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          settings={settings}
          onSettingsChange={setSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default App;
