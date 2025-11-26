import {
  BriefcaseBusiness,
  CalendarCog,
  File,
  FileChartColumnIncreasing,
  HelpCircle,
  House,
  Menu,
  Settings,
  SquareChartGantt,
  Users,
  X,
  Bell,
  PlusSquare,
  MessageSquare,
  Plus
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { MdAutoAwesome } from "react-icons/md";
import { BsDatabaseFillDown } from "react-icons/bs";

const SideBar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // general Links
  const allLinks = [
    {
      id: 1,
      icon: <House />,
      href: "/dashboard",
      label: "Dashboard"
    },
    {
      id: 2,
      icon: <Users />,
      href: "/projects",
      label: "Projects management"
    },
    {
      id: 3,
      icon: <BriefcaseBusiness />,
      href: "/knowledge",
      label: "Knowledge resources"
    },
    {
      id: 4,
      icon: <PlusSquare />,
      href: "/posts",
      label: "Posts"
    },
    {
      id: 5,
      icon: <MdAutoAwesome size={23}/>,
      href: "/business-plan",
      label: "A.I Business plan generator"
    }
    ,
    {
      id: 6,
      icon: <BsDatabaseFillDown size={23}/>,
      href: "/data-scraper",
      label: "Data scraper"
    }
    ,
    {
      id: 7,
      icon: <Plus size={23}/>,
      href: "/other-features",
      label: "Other features"
    }
  ];
  
  // Helper to close sidebar on mobile when a link is clicked
  const handleMobileLinkClick = () => {
    setIsOpen(false);
  };

  const SidebarContent = ({ onLinkClick }) => (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      <div className="flex flex-col gap-4 items-center">
        {/* general links */}
        <div className="flex flex-col gap-4 items-center z-50">
          {allLinks.map((link) => (
            <Tippy
              content={<span className="text-sm font-medium p-6">{link.label}</span>}
              animation="scale"
              theme="light-border"
              delay={[100, 50]}
              placement="right"
            >
              <Link
                key={link.id}
                to={link.href}
                className={`flex items-center justify-center w-full px-2 py-2 rounded-lg transition-colors ${location.pathname === link.href
                    ? "bg-[#2A2A2A] text-white"
                    : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                  }`}
                onClick={onLinkClick}
              >
                <div className="flex items-center justify-center">
                  {link.icon}
                </div>
              </Link>
            </Tippy>
          ))}
        </div>
      </div>

      {/* bottom links */}
      <div className="flex flex-col gap-2 items-center z-50">
        {/* <Link
          to="/messages"
          className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${location.pathname === "/messages"
              ? "bg-[#2A2A2A] text-white"
              : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
            }`}
          onClick={onLinkClick}
        >
          <div className="flex items-center justify-center">
            <MessageSquare size={20} />
          </div>
        </Link> */}
        <Tippy
          content={<span className="text-sm font-medium p-6">Settings</span>}
          animation="scale"
          theme="light-border"
          delay={[100, 50]}
          placement="right"
        >
          <Link
            to="/setting"
            className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${location.pathname === "/settings"
                ? "bg-[#2A2A2A] text-white"
                : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
              }`}
            onClick={onLinkClick}
          >
            <div className="flex items-center justify-center">
              <Settings size={20} />
            </div>
          </Link>
        </Tippy>
        <Link
          to="/notifications"
          className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${location.pathname === "/notifications"
            ? "bg-[#2A2A2A] text-white"
            : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
          }`}
          onClick={onLinkClick}
        >
          <div className="flex items-center justify-center relative">
            <Bell size={20} />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
        </Link>
        <Link
          to="/help"
          className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${location.pathname === "/help"
            ? "bg-[#2A2A2A] text-white"
            : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
          }`}
          onClick={onLinkClick}
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
      {/* Mobile Menu Button - Positioned to avoid logo overlap */}
      <button
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={20} />}
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[60px]  pt-4  text-white  h-full relative shadow-xl shadow-amber-300/14">
        {/* Dark Horizon Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #0d1a36 100%)",
          }}
        />
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`
        lg:hidden fixed inset-0 z-50 transition-all duration-300 ease-in-out        ${isOpen ? "visible" : "invisible"}
      `}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
            }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Panel */}
        <div
          className={`
          absolute left-0 top-0 h-full w-[100px] bg-[#1A1A1A] shadow-2xl transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
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
          <div className="px-4 pb-4">
            <SidebarContent onLinkClick={handleMobileLinkClick} />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
