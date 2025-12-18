// import React, { useState, useRef, useEffect } from "react";
// import { Outlet, useLocation } from "react-router-dom";
// import NavBar from "../components/sections/NavBar";
// import SideBar from "../components/sections/SideBar";
// import MobileNavBar from "../components/sections/MobileNavBar";
// import Options from "../components/sections/Options";
// import useScrollHide from "../hooks/useScrollHide";
// import FloatingChatbox from "../components/sections/ChatWidget";
// import AOS from 'aos';
// import 'aos/dist/aos.css'; 
// import '../components/style/Layout.css';

// import GlassmorphismFeedbackCard from '../components/sections/CompactFeedbackCard';
// import { useSelector } from "react-redux";
// import { motion } from "framer-motion";

// const Layout = () => {
//   const location = useLocation();
//   const isRootPath = location.pathname === "/";
  
//   const { isHidden: isNavHidden, onScroll } = useScrollHide({
//     deltaThreshold: 4,
//     topReveal: 10,
//   });
  
//   const {user,access_token,refreshToken} = useSelector((state) => state.auth);
  
//   const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  
//   const [isOptionsVisible, setIsOptionsVisible] = useState(false);
//   const optionsRef = useRef(null);
//   const navContainerRef = useRef(null);

//   const [isOpen, setIsOpen] = useState(false);

//   // Handle mouse enter for the entire nav area
//   const handleNavAreaEnter = () => {
//     if (!isRootPath) {
//       setIsOptionsVisible(true);
//     }
//   };
  
//   useEffect(() => {
//     if (user) {
//       setUnreadMessagesCount(
//         user?.relationships?.unread_count||0
//       );
//     }
//   }, [user]);
  
//   useEffect(() => {
//     AOS.init({
//       duration: 800,       
//       easing: "ease-out",  
//       once: false,         
//       mirror: false        
//     });
//   }, []);
  
//   useEffect(()=>{
//     if (!isRootPath) {
//       setIsOptionsVisible(true);
//       setTimeout(()=>{
//         setIsOptionsVisible(false);
//       },1000);
//     }
//   },[]);
  
//   // Handle mouse leave with proper event delegation
//   const handleNavAreaLeave = (e) => {
//     if (isRootPath) return;
    
//     // Safety check: relatedTarget might be null
//     if (!e.relatedTarget) {
//       setIsOptionsVisible(false);
//       return;
//     }
  
//     // Check if we're moving to the options element
//     if (
//       optionsRef.current && 
//       optionsRef.current.contains(e.relatedTarget)
//     ) {
//       return; // Don't hide if moving to options
//     }
    
//     // Also check if we're moving to a child of options
//     const isMovingToOptions = e.relatedTarget.closest('.options-container');
//     if (isMovingToOptions) {
//       return;
//     }
    
//     setIsOptionsVisible(false);
//   };

//   // Handle options area specifically
//   const handleOptionsEnter = () => {
//     if (!isRootPath) {
//       setIsOptionsVisible(true);
//     }
//   };

//   const handleOptionsLeave = (e) => {
//     if (isRootPath) return;
    
//     // Check if we're moving back to the nav area
//     if (navContainerRef.current && navContainerRef.current.contains(e.relatedTarget)) {
//       return; // Don't hide if moving back to nav
//     }
//     setIsOptionsVisible(false);
//   };
  
//   return (
//     <div className="relative min-h-screen h-screen w-screen overflow-hidden flex flex-col">
//       {/* Dark Horizon Glow */}
//       <div
//         className="absolute inset-0 z-0"
//         style={{
//           background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
//         }}
//       />

//       {/* Collapsible Top Nav Container - Hidden on root path */}
//       {!isRootPath && (
//         <div
//           ref={navContainerRef}
//           onMouseEnter={handleNavAreaEnter}
//           onMouseLeave={handleNavAreaLeave}
//           className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out ${
//             isNavHidden ? "h-0" : "h-[60px]"
//           } lg:h-[60px]`}
//         >
//           <NavBar setIsOpen={setIsOpen} isOpen={isOpen} isHidden={isNavHidden} />
//         </div>
//       )}

//       <div className="relative flex-1 w-full flex overflow-hidden">
//         {/* Desktop Sidebar - Hidden on root path and mobile */}
//         {!isRootPath && (
//           <div className="hidden sm:block">
//             <SideBar unreadMessagesCount={unreadMessagesCount} setIsOpen={setIsOpen} isOpen={isOpen} />
//           </div>
//         )}
        
//         {/* Main Content Area */}
//         <div className="text-white relative flex flex-col w-full max-sm:px-4 max-sm:py-0 overflow-hidden pb-16 sm:pb-0">
//           {/* Options Panel - Hidden on root path */}
//           {!isRootPath && (
//             <div
//               ref={optionsRef}
//               onMouseEnter={handleOptionsEnter}
//               onMouseLeave={handleOptionsLeave}
//               className={`transition-all duration-300 px-4 absolute z-50 w-full flex justify-center top-0 ${
//                 isOptionsVisible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-25"
//               }`}
//               style={{ zIndex: 99999999 }}
//             >
//               <Options isHidden={isNavHidden} unreadMessagesCount={unreadMessagesCount} />
//             </div>
//           )}
          
//           <div
//             className={`relative w-full h-full ${
//               !isRootPath ? "pt-3.5 max-sm:pb-16" : ""
//             } overflow-y-auto scrollbar-hide scroll-smooth overflow-x-hidden`}
//             onScroll={isRootPath ? undefined : onScroll}
//           >
//             <Outlet />
//           </div>
          
//           {
//             !isRootPath &&(
//             <>
//               <FloatingChatbox />
//               <GlassmorphismFeedbackCard />
//             </>
//             )
//           }
//         </div>
//       </div>

//       {/* Mobile Navigation Bar - Only visible on mobile and hidden on root path */}
//       {!isRootPath && <MobileNavBar isHidden={isNavHidden} />}
//     </div>
//   );
// };

// export default Layout;



// Layout.jsx (updated)
import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom"; // Added Link import
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
import { hasPermission } from "../utils/permissionCheck"; // Import permission check utility

const Layout = () => {
  const location = useLocation();
  const isRootPath = location.pathname === "/";
  
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

  // Check if user has admin permission
  const isAdmin = hasPermission(user, 'admin');

  // Handle mouse enter for the entire nav area
  const handleNavAreaEnter = () => {
    if (!isRootPath) {
      setIsOptionsVisible(true);
    }
  };
  
  useEffect(() => {
    if (user) {
      setUnreadMessagesCount(
        user?.relationships?.unread_count||0
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
    if (!isRootPath) {
      setIsOptionsVisible(true);
      setTimeout(()=>{
        setIsOptionsVisible(false);
      },1000);
    }
  },[]);
  
  // Handle mouse leave with proper event delegation
  const handleNavAreaLeave = (e) => {
    if (isRootPath) return;
    
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
    if (!isRootPath) {
      setIsOptionsVisible(true);
    }
  };

  const handleOptionsLeave = (e) => {
    if (isRootPath) return;
    
    // Check if we're moving back to the nav area
    if (navContainerRef.current && navContainerRef.current.contains(e.relatedTarget)) {
      return; // Don't hide if moving back to nav
    }
    setIsOptionsVisible(false);
  };
  
  return (
    <div className="relative min-h-screen h-screen w-screen overflow-hidden flex flex-col">
      {/* Dark Horizon Glow */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      {/* Collapsible Top Nav Container - Hidden on root path */}
      {!isRootPath && (
        <div
          ref={navContainerRef}
          onMouseEnter={handleNavAreaEnter}
          onMouseLeave={handleNavAreaLeave}
          className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isNavHidden ? "h-0" : "h-[60px]"
          } lg:h-[60px]`}
        >
          {/* Pass isAdmin prop to NavBar */}
          <NavBar 
            setIsOpen={setIsOpen} 
            isOpen={isOpen} 
            isHidden={isNavHidden}
            isAdmin={isAdmin} 
          />
        </div>
      )}

      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Desktop Sidebar - Hidden on root path and mobile */}
        {!isRootPath && (
          <div className="hidden sm:block">
            {/* Pass isAdmin prop to SideBar */}
            <SideBar 
              unreadMessagesCount={unreadMessagesCount} 
              setIsOpen={setIsOpen} 
              isOpen={isOpen}
              isAdmin={isAdmin} 
            />
          </div>
        )}
        
        {/* Main Content Area */}
        <div className="text-white relative flex flex-col w-full max-sm:px-4 max-sm:py-0 overflow-hidden pb-16 sm:pb-0">
          {/* Options Panel - Hidden on root path */}
          {!isRootPath && (
            <div
              ref={optionsRef}
              onMouseEnter={handleOptionsEnter}
              onMouseLeave={handleOptionsLeave}
              className={`transition-all duration-300 px-4 absolute z-50 w-full flex justify-center top-0 ${
                isOptionsVisible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-25"
              }`}
              style={{ zIndex: 99999999 }}
            >
              <Options 
                isHidden={isNavHidden} 
                unreadMessagesCount={unreadMessagesCount}
                isAdmin={isAdmin} // Pass admin status to Options
              />
            </div>
          )}
          
          <div
            className={`relative w-full h-full ${
              !isRootPath ? "pt-3.5 max-sm:pb-16" : ""
            } overflow-y-auto scrollbar-hide scroll-smooth overflow-x-hidden`}
            onScroll={isRootPath ? undefined : onScroll}
          >
            <Outlet />
          </div>
          
          {
            !isRootPath &&(
            <>
              <FloatingChatbox />
              <GlassmorphismFeedbackCard />
            </>
            )
          }
        </div>
      </div>

      {/* Mobile Navigation Bar - Only visible on mobile and hidden on root path */}
      {!isRootPath && <MobileNavBar isHidden={isNavHidden} isAdmin={isAdmin} />}
    </div>
  );
};

export default Layout;