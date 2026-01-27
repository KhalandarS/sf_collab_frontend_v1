import { BarChart3, BrainCircuit, BriefcaseBusiness } from "lucide-react"
import { IoChatbubbles } from "react-icons/io5"
import { LuLayoutDashboard } from "react-icons/lu"

export default function getDashboardLink(userRoles = [], setActiveRole) {
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