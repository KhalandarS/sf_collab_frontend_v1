import { BrainCircuit, BriefcaseBusiness, Lightbulb, PlusSquare, Rocket } from "lucide-react";
import { FaUsersViewfinder } from "react-icons/fa6";
import { IoChatbubbles } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { Badge } from "@/components/ui/badge";

export function createLinks(unreadMessagesCount) {
  return [
    {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Dashboard",
      subItems: [
        { id: "overview", href: "/dashboard", label: "Overview" },
        { id: "discover-startups", href: "/discover-startups", label: "My Startup" }
      ]
    },
    {
      id: 2,
      icon: <Lightbulb size={22} />,
      href: "/ideation",
      label: "Ideation",
      subItems: [
        { id: "ideas-feed", href: "/ideation", label: "Ideas Feed" },
      ]
    },
    {
      id: 3,
      icon: <Rocket size={21} />,
      href: "/discover-startups",
      label: "Startups",
      subItems: [
        { id: "discover-startups", href: "/discover-startups", label: "Discover Startups" },
        { id: "register-startup", href: "/register-startup", label: "Register Startup" },
      ]
    },
    {
      id: 4,
      icon: <IoChatbubbles size={23} />,
      href: "/chat",
      label: "Chat",
      unreadCount: (
        <Badge
          className="absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300"
        >
          {unreadMessagesCount > 0 ? unreadMessagesCount : "0"}
        </Badge>
      )
    },
    {
      id: 5,
      icon: <PlusSquare size={22} />,
      href: "/posts",
      label: "Posts",
      subItems: [
        { id: "posts-feed", href: "/posts", label: "Posts Feed" },
        { id: "discover-users", href: "/discover-users", label: "Connect with Users" }
      ]

    },

    {
      id: 6,
      icon: <BrainCircuit size={23} />,
      href: "/business-plan",
      label: "Other features",
      subItems: [
        { id: "logo-generator", href: "/logo-generator", label: "Logo Generator" },
        { id: "data-scraper", href: "/data-scraper", label: "Data Scraper" },
        { id: "knowledge", href: "/knowledge", label: "Knowledge" },
      ]
    }
  ];
}

// Helper to get current context based on pathname
export function getCurrentContext(pathname) {
  if (["/dashboard", "/my-startups"].some(path => pathname.startsWith(path))) {
    return 1;
  }
  if (["/ideation", "/submit-idea", "/my-ideas", "/ideas-feed"].some(path => pathname.startsWith(path))) {
    return 2;
  }
  if (["/discover-startups", "/register-startup", "/startup-teams", "/startup-documents", "/startup-details"].some(path => pathname.startsWith(path))) {
    return 3;
  }
  if (["/chat"].some(path => pathname.startsWith(path))) {
    return 4;
  }
  if (["/posts", "/my-posts", "/discover-users" ].some(path => pathname.startsWith(path))) {
    return 5;
  }
  if (["/business-plan", "/logo-generator", "/data-scraper", "/knowledge"].some(path => pathname.startsWith(path))) {
    return 6;
  }
  return 1;
}

// Get top nav links for current context
export function getTopNavLinks(pathname, unreadMessagesCount = 0) {
  const contextId = getCurrentContext(pathname);
  const links = createLinks(unreadMessagesCount);
  const activeLink = links.find(link => link.id === contextId);
  
  if (activeLink && activeLink.subItems) {
    return activeLink.subItems;
  }
  
  return links[0].subItems || [];
}

// Backward compatibility
export function createDashboardLinks(unreadMessagesCount) {
  return createLinks(unreadMessagesCount);
}

export function createIdeationLinks() {
  return createLinks(0);
}