
import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { Settings as SettingsIcon, Key, Database, Download, Upload, AlertCircle, Check, User, Moon, Sun, Volume2, Palette, Shield, Info } from 'lucide-react';

const Settings = () => {
  const { cases } = useContext(AppContext);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);

  const currentApiKey = process.env.API_KEY || '';
  const isApiKeyConfigured = currentApiKey && currentApiKey !== '';

  const handleSaveApiKey = () => {
    // Note: This won't actually update the environment variable in the browser
    // The user needs to update .env.local and restart the dev server
    setSaveStatus('error');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const exportData = () => {
    const data = {
      cases,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lexsim-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        // In a real implementation, you would restore the cases here
        console.log('Import data:', data);
        alert('Import functionality requires backend implementation');
      } catch (error) {
        alert('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white font-serif">Settings</h1>
        <p className="text-slate-400 mt-2">Configure your LexSim preferences and API settings</p>
      </div>

      {/* API Configuration */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="text-gold-500" size={24} />
          <h2 className="text-xl font-semibold text-white">API Configuration</h2>
        </div>

        <div className="space-y-4">
          {/* API Key Status */}
          <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
            {isApiKeyConfigured ? (
              <>
                <Check className="text-green-500" size={20} />
                <div>
                  <p className="text-green-400 font-medium">API Key Configured</p>
                  <p className="text-xs text-slate-400 mt-1">Gemini API is ready to use</p>
                </div>
              </>
            ) : (
              <>
                <AlertCircle className="text-yellow-500" size={20} />
                <div>
                  <p className="text-yellow-400 font-medium">API Key Not Configured</p>
                  <p className="text-xs text-slate-400 mt-1">Add GEMINI_API_KEY to .env.local and restart the server</p>
                </div>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-300">
                <p className="font-semibold mb-2">How to configure your API key:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-200">
                  <li>Get your API key from <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">Google AI Studio</a></li>
                  <li>Open <code className="bg-slate-900/50 px-2 py-0.5 rounded">.env.local</code> in your project root</li>
                  <li>Add: <code className="bg-slate-900/50 px-2 py-0.5 rounded">GEMINI_API_KEY=your_key_here</code></li>
                  <li>Restart the development server</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="text-gold-500" size={24} />
          <h2 className="text-xl font-semibold text-white">Data Management</h2>
        </div>

        <div className="space-y-4">
          {/* Storage Info */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300 font-medium">Cases stored</span>
              <span className="text-gold-500 font-bold text-lg">{cases.length}</span>
            </div>
            <p className="text-xs text-slate-400">
              Data is stored in browser memory and will be lost on page refresh
            </p>
          </div>

          {/* Export/Import */}
          <div className="grid sm:grid-cols-2 gap-3">
            <button
              onClick={exportData}
              disabled={cases.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-900 disabled:text-slate-600 border border-slate-600 rounded-lg transition-colors"
            >
              <Download size={18} />
              <span className="font-medium">Export Data</span>
            </button>

            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-colors cursor-pointer">
              <Upload size={18} />
              <span className="font-medium">Import Data</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>

          {/* Auto-save Toggle */}
          <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
            <div>
              <p className="text-slate-300 font-medium">Auto-save to LocalStorage</p>
              <p className="text-xs text-slate-400 mt-1">Persist data between sessions (not implemented)</p>
            </div>
            <button
              onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
              disabled
              className={`relative w-12 h-6 rounded-full transition-colors ${
                autoSaveEnabled ? 'bg-gold-500' : 'bg-slate-600'
              } disabled:opacity-50 cursor-not-allowed`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  autoSaveEnabled ? 'transform translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Appearance (Future Feature) */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 opacity-50">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="text-gold-500" size={24} />
          <h2 className="text-xl font-semibold text-white">Appearance</h2>
          <span className="text-xs px-2 py-1 bg-slate-700 text-slate-400 rounded">Coming Soon</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={20} className="text-slate-400" /> : <Sun size={20} className="text-slate-400" />}
              <span className="text-slate-400">Theme</span>
            </div>
            <select
              disabled
              value={theme}
              className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Profile (Future Feature) */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 opacity-50">
        <div className="flex items-center gap-3 mb-4">
          <User className="text-gold-500" size={24} />
          <h2 className="text-xl font-semibold text-white">User Profile</h2>
          <span className="text-xs px-2 py-1 bg-slate-700 text-slate-400 rounded">Coming Soon</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
            <input
              type="text"
              disabled
              placeholder="Attorney J. Doe"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Title</label>
            <input
              type="text"
              disabled
              placeholder="Senior Litigator"
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="text-gold-500" size={24} />
          <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
        </div>

        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-white">Data Storage:</strong> All case data is stored locally in your browser's memory. No data is sent to any server except Google's Gemini API.
          </p>
          <p>
            <strong className="text-white">API Usage:</strong> Your prompts and case information are sent to Google's Gemini API for processing. Review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">Google's Privacy Policy</a>.
          </p>
          <p>
            <strong className="text-white">Persistence:</strong> Case data is lost on page refresh unless you export it. No backend database is implemented.
          </p>
        </div>
      </div>

      {/* About */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-3">About LexSim</h2>
        <p className="text-sm text-slate-300 mb-2">
          LexSim is an AI-powered legal trial preparation platform built with Google Gemini AI.
        </p>
        <div className="flex gap-4 text-xs text-slate-400">
          <span>Version 1.0.0</span>
          <span>•</span>
          <a href="https://ai.studio/apps/drive/1V2CDhsqj46ydvFpmYDwK7mwA9ZvplvwL" target="_blank" rel="noopener noreferrer" className="text-gold-400 hover:underline">
            View on AI Studio
          </a>
        </div>
      </div>
    </div>
  );
};

export default Settings;
