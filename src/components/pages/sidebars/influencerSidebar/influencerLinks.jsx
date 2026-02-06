import { BriefcaseBusiness, Share2, TrendingUp, Wallet } from "lucide-react";
import { aiTools, toolsSection, dashboardLink } from "../sidebarCommons";

export function createInfluencerLinks(unreadMessagesCount, userRoles = [], setActiveRole) {
  return [
    dashboardLink(userRoles, setActiveRole),
    {
      id: 2,
      icon: <BriefcaseBusiness size={22} />,
      href: "/campaigns",
      label: "Campaigns",
      isUpcoming: true,
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
      isUpcoming: true,

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
      isUpcoming: true,

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
      isUpcoming: true,

      subItems: [
        { id: "payout-history", href: "/payouts", label: "Payout History" },
        { id: "bank-details", href: "/payouts/bank-details", label: "Bank Details" },
      ]
    },
    aiTools(6),
    toolsSection(7)
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