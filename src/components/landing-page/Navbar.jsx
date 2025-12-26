import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Menu, X, Youtube } from 'lucide-react';
import gsap from 'gsap';
import { heroAssest, mainsong } from './utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  const linksRef = useRef([]);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const navbarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false); // Start as fals
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef(null);
  const barRefs = useRef([]);
  const barTimeline = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);
  useEffect(() => {
    audioRef.current = new Audio(mainsong.mainAudio);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Lower volume for better UX
    audioRef.current.preload = 'auto';
    barTimeline.current = gsap.timeline({ 
      repeat: -1,
      paused: true 
    });
    
    barTimeline.current
      .to(barRefs.current[0], {
        scaleY: 2,
        duration: 0.4,
        ease: 'power2.inOut'
      })
      .to(barRefs.current[1], {
        scaleY: 1.8,
        duration: 0.3,
        ease: 'power2.inOut'
      }, '-=0.3')
      .to(barRefs.current[2], {
        scaleY: 2.2,
        duration: 0.5,
        ease: 'power2.inOut'
      }, '-=0.2')
      .to(barRefs.current, {
        scaleY: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.inOut'
      }, '+=0.2');

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (barTimeline.current) {
        barTimeline.current.kill();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!userInteracted) {
      setUserInteracted(true);
    }
    
    if (isPlaying) {
      handleStopMusic();
    } else {
      handlePlayMusic();
    }
  };

  const handlePlayMusic = async () => {
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      barTimeline.current.play();
    } catch (err) {
      setIsPlaying(false);
    }
  };

  const handleStopMusic = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    barTimeline.current.pause();
    
    gsap.to(barRefs.current, {
      scaleY: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  useEffect(() => {
    setUserInteracted(false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > lastScrollY.current && currentScroll > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollY.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (navbarRef.current) {
      if (showNavbar) {
        gsap.to(navbarRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      } else {
        gsap.to(navbarRef.current, {
          y: -100,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        });
      }
    }
  }, [showNavbar]);

  useEffect(() => {
    if (isOpen) {
      gsap.set(overlayRef.current, { display: 'flex', pointerEvents: 'auto' });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power4.inOut' }
      );

      gsap.fromTo(
        linksRef.current,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out',
          stagger: 0.1,
          delay: 0.2,
        }
      );

      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        ease: 'power4.inOut',
        onComplete: () => {
          gsap.set(overlayRef.current, {
            display: 'none',
            pointerEvents: 'none',
          });
        },
      });
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const navlink = [
    { href: '/', name: 'Home' },
    { href: '/about', name: 'Platform' },
    { href: '/pricing', name: 'Pricing' },
    { href: '/startuppage', name: 'Startups' },
    { href: '/team', name: 'Team' },
    { href: '/contact', name: 'Contact' },
  ];

  return (
    <>
      <div
        ref={overlayRef}
        className='fixed inset-0 z-[40] hidden bg-[#0f0f0f] text-white items-center justify-center'
        style={{ pointerEvents: 'none' }}
      >
        <div className='w-full h-full flex items-center lg:pt-5 pt-10 justify-between p-4'>
          <div className='lg:w-1/2 h-full w-full flex flex-col lg:gap-0 gap-10 lg:justify-between lg:py-16 py-5'>
            <div className='flex flex-col lg:gap-4 gap-4 px-3 lg:px-8'>
              {navlink.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  ref={(el) => (linksRef.current[index] = el)}
                  className='lg:text-4xl md:text-3xl text-2xl font-medium Messina hover:text-zinc-200 hover:underline transition-all'
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              <div className='flex gap-2'>
                <Link
                  to="/signup"
                  className='lg:mb-6 mb-3 inline-block text-lg font-semibold hover:text-white hover:bg-transparent hover:border hover:transition-all hover:ease-in bg-white text-black px-6 py-3 rounded-full transition-all w-fit'
                  onClick={() => setIsOpen(false)}
                >
                  Get Started
                </Link>
                <Link
                to="/login"
                className='lg:mb-6 mb-3 inline-block text-lg font-semibold hover:text-white hover:bg-transparent hover:border hover:transition-all hover:ease-in bg-white text-black px-6 py-3 rounded-full transition-all w-fit'
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              </div>
            </div>

            <div className='lg:px-8 px-3 flex items-center gap-12'>
              <div className='flex gap-2'>
                <a href="#" className='p-2 border border-white rounded-full hover:bg-white hover:text-black transition-all'><Facebook /></a>
                <a href="#" className='p-2 border border-white rounded-full hover:bg-white hover:text-black transition-all'><Instagram /></a>
                <a href="#" className='p-2 border border-white rounded-full hover:bg-white hover:text-black transition-all'><Linkedin /></a>
                <a href="#" className='p-2 border border-white rounded-full hover:bg-white hover:text-black transition-all'><Youtube /></a>
              </div>
            </div>
          </div>

          <div className='w-1/2 h-full hidden md:flex lg:flex items-center justify-end '>
            <div className=' w-[80%] h-full'>
              <video muted autoPlay loop className='w-full h-full object-cover rounded-2xl'>
                <source src={heroAssest.herovideoOne} />
              </video>
            </div>
          </div>
        </div>
      </div>
      <div 
        ref={navbarRef}
        className='fixed z-40 flex justify-between items-center w-full px-4 h-12 lg:h-20 transition-transform  '
      >
        <div className="flex-1">
          <div className="text-xl font-bold flex items-center gap-2">
            <img src="/logo_white.png" className="w-10" alt="sf collab"/>
            SF COLLAB
            
          </div>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <button
            onClick={toggleMusic}
            className="flex items-end justify-center gap-1 h-8 hover:opacity-80 transition-opacity group"
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            <span 
              ref={el => barRefs.current[0] = el}
              className="w-1 -mt-1 bg-[#fff] h-3 origin-bottom transform transition-all group-hover:bg-zinc-900"
            />
            <span 
              ref={el => barRefs.current[1] = el}
              className="w-1 bg-[#fff] h-4 origin-bottom transform transition-all group-hover:bg-zinc-700"
            />
            <span 
              ref={el => barRefs.current[2] = el}
              className="w-1 bg-[#fff] h-2 origin-bottom transform transition-all group-hover:bg-zinc-700"
            />
            
            {!userInteracted && (
              <div className="absolute -top-1 -right-1 w-2 h-2  rounded-full animate-pulse"></div>
            )}
          </button>
        </div>

        <div className="flex-1 flex justify-end">
          <button
            onClick={toggleMenu}
            className='flex gap-2 items-center justify-center rounded-full transition-all duration-300 hover:scale-105'
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            <span className='bg-[#2A2725] p-2 rounded-full hover:bg-zinc-900 transition-colors'>
              {isOpen ? <X className='text-white size-5' /> : <Menu className='text-white size-5' />}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
