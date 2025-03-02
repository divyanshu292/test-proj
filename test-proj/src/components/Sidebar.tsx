// import * as React from 'react'
// import { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { useAuth } from '../contexts/AuthContext'
// import ProjectListTile from './ProjectListTile'
// import { Button } from '@/components/ui/button'
// import { Plus, LogOut } from 'lucide-react'
// import { Input } from '@/components/ui/input'
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

// interface Thread {
//   id: string;
//   name: string;
// }

// interface Project {
//   id: string;
//   name: string;
//   threads: Thread[];
// }

// // Mock data for projects
// const MOCK_PROJECTS: Project[] = [
//   {
//     id: '1',
//     name: 'Personal Assistant',
//     threads: [
//       { id: '101', name: 'mock name 1' },
//       { id: '102', name: 'mock name 2' },
//       { id: '103', name: 'mock name 3' }
//     ]
//   },
// ];

// // Create a projects context to share project data across components
// export const ProjectsContext = React.createContext<{
//   projects: Project[];
//   setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
//   addThreadToProject: (projectId: string, thread: Thread) => void;
// }>({
//   projects: [],
//   setProjects: () => {},
//   addThreadToProject: () => {},
// });

// export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

//   const addThreadToProject = (projectId: string, thread: Thread) => {
//     setProjects(prevProjects => 
//       prevProjects.map(project => 
//         project.id === projectId 
//           ? { ...project, threads: [...project.threads, thread] }
//           : project
//       )
//     );
//   };

//   return (
//     <ProjectsContext.Provider value={{ projects, setProjects, addThreadToProject }}>
//       {children}
//     </ProjectsContext.Provider>
//   );
// };

// // Custom hook to use the projects context
// export const useProjects = () => React.useContext(ProjectsContext);

// const Sidebar: React.FC = () => {
//   const { currentUser, logout } = useAuth()
//   const { projects, setProjects } = useProjects()
//   const navigate = useNavigate()
//   const [newProjectDialogOpen, setNewProjectDialogOpen] = useState<boolean>(false)
//   const [newProjectName, setNewProjectName] = useState<string>('')

//   const handleLogout = () => {
//     logout()
//     navigate('/login')
//   }

//   const createNewProject = () => {
//     if (newProjectName.trim()) {
//       const newProject: Project = {
//         id: Date.now().toString(),
//         name: newProjectName,
//         threads: []
//       }
//       setProjects([...projects, newProject])
//       setNewProjectName('')
//       setNewProjectDialogOpen(false)
//     }
//   }

//   return (
//     <div className="flex h-full flex-col bg-white border-r border-gray-200 w-64">
//       {/* Header */}
//       <div className="p-2 border-b">
//         <div className="flex items-center space-x-2">
//           <div className="w-7 h-7 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold">
//             C
//           </div>
//           <h1 className="text-lg font-bold">Claude</h1>
//         </div>
//       </div>

//       {/* User info */}
//       <div className="p-2 border-b">
//         <div className="flex items-center">
//           <div className="w-8 h-8 rounded-full bg-gray-200 mr-2 overflow-hidden">
//             {currentUser?.picture ? (
//               <img src={currentUser.picture} alt={currentUser.name} className="w-full h-full object-cover" />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center bg-purple-100 text-purple-700 font-bold">
//                 {currentUser?.name?.charAt(0) || 'U'}
//               </div>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="font-medium truncate text-sm">{currentUser?.name || 'User'}</p>
//             <p className="text-xs text-gray-500 truncate">{currentUser?.email || ''}</p>
//           </div>
//           <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleLogout}>
//             <LogOut className="h-4 w-4" />
//           </Button>
//         </div>
//       </div>

//       {/* New Project Button */}
//       <div className="p-2">
//         <Button 
//           className="w-full text-sm" 
//           onClick={() => setNewProjectDialogOpen(true)}
//           size="sm"
//         >
//           <Plus className="mr-2 h-3 w-3" /> New Project
//         </Button>
//       </div>

//       {/* Projects List */}
//       <div className="flex-1 overflow-y-auto p-1">
//         {projects.map(project => (
//           <ProjectListTile key={project.id} project={project} />
//         ))}
//       </div>

//       {/* New Project Dialog */}
//       <Dialog open={newProjectDialogOpen} onOpenChange={setNewProjectDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Create New Project</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             <Input
//               value={newProjectName}
//               onChange={(e) => setNewProjectName(e.target.value)}
//               placeholder="Project name"
//               className="w-full"
//             />
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setNewProjectDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={createNewProject}>
//               Create
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }

// export default Sidebar
import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ProjectListTile from './ProjectListTile'
import { Button } from '@/components/ui/button'
import { Plus, LogOut } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

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
            C
          </div>
          <h1 className="text-lg font-bold text-gray-100">Claude</h1>
        </div>
      </div>

      {/* User info */}
      <div className="p-2 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-700 mr-2 overflow-hidden">
            {currentUser?.picture ? (
              <img src={currentUser.picture} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-purple-800 text-purple-100 font-bold">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate text-sm text-gray-200">{currentUser?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{currentUser?.email || ''}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-100 hover:bg-gray-700" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
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