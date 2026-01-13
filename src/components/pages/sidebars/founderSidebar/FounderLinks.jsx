import { Badge, File } from 'lucide-react';
import { FaTasks } from 'react-icons/fa';
import { FaMoneyBill } from 'react-icons/fa6';
import { FcFeedback, FcStart } from 'react-icons/fc';
import { IoChatbubbles } from "react-icons/io5";
import { LuLayoutDashboard } from 'react-icons/lu';
import { BrainCircuit, Wand2, FileText, BriefcaseBusiness, Lightbulb } from 'lucide-react';

export function createFounderLinks(unreadMessagesCount) {
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
          icon: <BrainCircuit size={23} />,
          href: "/ai-dashboard",
          label: "AI Tools",
          subItems: [
            { id: "logo-generator", href: "/logo-generator", label: "Logo Generator", icon: <Wand2 size={18} /> },
            { id: "pdf-signing", href: "/pdf-signing", label: "PDF Signing", icon: <FileText size={18} /> },
            { id: "business-plan", href: "/business-plan", label: "Business Plan", icon: <BriefcaseBusiness size={18} /> },
            { id: "qwen-chat", href: "/qwen-chat", label: "Qwen Chat", icon: <BrainCircuit size={18} /> },
            { id: "data-scraper", href: "/data-scraper", label: "Data Scraper", icon: <Lightbulb size={18} /> },
          ],
        },
  ];
}