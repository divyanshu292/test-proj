import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useSidebar } from '../contexts/SidebarContext'
import ProjectListTile from './ProjectListTile'
import ProfileSettings from './ProfileSettings'
import PreferencesDialog from './PreferencesDialog'
import { Button } from '@/components/ui/button'
import { 
  LogOut, 
  Sliders, 
  Search, 
  FolderPlus, 
  PanelLeftClose, 
  PanelLeftOpen,
  Settings
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatars'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
      <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 sm:max-w-md shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Search</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="search-dialog-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects & threads..."
              className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 pl-10"
            />
          </div>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="max-h-80 overflow-y-auto rounded border border-gray-700">
            {searchResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-0 transition-colors"
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

  // Sidebar icon with tooltip component
  const SidebarIcon: React.FC<{
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    active?: boolean;
    danger?: boolean;
  }> = ({ icon, label, onClick, active = false, danger = false }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all
              ${active 
                ? 'bg-purple-800/40 text-purple-300' 
                : danger 
                  ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/60'
              }`}
            onClick={onClick}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-gray-800 text-gray-200 border-gray-700">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div 
      className={`flex h-full flex-col bg-gray-900 border-r border-gray-800
        ${collapsed ? 'w-20' : 'w-64'} transition-all duration-500 ease-in-out`}
    >
      {/* Company Logo Section */}
      <div className={`flex ${collapsed ? 'justify-center' : 'items-center justify-between'} border-b border-gray-800 h-14`}>
        {collapsed ? (
          <div 
            className="w-12 h-12 flex items-center justify-center cursor-pointer p-2"
            onClick={navigateToHome}
          >
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-full w-full object-contain"
            />
          </div>
        ) : (
          <>
            <div 
              className="flex items-center pl-3 cursor-pointer" 
              onClick={navigateToHome}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800">
                <img 
                  src={companyLogo} 
                  alt="Company Logo" 
                  className="h-6 w-6 object-contain"
                />
              </div>
              <span className="font-bold text-xl ml-2 text-gray-200">TrulyMadly</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 mr-1"
              onClick={toggleSidebar}
            >
              <PanelLeftClose className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>

      {/* Main Navigation - Collapsed View */}
      {collapsed && (
        <div className="flex flex-col items-center mt-4 space-y-4">
          <SidebarIcon 
            icon={<Search className="h-5 w-5" />} 
            label="Search" 
            onClick={() => setSearchDialogOpen(true)}
          />
          
          <SidebarIcon 
            icon={<FolderPlus className="h-5 w-5" />} 
            label="New Project" 
            onClick={() => setNewProjectDialogOpen(true)}
          />
          
          <Separator className="bg-gray-800 my-1 w-8" />
          
          <SidebarIcon 
            icon={<PanelLeftOpen className="h-5 w-5" />} 
            label="Expand Sidebar" 
            onClick={toggleSidebar}
          />
        </div>
      )}

      {/* Projects List - Expanded View */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-2">
          <div className="flex items-center justify-between mb-1 px-1">
            <h2 className="text-sm font-semibold text-gray-400">PROJECTS</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800"
              onClick={() => setNewProjectDialogOpen(true)}
            >
              <FolderPlus className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {projects.map(project => (
            <ProjectListTile key={project.id} project={project} />
          ))}
          
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2 text-gray-400 border-gray-700 bg-gray-800/50 hover:bg-gray-800 hover:text-gray-200 flex items-center justify-center h-8 text-xs"
            onClick={() => setSearchDialogOpen(true)}
          >
            <Search className="h-3 w-3 mr-2" />
            Search...
          </Button>
        </div>
      )}
      
      {/* User info - Profile section */}
      <div className="mt-auto border-t border-gray-800">
        {collapsed ? (
          <div className="py-4 flex flex-col items-center space-y-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar 
                    className="h-9 w-9 cursor-pointer border-2 border-gray-800 hover:border-purple-700 transition-all"
                    onClick={() => setProfileSettingsOpen(true)}
                  >
                    {currentUser?.picture ? (
                      <AvatarImage src={currentUser.picture} alt={currentUser.name || 'User'} />
                    ) : (
                      <AvatarFallback className="bg-purple-900 text-purple-100 font-bold">
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
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                    onClick={() => setPreferencesOpen(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Preferences</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-lg text-red-400 hover:text-red-300 hover:bg-gray-800"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        ) : (
          <div className="px-2 py-2">
            <div className="flex items-center">
              <Avatar 
                className="h-8 w-8 cursor-pointer border border-gray-800 hover:border-purple-700 transition-all"
                onClick={() => setProfileSettingsOpen(true)}
              >
                {currentUser?.picture ? (
                  <AvatarImage src={currentUser.picture} alt={currentUser.name || 'User'} />
                ) : (
                  <AvatarFallback className="bg-purple-900 text-purple-100 font-bold">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              
              <div className="flex-1 min-w-0 ml-2">
                <div className="flex items-center">
                  <p className="font-medium truncate text-sm text-gray-200">
                    {currentUser?.name || 'User'}
                  </p>
                  <Badge variant="purple" className="ml-2 text-xs px-1 py-0">Pro</Badge>
                </div>
                <p className="text-xs text-gray-400 truncate">{currentUser?.email || ''}</p>
              </div>
              
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  onClick={() => setPreferencesOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-lg text-red-400 hover:text-red-300 hover:bg-gray-800"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
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
              autoFocus
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