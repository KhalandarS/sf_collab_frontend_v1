import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../components/sections/NavBar";
import SideBar from "../components/sections/SideBar";
import MobileNavBar from "../components/sections/MobileNavBar";
import Options from "../components/sections/Options";
import useScrollHide from "../hooks/useScrollHide";
import FloatingChatbox from "../components/sections/ChatWidget";

const Layout = () => {
  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });
  
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const optionsRef = useRef(null);
  const navContainerRef = useRef(null);

  // Handle mouse enter for the entire nav area
  const handleNavAreaEnter = () => {
    setIsOptionsVisible(true);
  };
  
  useEffect(()=>{
    setIsOptionsVisible(true);
    
    setTimeout(()=>{
      setIsOptionsVisible(false);
    },1000);
  },[]);
  
  // Handle mouse leave with proper event delegation
  const handleNavAreaLeave = (e) => {
    // Check if we're moving to the options element
    if (optionsRef.current && optionsRef.current.contains(e.relatedTarget)) {
      return; // Don't hide if moving to options
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
    <div className="relative h-screen w-screen overflow-hidden flex flex-col">
      {/* Dark Horizon Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      {/* Collapsible Top Nav Container */}
      <div
        ref={navContainerRef}
        onMouseEnter={handleNavAreaEnter}
        onMouseLeave={handleNavAreaLeave}
        className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isNavHidden ? "h-0" : "h-[60px]"
        } lg:h-[60px]`}
      >
        <NavBar isHidden={isNavHidden} />
      </div>

      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden sm:block">
          <SideBar />
        </div>
        
        {/* Main Content Area */}
        <div className="text-white relative flex flex-col w-full max-sm:px-4 max-sm:py-0 overflow-hidden pb-16 sm:pb-0">
          {/* Options Panel */}
          <div
            ref={optionsRef}
            onMouseEnter={handleOptionsEnter}
            onMouseLeave={handleOptionsLeave}
            className={`transition-all duration-300 px-4 bg-gray-400/8 backdrop-blur-sm p-3 rounded-b-2xl absolute z-50 left-1/3 top-0 ${
              isOptionsVisible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-25"
            }`}
            style={{ zIndex: 9999 }}
          >
            <Options isHidden={isNavHidden} />
          </div>
          
          <div
            className="relative w-full h-full pt-3.5 max-sm:pb-16 overflow-y-auto overflow-x-hidden"
            onScroll={onScroll}
          >
            <Outlet />
          </div>
          
          <FloatingChatbox />
        </div>
      </div>

      {/* Mobile Navigation Bar - Only visible on mobile */}
      <MobileNavBar isHidden={isNavHidden} />
    </div>
  );
};

export default Layout;