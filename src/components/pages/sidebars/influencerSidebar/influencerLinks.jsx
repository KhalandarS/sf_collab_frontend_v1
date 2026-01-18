import { BarChart3, BriefcaseBusiness, Earth, MessageSquare, Share2, TrendingUp, Wallet } from "lucide-react";
import { BrainCircuit, Wand2, FileText, Lightbulb } from 'lucide-react';

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