import React from "react";
import { Link, useLocation } from "react-router-dom";

const Options = ({ isHidden = false }) => {
  const location = useLocation();

  return (
    <div
      className={`transition-transform duration-300 will-change-transform ${isHidden ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
        } lg:translate-y-0 lg:opacity-100`}
    >
      <div className="flex items-center gap-4 overflow-x-auto text-sm py-1 ">
        <Link
          className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/dashboard"
              ? "border border-white text-white"
              : "text-gray-400 hover:text-white"
            }`}
          to="/dashboard"
        >
          Dashboard
        </Link>
        {/* <Link
          className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/dashboard"
              ? "border border-white text-white"
              : "text-gray-400 hover:text-white"
            }`}
          to="/dashboard"
        >
          Dashboard
        </Link> */}
        <Link
          className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/ideation"
              ? "border border-white text-white"
              : "text-gray-400 hover:text-white"
            }`}
          to="/ideation"
        >
          Ideation
        </Link>
        <Link
          className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/discover-startups"
              ? "border border-white text-white"
              : "text-gray-400 hover:text-white"
            }`}
          to="/discover-startups"
        >
          Startup
        </Link>
        <Link
          className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/register-startup"
              ? "border border-white text-white"
              : "text-gray-400 hover:text-white"
            }`}
          to="/register-startup"
        >
          Register
        </Link>
        <Link
          className={`px-3 py-1 rounded-full transition-colors ${location.pathname === "/chat"
              ? "border border-white text-white"
              : "text-gray-400 hover:text-white"
            }`}
          to="/chat"
        >
          Messages
        </Link>
      </div>
    </div>
  );
};

export default Options;
