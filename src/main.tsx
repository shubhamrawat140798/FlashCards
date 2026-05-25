import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { useDatabaseOnly } from './lib/dataMode';
import { initializeStorage } from './lib/storage';
import './index.css';

// localStorage seed only for local dev when VITE_USE_API=false
if (!useDatabaseOnly()) {
  initializeStorage();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
