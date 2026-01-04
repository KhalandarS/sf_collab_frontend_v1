import { Badge, File } from 'lucide-react';
import { FaTasks } from 'react-icons/fa';
import { FaMoneyBill } from 'react-icons/fa6';
import { FcFeedback, FcStart } from 'react-icons/fc';
import { IoChatbubbles } from "react-icons/io5";
import { LuLayoutDashboard } from 'react-icons/lu';

export function createFounderLinks(unreadMessagesCount) {
  return [
    {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Dashboard",
      subItems: [
        { id: "overview", href: "/dashboard", label: "Overview" },
      ]
    },
    {
      id: 2,
      icon: <FcStart size={22} />, // Replace with actual icon
      href: "/my-startups",
      label: "My Startups",
      subItems: []
    },
    {
      id: 3,
      icon: <FaTasks size={22} />, // Replace with actual icon
      href: "/tasks-team",
      label: "Tasks & Team",
      subItems: []
    },
    {
      id: 4,
      icon: <FaMoneyBill size={22} />, // Replace with actual icon
      href: "/fundraising",
      label: "Fundraising",
      subItems: []
    },
    {
      id: 5,
      icon: <FcFeedback size={22} />, // Replace with actual icon
      href: "/reports",
      label: "Reports",
      subItems: []
    },
    {
      id: 6,
      icon: <File size={22} />, // Replace with actual icon
      href: "/files",
      label: "Files",
      subItems: []
    },
    {
      id: 7,
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