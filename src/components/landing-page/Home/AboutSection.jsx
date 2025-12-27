import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import { motion } from "framer-motion";
import { AboutItems } from "../utils";
import { ArrowRight, Sparkles, Zap, Users, CheckCircle, Cpu, Layout, Clock, Brain ,TrendingUp, Building2, Palette} from "lucide-react";

gsap.registerPlugin(ScrollTrigger, Draggable);

const AboutSection = () => {
  const containerRef = useRef(null);
  const sectionRef = useRef(null);
  const [activeRailIndex, setActiveRailIndex] = useState(0);

  const aboutRail = [
    {
      id: 1,
      title: "Real-time Execution Engine",
      stat: "< 50ms sync",
      description: "Every action syncs instantly across teams, boards, and workflows. No refresh. No delay.",
      tag: "Core Engine",
      accent: "violet",
      video: AboutItems.aboutVideoOne,
    },
    {
      id: 2,
      title: "Unified Startup Workspace",
      stat: "1 platform",
      description: "Tasks, collaboration, planning, and communication live in one continuous system.",
      tag: "Workspace",
      accent: "blue",
      video: AboutItems.aboutVideoTwo,
    },
    {
      id: 3,
      title: "Founder-First Operations",
      stat: "0 context switching",
      description: "Designed for founders who execute fast without juggling disconnected tools.",
      tag: "Operations",
      accent: "emerald",
      video: AboutItems.aboutVideoThree,
    },
  
    {
      id: 5,
      title: "AI-Assisted Momentum",
      stat: "Smart workflows",
      description: "AI helps summarize, prioritize, and unblock execution without noise.",
      tag: "AI Layer",
      accent: "pink",
      video: AboutItems.aboutVideoFive,
    },
    {
      id: 6,
      title: "Scale Without Limits",
      stat: "Infinite growth",
      description: "Built to scale from MVP to unicorn with infrastructure that grows with your ambition.",
      tag: "Scale",
      accent: "amber",
      video: AboutItems.aboutVideoFive,
    },
  ];

// Updated feature sections with SF Collab MVP features
const featureSections = [
  {
    id: 1,
    title: "From Idea to Execution",
    description: "Transform raw ideas into structured business plans, project roadmaps, and investor-ready pitch decks in minutes, not months.",
    stats: ["Business Plan Generator", "AI Pitch Decks", "Smart Roadmaps", "MVP Planning"],
    icon: <Zap className="w-6 h-6" />,
    position: "left",
    color: "gradient",
    img:<img src="/f1.png" alt="" srcset=""  className=" absolute object-fill h-full" />
  },
  {
    id: 2,
    title: "AI-Powered Business Intelligence",
    description: "Advanced AI tools for market research, competitor analysis, financial modeling, and strategic decision-making.",
    stats: ["Market Analysis AI", "Financial Modeling", "Competitor Intelligence", "Risk Assessment"],
    icon: <Brain className="w-6 h-6" />,
    position: "right",
    color: "silver",
    img:<img src="/f2.png" alt="" srcset=""  className=" absolute object-fill h-full" />
  },
  {
    id: 3,
    title: "Virtual Economy & Gamification",
    description: "Earn XP, unlock achievements, and exchange SF Coins for premium features. A complete gamified ecosystem for professionals.",
    stats: ["XP System", "SF Coins Economy", "Achievement System", "Reward Marketplace"],
    icon: <TrendingUp className="w-6 h-6" />,
    position: "left",
    color: "platinum",
    img:<img src="/f3.png" alt="" srcset=""  className=" absolute object-fill h-full" />
  },
  {
    id: 4,
    title: "Complete Startup Infrastructure",
    description: "Everything a startup needs: team collaboration, legal document automation, investor CRM, and performance analytics.",
    stats: ["Team Management", "Legal Automation", "Investor CRM", "KPI Dashboards"],
    icon: <Building2 className="w-6 h-6" />,
    position: "right",
    color: "carbon",
    img:<img src="/f4.png" alt="" srcset=""  className=" absolute object-fill h-full" />
  },
  {
    id: 5,
    title: "Professional Creative Suite",
    description: "Generate logos, edit images, remove backgrounds, create pitch visuals, and design professional documents.",
    stats: ["Logo Generator", "Image Editor", "Background Remover", "PDF Signing"],
    icon: <Palette className="w-6 h-6" />,
    position: "left",
    color: "graphite",
    img:<img src="/f5.png" alt="" srcset=""  className=" absolute object-fill h-full" />
  },
  {
    id: 6,
    title: "Smart Collaboration Network",
    description: "Connect with founders, investors, and professionals. Smart matching based on skills, interests, and goals.",
    stats: ["Talent Discovery", "Investor Matching", "Team Formation", "Expert Network"],
    icon: <Users className="w-6 h-6" />,
    position: "right",
    color: "titanium",
    img:<img src="/f6.png" alt="" srcset=""  className=" absolute object-fill h-full" />
  }
];

// Helper function for gradients
const getAccentGradient = (color) => {
  const gradients = {
    gradient: "from-white via-gray-200 to-gray-300",
    silver: "from-slate-300 via-gray-200 to-gray-100",
    platinum: "from-gray-200 via-gray-300 to-gray-400",
    carbon: "from-gray-700 via-gray-600 to-gray-500",
    graphite: "from-gray-800 via-gray-700 to-gray-600",
    titanium: "from-gray-900 via-gray-800 to-gray-700"
  };
  return gradients[color] || "from-white to-gray-200";
};



// Helper function for text gradients
const getTextGradient = (color) => {
  const gradients = {
    gradient: "bg-gradient-to-r from-white via-gray-100 to-gray-200",
    silver: "bg-gradient-to-r from-gray-300 via-gray-200 to-gray-100",
    platinum: "bg-gradient-to-r from-gray-400 via-gray-300 to-gray-200",
    carbon: "bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400",
    graphite: "bg-gradient-to-r from-gray-700 via-gray-600 to-gray-500",
    titanium: "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600"
  };
  return gradients[color] || "bg-gradient-to-r from-white to-gray-200";
};
  useEffect(() => {
    // GSAP animations for all elements
    const ctx = gsap.context(() => {
      // Feature sections animations
      featureSections.forEach((section, index) => {
        const selector = `.feature-section-${section.id}`;
        
        gsap.from(selector, {
          opacity: 0,
          y: 60,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: selector,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          }
        });
      });

      // Rail cards animation
      gsap.from(".rail-card", {
        opacity: 0,
        y: 40,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        }
      });

      // Progress indicator animation
      gsap.from(".progress-item", {
        opacity: 0,
        x: -20,
        stagger: 0.15,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".progress-container",
          start: "top 85%",
          end: "top 60%",
          toggleActions: "play none none reverse",
        }
      });

      // Stats animation
      gsap.from(".stat-item", {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stats-container",
          start: "top 85%",
          end: "top 60%",
          toggleActions: "play none none reverse",
        }
      });

      // Note: Active rail index is only updated by dragging, not by page scroll

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId;
    
    // Smoother index calculation with reduced blinking
    const updateActiveIndex = (position) => {
      const maxScroll = container.scrollWidth - container.clientWidth;
      if (maxScroll === 0) return;
      
      const progress = Math.abs(position) / maxScroll;
      // Add slight offset to reduce flickering at boundaries
      const adjustedProgress = Math.min(Math.max(progress + 0.05, 0), 1);
      const rawIndex = adjustedProgress * aboutRail.length;
      const index = Math.min(Math.floor(rawIndex), aboutRail.length - 1);
      
      setActiveRailIndex(Math.max(0, index));
    };

    // Handle horizontal scroll within the carousel container only (not page scroll)
    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Only update when scrolling horizontally within the container
        updateActiveIndex(container.scrollLeft);
      });
    };

    // Only listen to scroll events on the container itself
    container.addEventListener('scroll', handleScroll, { passive: true });

    // Desktop draggable with improved UX
    if (window.innerWidth >= 768) {
      const draggable = Draggable.create(container, {
        type: "x",
        bounds: {
          minX: -(container.scrollWidth - container.clientWidth),
          maxX: 0
        },
        edgeResistance: 0.9,
        inertia: true,
        onPress() {
          gsap.to(container, { scale: 0.98, duration: 0.2 });
        },
        onRelease() {
          gsap.to(container, { scale: 1, duration: 0.3 });
        },
        onDrag() {
          updateActiveIndex(this.x);
        },
        onThrowUpdate() {
          updateActiveIndex(this.x);
        }
      });

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        draggable[0]?.kill();
        container.removeEventListener('scroll', handleScroll);
      };
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', handleScroll);
    };
  }, [aboutRail.length]);

  const getAccentColor = (color) => {
    const colors = {
      violet: "from-violet-500/20 to-violet-600/20",
      blue: "from-blue-500/20 to-blue-600/20",
      emerald: "from-emerald-500/20 to-emerald-600/20",
      cyan: "from-cyan-500/20 to-cyan-600/20",
      pink: "from-pink-500/20 to-pink-600/20",
      amber: "from-amber-500/20 to-amber-600/20",
    };
    return colors[color] || colors.violet;
  };

// Helper function for borders
const getAccentBorder = (color) => {
  const borders = {
    gradient: "border-white/30",
    silver: "border-gray-300/30",
    platinum: "border-gray-400/30",
    carbon: "border-gray-600/30",
    graphite: "border-gray-700/30",
    titanium: "border-gray-800/30"
  };
  return borders[color] || "border-white/20";
};

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen text-white overflow-hidden"
      style={{ marginTop: '0', paddingTop: '0' }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black" />
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:80px_80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 lg:py-32">
        {/* Hero section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm tracking-widest text-white/60 uppercase">
              For Builders Who Ship
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-semibold tracking-tight mb-6">
            The Startup
            <br />
            <span className="  bg-gradient-to-br from-gray-800 to-gray-900 bg-clip-text text-transparent">
              Operating System
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-white/80 leading-relaxed mb-8">
            Where ideas meet execution. One platform for everything your startup needs to build, collaborate, and scale.
          </p>


        </motion.div>

        {/* Feature sections - alternating layout */}
        <div className="space-y-24 md:space-y-40 mb-32">
          {featureSections.map((section) => (
            <div
              key={section.id}
              className={`feature-section-${section.id} flex flex-col lg:flex-row items-center gap-8 md:gap-16 lg:gap-32 ${
                section.position === 'right' ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Text content */}
              <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 px-4 md:px-0">
                <motion.div 
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  // viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${getAccentGradient(section.color)} shadow-lg border ${getAccentBorder(section.color)}`}>
                    {React.cloneElement(section.icon, { className: "w-5 h-5 md:w-7 md:h-7 text-gray-900" })}
                  </div>
                  <span className="text-xs md:text-sm font-semibold tracking-widest text-gray-400 uppercase">
                    Feature {section.id.toString().padStart(2, '0')}
                  </span>
                </motion.div>
        
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight"
                >
                  <span className={`bg-clip-text text-transparent ${getTextGradient(section.color)}`}>
                    {section.title}
                  </span>
                </motion.h2>
        
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-base md:text-xl text-gray-400 leading-relaxed"
                >
                  {section.description}
                </motion.p>
        
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  // viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6"
                >
                  {section.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      className="group relative p-3 md:p-4 rounded-xl backdrop-blur-sm border border-gray-800/50 bg-gradient-to-b from-gray-900/30 to-gray-900/10 hover:border-gray-700/50 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-400 to-gray-300" />
                          <span className="text-sm font-medium text-gray-300">{stat}</span>
                        </div>
                        <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          Included in all plans
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
        
              {/* Visual placeholder */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                // viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="w-full lg:w-1/2 relative px-4 md:px-0"
              >
                <div className="relative">
                  {/* Background gradient effect */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl opacity-70" />
                  
                  {/* Main card */}
                  <motion.div 
                    whileHover={{ scale: 1.02, rotateY: 2 }}
                    transition={{ duration: 0.3 }}
                    className="relative rounded-2xl overflow-hidden border border-gray-800/50 bg-gradient-to-br from-gray-900 to-black p-1 backdrop-blur-sm"
                  >
                        {section.img}
                  
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
                    
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden ">
                      {/* Grid pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px),
                                           linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                          backgroundSize: '40px 40px',
                        }} />
                      </div>
                      
                      {/* Animated dots */}
                      <div className="absolute inset-0">
                        {Array.from({ length: 12 }).map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-1 h-1 rounded-full bg-white/20"
                            style={{
                              left: `${10 + (i * 7)}%`,
                              top: `${20 + (i * 5)}%`,
                            }}
                            animate={{
                              y: [0, -10, 0],
                              opacity: [0.2, 0.8, 0.2],
                            }}
                            transition={{
                              duration: 2,
                              delay: i * 0.1,
                              repeat: Infinity,
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col items-center  justify-center p-8">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.8 }}
                          className="text-center mb-8"
                        >
                          <div className={`text-6xl font-bold mb-4 px-3 bg-black/70 backdrop-blur-sm rounded-tl-2xl rounded-br-2xl`}>
                            {section.stats[0].split(' ')[0]}
                          </div>
                          <div className="text-gray-400 px-3 bg-black/70 backdrop-blur-sm rounded-tl-2xl rounded-br-2xl text-sm uppercase tracking-widest">
                            {section.title.split(' ').slice(0, 2).join(' ')}
                          </div>
                        </motion.div>
                        {/* Feature indicators */}
                        <div className="flex flex-wrap gap-3 justify-center">
                          {section.stats.slice(1).map((stat, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.3, delay: 0.9 + idx * 0.1 }}
                              className="px-3 py-1.5 rounded-full border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm"
                            >
                              <span className="text-xs text-gray-400">{stat}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Corner accents */}
                      <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-gray-700/50 rounded-tl-xl" />
                      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-gray-700/50 rounded-tr-xl" />
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-gray-700/50 rounded-bl-xl" />
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-gray-700/50 rounded-br-xl" />
                    </div>
                  </motion.div>
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute -top-4 -left-4 w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-2xl"
                  >
                    <div className="absolute inset-2 border border-gray-700/30 rounded-lg flex items-center justify-center">
                      <div className="text-2xl font-bold text-gray-500">SF</div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    animate={{
                      y: [0, 10, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                    className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-2xl"
                  >
                    <div className="absolute inset-2 border border-gray-700/30 rounded-lg flex items-center justify-center">
                      <div className="text-xl font-bold text-gray-600">{section.id}</div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      

        {/* Horizontal media rail */}
        <div className="mb-32">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl lg:text-3xl font-medium">How It Works</h3>
              <p className="text-white/60 mt-2">The execution flow of every successful startup</p>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <span className="text-sm text-white/40">Drag to explore →</span>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="progress-container mb-12">
            <div className="mt-10 flex justify-center text-xs text-white/40 tracking-widest space-x-8">
              {["EXECUTION", "WORKSPACE", "OPERATIONS", "AI", "SCALE"].map((item, index) => (
                <motion.div
                  key={index}
                  className="progress-item relative cursor-pointer"
                  animate={{ 
                    color: index === activeRailIndex ? "#ffffff" : "rgba(255,255,255,0.4)",
                    scale: index === activeRailIndex ? 1.1 : 1
                  }}
                  transition={{ 
                    duration: 0.2,
                    ease: "easeOut"
                  }}
                >
                  {item}
                  {index === activeRailIndex && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-500 to-white"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Draggable rail */}
          <div 
            ref={containerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide overflow-y-hidden cursor-grab active:cursor-grabbing no-scrollbar pb-6"
            style={{
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
            }}
          >
            {aboutRail.map((item, index) => (
              <motion.div
                key={item.id}
                className="rail-card flex-shrink-0 w-[300px] lg:w-[380px] h-[360px] lg:h-[440px] rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#0f0f0f] to-black group hover:border-white/20 transition-all duration-300 scroll-snap-align-start relative"
                whileHover={{ y: -8 }}
                animate={{ 
                  opacity: index === activeRailIndex ? 1 : 0.7,
                  scale: index === activeRailIndex ? 1.02 : 1
                }}
              >
                <div className="relative h-full">
                  {/* Video background */}
                  <video
                    src={item.video}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full  backdrop-blur-sm`}>
                        <div className={`w-1.5 h-1.5 rounded-full  animate-pulse`} />
                        <span className="text-xs font-medium">{item.tag}</span>
                      </div>
                      <span className="text-sm text-white/40">{index + 1}/{aboutRail.length}</span>
                    </div>
                    
                    <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                    <div className={`text-2xl font-bold mb-3 `}>
                      {item.stat}
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Edge accent */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-${item.accent}-500 to-${item.accent}-600`} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats section */}
          <div className="stats-container mt-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <div className="stat-item p-6 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full " />
                  <span className="font-mono text-2xl lg:text-3xl font-bold">0.05s</span>
                </div>
                <p className="text-sm text-white/50">Sync latency</p>
              </div>
              
              <div className="stat-item p-6 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full " />
                  <span className="font-mono text-2xl lg:text-3xl font-bold">24/7</span>
                </div>
                <p className="text-sm text-white/50">Live collaboration</p>
              </div>
              
              <div className="stat-item p-6 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full " />
                  <span className="font-mono text-2xl lg:text-3xl font-bold">∞</span>
                </div>
                <p className="text-sm text-white/50">Canvas scale</p>
              </div>
              
              <div className="stat-item p-6 rounded-xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2 h-2 rounded-full" />
                  <span className="font-mono text-2xl lg:text-3xl font-bold">100%</span>
                </div>
                <p className="text-sm text-white/50">Uptime SLA</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto pt-16"
        >
          <h2 className="text-3xl lg:text-4xl font-semibold mb-6">
            Ready to Build Your Startup's Foundation?
          </h2>
          <p className="text-lg text-white/70 mb-8 leading-relaxed">
            Join thousands of founders who use SFCollab to execute faster, collaborate better, and scale smarter.
          </p>
          
          <motion.button 
            onClick={() => window.location.href = 'https://sfcollab.com/waitlist'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-gray-600 to-white-600 hover:from-white-500 hover:to-gray-500 transition-all duration-300 font-medium text-lg overflow-hidden"
          >
            <span>JOIN THE WAIT LIST</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </motion.button>
          
          <p className="mt-6 text-sm text-white/40">
            No credit card required • Full platform access • Cancel anytime
          </p>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
        <style >{`
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
          .animate-shimmer {
            animation: shimmer 2s infinite;
          }
        `}</style>
    </section>
  );
};

export default AboutSection;
