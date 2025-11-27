import React from "react";
import { Link, useLocation } from "react-router-dom";

const Options = ({ isHidden = false }) => {
  const location = useLocation();

  return (
    <div
      className={`transition-all duration-300 will-change-transform ${
        isHidden ? "-translate-y-6 opacity-0" : "translate-y-0 opacity-100"
      } lg:translate-y-0 lg:opacity-100`}
    >
      <div className="flex items-center gap-1 overflow-x-auto text-sm py-2">
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/dashboard"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          to="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/ideation"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          to="/ideation"
        >
          Ideation
        </Link>
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/discover-startups"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          to="/discover-startups"
        >
          Startups
        </Link>
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/register-startup"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          to="/register-startup"
        >
          Register
        </Link>
        <Link
          className={`px-4 py-2 rounded-full transition-all duration-200 font-medium ${
            location.pathname === "/chat"
              ? "bg-gray-900 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
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