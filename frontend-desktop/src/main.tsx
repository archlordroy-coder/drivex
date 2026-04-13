import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
    <h1>DriveX - Desktop</h1>
    <p>Application de bureau avec intégration Systray et Disque Virtuel.</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
