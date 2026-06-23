import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { DiscordWebhookService } from './services/DiscordWebhookService'

window.addEventListener('error', (e) => {
  DiscordWebhookService.sendError(
    'Error del sistema',
    e.message || 'Error no controlado en la aplicación',
    undefined,
    { 'Archivo': e.filename || 'desconocido', 'Línea': e.lineno ?? 0 },
  )
})

window.addEventListener('unhandledrejection', (e) => {
  DiscordWebhookService.sendError(
    'Promesa rechazada',
    String(e.reason) || 'Promesa rechazada sin manejar',
  )
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
