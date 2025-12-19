import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { MascotProvider } from './mascots/MascotContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MascotProvider>
      <App />
    </MascotProvider>
  </React.StrictMode>
)
