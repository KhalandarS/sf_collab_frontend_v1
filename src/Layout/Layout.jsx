import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/sections/NavBar";
import SideBar from "../components/sections/SideBar";
import MobileNavBar from "../components/sections/MobileNavBar";
import Options from "../components/sections/Options";
import useScrollHide from "../hooks/useScrollHide";
import FloatingChatbox from "../components/sections/ChatWidget";
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import '../components/style/Layout.css';

import GlassmorphismFeedbackCard from '../components/sections/CompactFeedbackCard';
import { useSelector } from "react-redux";
import { motion } from "framer-motion";




const Layout = () => {
  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });
  
  const {user,access_token,refreshToken} = useSelector((state) => state.auth);
  
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const optionsRef = useRef(null);
  const navContainerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  // Handle mouse enter for the entire nav area
  const handleNavAreaEnter = () => {
    setIsOptionsVisible(true);
  };
  
  useEffect(() => {
    if (user) {
      setUnreadMessagesCount(
        user.relationships.conversations.reduce(
          (acc, conv) => acc + conv.unread_count,
          0
        )
      );
    }
  }, [user]);
  
  useEffect(() => {
    AOS.init({
      duration: 800,       
      easing: "ease-out",  
      once: false,         
      mirror: false        
    });
  }, []);
  
  useEffect(()=>{
    setIsOptionsVisible(true);
    
    setTimeout(()=>{
      setIsOptionsVisible(false);
    },1000);
    
    
  },[]);
  
  // Handle mouse leave with proper event delegation
  const handleNavAreaLeave = (e) => {
    // Safety check: relatedTarget might be null
    if (!e.relatedTarget) {
      setIsOptionsVisible(false);
      return;
    }
  
    // Check if we're moving to the options element
    if (
      optionsRef.current && 
      optionsRef.current.contains(e.relatedTarget)
    ) {
      return; // Don't hide if moving to options
    }
    
    // Also check if we're moving to a child of options
    const isMovingToOptions = e.relatedTarget.closest('.options-container');
    if (isMovingToOptions) {
      return;
    }
    
    setIsOptionsVisible(false);
  };

  // Handle options area specifically
  const handleOptionsEnter = () => {
    setIsOptionsVisible(true);
  };

  const handleOptionsLeave = (e) => {
    // Check if we're moving back to the nav area
    if (navContainerRef.current && navContainerRef.current.contains(e.relatedTarget)) {
      return; // Don't hide if moving back to nav
    }
    setIsOptionsVisible(false);
  };
  
  

  return (
    <div  className="relative min-h-screen h-screen w-screen overflow-hidden flex flex-col">
      {/* Dark Horizon Glow*/}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />


  {/* Radial Gradient Background from Top */}
  {/* <div
    className="absolute inset-0 z-0"
    style={{
      background: "radial-gradient(125% 125% at 50% 10%, #fff 40%, #475569 100%)",
    }}
  /> */}
  


        {/* Animated Background */}
        {/* <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
          <div className="absolute top-1/4 bottom-5 left-20 w-72 h-72 bg-blue-500/12 rounded-full blur-3xl animate-ping" style={{ animationDelay: '10s',animationDuration:'20s' }}/>
          <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/12 rounded-full blur-3xl animate-ping" style={{ animationDelay: '10s',animationDuration:'20s' }} />
        </div> */}
        
      {/* Collapsible Top Nav Container */}
      <div
        ref={navContainerRef}
        onMouseEnter={handleNavAreaEnter}
        onMouseLeave={handleNavAreaLeave}
        className={`w-full  overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isNavHidden ? "h-0" : "h-[60px]"
        } lg:h-[60px]`}
      >
        <NavBar setIsOpen={setIsOpen} isOpen={isOpen} isHidden={isNavHidden} />
      </div>

      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden sm:block">
          <SideBar unreadMessagesCount={unreadMessagesCount} setIsOpen={setIsOpen} isOpen={isOpen} />
        </div>
        
        {/* Main Content Area */}
        <div  className="text-white relative flex flex-col w-full max-sm:px-4 max-sm:py-0 overflow-hidden pb-16 sm:pb-0">
          {/* Options Panel */}
          <div
            ref={optionsRef}
            onMouseEnter={handleOptionsEnter}
            onMouseLeave={handleOptionsLeave}
            className={`transition-all duration-300 px-4  absolute z-50 w-full flex justify-center top-0 ${
              isOptionsVisible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-25"
            }`}
            style={{ zIndex: 99999999 }}
          >
            <Options isHidden={isNavHidden} unreadMessagesCount={unreadMessagesCount} />
          </div>
          
          <div
            className="relative w-full h-full pt-3.5 max-sm:pb-16 overflow-y-auto scrollbar-hide scroll-smooth overflow-x-hidden"
            onScroll={onScroll}
          >
            <Outlet />
          </div>
          

          <FloatingChatbox />
          <GlassmorphismFeedbackCard />
          

          
        </div>
      </div>

      {/* Mobile Navigation Bar - Only visible on mobile */}
      <MobileNavBar isHidden={isNavHidden} />
    </div>
  );
};

export default Layout;