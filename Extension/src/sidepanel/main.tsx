import React from 'react';
import ReactDOM from 'react-dom/client';
import { SidePanel } from '../shared/components/SidePanel';
import '../shared/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="w-full h-screen bg-white">
      <SidePanel />
    </div>
  </React.StrictMode>
);
