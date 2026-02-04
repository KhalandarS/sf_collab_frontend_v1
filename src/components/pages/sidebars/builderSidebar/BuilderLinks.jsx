import { CheckCircle, Save, LightbulbIcon, BookOpen, MessageSquareHeart, Rocket, Users, ClipboardList, Calculator, FileTerminal } from 'lucide-react';

import { aiTools, dashboardLink, toolsSection } from '../sidebarCommons';

export function createBuilderLinks(unreadMessagesCount, userRoles = [], setActiveRole) {
  return [
    dashboardLink(userRoles, setActiveRole),
    {
      id: 2,
      icon: <Rocket size={22} />,
      href: "/discover-startups",
      label: "Discover Startups",
      subItems: [
        { id: "discover-startups", href: "/discover-startups", label: "Discover Startups", icon: <Rocket size={18} /> },
        { id: "saved-startups", href: "/saved-startups", label: "Saved Startups", icon: <Save size={18} /> },
      ]

    },

    {
      id: 4,
      icon: <LightbulbIcon size={22} />,
      href: "/ideation",
      label: "Ideation",
      subItems: [
        { id: "Ideation-Board", href: "/ideation", label: "Ideation Board", icon: <LightbulbIcon size={18} /> },
        { id: "knowledge-resources", href: "/knowledge", label: "Knowledge Resources", icon: <BookOpen size={18} /> },
      ]
    },
    {
      id: 5,
      icon: <CheckCircle size={22} />,
      href: "/builder/my-applications",
      label: "My Applications",
    },
    {
      id: 6,
      icon: <ClipboardList size={22} />,
      href: "/builder/my-work",
      label: "My Work",
    },
    {
      id: 7,
      icon: <Users size={22} />,
      href: "/discover-users",
      label: "Discover Builders",
      subItems: [
        { id: "discover-builders", href: "/discover-users", label: "Discover Builders", icon: <Users size={18} /> },
        { id: "social-feed", href: "/posts", label: "Social Feed", icon: <MessageSquareHeart size={18} />, badge: unreadMessagesCount > 0 ? unreadMessagesCount : null },
      ]
    },
    aiTools(8),
    toolsSection(9)
  ];
};