import * as React from 'react'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext'
import { Button } from '@/components/ui/button'
import { PanelLeftOpen } from 'lucide-react'

const MainLayoutContent: React.FC = () => {
  const { currentUser } = useAuth()
  const { collapsed: sidebarClosed, toggleSidebar } = useSidebar()
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`
          fixed md:static inset-y-0 left-0 z-40 
          transition-all duration-300 ease-in-out
          ${!sidebarClosed ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
          ${!sidebarClosed ? 'w-64' : 'w-0 md:w-20 overflow-visible'}
        `}
      >
        <div className="h-full relative">
          <Sidebar />
        </div>
      </div>
      
      {/* Main content */}
      <div className={`
        flex-1 overflow-auto relative
        transition-all duration-300 ease-in-out
        ${sidebarClosed ? 'md:ml-20' : ''}
      `}>
        <div className="h-full relative">
          <Outlet />
        </div>
      </div>
      
      {/* Mobile overlay - only appears when sidebar is open on mobile */}
      {!sidebarClosed && (
        <div 
          className="fixed inset-0 z-30 bg-black/70 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
};

const MainLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <MainLayoutContent />
    </SidebarProvider>
  );
};

export default MainLayout