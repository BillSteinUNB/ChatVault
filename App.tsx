import React, { useState } from 'react';
import { Popup } from './components/Popup';
import { SidePanel } from './components/SidePanel';
import { Layout, Maximize2, Minimize2 } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'popup' | 'sidepanel'>('popup');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gap-8">
      
      {/* View Switcher Controls (For Demo Purposes) */}
      <div className="fixed top-4 right-4 bg-white p-2 rounded-lg shadow-md flex gap-2 z-50">
        <button
          onClick={() => setView('popup')}
          className={`p-2 rounded-md transition-colors ${view === 'popup' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Popup View (320px)"
        >
          <Minimize2 size={20} />
        </button>
        <button
          onClick={() => setView('sidepanel')}
          className={`p-2 rounded-md transition-colors ${view === 'sidepanel' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-gray-100'}`}
          title="Side Panel View"
        >
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Main Container */}
      {view === 'popup' ? (
        <div className="relative">
          <div className="absolute -top-8 left-0 text-sm text-gray-500 font-mono">Popup View (320x500)</div>
          <div className="w-[320px] h-[500px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <Popup />
          </div>
        </div>
      ) : (
        <div className="relative w-full max-w-[600px] h-[80vh]">
          <div className="absolute -top-8 left-0 text-sm text-gray-500 font-mono">Side Panel View</div>
          <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <SidePanel />
          </div>
        </div>
      )}

      <div className="fixed bottom-4 text-xs text-gray-400">
        ChatVault MVP Preview • Toggle views top-right
      </div>
    </div>
  );
};

export default App;