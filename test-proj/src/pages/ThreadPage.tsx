// import * as React from 'react'
// import { useState, useEffect, useRef } from 'react'
// import { useParams } from 'react-router-dom'
// import { useSocket } from '../contexts/SocketContext'
// import { useProjects } from '../components/Sidebar'
// import MessageTile from '../components/MessageTile'
// import ChatInput from '../components/ChatInput'

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

// // Mock messages for threads that don't have them yet
// // declaring the default messages as a constant and disabling them for now to avoid duplication in all the thread pages
// // const DEFAULT_MESSAGES: Message[] = [
// //   { 
// //     id: 'welcome', 
// //     role: 'assistant', 
// //     content: 'Hello! How can I assist you today?', 
// //     timestamp: new Date().toISOString() 
// //   }
// // ];

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

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   // Find thread data
//   useEffect(() => {
//     if (projectId && threadId && projects.length > 0) {
//       setLoading(true);
      
//       // Find the project and thread
//       const project = projects.find(p => p.id === projectId);
//       if (project) {
//         const thread = project.threads.find(t => t.id === threadId);
//         if (thread) {
//           setThreadName(thread.name);
          
//           // In a real app, we would fetch messages from an API
//           // For now, use default messages
//           //setMessages(DEFAULT_MESSAGES);// disabling the default messages for now to avoid duplication in all the thread pages
//           setError(null);
//         } else {
//           setError("Thread not found");
//         }
//       } else {
//         setError("Project not found");
//       }
      
//       setLoading(false);
//     }
//   }, [projectId, threadId, projects]);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom()
//   }, [messages]);

//   // Handle socket events for real-time updates
//   useEffect(() => {
//     if (socket) {
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
      
//       // Listen for AI typing indicator
//       socket.on('typing', (data) => {
//         if (data.threadId === threadId) {
//           setIsTyping(data.isTyping);
//         }
//       });
      
//       // Listen for chat messages from the server
//       socket.on('chat', (data) => {
//         console.log('Received message:', data);
        
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
          
//           setMessages(prev => [...prev, newMessage]);
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
//     if (!content.trim()) return;
    
//     // Create and add user message
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content,
//       timestamp: new Date().toISOString()
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setIsTyping(true);
    
//     // Send message to the server via socket to trigger Groq API
//     if (socket && connected) {
//       socket.emit('chat', { 
//         message: content,
//         isAIMode: true,
//         threadId: threadId
//       });
//     } else {
//       // If socket is not connected, show an error and end typing indicator
//       setError("Not connected to server. Please try again later.");
//       setIsTyping(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
//           <p className="text-gray-500 mt-2">Please select another thread</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {/* Thread header */}
//       <header className="px-4 py-3 border-b bg-white shadow-sm">
//         <h1 className="text-lg font-semibold text-gray-800">{threadName}</h1>
//       </header>
      
//       {/* Messages container */}
//       <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//         <div className="max-w-3xl mx-auto space-y-4">
//           {messages.map(message => (
//             <MessageTile key={message.id} message={message} />
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>
      
//       {/* Chat input */}
//       <div className="p-3 border-t bg-white">
//         <div className="max-w-3xl mx-auto">
//           <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ThreadPage

// import * as React from 'react'
// import { useState, useEffect, useRef } from 'react'
// import { useParams } from 'react-router-dom'
// import { useSocket } from '../contexts/SocketContext'
// import { useProjects } from '../components/Sidebar'
// import MessageTile from '../components/MessageTile'
// import ChatInput from '../components/ChatInput'

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

//   // Scroll to bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   // Find thread data and load previous messages from localStorage
//   useEffect(() => {
//     if (projectId && threadId && projects.length > 0) {
//       setLoading(true);
      
//       // Find the project and thread
//       const project = projects.find(p => p.id === projectId);
//       if (project) {
//         const thread = project.threads.find(t => t.id === threadId);
//         if (thread) {
//           setThreadName(thread.name);
          
//           // Load messages from localStorage
//           try {
//             const savedMessages = localStorage.getItem(`thread_messages_${threadId}`);
//             if (savedMessages) {
//               setMessages(JSON.parse(savedMessages));
//             }
//           } catch (err) {
//             console.error('Error loading saved messages:', err);
//           }
          
//           setError(null);
//         } else {
//           setError("Thread not found");
//         }
//       } else {
//         setError("Project not found");
//       }
      
//       setLoading(false);
//     }
//   }, [projectId, threadId, projects]);

//   // Save messages to localStorage and scroll to bottom when messages change
//   useEffect(() => {
//     scrollToBottom();
    
//     // Save messages to localStorage for persistence
//     if (messages.length > 0 && threadId) {
//       try {
//         localStorage.setItem(`thread_messages_${threadId}`, JSON.stringify(messages));
//       } catch (err) {
//         console.error('Error saving messages:', err);
//       }
//     }
//   }, [messages, threadId]);

//   // Handle socket events for real-time updates
//   useEffect(() => {
//     if (socket) {
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
      
//       // Listen for AI typing indicator
//       socket.on('typing', (data) => {
//         if (data.threadId === threadId) {
//           setIsTyping(data.isTyping);
//         }
//       });
      
//       // Listen for chat messages from the server
//       socket.on('chat', (data) => {
//         console.log('Received message:', data);
        
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
          
//           setMessages(prev => [...prev, newMessage]);
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
//     if (!content.trim()) return;
    
//     // Create and add user message
//     const userMessage: Message = {
//       id: Date.now().toString(),
//       role: 'user',
//       content,
//       timestamp: new Date().toISOString()
//     };
    
//     const newMessages = [...messages, userMessage];
//     setMessages(newMessages);
//     setIsTyping(true);
    
//     // Prepare conversation context for the AI (past messages)
//     // Only include messages that would be relevant for context, up to a reasonable limit
//     // Format the context as simplified messages for the backend
//     const contextMessages = newMessages.slice(-10).map(msg => ({
//       role: msg.role,
//       content: msg.content
//     }));
    
//     // Send message to the server via socket to trigger Groq API
//     if (socket && connected) {
//       socket.emit('chat', { 
//         message: content,
//         isAIMode: true,
//         threadId: threadId,
//         context: contextMessages // Send conversation history for context
//       });
//     } else {
//       // If socket is not connected, show an error and end typing indicator
//       setError("Not connected to server. Please try again later.");
//       setIsTyping(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex h-full items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
//           <p className="text-gray-500 mt-2">Please select another thread</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full">
//       {/* Thread header */}
//       <header className="px-2 py-2 border-b bg-white shadow-sm">
//         <h1 className="text-lg font-semibold text-gray-800">{threadName}</h1>
//       </header>
      
//       {/* Messages container */}
//       <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
//         <div className="w-full space-y-3">
//           {messages.map(message => (
//             <MessageTile key={message.id} message={message} />
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>
      
//       {/* Chat input */}
//       <div className="p-2 border-t bg-white">
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

interface ThreadData {
  id: string;
  projectId: string;
  name: string;
  messages: Message[];
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
    
    // Send message to the server via socket to trigger Groq API
    if (socket && connected) {
      socket.emit('chat', { 
        message: content,
        isAIMode: true,
        threadId: threadId,
        requestId: requestId,
        context: contextMessages
      });
    } else {
      // If socket is not connected, show an error and end typing indicator
      setError("Not connected to server. Please try again later.");
      setIsTyping(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700">{error}</h2>
          <p className="text-gray-500 mt-2">Please select another thread</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Thread header with clear button */}
      <header className="px-2 py-2 border-b bg-white shadow-sm flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">{threadName}</h1>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={clearChatHistory}
          title="Clear chat history"
        >
          <Trash2 className="h-4 w-4 text-gray-500" />
        </Button>
      </header>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
        <div className="w-full space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 py-8">
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
      <div className="p-2 border-t bg-white">
        <div className="w-full">
          <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>
      </div>
    </div>
  )
}

export default ThreadPage