import { BarChart3, BrainCircuit, BriefcaseBusiness, Calculator, Earth, FileTerminal, FileText, Lightbulb, Wand2 } from "lucide-react";
import { BsGear } from "react-icons/bs";
import { IoChatbubbles } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { SiBoardgamegeek } from "react-icons/si";

export function aiTools(id) {
  return {
    id,
    icon: <BrainCircuit size={23} />,
    href: "/ai-dashboard",
    label: "AI Tools",
    subItems: [
      { id: "logo-generator", href: "/logo-generator", label: "Logo Generator", icon: <Wand2 size={18} /> },
      { id: "business-plan", href: "/business-plan", label: "Business Plan", icon: <BriefcaseBusiness size={18} /> },
      { id: "qwen-chat", href: "/qwen-chat", label: "Qwen Chat", icon: <BrainCircuit size={18} /> },
      { id: "data-scraper", href: "/data-scraper", label: "Data Scraper", icon: <Lightbulb size={18} /> },
      { id: "multimodal-images", href: "/multimodal-images", label: "Multimodal Images", icon: <Earth size={18} /> },
    ],
  };
};

export function toolsSection(id) {
  return {
    id,
    icon: <BsGear size={23} />,
    href: "/tools-dashboard",
    label: "Tools",
    subItems: [
      { id: "calculator", href: "/calculator", label: "Calculator", icon: <Calculator size={18} /> },
      { id: "pdf-signing", href: "/pdf-signing", label: "PDF Signing", icon: <FileTerminal size={18} /> },
      { id: "notes", href: "/notes", label: "Notes", icon: <FileText size={18} /> },
      // { id: "board", href: "/board", label: "Board", icon: <SiBoardgamegeek size={18} /> },
    ],
  }
}
export function dashboardLink(userRoles = [], setActiveRole) {
  return {
    id: 1,
    icon: <LuLayoutDashboard size={22} />,
    href: "/dashboard",
    label: "Dashboard",
    subItems: userRoles ? userRoles.map((role) => ({
      id: `${role}-dashboard`,
      onLinkClick: () => {
        setActiveRole(role)
        
      },
      href: `/dashboard`,
      icon: role === 'founder' 
        ? <BriefcaseBusiness size={18} /> // liderazgo / negocios
        : role === 'investor' 
        ? <BarChart3 size={18} /> // inversiones / rendimiento
        : role === 'builder' 
        ? <BrainCircuit size={18} /> // tech / desarrollo / innovación
        : role === 'influencer' 
        ? <IoChatbubbles size={18} /> // comunicación / social
        : <LuLayoutDashboard size={18} />,
      label: `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`,
    })) : [],
  }
}