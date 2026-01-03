import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Label } from '../../ui/label';
import { Loader2, Send, Bot, User, Trash2, Copy, Download, Settings, Zap, Brain, MessageSquare, Sparkles } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { useSelector } from 'react-redux';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';
import { Switch } from '../../ui/switch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const QwenChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m Qwen 2.5, an AI assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('You are Qwen 2.5, a helpful AI assistant. Provide accurate and helpful responses.');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [showSettings, setShowSettings] = useState(false);
  const [modelStatus, setModelStatus] = useState('loading');
  
  const messagesEndRef = useRef(null);
  const { user, access_token } = useSelector((state) => state.auth);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check model status
  useEffect(() => {
    checkModelStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkModelStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/qwen/health`);
      const data = await response.json();
      setModelStatus(data.model_loaded ? 'ready' : 'loading');
    } catch (err) {
      setModelStatus('error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    const token = access_token;
    if (!token) {
      setError('Please log in to use the chat');
      return;
    }

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      // Format messages for API
      const apiMessages = [];
      
      // Add system prompt if exists
      if (systemPrompt.trim()) {
        apiMessages.push({
          role: 'system',
          content: systemPrompt
        });
      }
      
      // Add conversation history (last 10 messages)
      const historyMessages = messages.slice(-10);
      historyMessages.forEach(msg => {
        if (msg.role !== 'system') { // Don't duplicate system message
          apiMessages.push({
            role: msg.role,
            content: msg.content
          });
        }
      });
      
      // Add current user message
      apiMessages.push({
        role: 'user',
        content: input
      });

      const response = await fetch(`${API_URL}/qwen/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input, 
          max_tokens: maxTokens,
          temperature: temperature,
          content_type: 'chat'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      // Add assistant response
      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        model: data.data.response
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (err) {
      setError(err.message);
      console.error('Chat error:', err);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handlegenerateSubmit = async (prompt) => {
    if (!prompt.trim()) return;
    
    const token = access_token;
    if (!token) {
      setError('Please log in to use the chat');
      return;
    }

    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/qwen/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: maxTokens
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error');
      }

      // Add conversation
      const userMessage = {
        id: messages.length + 1,
        role: 'user',
        content: prompt,
        timestamp: new Date()
      };
      
      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.data.response,
        timestamp: new Date(),
        model: data.data.model
      };
      
      setMessages(prev => [...prev, userMessage, assistantMessage]);
      
    } catch (err) {
      setError(err.message);
      console.error('generate chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m Qwen 2.5, an AI assistant. How can I help you today?',
        timestamp: new Date()
      }
    ]);
    setError('');
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const downloadChat = () => {
    const chatContent = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'Qwen'}: ${msg.content}\n${'-'.repeat(50)}`
    ).join('\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qwen-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePrompts = [
    'Explain quantum computing in simple terms',
    'Write a Python function to reverse a string',
    'What are the benefits of renewable energy?',
    'Create a short story about a time traveler',
    'How do I improve my coding skills?',
    'Write a recipe for chocolate chip cookies',
    'Explain the theory of relativity',
    'Help me plan a 3-day trip to Tokyo'
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Qwen 2.5 Chat
                </h1>
                <p className="text-gray-400 mt-1">
                  Chat with the 1.5B parameter Qwen 2.5 Instruct model
                </p>
              </div>
            </div>
            
            {/* Model Status */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 shadow-sm mb-4">
              <div className={`w-2 h-2 rounded-full ${
                modelStatus === 'ready' ? 'bg-green-500' :
                modelStatus === 'loading' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-gray-200">
                {modelStatus === 'ready' ? 'Model Ready' :
                 modelStatus === 'loading' ? 'Loading Model...' :
                 'Model Error'}
              </span>
              <span className="text-xs text-gray-500">• Qwen 2.5-1.5B-Instruct</span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-4">
            {/* Left Panel - Settings */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-lg h-fit sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-gray-100">
                    <Settings className="h-5 w-5" />
                    Settings
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your chat experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* System Prompt */}
                  <div className="space-y-3">
                    <Label htmlFor="system-prompt" className="text-sm font-semibold text-gray-200">
                      System Prompt
                    </Label>
                    <Textarea
                      id="system-prompt"
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="Define the AI's behavior..."
                      rows={3}
                      className="text-sm resize-none border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-500"
                    />
                    <p className="text-xs text-gray-500">
                      This guides the AI's behavior and response style.
                    </p>
                  </div>

                  {/* Temperature */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-semibold text-gray-200">
                        Temperature: {temperature.toFixed(1)}
                      </Label>
                      <span className="text-xs text-gray-500">
                        {temperature < 0.3 ? 'Deterministic' :
                         temperature < 0.7 ? 'Balanced' :
                         'Creative'}
                      </span>
                    </div>
                    <Slider
                      value={[temperature]}
                      onValueChange={([value]) => setTemperature(value)}
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500">
                      Controls randomness: Lower = more focused, Higher = more creative
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 border-t border-gray-700">
                    <Button
                      onClick={clearChat}
                      variant="outline"
                      className="w-full border-gray-600 hover:bg-gray-700 text-gray-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Chat
                    </Button>
                    
                    <Button
                      onClick={downloadChat}
                      variant="outline"
                      className="w-full border-gray-600 hover:bg-gray-700 text-gray-200"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Chat
                    </Button>
                  </div>

                  {/* Model Info */}
                  <div className="pt-4 border-t border-gray-700">
                    <h4 className="text-sm font-semibold mb-2 text-gray-200">Model Info</h4>
                    <div className="space-y-2 text-xs text-gray-400">
                      <div className="flex justify-between">
                        <span>Model:</span>
                        <span className="font-medium text-gray-300">Qwen 2.5-1.5B</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Parameters:</span>
                        <span className="font-medium text-gray-300">1.5 Billion</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Context:</span>
                        <span className="font-medium text-gray-300">8K tokens</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-medium ${
                          modelStatus === 'ready' ? 'text-green-400' :
                          modelStatus === 'loading' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {modelStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Prompts */}
              <Card className="mt-6 bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-gray-100">
                    <Zap className="h-5 w-5" />
                    generate Prompts
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Try these examples
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {generatePrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handlegenerateSubmit(prompt)}
                      disabled={loading}
                      className="w-full text-left p-3 rounded-lg border border-gray-700 hover:border-blue-500 hover:bg-gray-700 transition-colors text-sm text-gray-300"
                    >
                      {prompt}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <Card className="bg-gray-800/90 backdrop-blur-sm border-gray-700 shadow-lg h-[600px] flex flex-col">
                <CardHeader className="pb-4 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-gray-100">
                        <MessageSquare className="h-6 w-6" />
                        Chat with Qwen
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {messages.length - 1} messages exchanged
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setShowSettings(!showSettings)}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 hover:bg-gray-700 text-gray-200"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      {showSettings ? 'Hide' : 'Show'} Settings
                    </Button>
                  </div>
                </CardHeader>
                
                {/* Messages Container */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-600 text-blue-200' 
                          : 'bg-purple-600 text-purple-200'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                        <div className={`rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : message.isError
                            ? 'bg-red-900/30 border border-red-700 text-red-200'
                            : 'bg-gray-700 text-gray-100 rounded-bl-none'
                        }`}>
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                        
                        {/* Message Meta */}
                        <div className={`flex items-center gap-2 mt-1 text-xs ${
                          message.role === 'user' ? 'justify-end' : ''
                        }`}>
                          <span className="text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.role === 'assistant' && !message.isError && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="text-purple-400 font-medium">{message.model || 'Qwen 2.5'}</span>
                            </>
                          )}
                          
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => copyMessage(message.content)}
                                className="text-gray-500 hover:text-gray-300 transition-colors"
                              >
                                <Copy className="h-3 w-3" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Copy message</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Loading indicator */}
                  {loading && (
                    <div className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-purple-600 text-purple-200 flex items-center justify-center">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="bg-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>
                
                {/* Input Area */}
                <div className="p-4 border-t border-gray-700">
                  <form onSubmit={handleSubmit} className="space-y-3">
                    {error && (
                      <Alert variant="destructive" className="bg-red-900/20 border-red-700">
                        <AlertDescription className="text-red-200 text-sm">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here... (Press Shift+Enter for new line)"
                        rows={2}
                        className="resize-none border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-500 focus:border-blue-500"
                            onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        disabled={loading}
                      />
                      <Button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <div>
                        <span className="font-medium">Tips:</span>
                        <span className="ml-2">Shift+Enter for new line</span>
                      </div>
                      <div>
                        <span className="font-medium">Model:</span>
                        <span className="ml-2">Qwen 2.5-1.5B-Instruct</span>
                      </div>
                    </div>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default QwenChat;