import React from 'react';
import ReactDOM from 'react-dom/client';
// FIX: Added .tsx extension to module import.
import App from './App.tsx';
import './index.css'; // Assuming Tailwind CSS with a global stylesheet
// FIX: Added .tsx extension to module import.
import { LanguageProvider } from './i18n/LanguageContext.tsx';
// FIX: Added .tsx extension to module import.
import { AppProvider } from './state/AppContext.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <LanguageProvider>
      <AppProvider>
        <App />
      </AppProvider>
    {/* FIX: Corrected typo in closing tag for LanguageProvider. */}
    </LanguageProvider>
  </React.StrictMode>,
);