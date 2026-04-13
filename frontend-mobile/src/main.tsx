import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => (
  <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
    <h1>DriveX - Mobile</h1>
    <p>Application native alimentée par Capacitor avec scan de documents et biométrie.</p>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
