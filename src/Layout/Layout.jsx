import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import NavBar from "../components/sections/NavBar";
import Options from "../components/sections/Options";
import FloatingChatbox from "../components/sections/ChatWidget";

import UserSidebar from "@/components/pages/sidebars/sidebar/SideBar";
import FounderSidebar from "@/components/pages/sidebars/founderSidebar/FounderSidebar";
import InfluencerSidebar from "@/components/pages/sidebars/influencerSidebar/InfluencerSidebar";
import BuilderSidebar from "@/components/pages/sidebars/builderSidebar/BuilderSidebar";
import InvestorSidebar from "@/components/pages/sidebars/investorSidebar/InvestorSidebar";

import useScrollHide from "../hooks/useScrollHide";
import { hasPermission } from "../utils/permissionCheck";
import { waitlistAPI } from "@/utils/APIs/waitlistAPI";

import useSocket from "@/components/pages/chat/useSocket";

import { toast } from "react-toastify";
import ChatWebSocketClient from "@/services/websocket/ChatWebSocketClient";
import { SOCKET_API_URL } from "@/utils/config";
//import { io } from "socket.io-client";
import useSocket from "@/components/pages/chat/useSocket"; 

import ChatWebSocketClient from "@/services/websocket/ChatWebSocketClient";
import { SOCKET_API_URL } from "@/utils/config";

import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "../components/style/Layout.css";

import OnlineFriendsSidebar from '../components/OnlineFriendsSidebar';

const Layout = ({ activeRole, setActiveRole, userRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPath = location.pathname === "/";

  const { user, access_token } = useSelector((state) => state.auth);
  const isAdmin = hasPermission(user, "admin");

  const { socket, isConnected } = useSocket(access_token);

  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [wsClient, setWsClient] = useState(null);

  const optionsRef = useRef(null);
  const navContainerRef = useRef(null);

  /* -------------------- AOS -------------------- */
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: false });
  }, []);

  /* -------------------- Waitlist Guard -------------------- */
  useEffect(() => {
    if (!user || !access_token) return;

    const checkWaitlist = async () => {
      try {
        const res = await waitlistAPI.isOnWaitlist(user.email, access_token);
        if (
          !res.on_waitlist &&
          !["/waitlist", "/waitlist-terms"].includes(location.pathname)
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


  /* -------------------- Socket.IO (Chat) -------------------- */
  useEffect(() => {
    if (!socket || !isConnected || !user) return;

    const handleConversationMessage = (data) => {
      if (data.message.sender.id === user.id) return;
      if (location.pathname.startsWith("/chat")) return;

      toast.info(
        <>
          <p className="font-semibold">
            {data.message.sender.firstName} {data.message.sender.lastName}
          </p>
          <p className="text-sm opacity-80 truncate">
            {data.message.content}
          </p>
        </>,
        { onClick: () => navigate("/chat") }
      );
    };

    socket.on("conversation_message", handleConversationMessage);
    return () =>
      socket.off("conversation_message", handleConversationMessage);
  }, [socket, isConnected, user, location.pathname, navigate]);

  /* -------------------- Raw WebSocket Client -------------------- */
  useEffect(() => {
    if (!user?.id || wsClient) return;

    const client = new ChatWebSocketClient(SOCKET_API_URL, user.id);

    client.on("new_message", () => toast.info("New message received"));
    client.on("user_online", (d) =>
      toast.success(`${d.user_name || "User"} is online`)
    );
    client.on("user_offline", (d) =>
      toast.info(`${d.user_name || "User"} went offline`)
    );
    client.on("error", () => toast.error("Realtime connection error"));

    client.connect();
    setWsClient(client);

    return () => client.disconnect();
  }, [user?.id, wsClient]);

  const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Left sidebar (if you have one) */}
      
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Right sidebar - Online Friends */}
      <OnlineFriendsSidebar className="hidden lg:flex" />
    </div>
  );
};

const UserProfile = ({ userId }) => {
  return (
    <div className="profile-header">
      <h1>John Doe</h1>
      
      {/* Add friend button */}
      <FriendRequestButton 
        userId={userId}
        showMessage={true}
        variant="default"
      />
    </div>
  );
};

  /* -------------------- Sidebar Resolver -------------------- */
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

  return (
    <div className="relative min-h-screen h-screen w-screen overflow-hidden flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
        }}
      />

      {/* Top Nav */}
      {!isRootPath && (
        <div
          ref={navContainerRef}
          onMouseEnter={() => setIsOptionsVisible(true)}
          onMouseLeave={() => setIsOptionsVisible(false)}
          className={`transition-all ${
            isNavHidden ? "h-0" : "h-[60px]"
          } overflow-hidden`}
        >
          <NavBar
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

      <div className="flex flex-1 overflow-hidden">
        {!isRootPath && <SideBar />}

        <div className="relative w-full flex flex-col overflow-hidden">
          {!isRootPath &&
            ["refer", "waitlist"].includes(location.pathname) && (
              <div
                ref={optionsRef}
                className={`absolute top-0 w-full flex justify-center transition ${
                  isOptionsVisible ? "opacity-100" : "opacity-30"
                }`}
              >
                <Options
                  unreadMessagesCount={unreadMessagesCount}
                  isAdmin={isAdmin}
                />
              </div>
            )}

          <div
            className="relative w-full h-full overflow-y-auto scrollbar-hide"
            onScroll={!isRootPath ? onScroll : undefined}
          >
            <Outlet />
          </div>

          {!isRootPath && <FloatingChatbox />}
        </div>
      </div>
    </div>
  );
};

export default Layout;
