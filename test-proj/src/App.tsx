import * as React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import ProjectPage from './pages/ProjectPage'
import ThreadPage from './pages/ThreadPage'
import MainLayout from './layouts/MainLayout'
import { ProjectsProvider } from './components/Sidebar'

const App: React.FC = () => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
      </div>
    )
  }

  return (
    <Router>
      <ProjectsProvider>
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          
          <Route element={isAuthenticated ? <MainLayout /> : <Navigate to="/login" />}>
            <Route path="/" element={<ProjectPage />} />
            <Route path="/project/:projectId/thread/:threadId" element={<ThreadPage />} />
          </Route>
        </Routes>
      </ProjectsProvider>
    </Router>
  )
}

export default App