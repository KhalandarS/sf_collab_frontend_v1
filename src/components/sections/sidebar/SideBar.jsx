import {
  HelpCircle,
  X,
  Crown,
  Settings2
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip"; 
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import 'tippy.js/dist/tippy.css';
import SideBarLink from "./sideBarLink";
import SideBarFeaturesGroup from "./SideBarFeaturesGroup";
import { createLinks } from "./links";
import FloatingChatbox from "../ChatWidget";
import CompactFeedbackCard from "../CompactFeedbackCard";
import SidebarFeedbackCard from "../SidebarFeedbackCard";

const SideBar = ({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) => {
  const location = useLocation();
  const [links, setLinks] = useState(createLinks(unreadMessagesCount));
  useEffect(() => setLinks(createLinks(unreadMessagesCount)), [unreadMessagesCount]);

  // Helper to close sidebar on mobile when a link is clicked
  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto" style={{ zIndex: 9999999999 }}>
      {/* top links */}
      <div className="flex flex-col gap-4 items-center">
        {/* general links */}
        <div className="flex flex-col gap-4 items-center" style={{ zIndex: 9999999999 }}>
          {links.map((link, idx) => (
            link.label.startsWith('Other') ? (
              <SideBarFeaturesGroup key={idx} link={link} onClick={onLinkClick} />
            ) : (
              <SideBarLink key={idx} link={link} onClick={onLinkClick} />
            )
          ))}
          {
            isAdmin && (
              <AdminLink onClick={onLinkClick} />
            )
          }
        </div>
      </div>

      {/* bottom links */}
      <div className="flex flex-col gap-2 items-center" style={{ zIndex: 9999999999 }}>
        <div className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors
            `}>
          <SidebarFeedbackCard />
        </div>
        {/* <Link
          to="/help"
          className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${location.pathname === "/help"
            ? "bg-[#2A2A2A] text-white"
            : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
            }`}
          onClick={onLinkClick}
          style={{ zIndex: 9999999999 }}
        >
          <div className="flex items-center justify-center">
            <Settings2 size={20} />
          </div>
        </Link> */}
        <Link
          to="/help"
          className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${location.pathname === "/help"
            ? "bg-[#2A2A2A] text-white"
            : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
            }`}
          onClick={onLinkClick}
          style={{ zIndex: 9999999999 }}
        >
          <div className="flex items-center justify-center">
            <HelpCircle size={20} />
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      {/* <button
        className="lg:hidden fixed top-4 right-4 p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 9999999999 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={20} />}
      </button>  */}
      
      {/* Desktop Sidebar - Fixed position for proper stacking */}
      <div
        className="hidden lg:flex  fixed  left-0 top-0 h-screen w-[60px] pt-16 text-white shadow-xl shadow-amber-300/14"
        style={{ zIndex: 999999 }}
      >
        {/* Dark Horizon Glow */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
            zIndex: -1
          }}
        />
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Desktop style on mobile */}
      <div
        className={`
          lg:hidden md:hidden fixed inset-0 transition-all duration-300 ease-in-out
          ${isOpen ? "visible" : "invisible"}
        `}
        style={{ zIndex: 9999999998 }}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsOpen(false)}
          style={{ zIndex: 9999999998 }}
        />

        {/* Sidebar Panel - Desktop style with desktop width */}
        <div
          className={`
            absolute left-0 top-0 h-screen w-[70px] bg-[#1A1A1A] shadow-2xl transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ zIndex: 9999999999 }}
        >
          {/* Close Button positioned similarly to desktop */}
          <div className="flex justify-center p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
              style={{ zIndex: 9999999999 }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Sidebar Content - Same as desktop */}
          <div className="px-2">
            <SidebarContent onLinkClick={handleMobileLinkClick} />
          </div>
        </div>
      </div>

      {/* Content spacer for desktop sidebar */}
      <div className="hidden lg:block w-[70px]"></div>
    </>
  );
};

export default SideBar;