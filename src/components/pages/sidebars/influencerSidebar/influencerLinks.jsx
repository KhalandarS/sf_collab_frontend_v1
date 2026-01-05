import { BarChart3, BriefcaseBusiness, MessageSquare, Share2, TrendingUp, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IoChatbubbles } from "react-icons/io5";

// filepath: /Users/ivandavidgomezsilva/Documents/Ivan/Trabajos/SFORGER/SForger_data/SFRepos/sf_collab_frontend_v1/src/components/sections/sidebars/influencerSidebar/influencerLinks.jsx

export function createInfluencerLinks(unreadMessagesCount) {
  return [
    {
      id: 1,
      icon: <BarChart3 size={22} />,
      href: "/dashboard",
      label: "Dashboard",
      subItems: [
        { id: "overview", href: "/dashboard", label: "Overview" },
      ]
    },
    {
      id: 2,
      icon: <BriefcaseBusiness size={22} />,
      href: "/campaigns",
      label: "Campaigns",
      subItems: [
        { id: "active-campaigns", href: "/campaigns", label: "Active Campaigns" },
        { id: "past-campaigns", href: "/campaigns/past", label: "Past Campaigns" },
      ]
    },
    {
      id: 3,
      icon: <TrendingUp size={22} />,
      href: "/statistics",
      label: "Statistics",
      subItems: [
        { id: "performance", href: "/statistics", label: "Performance" },
        { id: "analytics", href: "/statistics/analytics", label: "Analytics" },
      ]
    },
    {
      id: 4,
      icon: <Share2 size={22} />,
      href: "/links-assets",
      label: "Links & Assets",
      subItems: [
        { id: "my-links", href: "/links-assets", label: "My Links" },
        { id: "assets", href: "/links-assets/assets", label: "Assets" },
      ]
    },
    {
      id: 5,
      icon: <Wallet size={22} />,
      href: "/payouts",
      label: "Payouts",
      subItems: [
        { id: "payout-history", href: "/payouts", label: "Payout History" },
        { id: "bank-details", href: "/payouts/bank-details", label: "Bank Details" },
      ]
    },
    {
      id: 6,
      icon: <IoChatbubbles size={22} />,
      href: "/chat",
      label: "Messages",
      unreadCount: (
        <Badge className="absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300">
          {unreadMessagesCount > 0 ? unreadMessagesCount : "0"}
        </Badge>
      )
    },
  ];
}

// Helper to get current context based on pathname
export function getCurrentContext(pathname) {
  if (["/dashboard"].some(path => pathname.startsWith(path))) {
    return 1;
  }
  if (["/campaigns"].some(path => pathname.startsWith(path))) {
    return 2;
  }
  if (["/statistics"].some(path => pathname.startsWith(path))) {
    return 3;
  }
  if (["/links-assets"].some(path => pathname.startsWith(path))) {
    return 4;
  }
  if (["/payouts"].some(path => pathname.startsWith(path))) {
    return 5;
  }
  if (["/chat"].some(path => pathname.startsWith(path))) {
    return 6;
  }
  return 1;
}

// Get top nav links for current context
export function getTopNavLinks(pathname, unreadMessagesCount = 0) {
  const contextId = getCurrentContext(pathname);
  const links = createInfluencerLinks(unreadMessagesCount);
  const activeLink = links.find(link => link.id === contextId);

  if (activeLink && activeLink.subItems) {
    return activeLink.subItems;
  }

  return links[0].subItems || [];
}

// Backward compatibility
export function createInfluencerDashboardLinks(unreadMessagesCount) {
  return createInfluencerLinks(unreadMessagesCount);
}