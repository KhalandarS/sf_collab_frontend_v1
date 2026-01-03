// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from '../../ui/button';
// import { Textarea } from '../../ui/textarea';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
// import { Alert, AlertDescription } from '../../ui/alert';
// import { Label } from '../../ui/label';
// import { Loader2, Send, Bot, User, Trash2, Copy, Download, Settings, Zap, Brain, MessageSquare, Sparkles, FileText, Briefcase, Presentation, Check } from 'lucide-react';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
// import { Slider } from '../../ui/slider';
// import { Switch } from '../../ui/switch';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
// import { Progress } from '../../ui/progress';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const QwenChat = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       role: 'assistant',
//       content: 'Hello! I\'m your AI Business Assistant. I can help you with general queries, create business plans, or generate pitch decks. How can I assist you today?',
//       timestamp: new Date()
//     }
//   ]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [contentType, setContentType] = useState('chat');
//   const [selectedModel, setSelectedModel] = useState('');
//   const [availableModels, setAvailableModels] = useState([]);
//   const [temperature, setTemperature] = useState(0.7);
//   const [maxTokens, setMaxTokens] = useState(2048);
//   const [showSettings, setShowSettings] = useState(false);
//   const [serviceStatus, setServiceStatus] = useState('loading');
//   const [progress, setProgress] = useState(0);
//   const [downloadLinks, setDownloadLinks] = useState({});
  
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom of messages
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Check service status and load models
//   useEffect(() => {
//     checkServiceStatus();
//     loadModels();
//   }, []);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const checkServiceStatus = async () => {
//     try {
//       const response = await fetch(`${API_URL}/qwen/health`);
//       if (response.ok) {
//         const data = await response.json();
//         if (data.success) {
//           setServiceStatus(data.data.status === 'ready' ? 'ready' : 'error');
//         }
//       } else {
//         setServiceStatus('error');
//       }
//     } catch (err) {
//       setServiceStatus('error');
//     }
//   };

//   const loadModels = async () => {
//     try {
//       const response = await fetch(`${API_URL}/qwen/models`);
//       const data = await response.json();
//       if (data.success) {
//         setAvailableModels(data.data.models);
//         if (data.data.models.length > 0) {
//           setSelectedModel(data.data.models[0]);
//         }
//       }
//     } catch (err) {
//       console.error('Failed to load models:', err);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!input.trim() || loading) return;

//     // Add user message
//     const userMessage = {
//       id: messages.length + 1,
//       role: 'user',
//       content: input,
//       timestamp: new Date(),
//       contentType: contentType
//     };
    
//     setMessages(prev => [...prev, userMessage]);
//     setInput('');
//     setLoading(true);
//     setError('');
//     setProgress(0);
//     setDownloadLinks({});

//     try {
//       // Simulate progress
//       const progressInterval = setInterval(() => {
//         setProgress(prev => {
//           if (prev >= 90) {
//             clearInterval(progressInterval);
//             return 90;
//           }
//           return prev + 10;
//         });
//       }, 200);

//       const response = await fetch(`${API_URL}/qwen/generate`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           prompt: input,
//           model: selectedModel,
//           content_type: contentType,
//           temperature: temperature,
//           max_tokens: maxTokens
//         }),
//       });

//       clearInterval(progressInterval);
//       setProgress(100);

//       const data = await response.json();

//       if (!response.ok || !data.success) {
//         throw new Error(data.error || 'Request failed');
//       }

//       // Add assistant response
//       const assistantMessage = {
//         id: messages.length + 2,
//         role: 'assistant',
//         content: data.data.response,
//         timestamp: new Date(),
//         model: data.data.model,
//         contentType: contentType,
//         downloadLinks: data.data.download_links,
//         tokensUsed: data.data.tokens_used
//       };
      
//       setMessages(prev => [...prev, assistantMessage]);
//       setDownloadLinks(data.data.download_links || {});
      
//       // Reset progress after delay
//       setTimeout(() => setProgress(0), 1000);
      
//     } catch (err) {
//       setError(err.message);
//       console.error('Generation error:', err);
      
//       // Add error message
//       const errorMessage = {
//         id: messages.length + 2,
//         role: 'assistant',
//         content: `Sorry, I encountered an error: ${err.message}`,
//         timestamp: new Date(),
//         isError: true
//       };
      
//       setMessages(prev => [...prev, errorMessage]);
//       setProgress(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const clearChat = () => {
//     setMessages([
//       {
//         id: 1,
//         role: 'assistant',
//         content: 'Hello! I\'m your AI Business Assistant. I can help you with general queries, create business plans, or generate pitch decks. How can I assist you today?',
//         timestamp: new Date()
//       }
//     ]);
//     setError('');
//     setDownloadLinks({});
//   };

//   const copyMessage = (content) => {
//     navigator.clipboard.writeText(content);
//   };

//   const downloadContent = async (format) => {
//     try {
//       const response = await fetch(`${API_URL}${downloadLinks[format]}`);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `qwen-${contentType}-${new Date().toISOString().split('T')[0]}.${format}`;
//       document.body.appendChild(a);
//       a.click();
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     } catch (error) {
//       console.error('Download error:', error);
//       setError('Failed to download file');
//     }
//   };

//   const quickPrompts = {
//     chat: [
//       'Explain blockchain technology in simple terms',
//       'What are the latest trends in AI?',
//       'How can I improve my productivity?',
//       'Write a professional email template'
//     ],
//     business_plan: [
//       'Create a business plan for an eco-friendly clothing brand',
//       'Generate a business plan for a tech startup',
//       'Business plan for a local coffee shop',
//       'SaaS business plan template'
//     ],
//     pitch_deck: [
//       'Create a pitch deck for a fintech startup',
//       'Generate investor pitch for a healthtech company',
//       'Pitch deck for an e-commerce platform',
//       'Startup pitch presentation template'
//     ]
//   };

//   const contentTypeLabels = {
//     chat: { label: 'General Chat', icon: MessageSquare, color: 'from-blue-400 to-blue-600' },
//     business_plan: { label: 'Business Plan', icon: Briefcase, color: 'from-green-400 to-green-600' },
//     pitch_deck: { label: 'Pitch Deck', icon: Presentation, color: 'from-purple-400 to-purple-600' }
//   };

//   return (
//     <TooltipProvider>
//       <div className="min-h-screen py-8 px-4">
//         {/* Animated Background */}
//         <div className="absolute inset-0">
//           <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[64px_64px] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
//         </div>
        
//         <div className="max-w-6xl mx-auto relative">
//           {/* Header */}
//           <div className="text-center mb-8">
//             <div className="flex items-center justify-center gap-3 mb-4">
//               <div className={`p-3 bg-linear-to-r ${contentTypeLabels[contentType].color} rounded-2xl shadow-lg`}>
//                 <Brain className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
//                   AI Business Assistant
//                 </h1>
//                 <p className="text-gray-300 mt-1">
//                   Chat, create business plans, and generate pitch decks with AI
//                 </p>
//               </div>
//             </div>
            
//             {/* Content Type Selector */}
//             <Tabs value={contentType} onValueChange={setContentType} className="w-full max-w-md mx-auto">
//               <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-sm">
//                 <TabsTrigger value="chat" className="data-[state=active]:bg-blue-500 text-white">
//                   <MessageSquare className="h-4 w-4 mr-2 " />
//                   Chat
//                 </TabsTrigger>
//                 <TabsTrigger value="business_plan" className="data-[state=active]:bg-green-500 text-white">
//                   <Briefcase className="h-4 w-4 mr-2 " />
//                   Business Plan
//                 </TabsTrigger>
//                 <TabsTrigger value="pitch_deck" className="data-[state=active]:bg-purple-500 text-white">
//                   <Presentation className="h-4 w-4 mr-2 " />
//                   Pitch Deck
//                 </TabsTrigger>
//               </TabsList>
//             </Tabs>
            
//             {/* Service Status */}
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/50 border border-blue-400/30 shadow-sm mt-4 backdrop-blur-sm">
//               <div className={`w-2 h-2 rounded-full ${
//                 serviceStatus === 'ready' ? 'bg-green-500' :
//                 serviceStatus === 'loading' ? 'bg-yellow-500' :
//                 'bg-red-500'
//               }`} />
//               <span className="text-sm font-medium text-white">
//                 {serviceStatus === 'ready' ? 'AI Service Ready' :
//                  serviceStatus === 'loading' ? 'Checking Status...' :
//                  'Service Error'}
//               </span>
//             </div>
//           </div>

//           <div className="grid gap-8 lg:grid-cols-4">
//             {/* Left Panel - Settings */}
//             <div className="lg:col-span-1">
//               <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg h-fit sticky top-8">
//                 <CardHeader className="pb-4">
//                   <CardTitle className="flex items-center gap-2 text-lg text-white">
//                     <Settings className="h-5 w-5 text-blue-400" />
//                     Configuration
//                   </CardTitle>
//                   <CardDescription className="text-gray-300">
//                     Configure AI Assistant
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="space-y-6">
//                   {/* Model Selection */}
//                   <div className="space-y-3">
//                     <Label htmlFor="model-select" className="text-sm font-semibold text-white">
//                       AI Model
//                     </Label>
//                     <Select value={selectedModel} onValueChange={setSelectedModel}>
//                       <SelectTrigger className="w-full border-gray-600 bg-gray-700/50 text-white">
//                         <SelectValue placeholder="Select model" />
//                       </SelectTrigger>
//                       <SelectContent className="bg-gray-800 border-gray-600 text-white">
//                         {availableModels.map((model, index) => (
//                           <SelectItem key={index} value={model} className="text-white hover:bg-gray-700 focus:bg-gray-700">
//                             {model.split('/').pop()}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   {/* Content Type Info */}
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-2">
//                       <div className={`p-2 rounded-lg bg-linear-to-r ${contentTypeLabels[contentType].color}`}>
//                         {React.createElement(contentTypeLabels[contentType].icon, { className: "h-4 w-4 text-white" })}
//                       </div>
//                       <div>
//                         <p className="text-sm font-semibold text-white">{contentTypeLabels[contentType].label}</p>
//                         <p className="text-xs text-gray-400">
//                           {contentType === 'chat' ? 'General conversation and queries' :
//                            contentType === 'business_plan' ? 'Professional business plan generation' :
//                            'Investor-ready pitch deck creation'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Temperature */}
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <Label className="text-sm font-semibold text-white">
//                         Creativity: {temperature.toFixed(1)}
//                       </Label>
//                       <span className="text-xs text-gray-400">
//                         {temperature < 0.3 ? 'Precise' :
//                          temperature < 0.7 ? 'Balanced' :
//                          'Creative'}
//                       </span>
//                     </div>
//                     <Slider
//                       value={[temperature]}
//                       onValueChange={([value]) => setTemperature(value)}
//                       min={0.1}
//                       max={1.0}
//                       step={0.1}
//                       className="w-full"
//                     />
//                   </div>

//                   {/* Max Tokens */}
//                   <div className="space-y-3">
//                     <div className="flex justify-between items-center">
//                       <Label className="text-sm font-semibold text-white">
//                         Response Length: {maxTokens}
//                       </Label>
//                     </div>
//                     <Slider
//                       value={[maxTokens]}
//                       onValueChange={([value]) => setMaxTokens(value)}
//                       min={500}
//                       max={4000}
//                       step={100}
//                       className="w-full"
//                     />
//                   </div>

//                   {/* Quick Prompts */}
//                   <div className="space-y-3">
//                     <Label className="text-sm font-semibold text-white">
//                       Quick Prompts
//                     </Label>
//                     <div className="space-y-2">
//                       {quickPrompts[contentType].map((prompt, index) => (
//                         <Button
//                           key={index}
//                           variant="outline"
//                           className="w-full text-left justify-start h-auto py-2 px-3 border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
//                           onClick={() => setInput(prompt)}
//                         >
//                           <span className="truncate text-sm">{prompt}</span>
//                         </Button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="space-y-3 pt-4 border-t border-gray-700">
//                     <Button
//                       onClick={clearChat}
//                       variant="outline"
//                       className="w-full border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600"
//                     >
//                       <Trash2 className="h-4 w-4 mr-2" />
//                       Clear Chat
//                     </Button>
                    
//                     {/* Download Buttons */}
//                     {Object.keys(downloadLinks).length > 0 && (
//                       <div className="space-y-2">
//                         <Label className="text-sm font-semibold text-white">
//                           Download Options
//                         </Label>
//                         <div className="flex gap-2">
//                           {Object.entries(downloadLinks).map(([format, url]) => (
//                             <Button
//                               key={format}
//                               variant="outline"
//                               size="sm"
//                               className="flex-1 border-green-400/50 text-green-400 hover:bg-green-400/10"
//                               onClick={() => downloadContent(format)}
//                             >
//                               <Download className="h-3 w-3 mr-1" />
//                               .{format}
//                             </Button>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Main Chat Area */}
//             <div className="lg:col-span-3">
//               <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg min-h-[600px] flex flex-col">
//                 <CardHeader className="pb-4 border-b border-gray-700">
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <CardTitle className="flex items-center gap-2 text-white">
//                         <MessageSquare className="h-6 w-6 text-blue-400" />
//                         {contentTypeLabels[contentType].label}
//                       </CardTitle>
//                       <CardDescription className="text-gray-300">
//                         {messages.length - 1} messages • {selectedModel ? selectedModel.split('/').pop() : 'Loading model...'}
//                       </CardDescription>
//                     </div>
//                     <Button
//                       onClick={() => setShowSettings(!showSettings)}
//                       variant="outline"
//                       size="sm"
//                       className="border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600"
//                     >
//                       <Settings className="h-4 w-4 mr-2" />
//                       {showSettings ? 'Hide' : 'Show'} Settings
//                     </Button>
//                   </div>
//                 </CardHeader>
                
//                 {/* Messages Container */}
//                 <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
//                   {messages.map((message) => (
//                     <div
//                       key={message.id}
//                       className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
//                     >
//                       {/* Avatar */}
//                       <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                         message.role === 'user' 
//                           ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30' 
//                           : 'bg-linear-to-r from-blue-400/20 to-blue-600/20 text-blue-400 border border-blue-400/30'
//                       }`}>
//                         {message.role === 'user' ? (
//                           <User className="h-4 w-4" />
//                         ) : (
//                           <Bot className="h-4 w-4" />
//                         )}
//                       </div>
                      
//                       {/* Message Bubble */}
//                       <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
//                         {/* Message Content */}
//                         <div className={`rounded-2xl px-4 py-3 ${
//                           message.role === 'user'
//                             ? 'bg-blue-400 text-white rounded-br-none border border-blue-400/30'
//                             : message.isError
//                             ? 'bg-red-400/10 border border-red-400/30 text-red-300'
//                             : 'bg-gray-700/50 text-gray-200 rounded-bl-none border border-gray-600'
//                         }`}>
//                           <div className="whitespace-pre-wrap text-sm leading-relaxed prose prose-invert max-w-none">
//                             {message.content.split('\n').map((line, i) => {
//                               if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
//                                 // Headers
//                                 return <h3 key={i} className="text-lg font-bold text-white mt-3 mb-2">{line.replace(/\*\*/g, '')}</h3>;
//                               } else if (line.includes('**')) {
//                                 // Bold text
//                                 const parts = line.split('**');
//                                 return (
//                                   <p key={i} className="my-1">
//                                     {parts.map((part, j) => 
//                                       j % 2 === 1 ? 
//                                         <strong key={j} className="font-bold">{part}</strong> : 
//                                         part
//                                     )}
//                                   </p>
//                                 );
//                               } else if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
//                                 // List items
//                                 return <li key={i} className="ml-4">{line.trim().substring(2)}</li>;
//                               } else if (line.trim().startsWith('|')) {
//                                 // Table rows
//                                 return <pre key={i} className="bg-gray-800/50 p-2 rounded my-1 overflow-x-auto">{line}</pre>;
//                               } else if (line.trim() === '') {
//                                 // Empty line
//                                 return <br key={i} />;
//                               } else {
//                                 // Regular text
//                                 return <p key={i} className="my-1">{line}</p>;
//                               }
//                             })}
//                           </div>
//                         </div>
                        
//                         {/* Message Meta */}
//                         <div className={`flex items-center gap-2 mt-1 text-xs ${message.role === 'user' ? 'justify-end' : ''}`}>
//                           <span className="text-gray-400">
//                             {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                           </span>
//                           {message.role === 'assistant' && !message.isError && (
//                             <>
//                               <span className="text-gray-600">•</span>
//                               <span className="text-blue-400 font-medium">
//                                 {message.model ? message.model.split('/').pop() : 'AI Assistant'}
//                               </span>
//                               {message.tokensUsed && (
//                                 <>
//                                   <span className="text-gray-600">•</span>
//                                   <span className="text-gray-500">{message.tokensUsed} tokens</span>
//                                 </>
//                               )}
//                             </>
//                           )}
                          
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <button
//                                 onClick={() => copyMessage(message.content)}
//                                 className="text-gray-500 hover:text-gray-300 transition-colors"
//                               >
//                                 <Copy className="h-3 w-3" />
//                               </button>
//                             </TooltipTrigger>
//                             <TooltipContent className="bg-gray-800 border-gray-600 text-white">
//                               <p>Copy message</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
                  
//                   {/* Progress Bar */}
//                   {loading && (
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-300">Generating {contentTypeLabels[contentType].label.toLowerCase()}...</span>
//                         <span className="text-blue-400">{progress}%</span>
//                       </div>
//                       <Progress value={progress} className="h-2 bg-gray-700" />
//                     </div>
//                   )}
                  
//                   <div ref={messagesEndRef} />
//                 </CardContent>
                
//                 {/* Input Area */}
//                 <div className="p-4 border-t border-gray-700">
//                   <form onSubmit={handleSubmit} className="space-y-3">
//                     {error && (
//                       <Alert variant="destructive" className="bg-red-400/10 border-red-400/30">
//                         <AlertDescription className="text-red-300 text-sm">
//                           {error}
//                         </AlertDescription>
//                       </Alert>
//                     )}
                    
//                     <div className="flex gap-2">
//                       <div className="flex-1 space-y-2">
//                         <Textarea
//                           value={input}
//                           onChange={(e) => setInput(e.target.value)}
//                           placeholder={
//                             contentType === 'chat' ? 
//                             'Type your message here... (Press Shift+Enter for new line)' :
//                             contentType === 'business_plan' ?
//                             'Describe your business idea for a professional business plan...' :
//                             'Describe your startup for an investor pitch deck...'
//                           }
//                           rows={3}
//                           className="resize-none border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400"
//                           onKeyDown={(e) => {
//                             if (e.key === 'Enter' && !e.shiftKey) {
//                               e.preventDefault();
//                               handleSubmit(e);
//                             }
//                           }}
//                           disabled={loading}
//                         />
//                       </div>
//                       <Button
//                         type="submit"
//                         disabled={!input.trim() || loading}
//                         className={`bg-linear-to-r ${contentTypeLabels[contentType].color} hover:opacity-90 text-white border-0 h-full`}
//                       >
//                         {loading ? (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         ) : (
//                           <Send className="h-4 w-4" />
//                         )}
//                       </Button>
//                     </div>
                    
//                     <div className="flex justify-between text-xs text-gray-400">
//                       <div>
//                         <span className="font-medium text-gray-300">Mode:</span>
//                         <span className="ml-2 text-blue-400">{contentTypeLabels[contentType].label}</span>
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-300">Model:</span>
//                         <span className="ml-2 text-blue-400">{selectedModel ? selectedModel.split('/').pop() : 'Loading...'}</span>
//                       </div>
//                     </div>
//                   </form>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </TooltipProvider>
//   );
// };

// export default QwenChat;

//! ===================================================================================
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Label } from '../../ui/label';
import { Loader2, Send, Bot, User, Trash2, Copy, Download, Settings, Brain, MessageSquare, Briefcase, Presentation } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';

// Import the Response component
import { Response } from '../../ui/shadcn-io/ai/response';

const API_URL = 'http://localhost:5000/api';

const QwenChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI Business Assistant. I can help you with general queries, create business plans, or generate pitch decks. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contentType, setContentType] = useState('chat');
  const [selectedModel, setSelectedModel] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(400);
  const [serviceStatus, setServiceStatus] = useState('loading');
  const [progress, setProgress] = useState(0);
  const [downloadLinks, setDownloadLinks] = useState({});
  const [isStreaming, setIsStreaming] = useState(false);
  
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check service status and load models
  useEffect(() => {
    checkServiceStatus();
    loadModels();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkServiceStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/qwen/health`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setServiceStatus(data.data.status === 'ready' ? 'ready' : 'error');
        }
      } else {
        setServiceStatus('error');
      }
    } catch (err) {
      setServiceStatus('error');
    }
  };

  const loadModels = async () => {
    try {
      const response = await fetch(`${API_URL}/qwen/models`);
      const data = await response.json();
      if (data.success) {
        setAvailableModels(data.data.models);
        if (data.data.models.length > 0) {
          setSelectedModel(data.data.models[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load models:', err);
    }
  };
  
  const renderContentTypeBadge = () => {
    const config = contentTypeLabels[contentType];
    return (
      <Badge className={`${config.bgColor} text-white hover:${config.bgColor}`}>
        {React.createElement(config.icon, { className: "h-3 w-3 mr-1" })}
        {config.label}
      </Badge>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || loading) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date(),
      contentType: contentType
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
    setProgress(0);
    setDownloadLinks({});

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_URL}/qwen/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: input,
          model: selectedModel,
          content_type: contentType,
          temperature: temperature,
          max_tokens: maxTokens
        }),
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Request failed');
      }

      // Add assistant response
      const assistantMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.data.response, // This is now plain text/markdown
        timestamp: new Date(),
        model: data.data.model,
        contentType: contentType,
        downloadLinks: data.data.download_links,
        tokensUsed: data.data.tokens_used
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setDownloadLinks(data.data.download_links || {});
      
      // Reset progress after delay
      setTimeout(() => setProgress(0), 1000);
      
    } catch (err) {
      setError(err.message);
      console.error('Generation error:', err);
      
      // Add error message
      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: 'Hello! I\'m your AI Business Assistant. I can help you with general queries, create business plans, or generate pitch decks. How can I assist you today?',
        timestamp: new Date()
      }
    ]);
    setError('');
    setDownloadLinks({});
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const downloadContent = async (format) => {
    try {
      const response = await fetch(`${API_URL}${downloadLinks[format]}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qwen-${contentType}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      setError('Failed to download file');
    }
  };

  const quickPrompts = {
    chat: [
      'Explain blockchain technology in simple terms',
      'What are the latest trends in AI?',
      'How can I improve my productivity?',
      'Write a professional email template'
    ],
    business_plan: [
      'Create a business plan for an eco-friendly clothing brand',
      'Generate a business plan for a tech startup',
      'Business plan for a local coffee shop',
      'SaaS business plan template'
    ],
    pitch_deck: [
      'Create a pitch deck for a fintech startup',
      'Generate investor pitch for a healthtech company',
      'Pitch deck for an e-commerce platform',
      'Startup pitch presentation template'
    ]
  };

  const contentTypeLabels = {
    chat: { label: 'General Chat', icon: MessageSquare, color: 'from-blue-400 to-blue-600', bgColor: 'bg-blue-500' },
    business_plan: { label: 'Business Plan', icon: Briefcase, color: 'from-green-400 to-green-600', bgColor: 'bg-green-500' },
    pitch_deck: { label: 'Pitch Deck', icon: Presentation, color: 'from-purple-400 to-purple-600', bgColor: 'bg-purple-500' }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex flex-col items-center gap-4 mb-4">
              <div className={`p-4 bg-gradient-to-r ${contentTypeLabels[contentType].color} rounded-2xl shadow-lg`}>
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  AI Business Assistant
                </h1>
                <p className="text-gray-300 mt-2 text-sm md:text-base">
                  Chat, create business plans, and generate pitch decks with AI
                </p>
              </div>
            </div>
            
            {/* Content Type Selector */}
            <div className="flex justify-center mb-4">
              <Tabs value={contentType} onValueChange={setContentType} className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 backdrop-blur-sm border border-gray-700">
                  <TabsTrigger value="chat" className="data-[state=active]:bg-blue-500 text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="business_plan" className="data-[state=active]:bg-green-500 text-white">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Business Plan
                  </TabsTrigger>
                  <TabsTrigger value="pitch_deck" className="data-[state=active]:bg-purple-500 text-white">
                    <Presentation className="h-4 w-4 mr-2" />
                    Pitch Deck
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Service Status */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-blue-400/30 shadow-sm backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${
                serviceStatus === 'ready' ? 'bg-green-500' :
                serviceStatus === 'loading' ? 'bg-yellow-500' :
                'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-white">
                {serviceStatus === 'ready' ? 'AI Service Ready' :
                 serviceStatus === 'loading' ? 'Checking Status...' :
                 'Service under maintenance'}
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Left Panel - Settings */}
            <div className="lg:col-span-1">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg h-fit sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg text-white">
                    <Settings className="h-5 w-5 text-blue-400" />
                    Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Configure AI Assistant
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Mode Badge */}
                  <div className="flex justify-center">
                    {renderContentTypeBadge()}
                  </div>

                  {/* Model Selection */}
                  <div className="space-y-3">
                    <Label htmlFor="model-select" className="text-sm font-semibold text-white">
                      AI Model
                    </Label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger className="w-full border-gray-600 bg-gray-700/50 text-white">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600 text-white">
                        {availableModels.map((model, index) => (
                          <SelectItem key={index} value={model} className="text-white group hover:bg-gray-700 focus:bg-gray-700">
                            <img 
                            className='w-5'
                            src={`${model.split('/').pop().startsWith('gpt') ? '/openai.svg' : '/qwen.svg'}`} />
                            <span className="group-hover:text-white text-white">
                              {model.split('/').pop().startsWith('gpt') ?'Chatgpt': "Qwen"}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Content Type Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-linear-to-r ${contentTypeLabels[contentType].color}`}>
                        {React.createElement(contentTypeLabels[contentType].icon, { className: "h-4 w-4 text-white" })}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{contentTypeLabels[contentType].label}</p>
                        <p className="text-xs text-gray-400">
                          {contentType === 'chat' ? 'General conversation and queries' :
                           contentType === 'business_plan' ? 'Professional business plan generation' :
                           'Investor-ready pitch deck creation'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-semibold text-white">
                        Creativity: {temperature.toFixed(1)}
                      </Label>
                      <span className="text-xs text-gray-400">
                        {temperature < 0.3 ? 'Precise' :
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
                  </div>

                  {/* Max Tokens */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-sm font-semibold text-white">
                        Response Length: {maxTokens}
                      </Label>
                    </div>
                    <Slider
                      value={[maxTokens]}
                      onValueChange={([value]) => setMaxTokens(value)}
                      min={500}
                      max={4000}
                      step={100}
                      className="w-full"
                    />
                  </div>

                  {/* Quick Prompts */}
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-white">
                      Quick Prompts
                    </Label>
                    <div className="space-y-2">
                      {quickPrompts[contentType].map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="w-full text-left justify-start h-auto py-2 px-3 border-gray-600 bg-gray-700/50 text-gray-300 hover:bg-gray-600 hover:text-white transition-colors"
                          onClick={() => setInput(prompt)}
                        >
                          <span className="truncate text-sm">{prompt}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-4 ">
                    {/* <Button
                      onClick={clearChat}
                      variant="outline"
                      className="w-full border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Chat
                    </Button> */}
                    
                    {/* Download Buttons */}
                    {Object.keys(downloadLinks).length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-white">
                          Download Options
                        </Label>
                        <div className="grid grid-cols-2 gap-2">
                          {Object.entries(downloadLinks).map(([format, url]) => (
                            <Button
                              key={format}
                              variant="outline"
                              size="sm"
                              className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                              onClick={() => downloadContent(format)}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              .{format}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Chat Area */}
            <div className="lg:col-span-3">
              <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg min-h-[600px] flex flex-col">
                <CardHeader className="pb-3 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base text-white">
                        <MessageSquare className="h-5 w-5 text-blue-400" />
                        {contentTypeLabels[contentType].label}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-xs">
                        {messages.length - 1} messages • {selectedModel ? selectedModel.split('/').pop() : 'Loading model...'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                {/* Messages Container */}
                <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                        message.role === 'user' 
                          ? 'bg-blue-400/20 text-blue-400 border border-blue-400/30' 
                          : 'bg-gradient-to-r from-blue-400/20 to-blue-600/20 text-blue-400 border border-blue-400/30'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="h-3 w-3" />
                        ) : (
                          <Bot className="h-3 w-3" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className={`max-w-[85%] ${message.role === 'user' ? 'items-end' : ''}`}>
                        {/* Message Content */}
                        <div className={`rounded-xl px-3 py-2 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white rounded-br-none border border-blue-500/30'
                            : message.isError
                            ? 'bg-red-400/10 border border-red-400/30'
                            : 'bg-gray-700/50 text-gray-200 rounded-bl-none border border-gray-600'
                        }`}>
                          {message.role === 'user' ? (
                            <div className="whitespace-pre-wrap text-sm">
                              {message.content}
                            </div>
                          ) : message.isError ? (
                            <div className="text-red-300 text-sm">
                              {message.content}
                            </div>
                          ) : (
                            <div className="max-w-full overflow-hidden">
                              <Response className="h-full text-sm">
                                {message.content}
                              </Response>
                            </div>
                          )}
                        </div>
                        
                        {/* Message Meta */}
                        <div className={`flex items-center gap-1 mt-1 text-xs ${message.role === 'user' ? 'justify-end' : ''}`}>
                          <span className="text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {message.role === 'assistant' && !message.isError && message.model && (
                            <>
                              <span className="text-gray-600">•</span>
                              <span className="text-blue-400">
                                {message.model.split('/').pop()}
                              </span>
                            </>
                          )}
                          
                          {message.role === 'assistant' && !message.isError && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={() => copyMessage(message.content)}
                                  className="text-gray-500 hover:text-gray-300 transition-colors ml-1"
                                >
                                  <Copy className="h-3 w-3" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-gray-800 border-gray-600 text-white text-xs">
                                Copy message
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Progress Bar */}
                  {loading && (
                    <div className="space-y-1 pt-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-300">Generating {contentTypeLabels[contentType].label.toLowerCase()}...</span>
                        <span className="text-blue-400">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-1 bg-gray-700" />
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </CardContent>
                
                {/* Input Area */}
                <div className="p-3 border-t border-gray-700">
                  <form onSubmit={handleSubmit} className="space-y-2">
                    {error && (
                      <Alert variant="destructive" className="bg-red-400/10 border-red-400/30 py-2">
                        <AlertDescription className="text-red-300 text-xs">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Textarea
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={
                            contentType === 'chat' ? 
                            'Type your message here...' :
                            contentType === 'business_plan' ?
                            'Describe your business idea...' :
                            'Describe your startup...'
                          }
                          rows={2}
                          className="resize-none border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(e);
                            }
                          }}
                          disabled={loading}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={!input.trim() || loading}
                        className={`bg-gradient-to-r ${contentTypeLabels[contentType].color} hover:opacity-90 text-white border-0 h-full px-3`}
                      >
                        {loading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400">
                      <div>
                        <span className="font-medium text-gray-300">Mode:</span>
                        <span className="ml-1 text-blue-400">{contentTypeLabels[contentType].label}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-300">Model:</span>
                        <span className="ml-1 text-blue-400">{selectedModel ? selectedModel.split('/').pop() : 'Loading...'}</span>
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