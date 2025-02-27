// import * as React from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App'
// import './App.css'
// import { AuthProvider } from './contexts/AuthContext'
// import { SocketProvider } from './contexts/SocketContext'

// createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <AuthProvider>
//       <SocketProvider>
//         <App />
//       </SocketProvider>
//     </AuthProvider>
//   </React.StrictMode>,
// )
import * as React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>,
)