import React from "react";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";

// В продакшене скрываем отладочные логи от пользователей
if (import.meta.env && import.meta.env.PROD) {
  const noop = () => {};
  // Безопасно глушим только информационные логи
  // Ошибки и предупреждения оставляем для возможной диагностики
  console.log = noop;
  console.debug = noop as any;
  console.info = noop as any;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
