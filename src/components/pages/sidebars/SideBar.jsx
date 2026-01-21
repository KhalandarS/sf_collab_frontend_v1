import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { getAllRoutes, getCurrentContext } from "./sidebar/links";
import DesktopSidebarContent from "./DesktopSidebarContent";
import MobileSidebarContent from "./MobileSidebarContent";

export default function SideBar({ isOpen, setIsOpen, unreadMessagesCount, isAdmin, links = [] }) {
  const location = useLocation();


  const [expandedItems, setExpandedItems] = useState({});

  const currentContextId = useMemo(
    () => getCurrentContext(location.pathname),
    [location.pathname]
  );

  const CHAT_CONTEXT_ID = 4;

  // Auto-expand active context
  useEffect(() => {
    if (currentContextId) {
      setExpandedItems(prev => ({ ...prev, [currentContextId]: true }));
    }
  }, [currentContextId]);

  const toggleExpand = (linkId) => {
    setExpandedItems(prev => ({ ...prev, [linkId]: !prev[linkId] }));
  };

  const handleMobileLinkClick = () => setIsOpen(false);

  const hasSubItems = (link) => {
    return Array.isArray(link.subItems) && 
           link.subItems.length > 0 && 
           link.id !== CHAT_CONTEXT_ID;
  };

  const shouldShowSubItems = (link) => {
    return getAllRoutes(link).includes(location.pathname);
  };



  return (
    <>
      {/* Desktop Sidebar - BELOW navbar (top-16), lower z-index (30) */}
      <div
        className="hidden lg:flex fixed left-0 top-16 h-[calc(100vh-64px)] w-15 text-white"
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
        <DesktopSidebarContent
          links={links}
          currentContextId={currentContextId}
          toggleExpand={toggleExpand}
          hasSubItems={hasSubItems}
          shouldShowSubItems={shouldShowSubItems}
          isAdmin={isAdmin}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 transition-all duration-300 ease-in-out ${isOpen ? "visible" : "invisible"
          }`}
        style={{ zIndex: 9999 }}
      >
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute left-0 top-0 h-screen w-65 bg-[#1A1A1A] shadow-2xl transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"
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

          <div className="h-[calc(100vh-65px)] overflow-y-auto">
            <MobileSidebarContent
              onLinkClick={handleMobileLinkClick}
              links={links}
              currentContextId={currentContextId}
              isAdmin={isAdmin}
              toggleExpand={toggleExpand}
              hasSubItems={hasSubItems}
              shouldShowSubItems={shouldShowSubItems}  
            />
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="hidden lg:block w-15 shrink-0" />
    </>
  );
};
