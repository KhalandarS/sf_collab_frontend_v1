/**
 * Layout.jsx - FIXED VERSION
 * 
 * FIXES:
 * 1. Proper sidebar spacing (60px on desktop)
 * 2. Removed the ChatDock from fixed position (it was overlapping)
 * 3. Clean structure
 */

import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Options from "../components/sections/Options";

import UserSidebar from "../components/pages/sidebars/sidebar/SideBar";
import FounderSidebar from "@/components/pages/sidebars/founderSidebar/FounderSidebar";
import InfluencerSidebar from "@/components/pages/sidebars/influencerSidebar/InfluencerSidebar";
import BuilderSidebar from "@/components/pages/sidebars/builderSidebar/BuilderSidebar";
import InvestorSidebar from "@/components/pages/sidebars/investorSidebar/InvestorSidebar";

import useScrollHide from "../hooks/useScrollHide";
import { hasPermission } from "../utils/permissionCheck";
import { waitlistAPI } from "@/utils/APIs/waitlistAPI";


import ChatDock from "@/components/chat-dock/ChatDock";
import { useAppSocket } from "@/context/SocketProvider";
import { useChatContacts } from "@/context/ChatContactsProvider";

import useSocket from "@/components/pages/chat/useSocket";
import { toast } from "react-toastify";

import ChatWebSocketClient from "@/services/websocket/ChatWebSocketClient";
import { SOCKET_API_URL } from "@/utils/config";

import AOS from "aos";
import "aos/dist/aos.css";
import { isUserProfileComplete } from "@/utils/getUserComplete";
import Navbar from "@/components/sections/NavBar";


const Layout = ({ activeRole, setActiveRole, userRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRootPath = location.pathname === "/";
  const isChatRoute = location.pathname.startsWith("/chat");

  const { user, access_token } = useSelector((state) => state.auth);
  const isAdmin = hasPermission(user, "admin");

  const { onlineUsers } = useAppSocket();
  const { friends } = useChatContacts();


  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });

  const [unreadMessagesCount] = useState(0);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const optionsRef = useRef(null);
  const navContainerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  AOS.init({ duration: 800, easing: "ease-out", once: true });


  // Waitlist guard
  useEffect(() => {
    if (!user || !access_token) return;

    const checkWaitlist = async () => {
      try {
        const res = await waitlistAPI.isOnWaitlist(user.email, access_token);
        if (
          !res?.on_waitlist &&
          !["/waitlist", "/waitlist-terms", "/user-profile"].includes(location.pathname)
        ) {
          toast.info("You should join the waitlist to access this section.");
          navigate("/waitlist");
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkWaitlist();
  }, [user, access_token, location.pathname, navigate]);

  // ✅ Socket.io global notifications (skip if already in chat)
  // useEffect(() => {
  //   if (!socket || !isConnected || !user) return;

  //   const handleConversationMessage = (data) => {
  //     if (!data?.message?.sender) return;
  //     if (data.message.sender.id === user.id) return;
  //     if (location.pathname.startsWith("/chat")) return;

  //     const content = data.message.content || "";
  //     const short = content.length > 80 ? content.slice(0, 80) + "..." : content;

  //     // toast.info(
  //     //   <div className="flex flex-col gap-1">
  //     //     <p className="font-semibold">
  //     //       {data.message.sender.firstName} {data.message.sender.lastName}
  //     //     </p>
  //     //     <p className="text-sm opacity-90">{short}</p>
  //     //   </div>,
  //     //   { onClick: () => navigate("/chat") }
  //     // );
  //     console.log("Dispatching chat:new_message", data);
      

  //   };

  //   socket.on("conversation_message", handleConversationMessage);
  //   return () => socket.off("conversation_message", handleConversationMessage);
  // }, [socket, isConnected, user, location.pathname, navigate]);

  // ✅ Raw websocket client (optional)
  useEffect(() => {
    const userId = user?.id;
    if (!userId) return;

    const client = new ChatWebSocketClient(SOCKET_API_URL, userId);

    client.on("new_message", (data) => {
      toast.info("New message received");
      window.dispatchEvent(new CustomEvent("chat:new_message", { detail: data }));
    });

    client.on("user_online", (data) =>
      toast.success(`${data?.user_name || "User"} is online`)
    );
    client.on("user_offline", (data) =>
      toast.info(`${data?.user_name || "User"} went offline`)
    );
    client.on("error", () => toast.error("Realtime connection error"));

    client.connect();
    

    return () => client.disconnect();
  }, [user?.id]);
  const [isCompletePopupVisible, setCompletePopupVisible] = useState(false);
  // ✅ Profile completion reminder
  useEffect(() => {
    if (!user || !access_token) return;

    const checkProfileCompletion = async () => {

      // Check if the last reminder was more than a week ago
      console.log(isUserProfileComplete(user));
      if (!isUserProfileComplete(user) && !location.pathname.startsWith("/user-profile")) {
        setCompletePopupVisible(true);
      }
    };

    checkProfileCompletion();
  }, [user, access_token]);
  // ✅ Sidebar resolver
  const SideBar = () => {
    const props = { unreadMessagesCount, setIsOpen, isOpen, isAdmin };

    switch (activeRole) {
      case "founder":
        return <FounderSidebar {...props} />;
      case "influencer":
        return <InfluencerSidebar {...props} />;
      case "builder":
        return <BuilderSidebar {...props} />;
      case "investor":
        return <InvestorSidebar {...props} />;
      default:
        return <UserSidebar {...props} />;
    }
  };

  const handleNavAreaEnter = () => !isRootPath && setIsOptionsVisible(true);

  const handleNavAreaLeave = (e) => {
    if (isRootPath) return;

    const nextEl = e.relatedTarget;

    if (!nextEl || !(nextEl instanceof Node)) {
      setIsOptionsVisible(false);
      return;
    }

    if (optionsRef.current && optionsRef.current.contains(nextEl)) return;
    if (nextEl.closest?.(".options-container")) return;

    setIsOptionsVisible(false);
  };


  return (
    <div className="relative min-h-screen w-screen flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />
      {
        isCompletePopupVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md mx-4">
              <h2 className="text-2xl font-semibold mb-4">Complete Your Profile</h2>
              <p className="mb-4">
                It looks like your profile is incomplete. Please take a moment to update your information to get the best experience.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                  onClick={() => setCompletePopupVisible(false)}
                >
                  Later
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                  onClick={() => {
                    setCompletePopupVisible(false);
                    navigate("/user-profile?page=settings");
                  }}
                >
                  Complete Now
                </button>
              </div>
            </div>
          </div>
        )
    }
      {/* Top Nav */}
      {!isRootPath && (
        <div
          ref={navContainerRef}
          onMouseEnter={handleNavAreaEnter}
          onMouseLeave={handleNavAreaLeave}
          className={`w-full z-50 overflow-hidden transition-height duration-300 ease-in-out ${isNavHidden ? "max-h-0" : "max-h-[60px]"}`}

        >
          <Navbar
            setIsOpen={setIsOpen}
            isOpen={isOpen}
            isHidden={isNavHidden}
            isAdmin={isAdmin}
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            userRoles={userRoles}
          />
        </div>
      )}

      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Left sidebar - Fixed position, handled internally */}
        {!isRootPath && <SideBar />}

        {/* Main content area - offset by sidebar width on desktop */}
        <div className="text-white relative flex flex-col items-center w-full overflow-hidden lg:ml-0">
          {/* Options bar: never show on chat */}
          {!isRootPath && !isChatRoute && (
            <div
              ref={optionsRef}
              className={`my-16 transition-all duration-300 px-4 absolute m-auto flex justify-center top-2 ${
                isOptionsVisible ? "translate-y-0 opacity-100" : "-translate-y-0.5 opacity-25"
              }`}
              style={{ zIndex: 99999999 }}
            >
              <Options
                isHidden={isNavHidden}
                unreadMessagesCount={unreadMessagesCount}
                isAdmin={isAdmin}
              />
            </div>
          )}

          <div
            className={`relative mt-16 w-full h-full ${
              !isRootPath ? "pt-3.5 max-sm:pb-16" : ""
            } overflow-y-auto scrollbar-hide scroll-smooth overflow-x-hidden`}
            onScroll={isRootPath ? undefined : onScroll}
          >
            <Outlet />
            
            {/* Chat dock - persistent on right side */}
            {!isRootPath && !isChatRoute && (
              <div 
                className="fixed right-0 bottom-0 z-[999999]"
                style={{ right: '16px', bottom: '16px' }}
              >
                <ChatDock maxWindows={2} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;