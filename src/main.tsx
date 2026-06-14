import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import './index.css';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Elemento #root não encontrado');

// HashRouter (rotas no #) para funcionar em qualquer hospedagem estática
// (raiz, subcaminho, GitHub Pages, file://) sem precisar de fallback de SPA.
createRoot(rootEl).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
);
