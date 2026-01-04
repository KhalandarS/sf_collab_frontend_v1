import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SidebarFeedbackCard from '../../../sections/SidebarFeedbackCard';
import { createBuilderLinks } from './BuilderLinks'
import { HelpCircle } from 'lucide-react';
const BuilderSidebar = ({ isOpen, setIsOpen, unreadMessagesCount }) => {
  const location = useLocation();
  const [links, setLinks] = useState(createBuilderLinks(unreadMessagesCount));

  useEffect(() => {
    setLinks(createBuilderLinks(unreadMessagesCount));
  }, [unreadMessagesCount]);

  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  const SidebarContent = ({ onLinkClick, isMobile = false }) => (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      <div className="flex flex-col gap-1 items-center px-1">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onLinkClick}
            className={`w-full flex items-center gap-3 px-2 py-3 rounded-lg transition-colors ${
              location.pathname === link.path
                ? "bg-yellow-600/20 text-yellow-400"
                : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
            }`}
          >
            {link.icon}
            {isMobile && <span className="text-sm font-medium">{link.label}</span>}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-2 items-center">
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
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <SidebarContent onLinkClick={handleMobileLinkClick} />
    </div>
  );
};

export default BuilderSidebar;