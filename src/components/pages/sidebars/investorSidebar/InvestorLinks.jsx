
import { BarChart2, ChartNoAxesGanttIcon, Eye } from 'lucide-react';
import { FcDocument } from 'react-icons/fc';
import  { aiTools, toolsSection, dashboardLink, socialSection } from '../sidebarCommons';

export function createInvestorLinks(unreadMessagesCount, userRoles = [], setActiveRole) {
  return [
    dashboardLink(userRoles, setActiveRole),
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
    socialSection(4),
    {
      id: 5,
      icon: <ChartNoAxesGanttIcon size={22} />,
      href: "/updates",
      label: "Updates",
      subItems: []
    },
    {
      id: 6,
      icon: <FcDocument size={22} />,
      href: "/documents",
      label: "Documents",
      subItems: []
    },
    aiTools(7),
    toolsSection(8)
  ];
}