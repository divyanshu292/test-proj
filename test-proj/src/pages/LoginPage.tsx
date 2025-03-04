import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import GoogleSignIn from '../components/GoogleSignIn'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Globe, LockIcon, ShieldCheckIcon } from 'lucide-react'

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
      <Card className="bg-gray-800 max-w-md w-full border border-gray-700 shadow-xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">TM</span>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-100">TrulyMadly</CardTitle>
          <CardDescription className="text-gray-400">
            Internal AI Tool
            <Badge className="ml-2 bg-purple-700 text-white hover:bg-purple-600">Enterprise</Badge>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
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
          <p className="text-xs text-center text-gray-400 mt-4">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default LoginPage