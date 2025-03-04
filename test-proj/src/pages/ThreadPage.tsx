
// import * as React from 'react'
// import { useState, useEffect, useRef } from 'react'
// import { useParams } from 'react-router-dom'
// import { useSocket } from '../contexts/SocketContext'
// import { useProjects } from '../components/Sidebar'
// import MessageTile from '../components/MessageTile'
// import ChatInput from '../components/ChatInput'
// import { Button } from '@/components/ui/button'
// import { Trash2 } from 'lucide-react'

// interface Message {
//   id: string;
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: string;
// }

// interface ThreadData {
//   id: string;
//   projectId: string;
//   name: string;
//   messages: Message[];
// }

// const ThreadPage: React.FC = () => {
//   const { projectId, threadId } = useParams<{ projectId: string; threadId: string }>()
//   const { socket, connected } = useSocket()
//   const { projects } = useProjects()
//   const [threadName, setThreadName] = useState<string>('')
//   const [messages, setMessages] = useState<Message[]>([])
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isTyping, setIsTyping] = useState<boolean>(false)
//   const messagesEndRef = useRef<HTMLDivElement>(null)
//   const previousThreadIdRef = useRef<string | undefined>(undefined)

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   // Function to get messages for a specific thread from localStorage
//   const getMessagesForThread = (tid: string): Message[] => {
//     try {
//       const savedMessages = localStorage.getItem(`thread_messages_${tid}`);
//       if (savedMessages) {
//         return JSON.parse(savedMessages);
//       }
//     } catch (err) {
//       console.error(`Error loading saved messages for thread ${tid}:`, err);
//     }
//     return [];
//   }

//   // Function to save messages for a specific thread to localStorage
//   const saveMessagesForThread = (tid: string, msgs: Message[]) => {
//     try {
//       localStorage.setItem(`thread_messages_${tid}`, JSON.stringify(msgs));
//     } catch (err) {
//       console.error(`Error saving messages for thread ${tid}:`, err);
//     }
//   }

//   // Create context for the current thread only
//   const createContextForCurrentThread = (): { role: string; content: string }[] => {
//     if (!threadId) return [];
    
//     // Get messages specifically for this thread from localStorage
//     const threadMessages = getMessagesForThread(threadId);
    
//     // Format them for the AI context (latest 10 messages)
//     return threadMessages.slice(-10).map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));
//   }

//   // Function to clear chat history for the current thread
//   const clearChatHistory = () => {
//     if (threadId) {
//       if (window.confirm('Are you sure you want to clear the chat history for this thread?')) {
//         localStorage.removeItem(`thread_messages_${threadId}`);
//         setMessages([]);
//       }
//     }
//   }

//   // Find thread data and load previous messages from localStorage
//   useEffect(() => {
//     if (projectId && threadId && projects.length > 0) {
//       setLoading(true);
      
//       // Clear previous thread state when switching to a new thread
//       if (previousThreadIdRef.current !== threadId) {
//         setMessages([]);
//         setError(null);
//         setIsTyping(false);
//         previousThreadIdRef.current = threadId;
//       }
      
//       // Find the project and thread
//       const project = projects.find(p => p.id === projectId);
//       if (project) {
//         const thread = project.threads.find(t => t.id === threadId);
//         if (thread) {
//           setThreadName(thread.name);
          
//           // Load messages for this specific thread
//           const threadMessages = getMessagesForThread(threadId);
//           setMessages(threadMessages);
          
//           setError(null);
//         } else {
//           setError("Thread not found");
//         }
//       } else {
//         setError("Project not found");
//       }
      
//       setLoading(false);
//     }
    
//     // Cleanup function - runs when component unmounts or threadId changes
//     return () => {
//       // Remove all socket listeners for the previous thread
//       if (socket) {
//         socket.off('chat');
//         socket.off('typing');
//       }
//     };
//   }, [projectId, threadId, projects, socket]);

//   // Save messages to localStorage and scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
    
//     // Save messages to localStorage for persistence (only if we have a valid threadId)
//     if (messages.length > 0 && threadId) {
//       saveMessagesForThread(threadId, messages);
//     }
//   }, [messages, threadId]);

//   // Handle socket events for real-time updates
//   useEffect(() => {
//     if (socket && threadId) {
//       // Handle connection events
//       const handleConnect = () => {
//         console.log('Socket connected');
//         setError(null);
//       };
      
//       const handleDisconnect = () => {
//         console.log('Socket disconnected');
//       };
      
//       // Listen for connection events
//       socket.on('connect', handleConnect);
//       socket.on('disconnect', handleDisconnect);
      
//       // Listen for AI typing indicator - keyed to current thread
//       socket.on('typing', (data) => {
//         // Only process typing events for the current thread
//         if (data.threadId === threadId) {
//           setIsTyping(data.isTyping);
//         }
//       });
      
//       // Listen for chat messages specific to this thread
//       socket.on('chat', (data) => {
//         // Only process messages for the current thread
//         if (data.threadId !== threadId) {
//           console.log(`Ignoring message for another thread: ${data.threadId}`);
//           return;
//         }
        
//         console.log(`Received message for thread ${threadId}:`, data);
        
//         // Handle error messages
//         if (data.type === 'error') {
//           setError(data.message);
//           setIsTyping(false);
//           return;
//         }
        
//         // We only want to add AI messages to our thread
//         // User messages are already added when sent
//         if (data.type === 'ai') {
//           console.log('Adding AI response to thread:', data);
          
//           const newMessage: Message = {
//             id: Date.now().toString(),
//             role: 'assistant',
//             content: data.message,
//             timestamp: new Date().toISOString()
//           };
          
//           // Check for duplicate messages (avoid adding the same response twice)
//           setMessages(prev => {
//             // Check if this message is already in the array
//             const isDuplicate = prev.some(msg => 
//               msg.role === 'assistant' && 
//               msg.content === newMessage.content
//             );
            
//             return isDuplicate ? prev : [...prev, newMessage];
//           });
          
//           setIsTyping(false);
//         }
//       });
      
//       // Cleanup
//       return () => {
//         socket.off('connect', handleConnect);
//         socket.off('disconnect', handleDisconnect);
//         socket.off('typing');
//         socket.off('chat');
//       }
//     }
//   }, [socket, threadId]);

//   const handleSendMessage = (content: string) => {
//     if (!content.trim() || !threadId) return;
    
//     // Create and add user message
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content,
//       timestamp: new Date().toISOString()
//     };
    
//     // Update messages array with the new user message
//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);
//     setIsTyping(true);
    
//     // Generate a unique request ID to track this specific conversation turn
//     const requestId = `${threadId}-${Date.now()}`;
    
//     // Create context specifically for this thread
//     const contextMessages = createContextForCurrentThread();
    
//     // Send message to the server via socket to trigger Groq API
//     if (socket && connected) {
//       socket.emit('chat', { 
//         message: content,
//         isAIMode: true,
//         threadId: threadId,
//         requestId: requestId,
//         context: contextMessages
//       });
//     } else {
//       // If socket is not connected, show an error and end typing indicator
//       setError("Not connected to server. Please try again later.");
//       setIsTyping(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-full items-center justify-center bg-gray-900">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-full items-center justify-center bg-gray-900">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold text-gray-200">{error}</h2>
//           <p className="text-gray-400 mt-2">Please select another thread</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-gray-900">
//       {/* Thread header with clear button */}
//       <header className="px-2 py-2 border-b border-gray-700 bg-gray-800 shadow-sm flex justify-between items-center">
//         <h1 className="text-lg font-semibold text-gray-100">{threadName}</h1>
//         <Button 
//           size="sm" 
//           variant="ghost" 
//           onClick={clearChatHistory}
//           title="Clear chat history"
//           className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
//         >
//           <Trash2 className="h-4 w-4" />
//         </Button>
//       </header>
      
//       {/* Messages container */}
//       <div className="flex-1 overflow-y-auto p-2 bg-gray-900">
//         <div className="w-full space-y-3">
//           {messages.length === 0 && (
//             <div className="text-center text-gray-400 py-8">
//               No messages yet. Start a conversation!
//             </div>
//           )}
//           {messages.map(message => (
//             <MessageTile key={message.id} message={message} />
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>
      
//       {/* Chat input */}
//       <div className="p-2 border-t border-gray-700 bg-gray-800">
//         <div className="w-full">
//           <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ThreadPage
import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../contexts/SocketContext'
import { useProjects } from '../components/Sidebar'
import MessageTile from '../components/MessageTile'
import ChatInput from '../components/ChatInput'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const ThreadPage: React.FC = () => {
  const { projectId, threadId } = useParams<{ projectId: string; threadId: string }>()
  const { socket, connected } = useSocket()
  const { projects } = useProjects()
  const [threadName, setThreadName] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const previousThreadIdRef = useRef<string | undefined>(undefined)

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Function to get messages for a specific thread from localStorage
  const getMessagesForThread = (tid: string): Message[] => {
    try {
      const savedMessages = localStorage.getItem(`thread_messages_${tid}`);
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    } catch (err) {
      console.error(`Error loading saved messages for thread ${tid}:`, err);
    }
    return [];
  }

  // Function to save messages for a specific thread to localStorage
  const saveMessagesForThread = (tid: string, msgs: Message[]) => {
    try {
      localStorage.setItem(`thread_messages_${tid}`, JSON.stringify(msgs));
    } catch (err) {
      console.error(`Error saving messages for thread ${tid}:`, err);
    }
  }

  // Create context for the current thread only
  const createContextForCurrentThread = (): { role: string; content: string }[] => {
    if (!threadId) return [];
    
    // Get messages specifically for this thread from localStorage
    const threadMessages = getMessagesForThread(threadId);
    
    // Format them for the AI context (latest 10 messages)
    return threadMessages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  // Function to clear chat history for the current thread
  const clearChatHistory = () => {
    if (threadId) {
      if (window.confirm('Are you sure you want to clear the chat history for this thread?')) {
        localStorage.removeItem(`thread_messages_${threadId}`);
        setMessages([]);
      }
    }
  }

  // Find thread data and load previous messages from localStorage
  useEffect(() => {
    if (projectId && threadId && projects.length > 0) {
      setLoading(true);
      
      // Clear previous thread state when switching to a new thread
      if (previousThreadIdRef.current !== threadId) {
        setMessages([]);
        setError(null);
        setIsTyping(false);
        previousThreadIdRef.current = threadId;
      }
      
      // Find the project and thread
      const project = projects.find(p => p.id === projectId);
      if (project) {
        const thread = project.threads.find(t => t.id === threadId);
        if (thread) {
          setThreadName(thread.name);
          
          // Load messages for this specific thread
          const threadMessages = getMessagesForThread(threadId);
          setMessages(threadMessages);
          
          setError(null);
        } else {
          setError("Thread not found");
        }
      } else {
        setError("Project not found");
      }
      
      setLoading(false);
    }
    
    // Cleanup function - runs when component unmounts or threadId changes
    return () => {
      // Remove all socket listeners for the previous thread
      if (socket) {
        socket.off('chat');
        socket.off('typing');
      }
    };
  }, [projectId, threadId, projects, socket]);

  // Save messages to localStorage and scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
    
    // Save messages to localStorage for persistence (only if we have a valid threadId)
    if (messages.length > 0 && threadId) {
      saveMessagesForThread(threadId, messages);
    }
  }, [messages, threadId]);

  // Handle socket events for real-time updates
  useEffect(() => {
    if (socket && threadId) {
      // Handle connection events
      const handleConnect = () => {
        console.log('Socket connected');
        setError(null);
      };
      
      const handleDisconnect = () => {
        console.log('Socket disconnected');
      };
      
      // Listen for connection events
      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      
      // Listen for AI typing indicator - keyed to current thread
      socket.on('typing', (data) => {
        // Only process typing events for the current thread
        if (data.threadId === threadId) {
          setIsTyping(data.isTyping);
        }
      });
      
      // Listen for chat messages specific to this thread
      socket.on('chat', (data) => {
        // Only process messages for the current thread
        if (data.threadId !== threadId) {
          console.log(`Ignoring message for another thread: ${data.threadId}`);
          return;
        }
        
        console.log(`Received message for thread ${threadId}:`, data);
        
        // Handle error messages
        if (data.type === 'error') {
          setError(data.message);
          setIsTyping(false);
          return;
        }
        
        // We only want to add AI messages to our thread
        // User messages are already added when sent
        if (data.type === 'ai') {
          console.log('Adding AI response to thread:', data);
          
          const newMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: data.message,
            timestamp: new Date().toISOString()
          };
          
          // Check for duplicate messages (avoid adding the same response twice)
          setMessages(prev => {
            // Check if this message is already in the array
            const isDuplicate = prev.some(msg => 
              msg.role === 'assistant' && 
              msg.content === newMessage.content
            );
            
            return isDuplicate ? prev : [...prev, newMessage];
          });
          
          setIsTyping(false);
        }
      });
      
      // Cleanup
      return () => {
        socket.off('connect', handleConnect);
        socket.off('disconnect', handleDisconnect);
        socket.off('typing');
        socket.off('chat');
      }
    }
  }, [socket, threadId]);

  const handleSendMessage = (content: string) => {
    if (!content.trim() || !threadId) return;
    
    // Create and add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    // Update messages array with the new user message
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsTyping(true);
    
    // Generate a unique request ID to track this specific conversation turn
    const requestId = `${threadId}-${Date.now()}`;
    
    // Create context specifically for this thread
    const contextMessages = createContextForCurrentThread();
    
    // In a real app, this would send the message to your backend
    // For now, we'll simulate a response after a delay
    if (socket && connected) {
      socket.emit('chat', { 
        message: content,
        isAIMode: true,
        threadId: threadId,
        requestId: requestId,
        context: contextMessages
      });
    } else {
      // For demo: Simulate a response if not connected
      setTimeout(() => {
        // Check if we need to format the response as code (if the user asks for code)
        const isMostLikelyCodeRequest = content.toLowerCase().includes('code') || 
                                       content.toLowerCase().includes('function') ||
                                       content.toLowerCase().includes('script') ||
                                       content.toLowerCase().includes('program');
        
        let responseContent = '';
        
        if (isMostLikelyCodeRequest) {
          responseContent = `Here's an example code that you requested:\n\n\`\`\`javascript\nfunction exampleFunction() {\n  // This is a code block example\n  const greeting = "Hello, world!";\n  console.log(greeting);\n  \n  // It will be formatted properly with syntax highlighting\n  return greeting;\n}\n\`\`\`\n\nYou can also use inline code like \`const x = 42\` within regular text.`;
        } else {
          responseContent = `I received your message: "${content}"\n\nIs there anything specific you'd like to know more about?`;
        }
        
        const assistantMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: responseContent,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-200">{error}</h2>
          <p className="text-gray-400 mt-2">Please select another thread</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Thread header with clear button */}
      <header className="px-4 py-3 border-b border-gray-700 bg-gray-800 shadow-sm flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-100">{threadName}</h1>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={clearChatHistory}
          title="Clear chat history"
          className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </header>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 ">
        <div className="max-w-1xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No messages yet. Start a conversation!
            </div>
          )}
          {messages.map(message => (
            <MessageTile key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Chat input */}
      <div className="p-1 border-t border-gray-700  ">
        <div className="max-w-1xl mx-auto">
          <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>
      </div>
    </div>
  )
}

export default ThreadPage