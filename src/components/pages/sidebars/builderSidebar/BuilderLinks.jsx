import { Badge, BarChart3, Briefcase, LucideLayoutDashboard, Star, User, Heart, CheckCircle } from 'lucide-react';
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
      icon: <Briefcase size={22} />,
      href: "/builder/browse-startups",
      label: "Browse Startups",
    },
    {
      id: 3,
      icon: <Heart size={22} />,
      href: "/builder/saved-startups",
      label: "Saved Startups",
    },
    {
      id: 4,
      icon: <CheckCircle size={22} />,
      href: "/builder/my-applications",
      label: "My Applications",
    },
    {
      id: 5,
      icon: <LucideLayoutDashboard size={22} />,
      href: "/builder/my-work",
      label: "My Work",
    },
    {
      id: 6,
      icon: <Star size={22} />,
      href: "/builder/rewards",
      label: "Rewards",
    },
    {
      id: 7,
      icon: <User size={22} />,
      href: "/builder/profile-skills",
      label: "Skill Profile",
    },
    {
      id: 8,
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