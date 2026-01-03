import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom"; // Added Link import
import NavBar from "../components/sections/NavBar";
import SideBar from "../components/sections/sidebar/SideBar";
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
import { useActivityHeartbeat } from "./useActivityHearbeat";
import { waitlistAPI } from "@/utils/APIs/waitlistAPI";
import { toast } from "react-toastify";
import ChatWebSocketClient from "@/services/websocket/ChatWebSocketClient";
import { SOCKET_API_URL } from "@/utils/config";
import { io } from "socket.io-client";
import useSocket from "@/components/pages/chat/useSocket";

const Layout = () => {
  const location = useLocation();

  const isRootPath = location.pathname === "/";
  
  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });
  const navigate = useNavigate();
const { user, access_token } = useSelector((state) => state.auth);
const { socket, isConnected } = useSocket(access_token);

useEffect(() => {
  if (!socket || !isConnected) return;

  // 🔔 Global message notification
  const handleConversationMessage = (data) => {
    console.log('Global message:', data);
    if (data.message.sender.id === user.id) return; // Ignore own messages
    if (window.location.pathname.startsWith('/chat')) return; // Ignore if already in chat
    const truncateContent = (content, maxLength = 80) => {
      return content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
    };

    toast.info(
      <div className="flex flex-col gap-1">
      <p className="font-semibold">{data.message.sender.firstName} {data.message.sender.lastName}</p>
      <p className="text-sm opacity-90">{truncateContent(data.message.content)}</p>
      </div>,
      {
        onClick: () => {
          navigate(`/chat`);
        }
      }
    );

    // Optional:
    // dispatch(fetchConversations());
    // dispatch(incrementUnread(data.conversation_id));
  };

  // 👥 Added to a team chat
  const handleAddedToTeamChat = (data) => {
    toast.success(`You have been added to the team chat: ${data.conversation_name}`);

    // Optional:
    // dispatch(fetchConversations());
  };

  socket.on('conversation_message', handleConversationMessage);
  socket.on('added_to_team_chat', handleAddedToTeamChat);

  return () => {
    socket.off('conversation_message', handleConversationMessage);
    socket.off('added_to_team_chat', handleAddedToTeamChat);
  };
}, [socket, isConnected]);


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
    AOS.init({
      duration: 800,       
      easing: "ease-out",  
      once: false,         
      mirror: false        
    });
  }, []);
  // useActivityHeartbeat(user, access_token);
  useEffect(()=>{
    if (!isRootPath) {
      setIsOptionsVisible(true);
      setTimeout(()=>{
        setIsOptionsVisible(false);
      },1000);
    }
  },[isRootPath]);
  useEffect(() => {
    async function fetchIsOnWaitlist() {
      if (user && access_token) {
        try {
          const result = await waitlistAPI.isOnWaitlist(user.email, access_token)
          if (!result.on_waitlist && window.location.pathname !== '/waitlist' && window.location.pathname !== '/waitlist-terms') {
            toast.info('You should join the waitlist to access this section.');
            navigate('/waitlist');
          }
        } catch (error) {
          console.error("Error fetching waitlist status:", error);
        }
      }
    }
  fetchIsOnWaitlist();
  }, [user, access_token, navigate]);
    const [wsClient, setWsClient] = useState(null);
  useEffect(() => {
  const userId = user?.id;
  if (!userId || wsClient) return;

  const client = new ChatWebSocketClient(SOCKET_API_URL, userId);

  client.on('new_message', (data) => {
    // 🔔 Always toast
    toast.info(`New message received`);

    // 📣 Dispatch global event
    window.dispatchEvent(
      new CustomEvent('chat:new_message', { detail: data })
    );
  });

  client.on('user_online', (data) => {
    toast.success(`${data.user_name || 'User'} is online`);
  });

  client.on('user_offline', (data) => {
    toast.info(`${data.user_name || 'User'} went offline`);
  });

  client.on('error', () => {
    toast.error('Realtime connection error');
  });

  client.connect();
  setWsClient(client);

  return () => client.disconnect();
}, [user?.id, wsClient]);

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
          <div className="block">
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
        <div className="text-white relative flex flex-col items-center w-full max-sm:px-4 max-sm:py-0 overflow-hidden pb-16 sm:pb-0">
          {/* Options Panel - Hidden on root path */}
          {!isRootPath && ["refer", "waitlist"].includes(location.pathname) && (
            <div
              ref={optionsRef}
              onMouseEnter={handleOptionsEnter}
              onMouseLeave={handleOptionsLeave}
              className={`transition-all duration-300 px-4 absolute z-50  m-auto flex justify-center top-0 ${
                isOptionsVisible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-25"
              }`}
              style={{ zIndex: 99999999 }}
            >
              <Options 
                isHidden={() => {
                  return isNavHidden;
                }}
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
              {/* <GlassmorphismFeedbackCard /> */}
            </>
            )
          }
        </div>
      </div>

      {/* Mobile Navigation Bar - Only visible on mobile and hidden on root path */}
      {/* {!isRootPath && <MobileNavBar isHidden={isNavHidden} isAdmin={isAdmin} />} */}
    </div>
  );
};

export default Layout;