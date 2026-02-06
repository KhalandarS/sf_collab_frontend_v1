import { BarChart2, ChartNoAxesGanttIcon, Eye, Lock } from 'lucide-react';
import { FcDocument } from 'react-icons/fc';
import { aiTools, toolsSection, dashboardLink, socialSection } from '../sidebarCommons';

export function createInvestorLinks(unreadMessagesCount, userRoles = [], setActiveRole) {
  return [
    dashboardLink(userRoles, setActiveRole),
    {
      id: 2,
      icon: <BarChart2 size={22} />,
      href: "/startup-analytics",
      label: "Startup Analytics",
      isUpcoming: true,
      subItems: []
    },
    {
      id: 3,
      icon: <Eye size={22} />,
      href: "/watchlist",
      label: "Watchlist / Deal Flow",
      isUpcoming: true,
      subItems: []
    },
    socialSection(4),
    {
      id: 5,
      icon: <ChartNoAxesGanttIcon size={22} />,
      href: "/updates",
      label: "Updates",
      isUpcoming: true,
      subItems: []
    },
    {
      id: 6,
      icon: <FcDocument size={22} />,
      href: "/documents",
      label: "Documents",
      isUpcoming: true,
      subItems: []
    },
    aiTools(7),
    toolsSection(8)
  ];
}
