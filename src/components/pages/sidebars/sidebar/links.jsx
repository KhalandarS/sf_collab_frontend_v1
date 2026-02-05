import React from "react";
import {
  BrainCircuit,
  BriefcaseBusiness,
  Lightbulb,
  PlusSquare,
  Rocket,
  FileText,
  Users,
  Wand2,
  Database,
  BookOpen,
  Earth,
  MessageSquareHeart,
  Building,
  Building2,
  Save,
  Layers,
} from "lucide-react";
import { LuLayoutDashboard, LuEye } from "react-icons/lu";
import { createInvestorLinks } from "../investorSidebar/InvestorLinks";
import { createBuilderLinks } from "../builderSidebar/BuilderLinks";
import { createFounderLinks } from "../founderSidebar/FounderLinks";
import { createInfluencerLinks } from "../influencerSidebar/influencerLinks";
import { BsPeople } from "react-icons/bs";
import { aiTools, dashboardLink, socialSection, toolsSection } from "../sidebarCommons";

// theme must be top-level (NOT inside any function)
export const CONTEXT_THEME = {
  1: {
    pillBg: "bg-blue-600/20",
    pillText: "text-blue-200",
    activeBg: "bg-white",
    activeText: "text-gray-950",
  },
  2: {
    pillBg: "bg-yellow-600/15",
    pillText: "text-yellow-100",
    activeBg: "bg-white",
    activeText: "text-gray-950",
  },
  3: {
    pillBg: "bg-purple-600/15",
    pillText: "text-purple-100",
    activeBg: "bg-white",
    activeText: "text-gray-950",
  },
  /*4: {
    pillBg: "bg-cyan-600/15",
    pillText: "text-cyan-100",
    activeBg: "bg-white",
    activeText: "text-gray-950",
  },*/
  5: {
    pillBg: "bg-emerald-600/15",
    pillText: "text-emerald-100",
    activeBg: "bg-white",
    activeText: "text-gray-950",
  },
  6: {
    pillBg: "bg-indigo-600/15",
    pillText: "text-white-100",
    activeBg: "bg-white",
    activeText: "text-gray-950",
  },
};

export function createLinks(unreadMessagesCount, userRoles = [], setActiveRole) {
  return [
    dashboardLink(userRoles, setActiveRole),
    {
      id: 3,
      icon: <Rocket size={21} />,
      href: "/discover-startups",
      label: "Startups",
      subItems: [
        { id: "discover-startups", href: "/discover-startups", label: "Discover", icon: <Rocket size={18} /> },
        { id: "my-startups", href: "/my-startups", label: "My Startups", icon: <Building2 size={18} /> },
        { id: "register-startup", href: "/register-startup", label: "Register", icon: <PlusSquare size={18} /> },
        { id: "saved-startups", href: "/saved-startups", label: "Saved Startups", icon: <Save size={18} /> },

        // { id: "startup-teams", href: "/startup-teams", label: "Teams", icon: <TiSocialAtCircular size={18} /> },
        // { id: "startup-documents", href: "/startup-documents", label: "Documents", icon: <FileText size={18} /> },
        // { id: "startup-details", href: "/startup-details", label: "Details", icon: <Database size={18} /> },
      ],
    },
    {
      id: 2,
      icon: <Lightbulb size={22} />,
      href: "/ideation",
      label: "Idea Incubator",
      subItems: [
        { id: "ideas-feed", href: "/ideation", label: "Ideas Feed", icon: <Lightbulb size={18} /> },
      ],
    },
    
    // {
    //   id: 4,
    //   icon: <IoChatbubbles size={23} />,
    //   href: "/chat",
    //   label: "Chat",
    //   unreadCount: (
    //     <Badge className="absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300">
    //       {unreadMessagesCount > 0 ? unreadMessagesCount : "0"}
    //     </Badge>
    //   ),
    // },
    socialSection(6),
    {
      id: 7,
      icon: <BookOpen size={22} />,
      href: "/knowledge",
      label: "Learning",
      subItems: [
        { id: "knowledge", href: "/knowledge", label: "Knowledge", icon: <BookOpen size={18} /> },
      ],
    },
    aiTools(8),
    toolsSection(9)
  ];
};

export function getAllRoutes(element) {
  let routes = [];

  if (element.href) {
    routes.push(element.href);
  }

  if (Array.isArray(element.subItems)) {
    for (const item of element.subItems) {
      routes = routes.concat(getAllRoutes(item));
    }
  }

  return routes;
}

export function getCurrentContext(pathname) {
  const links = createLinks(0); // Create links without unreadMessagesCount
  for (const link of links) {
    if (pathname.startsWith(link.href)) return link.id;

    for (const subItem of link.subItems || []) {
      if (pathname.startsWith(subItem.href)) return link.id;
    }
  }
  return 1; // Default to the first context if no match is found
}


export function getTopNavLinks(pathname, unreadMessagesCount = 0, activeMode = 'general') {
  const contextId = getCurrentContext(pathname);
  let links = []
  switch (activeMode) {
    case 'general':
      links = createLinks(unreadMessagesCount);
      break;
    case 'investor':
      links = createInvestorLinks(unreadMessagesCount);
      break;
    case 'builder':
      links = createBuilderLinks(unreadMessagesCount);
      break;
    case 'founder':
      links = createFounderLinks(unreadMessagesCount);
      break;
    case 'influencer':
      links = createInfluencerLinks(unreadMessagesCount);
      break;
    default:
      links = createLinks(unreadMessagesCount);
  }
  const activeLink = links.find((l) => l.id === contextId);
  return activeLink?.subItems || [];
}


