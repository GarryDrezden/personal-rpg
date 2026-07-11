import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { DEFAULT_APP_THEME_ID } from './constants/themes';
import { applyThemeToDocument, getStoredThemeId } from './utils/themeApply';
import { registerPwa } from './pwa/registerPwa';

applyThemeToDocument(getStoredThemeId() ?? DEFAULT_APP_THEME_ID);
registerPwa();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
