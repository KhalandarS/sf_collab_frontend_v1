
import { Badge, BarChart2, ChartNoAxesGanttIcon, Eye, LucideLayoutDashboard } from 'lucide-react';
import { FcDocument } from 'react-icons/fc';
import { IoChatbubbles } from 'react-icons/io5';

export function createInvestorLinks(unreadMessagesCount) {
  return [
    {
      id: 1,
      icon: <LucideLayoutDashboard size={22} />,
      href: "/portfolio",
      label: "Portfolio",
      subItems: []
    },
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