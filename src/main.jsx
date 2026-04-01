import React from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'

const rootElement = document.getElementById('root')

if (rootElement.hasChildNodes()) {
  hydrateRoot(
    rootElement,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} else {
  createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
