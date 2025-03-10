import * as React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ChevronRight, ChevronDown, Plus, Folder, FolderOpen } from 'lucide-react'
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
  const [isHovered, setIsHovered] = useState<boolean>(false)

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

  const isActive = projectId === project.id;

  return (
    <>
      <div className="mb-2 rounded-lg overflow-hidden">
        {/* Project header */}
        <div 
          className={`
            flex items-center p-2 cursor-pointer rounded-lg transition-all
            ${isActive 
              ? 'bg-purple-900/30 text-purple-300' 
              : 'text-gray-300 hover:bg-gray-800/60 hover:text-gray-100'
            }
          `}
          onClick={toggleExpand}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="mr-2 flex items-center">
            {isExpanded ? (
              <ChevronDown className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
            ) : (
              <ChevronRight className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
            )}
          </div>
          
          <div className="mr-2">
            {isExpanded ? (
              <FolderOpen className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
            ) : (
              <Folder className={`h-4 w-4 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
            )}
          </div>
          
          <div className="flex-1 font-medium truncate text-sm">{project.name}</div>
          
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 rounded-lg ${isActive ? 'text-purple-400 hover:text-purple-300 hover:bg-purple-900/40' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-700/50'} ${!isHovered && !isActive && 'opacity-0'} transition-opacity`}
            onClick={(e) => {
              e.stopPropagation()
              setNewThreadDialogOpen(true)
            }}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Thread list */}
        {isExpanded && (
          <div className="pl-6 pr-2 mt-1 space-y-1">
            {project.threads.map(thread => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                projectId={project.id}
              />
            ))}
            {project.threads.length === 0 && (
              <div className="py-2 px-2 text-xs text-gray-500 italic">
                No threads yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* New Thread Dialog */}
      <Dialog open={newThreadDialogOpen} onOpenChange={setNewThreadDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-gray-100 shadow-xl">
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