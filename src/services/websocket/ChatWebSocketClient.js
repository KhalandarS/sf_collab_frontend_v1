import io from 'socket.io-client';

class ChatWebSocketClient {
  constructor(serverUrl, userId) {
    this.serverUrl = serverUrl;
    this.userId = userId;
    this.socket = null;
    this.eventHandlers = {};
    this.typingTimeouts = {};
  }

  // Initialize and connect to WebSocket server
  connect() {
    this.socket = io(this.serverUrl, {
      query: { user_id: this.userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupDefaultHandlers();
    return this.socket;
  }

  // Setup default event handlers - FIXED: Added missing event handlers
  setupDefaultHandlers() {
    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.trigger('connected');
      
      // Join all user's conversation rooms
      this.joinUserConversations();
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
      this.trigger('disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      this.trigger('connection_error', error);
    });

    // User status events
    this.socket.on('user_online', (data) => {
      console.log(`User ${data.user_id} is now online`);
      this.trigger('user_online', data);
    });

    this.socket.on('user_offline', (data) => {
      console.log(`User ${data.user_id} is now offline`);
      this.trigger('user_offline', data);
    });

    this.socket.on('user_status_changed', (data) => {
      console.log(`User ${data.user_id} status changed to ${data.status}`);
      this.trigger('user_status_changed', data);
    });

    // Message events
    this.socket.on('new_message', (data) => {
      console.log('New message received:', data);
      this.trigger('new_message', data);
    });

    this.socket.on('message_edited', (data) => {
      console.log('Message edited:', data);
      this.trigger('message_edited', data);
    });

    this.socket.on('message_deleted', (data) => {
      console.log('Message deleted:', data);
      this.trigger('message_deleted', data);
    });

    this.socket.on('mark_message_read', (data) => {
      console.log('Message read:', data);
      this.trigger('message_read', data);
    });

    // Typing events
    this.socket.on('user_typing', (data) => {
      console.log('User typing:', data);
      this.trigger('user_typing', data);
    });

    // Conversation events
    this.socket.on('conversation_created', (data) => {
      console.log('New conversation created:', data);
      this.trigger('conversation_created', data);
    });

    this.socket.on('conversation_updated', (data) => {
      console.log('Conversation updated:', data);
      this.trigger('conversation_updated', data);
    });

    // Participant events - ADDED: Missing event handlers
    this.socket.on('participant_added', (data) => {
      console.log('Participant added:', data);
      this.trigger('participant_added', data);
    });

    this.socket.on('participant_removed', (data) => {
      console.log('Participant removed:', data);
      this.trigger('participant_removed', data);
    });

    this.socket.on('added_to_conversation', (data) => {
      console.log('Added to conversation:', data);
      this.trigger('added_to_conversation', data);
    });

    this.socket.on('removed_from_conversation', (data) => {
      console.log('Removed from conversation:', data);
      this.trigger('removed_from_conversation', data);
    });
  }

  // Join all user's conversation rooms
  joinUserConversations() {
    this.socket.emit('join_user_conversations', {
      user_id: this.userId
    });
  }

  // Join a specific conversation room
  joinConversation(conversationId) {
    this.socket.emit('join_conversation', {
      conversation_id: conversationId,
      user_id: this.userId
    });
  }

  // Leave a conversation room
  leaveConversation(conversationId) {
    this.socket.emit('leave_conversation', {
      conversation_id: conversationId,
      user_id: this.userId
    });
  }

  // Start typing indicator
  startTyping(conversationId) {
    this.socket.emit('start_typing', {
      conversation_id: conversationId,
      user_id: this.userId
    });
  }

  // Stop typing indicator
  stopTyping(conversationId) {
    this.socket.emit('stop_typing', {
      conversation_id: conversationId,
      user_id: this.userId
    });
  }

  // Auto-stop typing after delay
  handleTyping(conversationId, delay = 3000) {
    this.startTyping(conversationId);

    // Clear existing timeout
    if (this.typingTimeouts[conversationId]) {
      clearTimeout(this.typingTimeouts[conversationId]);
    }

    // Set new timeout to stop typing
    this.typingTimeouts[conversationId] = setTimeout(() => {
      this.stopTyping(conversationId);
      delete this.typingTimeouts[conversationId];
    }, delay);
  }

  // Mark message as read
  markMessageRead(conversationId, messageId) {
    this.socket.emit('mark_message_read', {
      conversation_id: conversationId,
      user_id: this.userId,
      message_id: messageId
    });
  }

  // Event handler registration
  on(event, handler) {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }
    this.eventHandlers[event].push(handler);
  }

  // Remove event handler
  off(event, handler) {
    if (!this.eventHandlers[event]) return;
    
    this.eventHandlers[event] = this.eventHandlers[event].filter(
      h => h !== handler
    );
  }

  // Trigger event handlers
  trigger(event, data) {
    if (!this.eventHandlers[event]) return;
    
    this.eventHandlers[event].forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error(`Error in ${event} handler:`, error);
      }
    });
  }

  // Disconnect from server
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Clear all typing timeouts
    Object.values(this.typingTimeouts).forEach(timeout => {
      clearTimeout(timeout);
    });
    this.typingTimeouts = {};
  }

  // Check if connected
  isConnected() {
    return this.socket && this.socket.connected;
  }
}

export default ChatWebSocketClient;