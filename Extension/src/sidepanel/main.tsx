import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '../shared/components/ThemeProvider';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { SidePanel } from '../shared/components/SidePanel';
import '../shared/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <div className="w-full h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
          <SidePanel />
        </div>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
