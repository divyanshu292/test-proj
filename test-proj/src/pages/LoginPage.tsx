import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LockIcon, ShieldCheckIcon, Globe } from 'lucide-react'

// Import the company logo
import companyLogo from '../assets/TM_Icon.png'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-950/20 to-gray-900">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-700/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-700/10 rounded-full filter blur-3xl"></div>
      </div>
      
      <Card className="max-w-md w-full border border-gray-800/60 shadow-2xl bg-gray-900/80 backdrop-blur-xl z-10">
        <CardHeader className="text-center pb-2">
          <div className="w-24 h-24 mx-auto mb-5 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-900 rounded-2xl shadow-xl transform rotate-3"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 rounded-2xl shadow-xl transform -rotate-3"></div>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-2xl border border-gray-700 shadow-inner p-4">
              <img 
                src={companyLogo} 
                alt="TrulyMadly Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <CardTitle className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 mb-1">TrulyMadly</CardTitle>
          <CardDescription className="text-gray-400 flex items-center justify-center">
            Internal AI Assistant
            <Badge className="ml-2 bg-purple-700 text-white hover:bg-purple-600">Beta</Badge>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-xl p-4 space-y-3 bg-gradient-to-b from-gray-800/60 to-gray-800/30 border border-gray-700/50 shadow-inner">
              <div className="flex items-center text-sm text-gray-300">
                <ShieldCheckIcon className="h-4 w-4 mr-2 text-purple-400" />
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <LockIcon className="h-4 w-4 mr-2 text-purple-400" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Globe className="h-4 w-4 mr-2 text-purple-400" />
                <span>Access from anywhere</span>
              </div>
            </div>
            
            <GoogleSignIn onSuccess={handleGoogleSignIn} />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center">
          <p className="text-xs text-center text-gray-500 mt-2">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage