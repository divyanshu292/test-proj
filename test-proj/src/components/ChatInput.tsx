import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, Loader, Sparkles, Image, SmilePlus } from 'lucide-react'
import { useSocket } from '../contexts/SocketContext'
import ModelSelector, { useModel } from './ModelSelector'
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
    <div className="relative px-4 sm:px-0">
      <div className="rounded-2xl border border-gray-700/50 bg-gray-800/60 backdrop-blur-lg shadow-xl hover:border-gray-600/70 transition-all">
        {/* Add a toolbar above the input for formatting options */}
        <div className="flex items-center px-3 pt-2 border-b border-gray-700/50">
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700/50">
              <SmilePlus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-gray-400 hover:text-gray-200 hover:bg-gray-700/50">
              <Image className="h-4 w-4" />
            </Button>
          </div>

          <div className="ml-auto">
            <ModelSelector variant="compact" />
          </div>
        </div>
        
        <div className="flex items-center">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="min-h-[60px] max-h-[200px] resize-none border-0 bg-transparent text-gray-200 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 py-4 px-4"
            rows={1}
            disabled={isTyping || isDisabled}
          />
          <div className="flex items-center pr-4 gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700/50">
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
                  <Button 
                    onClick={handleSendMessage} 
                    className={`rounded-lg h-9 w-9 flex items-center justify-center ${
                      connected && message.trim() 
                        ? 'bg-purple-700 hover:bg-purple-600 shadow-md shadow-purple-900/20' 
                        : 'bg-gray-700 text-gray-500'
                    }`}
                    disabled={!message.trim() || isTyping || isDisabled || !connected}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
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
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-red-900/80 rounded-full text-xs text-gray-200 border border-red-700/50 shadow-lg flex items-center z-50 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-red-500 mr-1.5 animate-pulse"></span>
          API Server Offline
        </div>
      )}
      
      {isTyping && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 py-2 px-5 bg-gray-800/90 backdrop-blur-md rounded-full text-sm text-gray-200 border border-gray-700/50 shadow-xl flex items-center gap-2 z-50">
          <Loader className="h-3.5 w-3.5 animate-spin text-purple-400" />
          <span className="font-medium">AI is thinking...</span>
          <Badge variant="purple" className="ml-1 text-xs px-2 py-0.5 h-5 bg-purple-700/80">
            {getModelShortName()}
          </Badge>
        </div>
      )}
    </div>
  )
}

export default ChatInput