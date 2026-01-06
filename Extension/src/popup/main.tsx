import React from 'react';
import ReactDOM from 'react-dom/client';
import { Popup } from '../shared/components/Popup';
import '../shared/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="w-[320px] h-[500px] bg-white overflow-hidden">
      <Popup />
    </div>
  </React.StrictMode>
);
