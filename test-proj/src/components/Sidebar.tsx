import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSidebar } from '../contexts/SidebarContext'
import ProjectListTile from './ProjectListTile'
import ProfileSettings from './ProfileSettings'
import PreferencesDialog from './PreferencesDialog'
import { Button } from '@/components/ui/button'
import { LogOut, Sliders, Search, FolderPlus, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatars'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

// Import your logo - update the path to match your project structure
import companyLogo from '../assets/TM_Icon.png' // Change this to your actual logo file name and extension

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

// Search Dialog Component
const SearchDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { projects } = useProjects();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<Array<{
    id: string;
    name: string;
    type: 'project' | 'thread';
    projectId?: string;
  }>>([]);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const input = document.getElementById('search-dialog-input');
        if (input) input.focus();
      }, 100);
    } else {
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);

  // Handle search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    const term = searchTerm.toLowerCase();
    const results: Array<{
      id: string;
      name: string;
      type: 'project' | 'thread';
      projectId?: string;
    }> = [];

    // Search projects
    projects.forEach(project => {
      if (project.name.toLowerCase().includes(term)) {
        results.push({
          id: project.id,
          name: project.name,
          type: 'project'
        });
      }

      // Search threads
      project.threads.forEach(thread => {
        if (thread.name.toLowerCase().includes(term)) {
          results.push({
            id: thread.id,
            name: thread.name,
            type: 'thread',
            projectId: project.id
          });
        }
      });
    });

    setSearchResults(results);
  }, [searchTerm, projects]);

  const handleResultClick = (result: {
    id: string;
    name: string;
    type: 'project' | 'thread';
    projectId?: string;
  }) => {
    if (result.type === 'project') {
      navigate('/');
    } else if (result.type === 'thread' && result.projectId) {
      navigate(`/project/${result.projectId}/thread/${result.id}`);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Search</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            id="search-dialog-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects & threads..."
            className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
          />
        </div>
        
        {searchResults.length > 0 ? (
          <div className="max-h-80 overflow-y-auto rounded border border-gray-700">
            {searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center">
                  <span className={`mr-2 text-xs px-2 py-0.5 rounded-full ${
                    result.type === 'project' ? 'bg-purple-900/60 text-purple-200' : 'bg-gray-700 text-gray-300'
                  }`}>
                    {result.type === 'project' ? 'Project' : 'Thread'}
                  </span>
                  <span className="text-gray-200">{result.name}</span>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm.trim() ? (
          <div className="text-center text-gray-400 py-4">No results found</div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth()
  const { projects, setProjects } = useProjects()
  const { collapsed, toggleSidebar } = useSidebar()
  const navigate = useNavigate()
  const [newProjectDialogOpen, setNewProjectDialogOpen] = useState<boolean>(false)
  const [newProjectName, setNewProjectName] = useState<string>('')
  const [searchDialogOpen, setSearchDialogOpen] = useState<boolean>(false)
  
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

  // Navigate to home when logo is clicked
  const navigateToHome = () => {
    navigate('/')
  }

  return (
    <div className={`flex h-full flex-col bg-gray-800 border-r border-gray-700 ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      {/* Company Logo and Action Buttons Section */}
      <div className={`p-2 flex ${collapsed ? 'flex-col' : 'items-center justify-between'} border-b border-gray-700`}>
        {/* Company Logo - Now clickable */}
        <img 
          src={companyLogo} 
          alt="Company Logo" 
          className={`${collapsed ? 'h-10 w-10 mx-auto mb-2' : 'h-12 max-w-[100px]'} object-contain cursor-pointer transition-all`}
          onClick={navigateToHome}
        />
        
        {collapsed ? (
          // Collapsed view - icons stacked vertically
          <div className="flex flex-col items-center space-y-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                    onClick={() => setSearchDialogOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                    onClick={() => setNewProjectDialogOpen(true)}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Create new project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                    onClick={toggleSidebar}
                  >
                    <PanelLeftOpen className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          // Expanded view - icons in a row
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-gray-700 mr-1"
                    onClick={() => setSearchDialogOpen(true)}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Search</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-gray-700 mr-1"
                    onClick={() => setNewProjectDialogOpen(true)}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Create new project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-300 hover:text-gray-100 hover:bg-gray-700"
                    onClick={toggleSidebar}
                  >
                    <PanelLeftClose className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Collapse sidebar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-1">
        {!collapsed && projects.map(project => (
          <ProjectListTile key={project.id} project={project} />
        ))}
      </div>
      
      {/* User info - Profile image opens profile settings, icons on right */}
      <div className={`p-2 border-t border-gray-700 mt-auto ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          // Collapsed view - just show avatar
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar 
                  className="h-9 w-9 cursor-pointer"
                  onClick={() => setProfileSettingsOpen(true)}
                >
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
                <p>Profile Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          // Expanded view - show full user info
          <div className="flex items-center justify-between">
            {/* Profile Image on Left */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar 
                    className="h-9 w-9 cursor-pointer"
                    onClick={() => setProfileSettingsOpen(true)}
                  >
                    {currentUser?.picture ? (
                      <AvatarImage src={currentUser.picture} alt={currentUser.name || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-purple-800 text-purple-100 font-bold">
                        {currentUser?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Profile Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            {/* User Info in Middle */}
            <div className="flex-1 min-w-0 mx-2">
              <p className="font-medium truncate text-sm text-gray-200 flex items-center">
                {currentUser?.name || 'User'} 
                <Badge variant="purple" className="ml-2 text-xs px-1">Pro</Badge>
              </p>
              <p className="text-xs text-gray-400 truncate">{currentUser?.email || ''}</p>
            </div>
            
            {/* Buttons on Right */}
            <div className="flex items-center">
              {/* Preferences Button */}
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
              
              {/* Logout Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-gray-700"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                    <p>Logout</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
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
      
      {/* Search Dialog */}
      <SearchDialog 
        isOpen={searchDialogOpen} 
        onClose={() => setSearchDialogOpen(false)} 
      />
      
      {/* Profile Settings Dialog */}
      <ProfileSettings open={profileSettingsOpen} onOpenChange={setProfileSettingsOpen} />
      
      {/* Preferences Dialog */}
      <PreferencesDialog open={preferencesOpen} onOpenChange={setPreferencesOpen} />
    </div>
  )
}

export default Sidebar