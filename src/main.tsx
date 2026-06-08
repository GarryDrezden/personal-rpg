import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { DEFAULT_APP_THEME_ID } from './constants/themes';
import { applyThemeToDocument, getStoredThemeId } from './utils/themeApply';

applyThemeToDocument(getStoredThemeId() ?? DEFAULT_APP_THEME_ID);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
