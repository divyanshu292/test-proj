import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, Loader, Sparkles } from 'lucide-react'
import { useSocket } from '../contexts/SocketContext'
import { useModel } from './ModelSelector'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isTyping = false }) => {
  const [message, setMessage] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { connected } = useSocket()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)
  const { model } = useModel()

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [message])
  
  // Disable input temporarily after sending to prevent double submissions
  useEffect(() => {
    if (isTyping) {
      setIsDisabled(true);
    } else {
      const timer = setTimeout(() => setIsDisabled(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendMessage = () => {
    if (message.trim() && !isDisabled) {
      onSendMessage(message.trim())
      setMessage('')
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  // Get the formatted model name for display
  const getFormattedModelName = () => {
    return model.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Get the model short name for badge
  const getModelShortName = () => {
    const parts = model.split('-');
    return parts[parts.length - 1].toUpperCase();
  }

  return (
    <div className="relative px-4 pb-4">
      <div className="rounded-full border border-gray-700 bg-gray-800/40 backdrop-blur-sm shadow-lg hover:shadow-purple-900/10 transition-all">
        <div className="flex items-center">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent text-gray-200 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-4 rounded-l-full"
            rows={1}
            disabled={isTyping || isDisabled}
          />
          <div className="flex items-center pr-3 gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700/50">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-purple-400 hover:text-purple-300 hover:bg-gray-700/50">
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>Using {getFormattedModelName()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handleSendMessage} 
                    className={`rounded-full h-8 w-8 ml-1 flex items-center justify-center ${
                      connected ? 'bg-purple-700 hover:bg-purple-600' : 'bg-gray-600'
                    }`}
                    disabled={!message.trim() || isTyping || isDisabled || !connected}
                    size="sm"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-gray-800 text-gray-200 border-gray-700">
                  <p>{connected ? 'Send message' : 'API connection offline'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {!connected && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-900/70 rounded-full text-xs text-gray-200 border border-red-700 shadow-sm flex items-center">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1 animate-pulse"></span>
          API Server Offline
        </div>
      )}
      
      {isTyping && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 py-1 px-3 bg-gray-800/70 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-gray-700 shadow-sm flex items-center gap-2">
          <Loader className="h-3 w-3 animate-spin" />
          <span>AI is thinking...</span>
          <Badge variant="purple" className="ml-1 text-xs px-1.5 py-0 h-4">
            {getModelShortName()}
          </Badge>
        </div>
      )}
    </div>
  )
}

export default ChatInput