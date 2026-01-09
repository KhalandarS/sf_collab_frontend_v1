import React, { useState, useRef, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import NavBar from "../components/sections/NavBar";
import Options from "../components/sections/Options";

import UserSidebar from "../components/pages/sidebars/sidebar/SideBar";
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

import AOS from "aos";
import "aos/dist/aos.css";
import { isUserProfileComplete } from "@/utils/getUserComplete";

const Layout = ({ activeRole, setActiveRole, userRoles }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isRootPath = location.pathname === "/";
  const isChatRoute = location.pathname.startsWith("/chat");

  const { user, access_token } = useSelector((state) => state.auth);
  const isAdmin = hasPermission(user, "admin");

  const { socket, isConnected } = useSocket(access_token);

  const { isHidden: isNavHidden, onScroll } = useScrollHide({
    deltaThreshold: 4,
    topReveal: 10,
  });

  const [unreadMessagesCount] = useState(0);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const optionsRef = useRef(null);
  const navContainerRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [wsClient, setWsClient] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: false });
  }, []);

  // ✅ Waitlist guard
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
    if (!userId || wsClient) return;

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
    setWsClient(client);

    return () => client.disconnect();
  }, [user?.id, wsClient]);
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
    if (!e.relatedTarget) return setIsOptionsVisible(false);
    if (optionsRef.current?.contains(e.relatedTarget)) return;
    if (e.relatedTarget.closest?.(".options-container")) return;
    setIsOptionsVisible(false);
  };
  useEffect(() => {
    const handler = (event) => {
      console.log("Received chat:new_message", event.detail);
    };

    window.addEventListener("chat:new_message", handler);

    return () => {
      window.removeEventListener("chat:new_message", handler);
    };
  }, []);

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
          className={`w-full overflow-hidden transition-[max-height] duration-300 ease-in-out ${
            isNavHidden ? "h-0" : "h-[60px]"
          }`}
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

      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Left sidebar */}
        {!isRootPath && <SideBar />}

        {/* Main */}
        <div className="text-white relative flex flex-col items-center w-full overflow-hidden">
          {/* ✅ Options bar: never show on chat */}
          {!isRootPath && !isChatRoute && (
            <div
              ref={optionsRef}
              className={`transition-all duration-300 px-4 absolute m-auto flex justify-center top-2 ${
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
            className={`relative w-full h-full ${
              !isRootPath ? "pt-3.5 max-sm:pb-16" : ""
            } overflow-y-auto scrollbar-hide scroll-smooth overflow-x-hidden`}
            onScroll={isRootPath ? undefined : onScroll}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
