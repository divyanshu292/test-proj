import * as React from 'react'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ModelSelector from '../components/ModelSelector'
import { useAuth } from '../contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { ChevronRight, ChevronLeft, Menu } from 'lucide-react'

const MainLayout: React.FC = () => {
  const { currentUser } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  
  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Set initial state based on screen size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Mobile sidebar toggle - only visible on mobile */}
      <div className={`fixed top-4 left-4 z-50 md:hidden ${sidebarOpen ? 'hidden' : 'block'}`}>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleSidebar}
          className="rounded-full shadow-md border-gray-700"
        >
          <Menu className="h-5 w-5 text-gray-300" />
        </Button>
      </div>
      
      {/* Sidebar */}
      <div 
        className={`
          fixed md:static inset-y-0 left-0 z-40 
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-64'} 
          ${sidebarOpen ? 'w-64' : 'w-0 md:w-0 overflow-hidden'}
        `}
      >
        <div className="h-full relative">
          <Sidebar />
          
          {/* Desktop sidebar toggle - shown on right edge of sidebar */}
          <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSidebar}
              className="rounded-full h-6 w-6 shadow-md bg-gray-800 border-gray-700 text-gray-300"
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`
        flex-1 overflow-auto relative p-0
        ${!sidebarOpen && 'ml-0'}
        transition-all duration-300
      `}>
        {/* Desktop collapsed sidebar toggle button */}
        {!sidebarOpen && (
          <div className="hidden md:block absolute left-4 top-4 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSidebar}
              className="rounded-full h-8 w-8 shadow-md bg-gray-800 border-gray-700"
            >
              <Menu className="h-4 w-4 text-gray-300" />
            </Button>
          </div>
        )}
        <div className={`${!sidebarOpen ? 'md:pl-14' : ''} h-full relative`}>
          {/* Model selector in top right */}
          <div className="absolute top-4 right-4 z-10">
            <ModelSelector />
          </div>
          <Outlet />
        </div>
      </div>
      
      {/* Mobile overlay - only appears when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/70 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}

export default MainLayout