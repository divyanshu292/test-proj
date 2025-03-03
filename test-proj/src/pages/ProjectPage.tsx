import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useProjects } from '../components/Sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { MessageSquare, Plus } from 'lucide-react'

interface Thread {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  threads: Thread[];
}

const ProjectPage: React.FC = () => {
  const { currentUser } = useAuth()
  const { projects, addThreadToProject } = useProjects()
  const navigate = useNavigate()
  
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [newThreadDialogOpen, setNewThreadDialogOpen] = useState<boolean>(false)
  const [newThreadName, setNewThreadName] = useState<string>('')

  // Use the first project by default, or update when projects change
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const handleThreadClick = (threadId: string) => {
    if (selectedProject) {
      navigate(`/project/${selectedProject.id}/thread/${threadId}`)
    }
  }

  const handleCreateThread = () => {
    if (newThreadName.trim() && selectedProject) {
      // Create a new thread
      const newThread: Thread = {
        id: Date.now().toString(),
        name: newThreadName
      }
      
      // Add the thread to the project
      addThreadToProject(selectedProject.id, newThread)
      
      // Clear form and close dialog
      setNewThreadName('')
      setNewThreadDialogOpen(false)
      
      // Navigate to the new thread
      navigate(`/project/${selectedProject.id}/thread/${newThread.id}`)
    }
  }

  if (!selectedProject) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-200">No projects available</h1>
          <p className="text-gray-400 mt-2">Create a new project to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-gray-900">
      <header className="mb-4 md:mt-0">
        <h1 className="text-2xl font-bold text-gray-100">{selectedProject.name}</h1>
        <p className="text-gray-400 text-sm">Select a thread or create a new one</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Thread cards */}
        {selectedProject.threads.map(thread => (
          <Card 
            key={thread.id} 
            className="cursor-pointer hover:shadow-md transition-shadow bg-gray-800 border-gray-700"
            onClick={() => handleThreadClick(thread.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center mb-2">
                <MessageSquare className="h-4 w-4 text-purple-400 mr-2" />
                <h3 className="font-medium text-sm text-gray-200">{thread.name}</h3>
              </div>
              <p className="text-xs text-gray-400">
                Last updated recently
              </p>
            </CardContent>
          </Card>
        ))}
        
        {/* New Thread Card */}
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow border-dashed border-gray-600 bg-gray-800/50"
          onClick={() => setNewThreadDialogOpen(true)}
        >
          <CardContent className="p-4 flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center mb-2">
              <Plus className="h-5 w-5 text-purple-300" />
            </div>
            <h3 className="font-medium text-sm text-gray-200">New Thread</h3>
            <p className="text-xs text-gray-400 text-center mt-1">
              Start a new conversation
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* New Thread Dialog */}
      <Dialog open={newThreadDialogOpen} onOpenChange={setNewThreadDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Create New Thread in {selectedProject.name}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newThreadName}
              onChange={(e) => setNewThreadName(e.target.value)}
              placeholder="Thread name"
              className="w-full bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewThreadDialogOpen(false)} className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-gray-100">
              Cancel
            </Button>
            <Button onClick={handleCreateThread} className="bg-purple-700 hover:bg-purple-600 text-white">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProjectPage