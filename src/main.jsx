import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom'; // <-- importa esto

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- envuelve tu App aquí */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
