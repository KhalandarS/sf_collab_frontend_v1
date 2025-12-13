import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Badge } from "../ui/badge";
import { IoChatbubbles } from "react-icons/io5";
import { Lightbulb, Rocket} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";

const Options = ({ isHidden = false ,unreadMessagesCount=0}) => {
  const location = useLocation();

  return (
    <div
      // style={{zIndex:999999999}}
      className={`transition-all duration-400 will-change-transform ${
        isHidden ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      } lg:translate-y-0 lg:opacity-100 bg-white/5 backdrop-blur-3xl px-2 rounded-full`}
    >
      <div className="flex items-center gap-1 overflow-x-auto text-sm py-2">
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/dashboard"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-white hover:text-gray-900 hover:bg-gray-100"
          } flex items-center gap-1`}
          to="/dashboard"
        >
          <LuLayoutDashboard size={20}/>Dashboard
        </Link>
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/ideation"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-white hover:text-gray-900 hover:bg-gray-100"
          } flex items-center gap-1`}
          to="/ideation"
        >
          <Lightbulb size={21}/> Ideation
        </Link>
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/discover-startups"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-white hover:text-gray-900 hover:bg-gray-100"
          } flex items-center gap-1`}
          to="/discover-startups"
        >
          <Rocket size={21}/> Startups
        </Link>
        {/* <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/register-startup"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          to="/register-startup"
        >
          Register
        </Link> */}
        {/* <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/chat"
              ? "bg-white text-gray-950 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          } flex items-center gap-1`}
          to="/chat"
        >
          <IoChatbubbles size={20}/>
          <Badge
            
            className=" absolute top-1 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums bg-blue-800 text-blue-300"
            // variant="secondary"
          >
            {unreadMessagesCount>0?unreadMessagesCount:"0"} 
          </Badge> Chat
        </Link> */}
      </div>
    </div>
  );
};

export default Options;