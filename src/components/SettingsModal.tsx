import { useState } from 'react';
import type { Settings } from '../App';

interface SettingsModalProps {
  settings: Settings;
  onSettingsChange: (settings: Settings) => void;
  onClose: () => void;
}

export function SettingsModal({ settings, onSettingsChange, onClose }: SettingsModalProps) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onSettingsChange(localSettings);
    onClose();
  };

  const models = [
    { id: 'o4-mini', name: 'o4-mini', desc: 'Fast & efficient' },
    { id: 'o3', name: 'o3', desc: 'Balanced performance' },
    { id: 'gpt-4.1', name: 'GPT-4.1', desc: 'Most capable' },
  ];

  const approvalModes = [
    { id: 'suggest', name: 'Suggest', desc: 'Suggest changes, require approval for all actions' },
    { id: 'auto-edit', name: 'Auto Edit', desc: 'Auto-apply file edits, approve commands' },
    { id: 'full-auto', name: 'Full Auto', desc: 'Auto-apply all actions (use with caution)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-[#0d1117] border border-[#1a1f2e] rounded-2xl shadow-2xl overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-[#1a1f2e]">
          <h2 className="text-base md:text-lg font-semibold text-[#c5c8c6]">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#1a1f2e] rounded-lg transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5 text-[#5c6370]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6 md:space-y-8">
          {/* API Key */}
          <div>
            <label className="block text-sm font-medium text-[#c5c8c6] mb-2">
              API Key
            </label>
            <input
              type="password"
              value={localSettings.apiKey}
              onChange={e => setLocalSettings({ ...localSettings, apiKey: e.target.value })}
              placeholder="sk-..."
              className="w-full bg-[#1a1f2e] border border-[#2a2f3e] rounded-xl px-4 py-3 text-sm text-[#c5c8c6] placeholder-[#3d4450] font-mono focus:outline-none focus:border-[#00ff9d]/50 focus:ring-1 focus:ring-[#00ff9d]/20 transition-all min-h-[48px]"
            />
            <p className="mt-2 text-xs text-[#5c6370]">
              Your API key is stored locally and never sent to any server.
            </p>
          </div>

          {/* Model selection */}
          <div>
            <label className="block text-sm font-medium text-[#c5c8c6] mb-3">
              Model
            </label>
            <div className="space-y-2">
              {models.map(model => (
                <button
                  key={model.id}
                  onClick={() => setLocalSettings({ ...localSettings, model: model.id })}
                  className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all text-left min-h-[56px]
                    ${localSettings.model === model.id
                      ? 'bg-[#00ff9d]/10 border-[#00ff9d]/30'
                      : 'bg-[#1a1f2e] border-[#2a2f3e] hover:border-[#3a3f4e]'
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0
                    ${localSettings.model === model.id
                      ? 'border-[#00ff9d] bg-[#00ff9d]'
                      : 'border-[#5c6370]'
                    }
                  `}>
                    {localSettings.model === model.id && (
                      <svg className="w-full h-full text-[#0a0e14]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${localSettings.model === model.id ? 'text-[#00ff9d]' : 'text-[#c5c8c6]'}`}>
                      {model.name}
                    </p>
                    <p className="text-xs text-[#5c6370]">{model.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Approval mode */}
          <div>
            <label className="block text-sm font-medium text-[#c5c8c6] mb-3">
              Approval Mode
            </label>
            <div className="space-y-2">
              {approvalModes.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setLocalSettings({ ...localSettings, autoApprove: mode.id as Settings['autoApprove'] })}
                  className={`w-full flex items-center gap-3 p-3 md:p-4 rounded-xl border transition-all text-left min-h-[56px]
                    ${localSettings.autoApprove === mode.id
                      ? mode.id === 'full-auto'
                        ? 'bg-[#ff5f56]/10 border-[#ff5f56]/30'
                        : 'bg-[#00ff9d]/10 border-[#00ff9d]/30'
                      : 'bg-[#1a1f2e] border-[#2a2f3e] hover:border-[#3a3f4e]'
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0
                    ${localSettings.autoApprove === mode.id
                      ? mode.id === 'full-auto'
                        ? 'border-[#ff5f56] bg-[#ff5f56]'
                        : 'border-[#00ff9d] bg-[#00ff9d]'
                      : 'border-[#5c6370]'
                    }
                  `}>
                    {localSettings.autoApprove === mode.id && (
                      <svg className="w-full h-full text-[#0a0e14]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm ${
                      localSettings.autoApprove === mode.id
                        ? mode.id === 'full-auto' ? 'text-[#ff5f56]' : 'text-[#00ff9d]'
                        : 'text-[#c5c8c6]'
                    }`}>
                      {mode.name}
                    </p>
                    <p className="text-xs text-[#5c6370]">{mode.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox mode */}
          <div className="flex items-center justify-between p-3 md:p-4 bg-[#1a1f2e] rounded-xl min-h-[56px]">
            <div>
              <p className="font-medium text-sm text-[#c5c8c6]">Sandbox Mode</p>
              <p className="text-xs text-[#5c6370]">Preview changes before applying</p>
            </div>
            <button
              onClick={() => setLocalSettings({ ...localSettings, sandboxMode: !localSettings.sandboxMode })}
              className={`relative w-12 h-7 rounded-full transition-colors ${
                localSettings.sandboxMode ? 'bg-[#00ff9d]' : 'bg-[#3d4450]'
              }`}
            >
              <span className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                localSettings.sandboxMode ? 'left-6' : 'left-1'
              }`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-4 md:px-6 py-4 border-t border-[#1a1f2e]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[#5c6370] hover:text-[#c5c8c6] transition-colors min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-[#00ff9d] hover:bg-[#00cc7d] text-[#0a0e14] font-medium text-sm rounded-lg transition-colors min-h-[44px]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
