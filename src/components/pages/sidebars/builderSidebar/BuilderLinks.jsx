import { Badge, BarChart3, Briefcase, LucideLayoutDashboard, Star, User } from 'lucide-react';
import { IoChatbubbles } from 'react-icons/io5';

export function createBuilderLinks(unreadMessagesCount) {
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
      icon: <LucideLayoutDashboard
      
        size={22} />,
      href: "/tasks",
      label: "Tasks Available",
    },
    {
      id: 3,
      icon: <Briefcase size={22} />,
      href: "/my-applications",
      label: "My Applications",
    },
    {
      id: 4,
      icon: <Star size={22} />,
      href: "/my-work",
      label: "My Work",
    },
    {
      id: 5,
      icon: <User size={22} />,
      href: "/rewards",
      label: "Rewards",
    },
    {
      id: 6,
      icon: <User size={22} />,
      href: "/profile-skills",
      label: "Profile / Skills",
    },
    {
      id: 7,
      icon: <IoChatbubbles size={23} />,
      href: "/chat",
      label: "Messages",
      unreadCount: (
        <Badge className="absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300">
          {unreadMessagesCount > 0 ? unreadMessagesCount : "0"}
        </Badge>
      )
    },
  ];
};