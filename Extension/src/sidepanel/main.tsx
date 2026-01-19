import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '../shared/components/ThemeProvider';
import { SidePanel } from '../shared/components/SidePanel';
import '../shared/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="w-full h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
        <SidePanel />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
