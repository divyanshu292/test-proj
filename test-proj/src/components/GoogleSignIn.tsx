import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
}

interface GoogleSignInProps {
  onSuccess: (userData: User) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSignIn = () => {
    // Show loading state
    setIsLoading(true);
    
    // In a real app, you would use the Google OAuth API
    // For this demo, we'll just simulate a successful sign-in with a delay
    setTimeout(() => {
      const mockUserData: User = {
        id: '123456789',
        name: 'Demo User',
        email: 'demo@example.com',
        photoURL: null
      }
      
      setIsLoading(false);
      onSuccess(mockUserData);
    }, 1000);
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            onClick={handleSignIn}
            className="w-full py-6 flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg transition-all hover:shadow-purple-500/20"
            disabled={isLoading}
          >
            {!isLoading ? (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            ) : (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </div>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-gray-800 text-gray-200 border-gray-700">
          <p>Click to sign in with your Google account</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default GoogleSignIn