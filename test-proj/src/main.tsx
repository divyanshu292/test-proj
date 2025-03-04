import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { ModelProvider } from './components/ModelSelector'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <ModelProvider>
          <App />
        </ModelProvider>
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>,
)