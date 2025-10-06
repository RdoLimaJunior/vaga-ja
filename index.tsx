import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Explicitly use .tsx extension to ensure module resolution. This resolves the "is not a module" error.
import App from './App.tsx';
import './i18n'; // Initialize i18next

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback="Loading...">
      <App />
    </React.Suspense>
  </React.StrictMode>
);
