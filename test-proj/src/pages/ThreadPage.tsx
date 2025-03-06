import * as React from 'react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../contexts/SocketContext'
import { useProjects } from '../components/Sidebar'
import { useModel } from '../components/ModelSelector'
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
  const { model } = useModel()
  const { projects } = useProjects()
  const [threadName, setThreadName] = useState<string>('Thread')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load messages from localStorage
  const getMessagesForThread = useCallback((tid: string): Message[] => {
    try {
      const savedMessages = localStorage.getItem(`thread_messages_${tid}`);
      if (savedMessages) {
        return JSON.parse(savedMessages);
      }
    } catch (err) {
      console.error(`Error loading saved messages:`, err);
    }
    return [];
  }, []);

  // Save messages to localStorage
  const saveMessagesForThread = useCallback((tid: string, msgs: Message[]) => {
    try {
      localStorage.setItem(`thread_messages_${tid}`, JSON.stringify(msgs));
    } catch (err) {
      console.error(`Error saving messages:`, err);
    }
  }, []);

  // Create context for the AI model
  const createContextForCurrentThread = useCallback((): { role: string; content: string }[] => {
    if (!threadId) return [];
    
    // Get messages specifically for this thread from localStorage
    const threadMessages = getMessagesForThread(threadId);
    
    // Format them for the AI context (latest 10 messages)
    return threadMessages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }, [threadId, getMessagesForThread]);

  // Find thread and load saved messages
  useEffect(() => {
    if (!projectId || !threadId || !projects || projects.length === 0) {
      setLoading(false);
      if (!projectId || !threadId) {
        setError("Thread not found");
      }
      return;
    }

    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) {
        setError("Project not found");
        setLoading(false);
        return;
      }

      const thread = project.threads.find(t => t.id === threadId);
      if (!thread) {
        setError("Thread not found");
        setLoading(false);
        return;
      }

      setThreadName(thread.name || 'Thread');
      setMessages(getMessagesForThread(threadId));
      setError(null);
      setLoading(false);
    } catch (err) {
      console.error("Error in thread initialization:", err);
      setError("Error loading thread");
      setLoading(false);
    }
  }, [projectId, threadId, projects, getMessagesForThread]);

  // Save messages when they change
  useEffect(() => {
    if (threadId && messages.length > 0) {
      saveMessagesForThread(threadId, messages);
    }
    
    // Scroll to bottom
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, threadId, saveMessagesForThread]);

  // Socket event listeners for real-time updates
  useEffect(() => {
    if (!socket) {
      console.log("Socket not available");
      return;
    }

    // Listen for AI typing indicator
    const handleTyping = (data: any) => {
      if (data.threadId === threadId) {
        setIsTyping(data.isTyping);
      }
    };
    
    // Listen for chat messages
    const handleChat = (data: any) => {
      if (data.threadId !== threadId) {
        return; // Ignore messages for other threads
      }
      
      console.log("Received message from socket:", data);
      
      // Handle error messages
      if (data.type === 'error') {
        console.error("Error from API:", data.message);
        setError(data.message);
        setIsTyping(false);
        return;
      }
      
      // Handle AI responses
      if (data.type === 'ai') {
        const newMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => {
          // Check if message is already in the array (avoid duplicates)
          const isDuplicate = prev.some(msg => 
            msg.role === 'assistant' && 
            msg.content === newMessage.content
          );
          
          return isDuplicate ? prev : [...prev, newMessage];
        });
        
        setIsTyping(false);
      }
    };

    // Register event listeners
    socket.on('typing', handleTyping);
    socket.on('chat', handleChat);
    
    // Clean up event listeners
    return () => {
      socket.off('typing', handleTyping);
      socket.off('chat', handleChat);
    };
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
    
    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Generate a unique request ID
    const requestId = `${threadId}-${Date.now()}`;
    
    // Create context for the AI
    const contextMessages = createContextForCurrentThread();
    
    console.log("Sending message to API:", content);
    console.log("Using model:", model);
    
    if (socket && connected) {
      // Send to socket server
      socket.emit('chat', { 
        message: content,
        isAIMode: true,
        threadId: threadId,
        requestId: requestId,
        context: contextMessages,
        model: model // Add the selected model
      });
    } else {
      console.log("Socket not connected, using fallback mode");
      // Fallback if socket is not available
      setTimeout(() => {
        const fallbackResponse: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `I'm currently in offline mode. Please check your connection to the API server.\n\nYour message was: "${content}"`,
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, fallbackResponse]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const clearChatHistory = () => {
    if (threadId && window.confirm('Are you sure you want to clear the chat history?')) {
      try {
        localStorage.removeItem(`thread_messages_${threadId}`);
        setMessages([]);
      } catch (err) {
        console.error("Error clearing chat history:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <p className="text-gray-400 mt-4">Loading thread...</p>
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
      {/* Thread header */}
      <header className="px-4 py-3 border-b border-gray-700 bg-gray-800 shadow-sm flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-100">{threadName}</h1>
        <div className="flex items-center">
          {!connected && (
            <span className="text-xs text-red-400 mr-3">API Server Offline</span>
          )}
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={clearChatHistory}
            className="text-gray-400 hover:text-gray-200 hover:bg-gray-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      {/* Messages container with mask for fade effect */}
      <div className="flex-1 overflow-y-auto w-[70%] mx-auto">
        {/* Mask container with fading effects */}
        <div className="relative">
          {/* Top fade mask */}
          <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
               style={{ 
                 background: 'linear-gradient(to bottom, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.9) 30%, rgba(17, 24, 39, 0.1) 90%, transparent 100%)',
                 zIndex: 10 
               }}>
          </div>
          
          {/* Bottom fade mask */}
          <div className="absolute bottom-0 left-0 right-0 h-0 pointer-events-none"
               style={{ 
                 background: 'linear-gradient(to top, rgba(17, 24, 39, 1) 0%, rgba(17, 24, 39, 0.9) 30%, rgba(17, 24, 39, 0.1) 90%, transparent 100%)',
                 zIndex: 10 
               }}>
          </div>
          
          {/* Messages with padding for fade zones */}
          <div className="p-4 pt-24 pb-10">
            <div className="max-w-1xl mx-auto space-y-20">
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
        </div>
      </div>
      
      {/* Chat input - Removed the border/container outside */}
      <div className="max-w-4xl mx-auto w-full pb-4">
        <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
      </div>
    </div>
  )
}

export default ThreadPage