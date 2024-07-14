import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './ui/App.js';
import { RouteContextProvider } from './ui/contexts/';

import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouteContextProvider>
      <App />
    </RouteContextProvider>
  </React.StrictMode>
);
