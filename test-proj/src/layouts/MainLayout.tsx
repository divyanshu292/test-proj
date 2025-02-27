
// import * as React from 'react'
// import { useState, useEffect } from 'react'
// import { Outlet } from 'react-router-dom'
// import Sidebar from '../components/Sidebar'
// import { useAuth } from '../contexts/AuthContext'
// import { Button } from '@/components/ui/button'
// import { Menu } from 'lucide-react'

// const MainLayout: React.FC = () => {
//   const { currentUser } = useAuth()
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  
//   // Close sidebar on mobile when clicking outside
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth >= 768) {
//         setSidebarOpen(true);
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);
  
//   return (
//     <div className="flex h-screen overflow-hidden bg-gray-50">
//       {/* Mobile sidebar toggle */}
//       <div className="fixed top-4 left-4 z-50 md:hidden">
//         <Button 
//           variant="outline" 
//           size="icon" 
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="rounded-full shadow-md bg-white"
//         >
//           <Menu className="h-5 w-5" />
//         </Button>
//       </div>
      
//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
//         fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-80`}
//       >
//         <Sidebar />
//       </div>
      
//       {/* Main content */}
//       <div className="flex-1 overflow-auto relative">
//         <Outlet />
//       </div>
      
//       {/* Mobile overlay */}
//       {sidebarOpen && (
//         <div 
//           className="fixed inset-0 z-30 bg-black/50 md:hidden" 
//           onClick={() => setSidebarOpen(false)}
//         />
//       )}
//     </div>
//   )
// }

// export default MainLayout


import * as React from 'react'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

const MainLayout: React.FC = () => {
  const { currentUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  
  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-2 left-2 z-50 md:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-full shadow-md bg-white"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-64`}
      >
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto relative p-0">
        <Outlet />
      </div>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default MainLayout