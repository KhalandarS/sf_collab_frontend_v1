import { Badge, File } from 'lucide-react';
import { FaTasks } from 'react-icons/fa';
import { FaMoneyBill } from 'react-icons/fa6';
import { FcFeedback } from 'react-icons/fc';
import { Rocket, PlusSquare, BookOpen, MessageSquareHeart, Users } from 'lucide-react';
import { LuLayoutDashboard } from 'react-icons/lu';
import { BrainCircuit, Wand2, FileText, BriefcaseBusiness, Lightbulb } from 'lucide-react';

/**
 * Creates navigation links for the Founder sidebar
 * @param {number} unreadMessagesCount - Number of unread messages to display in badge
 * @returns {Array} Array of link objects for sidebar navigation
 */
export function createFounderLinks(unreadMessagesCount = 0) {
  return [
    {
      id: 1,
      icon: <BarChart3 size={22} />,
      href: "/dashboard",
      label: "Dashboard",
      subItems: []
    },
    {
      id: 2,
      icon: <Rocket size={22} />,
      href: "/my-startups",
      label: "Startups",
      subItems: [
        { id: "discover-startups", href: "/my-startups", label: "Discover", icon: <Rocket size={18} /> },
        { id: "register-startup", href: "/register-startup", label: "Register", icon: <PlusSquare size={18} /> },
      ]
    },
    {
      id: 3,
      icon: <MessageSquareHeart size={22} />,
      href: "/posts",
      label: "Social",
      subItems: [
        { id: "posts-feed", href: "/posts", label: "Social Feed", icon: <MessageSquareHeart size={18} /> },
        { id: "discover-users", href: "/discover-users", label: "Discover Users", icon: <Users size={18} /> },
      ]
    },
    {
      id: 4,
      icon: <BookOpen size={22} />,
      href: "/knowledge",
      label: "Learning",
      subItems: [
        { id: "knowledge", href: "/knowledge", label: "Knowledge", icon: <BookOpen size={18} /> },
      ]
    },
    {
      id: 5,
      icon: <BrainCircuit size={23} />,
      href: "/ai-dashboard",
      label: "AI Tools",
      subItems: [
        { id: "logo-generator", href: "/logo-generator", label: "Logo Generator", icon: <Wand2 size={18} /> },
        { id: "pdf-signing", href: "/pdf-signing", label: "PDF Signing", icon: <FileText size={18} /> },
        { id: "business-plan", href: "/business-plan", label: "Business Plan", icon: <BriefcaseBusiness size={18} /> },
        { id: "qwen-chat", href: "/qwen-chat", label: "Qwen Chat", icon: <BrainCircuit size={18} /> },
        { id: "data-scraper", href: "/data-scraper", label: "Data Scraper", icon: <Lightbulb size={18} /> },
      ]
    },
  ];
}
