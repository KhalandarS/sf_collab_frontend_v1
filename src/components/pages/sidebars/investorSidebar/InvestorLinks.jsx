
import { Badge, BarChart2, ChartNoAxesGanttIcon, Earth, Eye, LucideLayoutDashboard } from 'lucide-react';
import { FcDocument } from 'react-icons/fc';
import { IoChatbubbles } from 'react-icons/io5';
import { BrainCircuit, Wand2, FileText, BriefcaseBusiness, Lightbulb } from 'lucide-react';

export function createInvestorLinks(unreadMessagesCount) {
  return [
    {
      id: 0,
      icon: <LucideLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Dashboard",
      subItems: []
    },
    // {
    //   id: 1,
    //   icon: <Portfolio size={22} />,
    //   href: "/portfolio",
    //   label: "Portfolio",
    //   subItems: []
    // },
    {
      id: 2,
      icon: <BarChart2 size={22} />,
      href: "/startup-analytics",
      label: "Startup Analytics",
      subItems: []
    },
    {
      id: 3,
      icon: <Eye size={22} />,
      href: "/watchlist",
      label: "Watchlist / Deal Flow",
      subItems: []
    },
    {
      id: 4,
      icon: <ChartNoAxesGanttIcon size={22} />,
      href: "/updates",
      label: "Updates",
      subItems: []
    },
    {
      id: 5,
      icon: <FcDocument size={22} />,
      href: "/documents",
      label: "Documents",
      subItems: []
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