import React, { useState, useRef } from 'react';
import { toast } from 'react-toastify';
import {
  Lightbulb, 
  BarChart3, 
  Mic, 
  Square, 
  Download, 
  Building2,
  DollarSign,
  MapPin,
  Cpu,
  Target,
  Sparkles,
  Loader2,
  Check,
  Shield,
  Clock
} from 'lucide-react';
import ShinyText from "../../ui/ShinyText";

export default function BusinessIdeaGenerator() {
  const [mode, setMode] = useState('ideas');
  const [isRecording, setIsRecording] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [formData, setFormData] = useState({
    businessIdea: '',
    industry: '',
    budget: '',
    location: '',
    tech: ''
  });
  const [voiceStatus, setVoiceStatus] = useState({});

  const recognitionInstances = useRef({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const switchMode = (newMode) => {
    setMode(newMode);
  };

  const startVoiceInput = (fieldName, btnId) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast.error('Speech recognition is not supported in your browser.');
      return;
    }

    if (recognitionInstances.current[btnId]) {
      recognitionInstances.current[btnId].stop();
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognitionInstances.current[btnId] = recognition;

    recognition.onstart = () => {
      setIsRecording(prev => ({ ...prev, [btnId]: true }));
      setVoiceStatus(prev => ({ ...prev, [btnId]: '🎤 Listening... Click stop when finished' }));
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }

      if (finalTranscript) {
        setFormData(prev => ({
          ...prev,
          [fieldName]: (prev[fieldName] + ' ' + finalTranscript).trim()
        }));
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      stopVoiceInput(btnId);
      setVoiceStatus(prev => ({ ...prev, [btnId]: '❌ Error: ' + event.error }));
    };

    recognition.start();
  };

  const stopVoiceInput = (btnId) => {
    if (recognitionInstances.current[btnId]) {
      recognitionInstances.current[btnId].stop();
      delete recognitionInstances.current[btnId];
      setIsRecording(prev => ({ ...prev, [btnId]: false }));
      setVoiceStatus(prev => ({ ...prev, [btnId]: '✅ Recording stopped' }));
      
      setTimeout(() => {
        setVoiceStatus(prev => ({ ...prev, [btnId]: '' }));
      }, 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setResults({
        type: mode,
        content: `Generated ${mode === 'ideas' ? 'Business Ideas' : 'Business Plan'} based on your inputs...`
      });
      setIsLoading(false);
    }, 2000);
  };

  const VoiceInput = ({ fieldName, placeholder, value, type = 'input', btnId, label, icon }) => (
    <div className="mb-4">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            name={fieldName}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            rows={3}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 pr-24 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
          />
        ) : (
          <input
            type="text"
            name={fieldName}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 pr-24 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
          />
        )}
        <div className="absolute right-2 top-3 flex gap-2">
          <button
            type="button"
            onClick={() => startVoiceInput(fieldName, btnId)}
            className={`p-2 rounded-lg transition-all ${
              isRecording[btnId]
                ? 'bg-linear-to-br from-rose-500 to-red-600 animate-pulse'
                : 'bg-linear-to-br from-purple-500 to-blue-600 hover:scale-110'
            }`}
          >
            <Mic className="h-4 w-4 text-white" />
          </button>
          {isRecording[btnId] && (
            <button
              type="button"
              onClick={() => stopVoiceInput(btnId)}
              className="p-2 rounded-lg bg-linear-to-br from-rose-500 to-red-600 hover:scale-110 transition-all"
            >
              <Square className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      </div>
      {voiceStatus[btnId] && (
        <div className="mt-2 text-xs text-purple-400 bg-purple-500/10 px-3 py-2 rounded-lg">
          {voiceStatus[btnId]}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-5xl mx-auto">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
          <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        {/* Premium AI Business Plan Generator Header */}
        <div className="relative overflow-hidden">
            <div className="text-center">
              {/* AI Badge */}
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl animate-fade-in">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-75 animate-pulse" />
                    <div className="relative p-2 bg-linear-to-br from-slate-900 to-slate-800 rounded-full border border-white/10">
                      <img className="h-5 w-5" src='/ai.png' />
                    </div>
                  </div>
                  <span className="text-sm font-semibold bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                    ENTERPRISE-GRADE AI
                  </span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <span className="text-sm text-slate-400 font-medium">
                  Powered by Qwen2.5-72B
                </span>
              </div>
        
              {/* Main Hero Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 animate-slide-up">
                <span className="bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                  AI Business Plan
                </span>
                <br />
                <span className=" relative">
                  <span style={{zIndex:99999}} className='mt-4 z-50 bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent '>
                  Generator
                  </span>
                  {/* Animated underline */}
                  {/* <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-48 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent animate-shimmer" /> */}
                  <span className='absolute z-10 top-16 right-1 w-full flex justify-center mt-2'>
                    <svg aria-hidden="true" viewBox="0 0 418 42" className=" h-[0.70em] w-96 fill-blue-400/50" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
                  </span>
                </span>
              </h1>
        
              {/* Subheading */}
              <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                Transform your vision into investor-ready business plans with our advanced AI. 
                <span className="bg-linear-to-r from-blue-300 to-purple-300 text-transparent bg-clip-text font-semibold"> Generate comprehensive strategies,</span>
                financial projections, 
                and market analysis in minutes.
              </p>
        
              {/* Feature Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {[
                  { icon: <img src='/thounder.png' alt='Generation'/>, label: '90-Second Generation', value: 'Lightning Fast' },
                  { icon: <img src='/brain.png' alt='Generation'/>, label: 'Smart Market Analysis', value: 'AI-Powered' },
                  { icon: <img src='/investor.png' alt='Generation'/>, label: 'Investor-Ready Output', value: 'Professional' },
                  { icon: <img src='/recycle.png' alt='Generation'/>, label: 'Multi-Step Planning', value: 'Comprehensive' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center gap-3 group">
                    <div className="text-2xl w-10  group-hover:scale-110 transition-transform duration-300">
                      {stat.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-white font-semibold text-sm">{stat.label}</div>
                      <div className="text-slate-400 text-xs">{stat.value}</div>
                    </div>
                  </div>
                ))}
              </div>
        
              
            </div>
        
          {/* Animated Scan Line */}
          <div className="absolute bottom-0  left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent animate-scan" />
        </div>

        {/* Mode Selector */}
        <div className="relative">
          <div className="absolute inset-0 -top-4 -bottom-4 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-amber-500/5 blur-xl rounded-3xl" />
          
          <div className="relative flex gap-2 p-2 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl max-w-md mx-auto my-12">
            {/* Animated Background Slider */}
            <div 
              className={`absolute top-2 bottom-2 bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-500 ease-out ${
                mode === 'ideas' ? 'left-2 w-[calc(50%-8px)]' : 'left-[calc(50%+1px)] w-[calc(50%-8px)]'
              }`}
            />
            
            {/* Ideas Button */}
            <button
              onClick={() => switchMode('ideas')}
              className={`cursor-pointer relative flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 group ${
                mode === 'ideas'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {/* Icon Container */}
              <div className={`relative transition-transform duration-300 group-hover:scale-110 ${
                mode === 'ideas' ? 'text-yellow-400' : 'text-slate-500 group-hover:text-yellow-300'
              }`}>
                <div className={`absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                  mode === 'ideas' ? 'bg-yellow-400/50 opacity-100' : 'bg-yellow-400/0 opacity-0 group-hover:opacity-50'
                }`} />
                <Lightbulb className="h-5 w-5 relative" />
              </div>
              
              <span className="relative text-sm font-medium whitespace-nowrap">
                Business Ideas
              </span>
              
              {/* Active State Glow */}
              {/* {mode === 'ideas' && (
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 shadow-inner" />
              )} */}
            </button>
        
            {/* Plan Button */}
            <button
              onClick={() => switchMode('plan')}
              className={`cursor-pointer relative flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-300 group ${
                mode === 'plan'
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              {/* Icon Container */}
              <div className={`relative transition-transform duration-300 group-hover:scale-110 ${
                mode === 'plan' ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-300'
              }`}>
                <div className={` absolute inset-0 rounded-lg blur-sm transition-opacity duration-300 ${
                  mode === 'plan' ? 'bg-blue-400/50 opacity-100' : 'bg-blue-400/0 opacity-0 group-hover:opacity-50'
                }`} />
                <BarChart3 className="h-5 w-5 relative" />
              </div>
              
              <span className="relative text-sm font-medium whitespace-nowrap">
                Business Plan
              </span>
              
              {/* Active State Glow */}
              {/* {mode === 'plan' && (
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-500/10 to-purple-500/5 border border-blue-500/20 shadow-inner" />
              )} */}
            </button>
          </div>
        
          {/* Feature Highlights */}
          <div className="flex justify-center  mt-6 animate-fade-in">
            <div className='w-[80%] flex justify-around '>
              {[
                { 
                  mode: 'ideas', 
                  icon: <img src="/idea.png" className='w-30' alt="idea" />, 
                  title: 'Ideation Mode', 
                  features: ['Market Gaps', 'Creative Concepts', 'Quick Brainstorming'] 
                },
                { 
                  mode: 'plan', 
                  icon: <img src="/chart.png" className='w-30' alt="plan" />, 
                  title: 'Planning Mode', 
                  features: ['Financial Models', 'Investor Docs', 'Full Strategy'] 
                }
              ].map((item) => (
                <div 
                  key={item.mode}
                  className={`flex w-full transition-all duration-500 ${
                    mode === item.mode ? 'opacity-100 scale-105' : 'opacity-40 scale-95'
                  }`}
                >
                  <div className="w-full flex justify-center text-2xl mb-2">{item.icon}</div>
                  <div className="w-full text-xs text-slate-500 space-y-0.5">
                    <div className="text-sm font-semibold text-slate-300 mb-1">{item.title}</div>
                    {item.features.map((feature, index) => (
                      <div key={index} className='flex items-center gap-2'><Check size={10}/>{feature}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        {/* Premium Form Section */}
          <div className="relative">
            {/* Background Glow Effects */}
            <div className="absolute -inset-4 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-amber-500/10 blur-3xl rounded-3xl" />
            <div className="absolute -inset-2 bg-linear-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl" />
            
            <div className="relative bg-linear-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              {/* Form Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 mb-4">
                  <div className="p-1.5 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                    {mode === 'ideas' ? 
                      <Lightbulb className="h-4 w-4 text-white" /> : 
                      <BarChart3 className="h-4 w-4 text-white" />
                    }
                  </div>
                  <span className="text-sm font-semibold text-slate-300">
                    {mode === 'ideas' ? 'Business Ideation' : 'Strategic Planning'}
                  </span>
                </div>
                <h3 className="text-2xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {mode === 'ideas' ? 'Describe Your Vision' : 'Build Your Business Plan'}
                </h3>
                <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
                  {mode === 'ideas' 
                    ? 'Provide key details to generate innovative business concepts tailored to your goals'
                    : 'Enter comprehensive information to create a detailed, investor-ready business plan'
                  }
                </p>
              </div>
          
              {/* Business Idea (only for plan mode) */}
              {mode === 'plan' && (
                <div className="mb-8 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <Target className="h-4 w-4 text-blue-400" />
                    </div>
                    <label className="text-sm font-semibold text-slate-300">Core Business Concept</label>
                    <span className="text-xs text-blue-400 font-medium bg-blue-500/10 px-2 py-1 rounded-full">Required</span>
                  </div>
                  <VoiceInput
                    fieldName="businessIdea"
                    label=""
                    // icon={<Target className="h-4 w-4" />}
                    placeholder="Describe your business vision, target market, and unique value proposition in detail..."
                    value={formData.businessIdea}
                    type="textarea"
                    btnId="1"
                    className="bg-slate-800/50 border-white/10 focus:border-blue-500/30 transition-all duration-300"
                  />
                </div>
              )}
          
              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    fieldName: 'industry',
                    label: 'Industry Focus',
                    icon: <Building2 className="h-4 w-4" />,
                    placeholder: 'e.g., HealthTech, FinTech, Sustainable Energy',
                    value: formData.industry,
                    btnId: '2'
                  },
                  {
                    fieldName: 'budget',
                    label: 'Investment Range',
                    icon: <DollarSign className="h-4 w-4" />,
                    placeholder: 'e.g., $5,000 - $50,000',
                    value: formData.budget,
                    btnId: '3'
                  },
                  {
                    fieldName: 'location',
                    label: 'Market Location',
                    icon: <MapPin className="h-4 w-4" />,
                    placeholder: 'e.g., North America, Remote, EU Market',
                    value: formData.location,
                    btnId: '4'
                  },
                  {
                    fieldName: 'tech',
                    label: 'Technology Stack',
                    icon: <Cpu className="h-4 w-4" />,
                    placeholder: 'e.g., AI/ML, Blockchain, Cloud Native',
                    value: formData.tech,
                    btnId: '5'
                  }
                ].map((field, index) => (
                  <div key={field.fieldName} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-slate-700/50 rounded-lg border border-white/5">
                        {field.icon}
                      </div>
                      <label className="text-sm font-semibold text-slate-300">{field.label}</label>
                    </div>
                    <VoiceInput
                      fieldName={field.fieldName}
                      label=""
                      // icon={field.icon}
                      placeholder={field.placeholder}
                      value={field.value}
                      btnId={field.btnId}
                      className="bg-slate-800/30 border-white/10 hover:border-white/20 focus:border-blue-500/30 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
          
              {/* Generate Button */}
              <div className="relative group">
                {/* Button Glow Effect */}
                <div className="absolute -inset-1 bg-linear-to-r from-amber-500 via-purple-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-1000 group-hover:duration-200" />
                
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="relative w-full bg-linear-to-r from-slate-900 to-slate-800 border border-white/10 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 group/btn"
                >
                  {/* Animated Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-r from-amber-500 via-purple-500 to-blue-500 rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  
                  {/* Button Content */}
                  <div className="relative flex items-center gap-3">
                    {isLoading ? (
                      <>
                        <div className="relative">
                          <div className="absolute inset-0 bg-white rounded-full blur-sm animate-pulse" />
                          <Loader2 className="h-5 w-5 text-white animate-spin relative" />
                        </div>
                        <span className="font-semibold">
                          {mode === 'ideas' ? 'Generating Ideas...' : 'Creating Business Plan...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="p-1 bg-white/10 rounded-lg group-hover/btn:bg-white/20 transition-colors">
                          {mode === 'ideas' ? 
                            <Lightbulb className="h-5 w-5 text-amber-400" /> : 
                            <BarChart3 className="h-5 w-5 text-blue-400" />
                          }
                        </div>
                        <span className="font-semibold text-lg">
                          {mode === 'ideas' ? 'Generate Business Ideas' : 'Create Business Plan'}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Loading Progress Bar */}
                  {isLoading && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-amber-500 via-purple-500 to-blue-500 rounded-b-2xl animate-pulse" />
                  )}
                </button>
              </div>
          
              {/* Form Footer */}
              <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>Enterprise-Grade Security</span>
                </div>
                <div className="w-px h-4 bg-slate-600" />
                <div className="flex items-center gap-2">
                  <Cpu className="h-3 w-3" />
                  <span>AI-Powered Analysis</span>
                </div>
                <div className="w-px h-4 bg-slate-600" />
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>90-Second Generation</span>
                </div>
              </div>
            </div>
          </div>

        {/* Loading State */}
        {isLoading && (
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-4 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl">
              <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
              <span className="text-slate-300">
                {mode === 'ideas' ? 'Generating innovative ideas...' : 'Creating your detailed business plan...'}
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !isLoading && (
          <div className="mt-8 bg-linear-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
            {/* Results Header */}
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between bg-linear-to-r from-purple-500/10 to-blue-500/10">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                {mode === 'ideas' ? (
                  <>
                    <Lightbulb className="h-6 w-6 text-amber-400" />
                    <span className="bg-linear-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent">
                      Generated Business Ideas
                    </span>
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-6 w-6 text-purple-400" />
                    <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Your Detailed Business Plan
                    </span>
                  </>
                )}
              </h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all hover:scale-105 shadow-lg">
                <Download className="h-4 w-4" />
                Download PDF
              </button>
            </div>

            {/* Results Content */}
            <div className="p-8 bg-slate-950/50 max-h-[600px] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-purple-400 mb-4 pb-3 border-b border-slate-700/50">
                    Executive Summary
                  </h3>
                  <p className="text-slate-300 leading-relaxed">
                    Based on your inputs for the <strong className="text-amber-400">{formData.industry || 'selected'}</strong> industry 
                    with a budget of <strong className="text-amber-400">{formData.budget || 'specified'}</strong> in{' '}
                    <strong className="text-amber-400">{formData.location || 'your location'}</strong>, here are tailored recommendations 
                    leveraging <strong className="text-amber-400">{formData.tech || 'modern'}</strong> technology.
                  </p>
                </div>

                <div>
                  <h4 className="text-xl font-bold text-blue-400 mb-3">Key Opportunities</h4>
                  <div className="space-y-3">
                    <div className="pl-4 py-3 bg-purple-500/5 border-l-4 border-purple-500 rounded-r text-slate-300">
                      Market analysis shows strong potential in your target region
                    </div>
                    <div className="pl-4 py-3 bg-blue-500/5 border-l-4 border-blue-500 rounded-r text-slate-300">
                      Technology stack aligns with industry trends and scalability needs
                    </div>
                    <div className="pl-4 py-3 bg-amber-500/5 border-l-4 border-amber-500 rounded-r text-slate-300">
                      Budget allocation supports MVP development and initial market testing
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 italic text-sm bg-slate-800/30 p-4 rounded-lg border border-slate-700/30">
                  💡 This is a demo response. Integrate with your actual AI model to generate real business insights.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-slate-500 text-sm">
          <p className="flex items-center justify-center gap-2">
            <Cpu className="h-4 w-4" />
            Running locally with Hugging Face Transformers | No API keys needed
          </p>
        </div>
      </div>
    </div>
  );
}