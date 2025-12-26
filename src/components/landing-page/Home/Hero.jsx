import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, X ,ArrowRight} from 'lucide-react';

import { heroAssest } from '../utils';
import ShinyText from '../../ui/ShinyText';
import { motion } from 'framer-motion';
import { ShineButton } from '../../lightswind/shine-button';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const popupRef = useRef(null);
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const backgroundMetricsRef = useRef(null);
  const mainHeadingRef = useRef(null);
  const liveStatsRef = useRef(null);
  const navigate=useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Main scroll animation controller
  useEffect(() => {
    if (!contentRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Initial entrance animations (staggered)
      gsap.from([mainHeadingRef.current, backgroundMetricsRef.current, liveStatsRef.current], {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.2,
        delay: 0.3
      });

      // Scroll-triggered hero transformation
      gsap.fromTo(
        contentRef.current,
        {
          scale: 1,
          opacity: 1,
        },
        {
          scale: 4,
          opacity: 0,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom+=50% top",
            scrub: 1.2,
            pin: true,
            pinSpacing: false,
            onUpdate: (self) => {
              // Parallax background metrics
              gsap.to(backgroundMetricsRef.current, {
                y: self.progress * -60,
                opacity: 0.03 + (self.progress * 0.01),
                ease: "none"
              });

              // Fade out live stats
              gsap.to(liveStatsRef.current, {
                opacity: 1 - (self.progress * 2),
                y: self.progress * 30,
                ease: "none"
              });
            }
          }
        }
      );

      // Background video scroll scale
      gsap.to(imageRef.current, {
        scale: 1.3,
        opacity: 0.4,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom+=50% top",
          scrub: 1.5,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openPopup = () => {
    setIsPopupOpen(true);
    gsap.fromTo(
      popupRef.current,
      { 
        opacity: 0, 
        scale: 0.95,
        display: 'flex'
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.log("Video play failed:", e));
          }
        },
      }
    );
  };

  const closePopup = () => {
    gsap.to(popupRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: 'power3.in',
      onComplete: () => {
        gsap.set(popupRef.current, { display: 'none' });
        setIsPopupOpen(false);
        if (videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      },
    });
  };

  // Close popup on ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isPopupOpen) {
        closePopup();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isPopupOpen]);

  // Close popup on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isPopupOpen && popupRef.current && 
          !popupRef.current.contains(e.target) && 
          !e.target.closest('button[onclick]')) {
        closePopup();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isPopupOpen]);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Content Container */}
      <div
        ref={contentRef}
        className="h-screen w-full relative flex flex-col items-center justify-center z-20 overflow-hidden  md:px-8"
      >
        {/* Layer 1 — Background Metrics (Massive, Subtle) */}
        <div 
          ref={backgroundMetricsRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-[15vw] md:text-[18vw] lg:text-[20vw] font-black uppercase opacity-[0.06] tracking-tight leading-none whitespace-nowrap font-mono">
            <div className="translate-y-[-5%]">
              SF COLLAB
            </div>
          </div>
        </div>

        {/* Layer 2 — Main Authority Statement */}
        <div className="relative z-10 text-center">
          <h1 
            ref={mainHeadingRef}
            className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] font-semibold uppercase text-white tracking-tight leading-[0.9]"
          >
             <ShinyText 
                  text="COLLABORATION" 
                  // disabled={false} 
                  speed={3} 
                  className='custom-title opacity-95' 
                />
              
            <br />
            <ShinyText 
                  text="without" 
                  // disabled={false} 
                  speed={3} 
                  className='custom-title opacity-95 text-7xl ' 
                />
              
            <br />
            <ShinyText 
                  text="friction" 
                  // disabled={false} 
                  speed={3} 
                  className='custom-title opacity-95 text-7xl ' 
                />
              
          </h1>
        </div>

        {/* Layer 3 — Proof-Driven Subline */}
        <div className="relative z-10 mt-4 md:mt-6 max-w-xl md:max-w-2xl px-4 text-center">
          <p className="text-base md:text-lg lg:text-xl text-white/85 font-light tracking-wide leading-relaxed">
            The real-time canvas where distributed teams build, think, and create in sync.
            <span className="block mt-2 text-sm md:text-base text-white/50 font-normal">
              Sub-50ms sync • Infinite workspace • Enterprise-grade
            </span>
          </p>
        </div>

        

        {/* Animated Metric Ticker */}
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 px-4">
          <div className="flex items-center justify-center gap-4 md:gap-8 lg:gap-12 opacity-80">
            <ShineButton
            onClick={()=>navigate('/waitlist')}
            label='Join Waitlist'
            icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              className="group cursor-pointer relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-300 font-medium text-lg overflow-hidden"
            >
            </ShineButton>
          </div>
        </div>

        {/* Interactive CTA */}
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-20">
          <button
            onClick={openPopup}
            className="group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-white/3 backdrop-blur-sm border border-white/10 font-medium cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            <span className="text-sm md:text-base">Experience Live</span>
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white  flex items-center justify-center">
              <Play className="w-3 h-3 md:w-4 md:h-4 fill-black text-black" />
            </div>
          </button>

        </div>
      </div>

      {/* Background video */}
      <div className="absolute inset-0 w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 z-10"></div>
        <video
          ref={imageRef}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroAssest.herovideothree} type="video/mp4" />
        </video>
      </div>

      {/* Popup Modal */}
      <div
        ref={popupRef}
        style={{ display: isPopupOpen ? 'flex' : 'none' }}
        className="fixed inset-0 items-center justify-center bg-black/90 backdrop-blur-sm z-50 p-4 hidden"
      >
        <div className="relative w-full max-w-4xl lg:max-w-6xl aspect-video rounded-lg md:rounded-xl overflow-hidden bg-black shadow-2xl">
          <video
            ref={videoRef}
            src={heroAssest.herovideoOne}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
          />
          
          <button
            onClick={closePopup}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-50 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-all backdrop-blur-sm"
            aria-label="Close video"
          >
            <X className="text-white w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;