import { Badge, BarChart3, Briefcase, LucideLayoutDashboard, Star, User, Heart, CheckCircle, BrainCircuit, Wand2, FileText, BriefcaseBusiness, Lightbulb, Earth } from 'lucide-react';
import { IoChatbubbles } from 'react-icons/io5';
import { LuLayoutDashboard } from 'react-icons/lu';

export function createBuilderLinks(unreadMessagesCount) {
  return [
  {
      id: 1,
      icon: <LuLayoutDashboard size={22} />,
      href: "/dashboard",
      label: "Dashboard",
      subItems: [
        // { id: "overview", href: "/dashboard", label: "Overview" },
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