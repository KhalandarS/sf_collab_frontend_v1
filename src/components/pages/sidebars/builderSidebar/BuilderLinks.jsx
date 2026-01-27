import { CheckCircle, BrainCircuit, Wand2, FileText, BriefcaseBusiness, Lightbulb, Earth, Save, LightbulbIcon, BookOpen, MessageSquareHeart, Rocket, Users } from 'lucide-react';

import { LuLayoutDashboard } from 'react-icons/lu';
import getDashboardLink from "../getDashboardLink";

export function createBuilderLinks(unreadMessagesCount, userRoles = [], setActiveRole) {
  return [
  getDashboardLink(userRoles, setActiveRole),
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
      icon:<LightbulbIcon size={22} />,
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
    // {
    //   id: 6,
    //   icon: <LucideLayoutDashboard size={22} />,
    //   href: "/builder/my-work",
    //   label: "My Work",
    // },
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
    {
          id: 8,
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
};