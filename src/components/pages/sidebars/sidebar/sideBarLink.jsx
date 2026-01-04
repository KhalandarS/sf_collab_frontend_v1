import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip"; 
import { Link } from "react-router-dom";

export default function SideBarLink({ link, onClick }) {
  return (<>
    <TooltipProvider key={link.id}>
      <Tooltip key={link.id}>
        <TooltipTrigger asChild>
          <Link
            to={link.href}
            className={`relative flex items-center justify-center w-full px-2 py-2 rounded-lg transition-colors ${location.pathname === link.href
                ? "bg-white text-gray-900"
                : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
              }`}
            onClick={onClick}
            style={{ zIndex: 9999999999 }}
          >
            {link.unreadCount ? link.unreadCount : ''}
            <div className="flex items-center justify-center">
              {link.icon}
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="right"
          style={{ zIndex: 9999999999999 }}
          arrowColor="bg-gray-800 fill-gray-800"
          className="bg-gray-800 fill-gray-800 border-gray-600 text-white"
        >
          <span className="text-sm font-medium">{link.label}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </>
  );
};