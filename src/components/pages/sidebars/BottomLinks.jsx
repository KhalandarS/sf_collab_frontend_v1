import SidebarFeedbackCard from "@/components/sections/SidebarFeedbackCard";
import { FileText, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function BottomLinks({
  onLinkClick
}) {
  const location = useLocation();
  
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors hover:bg-amber-500/30">
        <SidebarFeedbackCard />
      </div>
      <Link
        to="/contribution"
        className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${
          location.pathname === "/contribution"
            ? "bg-amber-500 text-white shadow-lg shadow-amber-500/50"
            : "text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
        }`}
        onClick={onLinkClick}
      >
        <FileText size={20} />
      </Link>
      <Link
        to="/help"
        className={`flex items-center justify-center w-fit px-2 py-2 rounded-lg transition-colors ${
          location.pathname === "/help"
            ? "bg-[#2A2A2A] text-white"
            : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
        }`}
        onClick={onLinkClick}
      >
        <HelpCircle size={20} />
      </Link>
    </div>
  )
}