import * as React from 'react'
import { format } from 'date-fns'

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
  
  // Handle potentially very long responses
  const renderContent = () => {
    // Add proper line breaking for long text
    return message.content.split('\n').map((text, index) => (
      <React.Fragment key={index}>
        {text}
        {index < message.content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${
        isUser 
          ? 'bg-purple-700 text-white' 
          : 'bg-gray-800 border border-gray-700 text-gray-100'
      }`}>
        <div className="flex items-center mb-1">
          <span className={`text-xs font-medium ${isUser ? 'text-purple-200' : 'text-purple-300'}`}>
            {isUser ? 'You' : 'Claude'}
          </span>
          <span className={`text-xs ml-2 ${isUser ? 'text-purple-300' : 'text-gray-400'}`}>
            {formattedTime}
          </span>
        </div>
        <div className={`whitespace-pre-wrap text-sm ${isUser ? 'text-white' : 'text-gray-200'}`}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MessageTile