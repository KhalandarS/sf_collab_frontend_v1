import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
<<<<<<< HEAD
import { Crown, X } from "lucide-react";
=======
import { HelpCircle, X, Crown, ChevronRight } from "lucide-react";
import SidebarFeedbackCard from "../../../sections/SidebarFeedbackCard";
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
import { createLinks, getCurrentContext } from "./links";
import BottomLinks from "../BottomLinks";

const SideBar = ({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) => {
  const location = useLocation();

<<<<<<< HEAD
  const [links, setLinks] = useState(() => createLinks(unreadMessagesCount));
  const [expandedItems, setExpandedItems] = useState({});
=======
  // Build links once per unread count change
  const [links, setLinks] = useState(() => createLinks(unreadMessagesCount));
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692

  useEffect(() => {
    setLinks(createLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

<<<<<<< HEAD
=======
  // Identify current context
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
  const currentContextId = useMemo(
    () => getCurrentContext(location.pathname),
    [location.pathname]
  );

<<<<<<< HEAD
  const CHAT_CONTEXT_ID = 4;

  // Auto-expand active context
  useEffect(() => {
    if (currentContextId) {
      setExpandedItems(prev => ({ ...prev, [currentContextId]: true }));
    }
  }, [currentContextId]);

  const toggleExpand = (linkId) => {
    setExpandedItems(prev => ({ ...prev, [linkId]: !prev[linkId] }));
=======
  // If your "Chat" context id is different, change this value.
  // (From your earlier Options code, contextId === 4 looked like Chat.)
  const CHAT_CONTEXT_ID = 4;

  // Close sidebar on mobile when navigating
  const handleMobileLinkClick = () => setIsOpen(false);

  // Render subitems only for non-chat contexts
  const shouldShowSubItems = (link, isActive) => {
    const hasSubItems = Array.isArray(link.subItems) && link.subItems.length > 0;
    if (!hasSubItems) return false;
    if (!isActive) return false;
    // Do NOT show subitems for Chat
    if (link.id === CHAT_CONTEXT_ID) return false;
    return true;
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
  };

  const handleMobileLinkClick = () => setIsOpen(false);

  const hasSubItems = (link) => {
    return Array.isArray(link.subItems) && 
           link.subItems.length > 0 && 
           link.id !== CHAT_CONTEXT_ID;
  };

  const shouldShowSubItems = (link) => {
    return hasSubItems(link) && expandedItems[link.id];
  };

  // Desktop Content
  const DesktopSidebarContent = () => (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      <div className="flex flex-col gap-1 items-center px-1">
        {links.map((link) => {
          const isActive = link.id === currentContextId;
<<<<<<< HEAD
          const showSubs = shouldShowSubItems(link);

          return (
            <div key={link.id} className="w-full">
              {/* Main nav item with tooltip */}
              <div className="relative group">
                {hasSubItems(link) ? (
                  <button
                    onClick={() => toggleExpand(link.id)}
                    className={`w-full flex items-center justify-center px-2 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center relative">
                      {link.icon}
                      {link.unreadCount}
                    </div>
                  </button>
                ) : (
                  <Link
                    to={link.href}
                    className={`w-full flex items-center justify-center px-2 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-center relative">
                      {link.icon}
                      {link.unreadCount}
                    </div>
                  </Link>
                )}

                {/* Hover tooltip */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg">
                  {link.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-zinc-800" />
                </div>
              </div>

              {/* Subitems */}
              {showSubs && (
                <div className="flex flex-col gap-0.5 mt-1 ml-1.5 pl-1.5 border-l border-zinc-700/50">
                  {link.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;

                    return (
                      <div key={subItem.id} className="relative group">
                        <Link
                          to={subItem.href}
                          className={`flex items-center justify-center px-2 py-2 rounded-md transition-colors ${
                            isSubActive
                              ? "bg-blue-600/30 text-white"
                              : "text-gray-500 hover:bg-[#2A2A2A] hover:text-white"
                          }`}
                        >
                          {subItem.icon || (
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          )}
                        </Link>

                        {/* Subitem tooltip */}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg">
                          {subItem.label}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-zinc-800" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Admin */}
        {isAdmin && (
          <div className="relative group w-full">
            <Link
              to="/admin"
              className={`w-full flex items-center justify-center px-2 py-3 rounded-lg transition-colors ${
                location.pathname === "/admin"
                  ? "bg-yellow-600/20 text-yellow-400"
                  : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
              }`}
            >
              <Crown size={22} />
            </Link>

            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg">
              Admin Panel
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-zinc-800" />
            </div>
          </div>
        )}
      </div>

      <BottomLinks />
    </div>
  );

  // Mobile Content
  const MobileSidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      <div className="flex flex-col gap-1 px-2">
        {links.map((link) => {
          const isActive = link.id === currentContextId;
          const showSubs = shouldShowSubItems(link);

          return (
            <div key={link.id} className="w-full">
              {hasSubItems(link) ? (
                <button
                  onClick={() => toggleExpand(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center relative">
                    {link.icon}
                    {link.unreadCount}
                  </div>
                  <span className="text-sm font-medium flex-1 text-left">{link.label}</span>
                </button>
              ) : (
                <Link
                  to={link.href}
                  onClick={onLinkClick}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center relative">
                    {link.icon}
                    {link.unreadCount}
                  </div>
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              )}

              {showSubs && (
                <div className="flex flex-col gap-0.5 mt-1 ml-4 pl-3 border-l border-zinc-700/50">
=======

          return (
            <div key={link.id} className="w-full">
              {/* Main nav link */}
              <Link
                to={link.href}
                onClick={onLinkClick}
                className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400"
                    : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                }`}
              >
                <div className="flex items-center justify-center relative">
                  {link.icon}
                  {link.unreadCount}
                </div>

                {/* Show labels only on mobile */}
                {isMobile && (
                  <span className="text-sm font-medium">{link.label}</span>
                )}

                {/* Optional chevron hint on mobile when active + has subitems */}
                {isMobile &&
                  Array.isArray(link.subItems) &&
                  link.subItems.length > 0 &&
                  link.id !== CHAT_CONTEXT_ID && (
                    <ChevronRight
                      size={16}
                      className={`ml-auto transition-transform ${
                        isActive ? "rotate-90" : ""
                      }`}
                    />
                  )}
              </Link>

              {/* Sub-items (ICONS ONLY) */}
              {shouldShowSubItems(link, isActive) && (
                <div
                  className={`flex flex-col gap-1 mt-1 ${
                    isMobile ? "pl-6" : "pl-0"
                  }`}
                >
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
                  {link.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        onClick={onLinkClick}
<<<<<<< HEAD
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                          isSubActive
                            ? "bg-blue-600/30 text-white"
                            : "text-gray-500 hover:bg-[#2A2A2A] hover:text-white"
                        }`}
                      >
                        {subItem.icon || (
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        )}
                        <span className="text-xs font-medium">{subItem.label}</span>
=======
                        className={`
                          ${isMobile ? "justify-start" : "justify-center"}
                          flex items-center gap-2 px-2 py-2 rounded-md transition-colors
                          ${
                            isSubActive
                              ? "bg-blue-600/30 text-white"
                              : "text-gray-500 hover:bg-[#2A2A2A] hover:text-white"
                          }
                        `}
                        title={subItem.label}
                        aria-label={subItem.label}
                      >
                        {/* ICON ONLY on desktop, icon + label on mobile */}
                        {subItem.icon ? (
                          <span className="inline-flex items-center justify-center">
                            {subItem.icon}
                          </span>
                        ) : (
                          // If no icon exists in data, show a tiny dot as fallback
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        )}

                        {isMobile && (
                          <span className="text-xs font-medium">
                            {subItem.label}
                          </span>
                        )}
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            onClick={onLinkClick}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              location.pathname === "/admin"
                ? "bg-yellow-600/20 text-yellow-400"
                : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
            }`}
          >
            <Crown size={22} />
            <span className="text-sm font-medium">Admin Panel</span>
          </Link>
        )}
      </div>

      <BottomLinks onLinkClick={onLinkClick} />
<<<<<<< HEAD
=======

>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar - BELOW navbar (top-16), lower z-index (30) */}
      <div
        className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-[60px] text-white"
        style={{ zIndex: 30 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
            zIndex: -1,
          }}
        />
        <DesktopSidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 transition-all duration-300 ease-in-out ${
          isOpen ? "visible" : "invisible"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-screen w-[260px] bg-[#1A1A1A] shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-zinc-800">
            <span className="text-white font-semibold">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-zinc-800 text-white flex items-center justify-center hover:bg-zinc-700 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

<<<<<<< HEAD
          <div className="h-[calc(100vh-65px)] overflow-y-auto">
            <MobileSidebarContent onLinkClick={handleMobileLinkClick} />
=======
          {/* Sidebar Content */}
          <div className="px-2">
            <SidebarContent onLinkClick={handleMobileLinkClick} isMobile />
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Spacer */}
      <div className="hidden lg:block w-[60px] flex-shrink-0" />
=======
      {/* Content spacer */}
      <div className="hidden lg:block w-[70px]" />
>>>>>>> 12c024d7788f45bdba0aa399169bdb5745008692
    </>
  );
};

export default SideBar;
