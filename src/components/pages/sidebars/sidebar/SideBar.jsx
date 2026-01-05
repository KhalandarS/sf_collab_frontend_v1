import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HelpCircle, X, Crown, ChevronRight } from "lucide-react";
import SidebarFeedbackCard from "../../../sections/SidebarFeedbackCard";
import { createLinks, getCurrentContext } from "./links";

const SideBar = ({ isOpen, setIsOpen, unreadMessagesCount, isAdmin }) => {
  const location = useLocation();

  // Build links once per unread count change
  const [links, setLinks] = useState(() => createLinks(unreadMessagesCount));

  useEffect(() => {
    setLinks(createLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

  // Identify current context
  const currentContextId = useMemo(
    () => getCurrentContext(location.pathname),
    [location.pathname]
  );

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
  };

  const SidebarContent = ({ onLinkClick, isMobile = false }) => (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      {/* Main navigation */}
      <div className="flex flex-col gap-1 items-center px-1">
        {links.map((link) => {
          const isActive = link.id === currentContextId;

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
                  {link.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        onClick={onLinkClick}
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
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Admin link */}
        {isAdmin && (
          <Link
            to="/admin"
            onClick={onLinkClick}
            className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
              location.pathname === "/admin"
                ? "bg-yellow-600/20 text-yellow-400"
                : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
            }`}
          >
            <Crown size={22} />
            {isMobile && (
              <span className="text-sm font-medium">Admin Panel</span>
            )}
          </Link>
        )}
      </div>

      {/* Bottom links */}
      <div className="flex flex-col gap-2 items-center pb-2">
        <div className="flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors">
          <SidebarFeedbackCard />
        </div>

        <Link
          to="/help"
          className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${
            location.pathname === "/help"
              ? "bg-[#2A2A2A] text-white"
              : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
          }`}
          onClick={onLinkClick}
        >
          <HelpCircle size={20} />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className="hidden lg:flex fixed left-0 top-0 h-screen w-[60px] pt-16 text-white shadow-xl shadow-amber-300/14"
        style={{ zIndex: 999999 }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
            zIndex: -1,
          }}
        />
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden md:hidden fixed inset-0 transition-all duration-300 ease-in-out ${
          isOpen ? "visible" : "invisible"
        }`}
        style={{ zIndex: 9999999998 }}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`absolute left-0 top-0 h-screen w-[220px] bg-[#1A1A1A] shadow-2xl transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ zIndex: 9999999999 }}
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="px-2">
            <SidebarContent onLinkClick={handleMobileLinkClick} isMobile />
          </div>
        </div>
      </div>

      {/* Content spacer */}
      <div className="hidden lg:block w-[70px]" />
    </>
  );
};

export default SideBar;
