// import * as React from 'react'
// import { Button } from '@/components/ui/button'

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   photoURL: string | null;
// }

// interface GoogleSignInProps {
//   onSuccess: (userData: User) => void;
// }

// const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess }) => {
//   const handleSignIn = () => {
//     // In a real app, you would use the Google OAuth API
//     // For this demo, we'll just simulate a successful sign-in
//     const mockUserData: User = {
//       id: '123456789',
//       name: 'Demo User',
//       email: 'demo@example.com',
//       photoURL: null
//     }
    
//     onSuccess(mockUserData)
//   }
  
//   return (
//     <Button 
//       onClick={handleSignIn}
//       className="w-full py-6 flex items-center justify-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 shadow-sm"
//       variant="outline"
//     >
//       <svg className="w-5 h-5" viewBox="0 0 24 24">
//         <path
//           fill="currentColor"
//           d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
//         />
//       </svg>
//       <span>Sign in with Google</span>
//     </Button>
//   )
// }

// export default GoogleSignIn
import * as React from 'react'
import { Button } from '@/components/ui/button'

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
  const handleSignIn = () => {
    // In a real app, you would use the Google OAuth API
    // For this demo, we'll just simulate a successful sign-in
    const mockUserData: User = {
      id: '123456789',
      name: 'Demo User',
      email: 'demo@example.com',
      photoURL: null
    }
    
    onSuccess(mockUserData)
  }
  
  return (
    <Button 
      onClick={handleSignIn}
      className="w-full py-6 flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 shadow-sm"
      variant="outline"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
        />
      </svg>
      <span>Sign in with Google</span>
    </Button>
  )
}

export default GoogleSignIn