import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Linkedin, Instagram, Menu, X } from 'lucide-react';

import gsap from 'gsap';
import { heroAssest, mainsong } from './utils';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef(null);
  const linksRef = useRef([]);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const navbarRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef(null);
  const barRefs = useRef([]);
  const barTimeline = useRef(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    audioRef.current = new Audio(mainsong.mainAudio);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.preload = 'auto';

    barTimeline.current = gsap.timeline({ repeat: -1, paused: true })
      .to(barRefs.current[0], { scaleY: 2, duration: 0.4, ease: 'power2.inOut' })
      .to(barRefs.current[1], { scaleY: 1.8, duration: 0.3, ease: 'power2.inOut' }, '-=0.3')
      .to(barRefs.current[2], { scaleY: 2.2, duration: 0.5, ease: 'power2.inOut' }, '-=0.2')
      .to(barRefs.current, { scaleY: 1, duration: 0.4, stagger: 0.1, ease: 'power2.inOut' }, '+=0.2');

    return () => {
      if (audioRef.current) audioRef.current.pause();
      if (barTimeline.current) barTimeline.current.kill();
    };
  }, []);

  const toggleMusic = () => {
    if (!userInteracted) setUserInteracted(true);
    isPlaying ? handleStopMusic() : handlePlayMusic();
  };

  const handlePlayMusic = async () => {
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      barTimeline.current.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const handleStopMusic = () => {
    audioRef.current.pause();
    setIsPlaying(false);
    barTimeline.current.pause();
    gsap.to(barRefs.current, { scaleY: 1, duration: 0.3 });
  };

  useEffect(() => setUserInteracted(false), []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setShowNavbar(!(currentScroll > lastScrollY.current && currentScroll > 100));
      lastScrollY.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!overlayRef.current) return;

    if (isOpen) {
      gsap.set(overlayRef.current, { display: 'flex', pointerEvents: 'auto' });
      gsap.fromTo(overlayRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 });
      gsap.fromTo(linksRef.current, { x: -100, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.1, delay: 0.2 });

      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.4,
        onComplete: () => {
          gsap.set(overlayRef.current, { display: 'none', pointerEvents: 'none' });
        },
      });
      document.body.classList.remove('menu-open');
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
      {/* Menu Overlay */}
      <div ref={overlayRef} className='fixed inset-0 z-[40] hidden bg-[#0f0f0f] text-white items-center justify-center'>
        <div className='w-full h-full flex items-center lg:pt-5 pt-10 justify-between p-4'>

          {/* Left Menu */}
          <div className='lg:w-1/2 h-full w-full flex flex-col gap-10 lg:justify-between py-5'>
            <div className='flex flex-col gap-4 px-3 lg:px-8'>
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
                <Link to="/signup" onClick={() => setIsOpen(false)}
                  className='lg:mb-6 mb-3 text-lg font-semibold bg-white text-black px-6 py-3 rounded-full'>
                  Get Started
                </Link>
                <Link to="/login" onClick={() => setIsOpen(false)}
                  className='lg:mb-6 mb-3 text-lg font-semibold bg-white text-black px-6 py-3 rounded-full'>
                  Login
                </Link>
              </div>
            </div>

            <div className='px-3 lg:px-8 flex items-center gap-12'>
              <div className='flex gap-2'>
                <Facebook /><Instagram /><Linkedin /><Youtube />
              </div>
            </div>
          </div>

          {/* Right Video */}
          {/* Right Video */}
{/* Right Video */}
<div className="w-[65%] h-full hidden md:flex lg:flex items-center justify-end pr-10">
  <div className="relative w-full max-w-[800px] h-[450px] rounded-2xl overflow-hidden bg-black shadow-xl">
    <video
      muted
      autoPlay
      loop
      playsInline
      className="absolute inset-0 w-full h-full object-contain"
    >
      <source src={heroAssest.herovideoOne} type="video/mp4" />
    </video>
  </div>
</div>



        </div>
      </div>

      {/* Top Navbar */}
      <div ref={navbarRef} className='fixed z-40 flex justify-between items-center w-full px-4 h-12 lg:h-20'>
        <div className="text-xl font-bold flex items-center gap-2">
          <img src="/logo_white.png" className="w-10" alt="sf collab" /> SF COLLAB
        </div>

        <button onClick={toggleMusic} className="flex items-end gap-1 h-8">
          <span ref={el => barRefs.current[0] = el} className="w-1 bg-white h-3" />
          <span ref={el => barRefs.current[1] = el} className="w-1 bg-white h-4" />
          <span ref={el => barRefs.current[2] = el} className="w-1 bg-white h-2" />
        </button>

        <button onClick={toggleMenu} className='rounded-full p-2 bg-[#2A2725] hover:bg-zinc-900'>
          {isOpen ? <X className='text-white' /> : <Menu className='text-white' />}
        </button>
      </div>
    </>
  );
};

export default Navbar;
