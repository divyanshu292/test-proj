import * as React from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MessageSquare, MessageCircle } from 'lucide-react'

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
  const [isHovered, setIsHovered] = useState(false)
  
  const handleClick = () => {
    navigate(`/project/${projectId}/thread/${thread.id}`)
  }
  
  return (
    <div 
      className={`
        flex items-center p-2 my-1 rounded-md cursor-pointer transition-colors
        ${isActive 
          ? 'bg-purple-900/40 text-purple-200' 
          : 'hover:bg-gray-800/60 text-gray-400 hover:text-gray-200'
        }
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isActive ? (
        <MessageCircle className="h-3.5 w-3.5 mr-2 text-purple-400" />
      ) : (
        <MessageSquare className="h-3.5 w-3.5 mr-2 text-gray-500" />
      )}
      <div className="truncate text-xs font-medium">{thread.name}</div>
    </div>
  )
}

export default ThreadItem