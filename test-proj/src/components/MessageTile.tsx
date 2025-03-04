import * as React from 'react'
import { format } from 'date-fns'
import MessageFormatter from './MessageFormatter'

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface MessageTileProps {
  message: Message;
}

const MessageTile: React.FC<MessageTileProps> = ({ message }) => {
  const isUser = message.role === 'user'
  
  // Format timestamp
  const formattedTime = message.timestamp 
    ? format(new Date(message.timestamp), 'h:mm a')
    : ''
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[95%] md:max-w-[85%] rounded-2xl px-3 py-2 ${
        isUser 
          ? 'bg-purple-700 text-white' 
          : 'bg-gray-800 border border-gray-700 text-gray-100'
      }`}>
        <div className="flex items-center mb-1">
          <span className={`text-xs font-medium ${isUser ? 'text-purple-200' : 'text-purple-300'}`}>
            {isUser ? 'You' : 'Assistant'}
          </span>
          <span className={`text-xs ml-2 ${isUser ? 'text-purple-300' : 'text-gray-400'}`}>
            {formattedTime}
          </span>
        </div>
        <div className={`text-sm ${isUser ? 'text-white' : 'text-gray-200'}`}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : (
            <MessageFormatter content={message.content} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageTile