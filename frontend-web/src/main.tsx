import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
    <h1>DriveX - Web</h1>
    <p>Interface optimisée avec support PWA et mise en cache IndexedDB.</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
