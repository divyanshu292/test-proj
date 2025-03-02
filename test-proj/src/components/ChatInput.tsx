// // import * as React from 'react'
// // import { useState, useRef, useEffect } from 'react'
// // import { Button } from '@/components/ui/button'
// // import { Textarea } from '@/components/ui/textarea'
// // import { Send, Paperclip, Loader } from 'lucide-react'
// // import { useSocket } from '../contexts/SocketContext'

// // interface ChatInputProps {
// //   onSendMessage: (message: string) => void;
// //   isTyping?: boolean;
// // }

// // const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isTyping = false }) => {
// //   const [message, setMessage] = useState<string>('')
// //   const textareaRef = useRef<HTMLTextAreaElement>(null)
// //   const { connected } = useSocket()
// //   const [isDisabled, setIsDisabled] = useState<boolean>(false)

// //   // Auto-resize textarea based on content
// //   useEffect(() => {
// //     if (textareaRef.current) {
// //       textareaRef.current.style.height = 'auto'
// //       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
// //     }
// //   }, [message])
  
// //   // Disable input temporarily after sending to prevent double submissions
// //   useEffect(() => {
// //     if (isTyping) {
// //       setIsDisabled(true);
// //     } else {
// //       const timer = setTimeout(() => setIsDisabled(false), 500);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [isTyping]);

// //   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
// //     if (e.key === 'Enter' && !e.shiftKey) {
// //       e.preventDefault()
// //       handleSendMessage()
// //     }
// //   }

// //   const handleSendMessage = () => {
// //     if (message.trim() && !isDisabled) {
// //       onSendMessage(message.trim())
// //       setMessage('')
      
// //       // Reset textarea height
// //       if (textareaRef.current) {
// //         textareaRef.current.style.height = 'auto'
// //       }
// //     }
// //   }

// //   return (
// //     <div className="relative">
// //       <div className="rounded-lg border bg-background">
// //         <Textarea
// //           ref={textareaRef}
// //           value={message}
// //           onChange={(e) => setMessage(e.target.value)}
// //           onKeyDown={handleKeyDown}
// //           placeholder="Ask Claude anything..."
// //           className="min-h-[52px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
// //           rows={1}
// //           disabled={isTyping || isDisabled}
// //         />
// //         <div className="flex justify-between items-center p-2 border-t">
// //           <div className="flex items-center">
// //             <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
// //               <Paperclip className="h-4 w-4 text-gray-500" />
// //             </Button>
// //             {!connected && (
// //               <span className="text-xs text-red-500 ml-1">Offline</span>
// //             )}
// //           </div>
// //           <Button 
// //             onClick={handleSendMessage} 
// //             className="rounded-full h-7 w-7" 
// //             disabled={!message.trim() || isTyping || isDisabled}
// //             size="sm"
// //           >
// //             <Send className="h-3 w-3" />
// //           </Button>
// //         </div>
// //       </div>
      
// //       {isTyping && (
// //         <div className="absolute bottom-full mb-2 px-3 py-1 bg-white rounded-full text-xs text-gray-500 border shadow-sm flex items-center">
// //           <Loader className="h-3 w-3 animate-spin mr-1" />
// //           Claude is thinking...
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// // export default ChatInput

// import * as React from 'react'
// import { useState, useRef, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { Send, Paperclip, Loader } from 'lucide-react'
// import { useSocket } from '../contexts/SocketContext'

// interface ChatInputProps {
//   onSendMessage: (message: string) => void;
//   isTyping?: boolean;
// }

// const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isTyping = false }) => {
//   const [message, setMessage] = useState<string>('')
//   const textareaRef = useRef<HTMLTextAreaElement>(null)
//   const { connected } = useSocket()
//   const [isDisabled, setIsDisabled] = useState<boolean>(false)

//   // Auto-resize textarea based on content
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto'
//       textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
//     }
//   }, [message])
  
//   // Disable input temporarily after sending to prevent double submissions
//   useEffect(() => {
//     if (isTyping) {
//       setIsDisabled(true);
//     } else {
//       const timer = setTimeout(() => setIsDisabled(false), 500);
//       return () => clearTimeout(timer);
//     }
//   }, [isTyping]);

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault()
//       handleSendMessage()
//     }
//   }

//   const handleSendMessage = () => {
//     if (message.trim() && !isDisabled) {
//       onSendMessage(message.trim())
//       setMessage('')
      
//       // Reset textarea height
//       if (textareaRef.current) {
//         textareaRef.current.style.height = 'auto'
//       }
//     }
//   }

//   return (
//     <div className="relative">
//       <div className="rounded-lg border bg-background">
//         <Textarea
//           ref={textareaRef}
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={handleKeyDown}
//           placeholder="Ask Claude anything..."
//           className="min-h-[52px] max-h-[200px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-1"
//           rows={1}
//           disabled={isTyping || isDisabled}
//         />
//         <div className="flex justify-between items-center p-2 border-t">
//           <div className="flex items-center">
//             <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full">
//               <Paperclip className="h-4 w-4 text-gray-500" />
//             </Button>
//             {!connected && (
//               <span className="text-xs text-red-500 ml-1">Offline</span>
//             )}
//           </div>
//           <Button 
//             onClick={handleSendMessage} 
//             className="rounded-full h-7 w-7" 
//             disabled={!message.trim() || isTyping || isDisabled}
//             size="sm"
//           >
//             <Send className="h-3 w-3" />
//           </Button>
//         </div>
//       </div>
      
//       {isTyping && (
//         <div className="absolute bottom-full mb-2 px-3 py-1 bg-white rounded-full text-xs text-gray-500 border shadow-sm flex items-center">
//           <Loader className="h-3 w-3 animate-spin mr-1" />
//           Claude is thinking...
//         </div>
//       )}
//     </div>
//   )
// }

// export default ChatInput
import * as React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Paperclip, Loader } from 'lucide-react'
import { useSocket } from '../contexts/SocketContext'

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isTyping = false }) => {
  const [message, setMessage] = useState<string>('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { connected } = useSocket()
  const [isDisabled, setIsDisabled] = useState<boolean>(false)

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

  return (
    <div className="relative">
      <div className="rounded-lg border border-gray-700 bg-gray-800">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Claude anything..."
          className="min-h-[52px] max-h-[200px] resize-none border-0 bg-gray-800 text-gray-200 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0 p-1"
          rows={1}
          disabled={isTyping || isDisabled}
        />
        <div className="flex justify-between items-center p-2 border-t border-gray-700">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-700">
              <Paperclip className="h-4 w-4" />
            </Button>
            {!connected && (
              <span className="text-xs text-red-400 ml-1">Offline</span>
            )}
          </div>
          <Button 
            onClick={handleSendMessage} 
            className="rounded-full h-7 w-7 bg-purple-700 hover:bg-purple-600" 
            disabled={!message.trim() || isTyping || isDisabled}
            size="sm"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {isTyping && (
        <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300 border border-gray-700 shadow-sm flex items-center">
          <Loader className="h-3 w-3 animate-spin mr-1" />
          Claude is thinking...
        </div>
      )}
    </div>
  )
}

export default ChatInput