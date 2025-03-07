import socketio
import asyncio

sio_server = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins=["http://localhost:3000", "http://localhost:5173"],  # React development server
    logger=True,
    engineio_logger=True,
    ping_timeout=120000,  # Increased timeout for longer API responses
    ping_interval=25000,
    transports=['websocket']  # Force WebSocket only, no polling
)

sio_app = socketio.ASGIApp(
    socketio_server=sio_server,
    socketio_path='sockets',
    static_files={
        '/': {'content_type': 'text/html', 'filename': 'index.html'}
    }
)

# Track active requests to prevent duplicates
active_requests = set()

# Keep track of active thread conversations by thread ID
thread_conversations = {}

@sio_server.event
async def connect(sid, environ, auth):
    print(f"{sid} : Connected")
    await sio_server.emit('join', {'sid': sid})

@sio_server.event
async def chat(sid, message):
    # Log message received
    print(f"Message received from {sid}: {message}")  # Debug log
    
    # Check if the message is a dictionary with isAIMode flag
    if isinstance(message, dict) and message.get('isAIMode'):
        user_message = message.get('message', '')
        thread_id = message.get('threadId', 'unknown')
        request_id = message.get('requestId', f"{thread_id}-{sid}-{user_message[:10]}")
        
        # Check if this is a duplicate request
        if request_id in active_requests:
            print(f"Ignoring duplicate request: {request_id}")
            return
            
        # Add to active requests
        active_requests.add(request_id)
        
        # First emit the user's message to other clients
        await sio_server.emit('chat', {
            'sid': sid, 
            'message': user_message, 
            'type': 'user',
            'threadId': thread_id,
            'requestId': request_id
        })
        
        try:
            # Import Groq client inside try block to handle import errors
            from groq import Groq
            
            # Initialize Groq client
            groq_client = Groq(
                api_key="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",
            )
            
            # Parse the message context if available
            context = message.get('context', [])
            
            # Prepare messages for Groq API with conversation history
            api_messages = []
            
            # Add context messages first (if any)
            for ctx_msg in context:
                api_messages.append({
                    "role": ctx_msg.get('role', 'user'),
                    "content": ctx_msg.get('content', '')
                })
            
            # Add the current user message
            api_messages.append({
                "role": "user",
                "content": user_message
            })
            
            # Store the conversation for this specific thread
            thread_conversations[thread_id] = api_messages
            
            # Get response from Groq API
            print(f"Sending request to Groq API with {len(api_messages)} messages for thread {thread_id}")
            chat_completion = groq_client.chat.completions.create(
                messages=api_messages,
                model="llama-3.3-70b-versatile",
                stream=False,
            )
            
            # Extract the AI response
            ai_response = chat_completion.choices[0].message.content
            
            # Add the AI response to the conversation context
            thread_conversations[thread_id].append({
                "role": "assistant",
                "content": ai_response
            })
            
            # Emit AI response back to all clients with the specific thread ID
            await sio_server.emit('chat', {
                'sid': 'AI', 
                'message': ai_response, 
                'type': 'ai',
                'threadId': thread_id,
                'requestId': request_id
            })
            print(f"AI response sent: {ai_response[:100]}... to thread {thread_id}")  # Debug log (first 100 chars)
            
        except Exception as e:
            print(f"Error in chat handler for thread {thread_id}: {str(e)}")  # Debug log
            await sio_server.emit('chat', {
                'sid': 'System', 
                'message': f'Sorry, I encountered an error: {str(e)}',
                'type': 'error',
                'threadId': thread_id,
                'requestId': request_id
            })
        finally:
            # Remove from active requests
            active_requests.discard(request_id)
    else:
        # Regular chat message (not AI mode)
        if isinstance(message, dict):
            msg_content = message.get('message', str(message))
            thread_id = message.get('threadId', 'unknown')
        else:
            msg_content = str(message)
            thread_id = 'unknown'
            
        # Emit the message to all clients
        await sio_server.emit('chat', {
            'sid': sid, 
            'message': msg_content, 
            'type': 'user',
            'threadId': thread_id
        })

@sio_server.event
async def clear_thread(sid, data):
    """
    Handler to clear a thread's conversation context on the server
    """
    thread_id = data.get('threadId')
    if thread_id and thread_id in thread_conversations:
        del thread_conversations[thread_id]
        await sio_server.emit('thread_cleared', {
            'threadId': thread_id,
            'success': True
        }, room=sid)
        print(f"Cleared conversation context for thread {thread_id}")

@sio_server.event
async def disconnect(sid):
    print(f"{sid} : Disconnected")