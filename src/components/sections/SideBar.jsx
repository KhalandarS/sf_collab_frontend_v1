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
  Plus,
  MessageCircle,
  BrainCircuit,
  BookUser,
  Rocket,
  Crown,
  Settings2
} from "lucide-react";

import { 
  // MdModelTraining, 
  RiAiGenerate,
  RiRobot2Line,
  RiImageEditLine,
  RiPaletteLine,
  RiChat3Line 
} from 'react-icons/ri';
import { 
  FaRobot, 
  FaImage, 
  FaPalette, 
  FaComments,
  FaMagic,
  FaPaintBrush 
} from 'react-icons/fa';
import { 
  GiAbstract050,
  GiMagicSwirl,
  GiConversation
} from 'react-icons/gi';
import { 
  BsImage,
  BsChatLeftText,
  BsBrush,
  BsFilePdf
} from 'react-icons/bs';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"; 

import { BsStars } from "react-icons/bs";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import GlareHover from "../ui/GlareHover";
import { RiGeminiFill } from "react-icons/ri";
import { MdAutoAwesome } from "react-icons/md";
import { BsDatabaseFillDown } from "react-icons/bs";
import { RiAiGenerate2 } from "react-icons/ri";
import { IoChatbubbles } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { Badge } from "../ui/badge";
import { FaUsersViewfinder } from "react-icons/fa6";
const SideBar = ({isOpen, setIsOpen, unreadMessagesCount,isAdmin}) => {
  const location = useLocation();
  // const [isOpen, setIsOpen] = useState(false);

  // general Links
  const allLinks = [
    {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Dashboard"
    },
    {
      id: 2,
      icon: <Rocket size={21} />,
      href: "/discover-startups",
      label: "Discover startups"
    },
    {
      id: 3,
      icon: <FaUsersViewfinder size={22} />,
      href: 'discover-users',
      label: "Connect with Users"  // more engaging
    },
    {
      id: 4,
      icon: <BriefcaseBusiness />,
      href: "/knowledge",
      label: "Knowledge resources"
    },
    {
      id: 5,
      icon: <PlusSquare />,
      href: "/posts",
      label: "Posts"
    }
    // {
    //   id: 5,
    //   icon: <MdAutoAwesome size={23}/>,
    //   href: "/business-plan",
    //   label: "A.I Business plan generator"
    // }
    ,
    {
      id: 6,
      icon: <IoChatbubbles size={23}/>,
      href: "/chat",
      unreadCount:(
        <Badge
          
          className=" absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300"
          // variant="secondary"
        >
          {unreadMessagesCount>0?unreadMessagesCount:"0"} 
        </Badge> 
      ),
      label: "Chat"
    }
    ,
    {
      id: 7,
      icon: <BrainCircuit size={23}/>,
      href: "/other-features",
      label: "Other features"
    }
    
  ];
  
  const otherPages = [
    {
      id: 1,
      type: "Images",
      description: "Generate images from text prompts",
      icon: <BsStars size={23}/>,
      href: "/multimodal-images",
      label: "Multimodal AI (coming soon)"
    },
    {
      id: 2,
      type: "Images",
      description: "Edit and enhance your images",
      icon: <RiAiGenerate2 size={23}/>,
      href: "/image-editor",
      label: "Image editor"
    },
    {
      id: 3,
      type: "Images",
      description: "Remove backgrounds from images",
      icon: <FaImage size={20} />,
      href: "/background-remover",
      label: "Background Remover"
    },
    {
      id: 4,
      type: "Business Plans & Pitch Decks", 
      description: "Generate business plans and pitch decks",
      icon: <RiGeminiFill size={20} />,
      href: "/qwen-chat",
      label: "AI Chat / Business plan generator / Pitch deck creator"
    },
    {
      id: 5,
      type: "Images",
      description: "Convert photos to anime style",
      icon: <FaMagic size={20} />,
      href: "/anime-converter",
      label: "Anime Converter (coming soon)"
    },
    {
      id: 6,
      type: "Documents",
      description: "Sign PDF documents digitally",
      icon: <BsFilePdf size={20} />,
      href: "/pdf-signing",
      label: "PDF Signing"
    },
    {
      id: 7,
      type: "Data",
      description: "Extract data from websites",
      icon: <BsDatabaseFillDown size={23}/>,
      href: "/data-scraper",
      label: "Data scraper (coming soon)"
    }
  ];
  
  // Group pages by type
  const groupedPages = otherPages.reduce((groups, page) => {
    if (!groups[page.type]) {
      groups[page.type] = [];
    }
    groups[page.type].push(page);
    return groups;
  }, {});  
  
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
          {allLinks.map((link) => (
            link.label.startsWith('Other') ? (
              <div key={link.id} className="relative" style={{ zIndex: 9999999999 }}>
                <TooltipProvider key={link.id}>
                  <Tooltip key={link.id}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => handleDropdownClick("profile")}
                        className="flex items-center gap-2.5 w-11 h-11 transition-all duration-300 group"
                        style={{ zIndex: 9999999999 }}
                      >
                        <div className="flex items-center justify-center w-full px-2 py-2 rounded-lg transition-colors text-gray-400 hover:bg-[#2A2A2A] hover:text-white">
                          <div className="flex items-center justify-center">
                            {link.icon}
                          </div>
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="right" 
                      style={{zIndex:99999999999999999}} 
                      arrowColor="bg-gray-800 fill-gray-800" 
                      className="p-4  bg-gray-800 fill-gray-800 border-gray-600 text-white"
                    >
                      <div className="mt-3 w-full  animate-in fade-in slide-in-from-top-2 duration-200 " style={{ zIndex: 9999999999 }}>
                        <div className="flex flex-col  gap-6">
                          {Object.entries(groupedPages).map(([type, pages]) => (
                            <div key={type} className="flex flex-col gap-2">
                              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                                {type}
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                {pages.map((page) => (
                                  <Link
                                    key={page.id}
                                    to={page.href}
                                    className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                                      location.pathname === page.href
                                        ? "bg-white text-gray-900"
                                        : "text-gray-400 hover:bg-black/60 hover:text-white"
                                    }`}
                                    onClick={onLinkClick}
                                    style={{ zIndex: 9999999999 }}
                                  >
                                    <div className="flex items-center justify-center mb-2">
                                      {page.icon}
                                    </div>
                                    <span className="text-xs font-medium text-center mb-1">
                                      {page.label}
                                    </span>
                                    <p className="text-xs text-gray-500 text-center">
                                      {page.description}
                                    </p>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ) : (
              <TooltipProvider key={link.id}>
                <Tooltip key={link.id}>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.href}
                      className={`relative flex items-center justify-center w-full px-2 py-2 rounded-lg transition-colors ${
                        location.pathname === link.href
                          ? "bg-white text-gray-900"
                          : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                      }`}
                      onClick={onLinkClick}
                      style={{ zIndex: 9999999999 }}
                    >
                      {link.unreadCount?link.unreadCount:''}
                      <div className="flex items-center justify-center">
                        {link.icon}
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    style={{zIndex:9999999999999}} 
                    arrowColor="bg-gray-800 fill-gray-800" 
                    className="bg-gray-800 fill-gray-800 border-gray-600 text-white"
                  >
                    <span className="text-sm font-medium">{link.label}</span>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )
          ))}
          {
          isAdmin && (
            <TooltipProvider key={"admin-tooltip"}>
              <Tooltip key={"admin-tooltip-content"}>
                <TooltipTrigger asChild>
                  <Link
                    to={"/admin"}
                    className={`relative flex items-center justify-center w-full px-2 py-2 rounded-lg transition-colors ${
                      location.pathname.startsWith("/admin")
                        ? "bg-white text-gray-900"
                        : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                    }`}
                    // onClick={onLinkClick}
                    style={{ zIndex: 9999999999 }}
                  >
                    
                    <div className="flex items-center justify-center">
                      <Crown size={22}/>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  style={{zIndex:9999999999999}} 
                  arrowColor="bg-gray-800 fill-gray-800" 
                  className="bg-gray-800 fill-gray-800 border-gray-600 text-white"
                >
                  <span className="text-sm font-medium">Admin panel</span>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )
          }
        </div>
      </div>

      {/* bottom links */}
      <div className="flex flex-col gap-2 items-center" style={{ zIndex: 9999999999 }}>
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
            <Settings2 size={20} />
          </div>
        </Link>
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
      {/* Mobile Menu Button
      <button
        className="lg:hidden fixed top-4 right-4 p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 9999999999 }}
      >
        {isOpen ? <X size={24} /> : <Menu size={20} />}
      </button> */}

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