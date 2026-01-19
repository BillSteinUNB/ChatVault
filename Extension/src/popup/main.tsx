import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '../shared/components/ThemeProvider';
import { Popup } from '../shared/components/Popup';
import '../shared/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <div className="w-[320px] h-[500px] bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-200">
        <Popup />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
