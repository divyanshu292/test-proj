import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProjectListTile from './ProjectListTile'
import SearchBar from './SearchBar'
import ProfileSettings from './ProfileSettings'
import PreferencesDialog from './PreferencesDialog'
import { Button } from '@/components/ui/button'
import { Plus, LogOut, Settings, User, Sliders } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatars'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

// Import your logo - update the path to match your project structure
import companyLogo from '../assets/logo.webp' // Change this to your actual logo file name and extension

interface Thread {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  threads: Thread[];
}

// Mock data for projects
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Personal Assistant',
    threads: [
      { id: '101', name: 'mock name 1' },
      { id: '102', name: 'mock name 2' },
      { id: '103', name: 'mock name 3' }
    ]
  },
];

// Create a projects context to share project data across components
export const ProjectsContext = React.createContext<{
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addThreadToProject: (projectId: string, thread: Thread) => void;
}>({
  projects: [],
  setProjects: () => {},
  addThreadToProject: () => {},
});

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const addThreadToProject = (projectId: string, thread: Thread) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, threads: [...project.threads, thread] }
          : project
      )
    );
  };

  return (
    <ProjectsContext.Provider value={{ projects, setProjects, addThreadToProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Custom hook to use the projects context
export const useProjects = () => React.useContext(ProjectsContext);

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { projects, setProjects } = useProjects()
  const navigate = useNavigate()
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState<boolean>(false)
  const [newProjectName, setNewProjectName] = useState<string>('')
  
  // State for profile settings and preferences dialogs
  const [profileSettingsOpen, setProfileSettingsOpen] = useState<boolean>(false)
  const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const createNewProject = () => {
    if (newProjectName.trim()) {
      const newProject: Project = {
        id: Date.now().toString(),
        name: newProjectName,
        threads: []
      }
      setProjects([...projects, newProject])
      setNewProjectName('')
      setNewProjectDialogOpen(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-gray-800 border-r border-gray-700 w-64">
      {/* Company Logo Section */}
      <div className="p-4 flex justify-center items-center border-b border-gray-700">
        <img 
          src={companyLogo} 
          alt="Company Logo" 
          className="h-10 max-w-full object-contain"
        />
      </div>
      
      {/* Search Bar */}
      <div className="p-2 border-b border-gray-700 pb-3">
        <SearchBar />
      </div>
      
      {/* New Project Button */}
      <div className="p-2">
        <Button 
          className="w-full text-sm bg-gray-700 hover:bg-gray-600 text-white" 
          onClick={() => setNewProjectDialogOpen(true)}
          size="sm"
        >
          <Plus className="mr-2 h-3 w-3" /> New Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-1">
        {projects.map(project => (
          <ProjectListTile key={project.id} project={project} />
        ))}
      </div>
      
      {/* User info - Now with preferences button outside dropdown */}
      <div className="p-2 border-t border-gray-700 mt-auto">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="h-9 w-9 mr-2">
                  {currentUser?.picture ? (
                    <AvatarImage src={currentUser.picture} alt={currentUser.name || 'User'} />
                  ) : (
                    <AvatarFallback className="bg-purple-800 text-purple-100 font-bold">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  )}
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-gray-800 text-gray-200 border-gray-700">
                <p>Signed in as {currentUser?.name || 'User'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm text-gray-200 flex items-center">
              {currentUser?.name || 'User'} 
              <Badge variant="purple" className="ml-2 text-xs px-1">Pro</Badge>
            </p>
            <p className="text-xs text-gray-400 truncate">{currentUser?.email || ''}</p>
          </div>
          
          <div className="flex items-center">
            {/* Preferences Button - Now outside the dropdown */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-gray-300 hover:text-gray-100 hover:bg-gray-700 mr-1"
                    onClick={() => setPreferencesOpen(true)}
                  >
                    <Sliders className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Preferences</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* Settings dropdown - without preferences option */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-100 hover:bg-gray-700">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-200">
                <DropdownMenuItem 
                  className="hover:bg-gray-700 cursor-pointer"
                  onClick={() => setProfileSettingsOpen(true)}
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer text-red-400" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* New Project Dialog */}
      <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Create New Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100">
              Cancel
            </Button>
            <Button onClick={createNewProject} className="bg-purple-600 hover:bg-purple-700 text-white">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Profile Settings Dialog */}
      <ProfileSettings open={profileSettingsOpen} onOpenChange={setProfileSettingsOpen} />
      
      {/* Preferences Dialog */}
      <PreferencesDialog open={preferencesOpen} onOpenChange={setPreferencesOpen} />
    </div>
  )
}

export default Sidebar