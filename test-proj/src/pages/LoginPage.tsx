import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'

interface User {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
}

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSignIn = (userData: User) => {
    // In a real app, you'd validate this with your backend
    login(userData)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-indigo-950">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-100">Claude Clone</h1>
          <p className="text-gray-400 mt-2">Your AI Assistant</p>
        </div>
        
        <div className="space-y-4">
          <p className="text-center text-purple-300 mb-4">
            Sign in with your Google account to get started
          </p>
          
          <GoogleSignIn onSuccess={handleGoogleSignIn} />
          
          <p className="text-xs text-center text-gray-400 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage