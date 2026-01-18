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
} from "lucide-react";

import { IoChatbubbles } from "react-icons/io5";
import { LuLayoutDashboard, LuEye } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";
import { TiSocialAtCircular } from "react-icons/ti";
import { MdSocialDistance } from "react-icons/md";

// ✅ theme must be top-level (NOT inside any function)
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

export function createLinks(unreadMessagesCount) {
  return [
    {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Dashboard",
      subItems: [
        // { id: "overview", href: "/dashboard", label: "Overview", icon: <LuEye size={18} /> },
        // { id: "my-startup", href: "/discover-startups", label: "My Startup", icon: <BriefcaseBusiness size={18} /> },
      ],
    },
    {
      id: 3,
      icon: <Rocket size={21} />,
      href: "/discover-startups",
      label: "Startups",
      subItems: [
        { id: "discover-startups", href: "/discover-startups", label: "Discover", icon: <Rocket size={18} /> },
        { id: "register-startup", href: "/register-startup", label: "Register", icon: <PlusSquare size={18} /> },
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
    {
      id: 5,
      icon: <MessageSquareHeart size={22} />,
      href: "/posts",
      label: "Social",
      subItems: [
        { id: "posts-feed", href: "/posts", label: "Social Feed", icon: <MessageSquareHeart size={18} /> },
        { id: "discover-users", href: "/discover-users", label: "Discover Users", icon: <Users size={18} /> },
      ],
    },
    {
      id: 7,
      icon: <BookOpen size={22} />,
      href: "/knowledge",
      label: "Learning",
      subItems: [
        { id: "knowledge", href: "/knowledge", label: "Knowledge", icon: <BookOpen size={18} /> },
      ],
    },
    {
          id: 6,
          icon: <BrainCircuit size={23} />,
          href: "/ai-dashboard",
          label: "AI Tools",
          subItems: [
            { id: "logo-generator", href: "/logo-generator", label: "Logo Generator", icon: <Wand2 size={18} /> },
            { id: "pdf-signing", href: "/pdf-signing", label: "PDF Signing", icon: <FileText size={18} /> },
            { id: "business-plan", href: "/business-plan", label: "Business Plan", icon: <BriefcaseBusiness size={18} /> },
            { id: "qwen-chat", href: "/qwen-chat", label: "Qwen Chat", icon: <BrainCircuit size={18} /> },
            { id: "data-scraper", href: "/data-scraper", label: "Data Scraper", icon: <Lightbulb size={18} /> },
            { id: "multimodal-images", href: "/multimodal-images", label: "Multimodal Images", icon: <Earth size={18} /> },
          ],
        },
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
  //if (pathname.startsWith("/chat")) return null;

  // Startups first to avoid collision
  if (
    ["/discover-startups", "/register-startup", "/startup-teams", "/startup-documents", "/startup-details"].some((p) =>
      pathname.startsWith(p)
    )
  )
    return 3;

  if (pathname.startsWith("/dashboard")) return 1;

  if (["/ideation", "/submit-idea", "/my-ideas", "/ideas-feed"].some((p) => pathname.startsWith(p))) return 2;

  if (["/posts", "/my-posts", "/discover-users"].some((p) => pathname.startsWith(p))) return 5;

  if (["/business-plan", "/logo-generator", "/data-scraper", "/knowledge"].some((p) => pathname.startsWith(p)))
    return 6;

  return 1;
}


export function getTopNavLinks(pathname, unreadMessagesCount = 0) {
  const contextId = getCurrentContext(pathname);
  const links = createLinks(unreadMessagesCount);
  const activeLink = links.find((l) => l.id === contextId);
  return activeLink?.subItems || [];
}


