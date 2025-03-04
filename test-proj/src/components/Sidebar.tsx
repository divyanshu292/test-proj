import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProjectListTile from './ProjectListTile'
import SearchBar from './SearchBar'
import { Button } from '@/components/ui/button'
import { Plus, LogOut, Settings } from 'lucide-react'
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
      {/* Header */}
      <div className="p-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
            TM
          </div>
          <h1 className="text-lg font-bold text-gray-100">TrulyMadly Internal Tool</h1>
        </div>
      </div>

      {/* User info */}
      <div className="p-2 border-b border-gray-700">
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-100 hover:bg-gray-700">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-200">
              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-gray-700 cursor-pointer">
                Preferences
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

      {/* Search Bar */}
      <div className="p-2 border-b border-gray-700">
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
    </div>
  )
}

export default Sidebar