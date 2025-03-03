import * as React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import ThreadItem from './ThreadItem'
import { useProjects } from './Sidebar'

interface Thread {
  id: string;
  name: string;
}

interface Project {
  id: string;
  name: string;
  threads: Thread[];
}

interface ProjectListTileProps {
  project: Project;
}

const ProjectListTile: React.FC<ProjectListTileProps> = ({ project }) => {
  const navigate = useNavigate()
  const { projectId, threadId } = useParams<{ projectId: string; threadId: string }>()
  const [isExpanded, setIsExpanded] = useState<boolean>(projectId === project.id)
  const [newThreadDialogOpen, setNewThreadDialogOpen] = useState<boolean>(false)
  const [newThreadName, setNewThreadName] = useState<string>('')
  const { addThreadToProject } = useProjects()

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  const handleCreateThread = () => {
    if (newThreadName.trim()) {
      // Create a new thread
      const newThread: Thread = {
        id: Date.now().toString(),
        name: newThreadName
      }
      
      // Add the thread to the project
      addThreadToProject(project.id, newThread)
      
      // Clear form and close dialog
      setNewThreadName('')
      setNewThreadDialogOpen(false)
      
      // Navigate to the new thread
      navigate(`/project/${project.id}/thread/${newThread.id}`)
    }
  }

  return (
    <>
      <div className="mb-1 rounded-lg overflow-hidden">
        {/* Project header */}
        <div 
          className="flex items-center p-2 hover:bg-gray-700 cursor-pointer rounded-md"
          onClick={toggleExpand}
        >
          <div className="mr-1">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
          <div className="flex-1 font-medium truncate text-sm text-gray-200">{project.name}</div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
            onClick={(e) => {
              e.stopPropagation()
              setNewThreadDialogOpen(true)
            }}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        {/* Thread list */}
        {isExpanded && (
          <div className="pl-5 pr-2">
            {project.threads.map(thread => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                projectId={project.id}
              />
            ))}
            {project.threads.length === 0 && (
              <div className="py-2 px-2 text-xs text-gray-400 italic">
                No threads yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Thread Dialog */}
      <Dialog open={newThreadDialogOpen} onOpenChange={setNewThreadDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-gray-100">Create New Thread in {project.name}</DialogTitle>
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
            <Button onClick={handleCreateThread} className="bg-purple-600 hover:bg-purple-700 text-white">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProjectListTile