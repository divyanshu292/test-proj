import * as React from 'react'
import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../contexts/AuthContext'
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext'
import { Button } from '@/components/ui/button'
import { Menu, PanelLeftOpen } from 'lucide-react'

const MainLayoutContent: React.FC = () => {
  const { currentUser } = useAuth()
  const { collapsed: sidebarClosed, toggleSidebar } = useSidebar()
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle - only visible on mobile */}
      <div className={`fixed top-4 left-4 z-50 md:hidden ${!sidebarClosed ? 'hidden' : 'block'}`}>
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
          ${!sidebarClosed ? 'translate-x-0' : '-translate-x-full md:-translate-x-64'} 
          ${!sidebarClosed ? 'w-64' : 'w-0 md:w-0 overflow-hidden'}
        `}
      >
        <div className="h-full relative">
          <Sidebar />
        </div>
      </div>
      
      {/* Main content */}
      <div className={`
        flex-1 overflow-auto relative p-0
        ${sidebarClosed && 'ml-0'}
        transition-all duration-300
      `}>
        {/* Desktop collapsed sidebar toggle button - Using PanelLeftOpen to match sidebar */}
        {sidebarClosed && (
          <div className="hidden md:block absolute left-4 top-4 z-10">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleSidebar}
              className="rounded-full h-8 w-8 shadow-md bg-gray-800 border-gray-700"
            >
              <PanelLeftOpen className="h-4 w-4 text-gray-300" />
            </Button>
          </div>
        )}
        <div className={`${sidebarClosed ? 'md:pl-14' : ''} h-full relative`}>
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