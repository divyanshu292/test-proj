import * as React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MessageSquare } from 'lucide-react'

interface Thread {
  id: string;
  name: string;
}

interface ThreadItemProps {
  thread: Thread;
  projectId: string;
}

const ThreadItem: React.FC<ThreadItemProps> = ({ thread, projectId }) => {
  const navigate = useNavigate()
  const { threadId } = useParams<{ threadId: string }>()
  const isActive = threadId === thread.id
  
  const handleClick = () => {
    navigate(`/project/${projectId}/thread/${thread.id}`)
  }
  
  return (
    <div 
      className={`flex items-center p-2 my-1 rounded-md cursor-pointer ${
        isActive ? 'bg-purple-900/50 text-purple-300' : 'hover:bg-gray-700'
      }`}
      onClick={handleClick}
    >
      <MessageSquare className={`h-3 w-3 mr-2 ${isActive ? 'text-purple-300' : 'text-gray-400'}`} />
      <div className="truncate text-xs">{thread.name}</div>
    </div>
  )
}

export default ThreadItem