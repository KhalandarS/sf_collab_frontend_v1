import { Link, useLocation } from "react-router-dom";
import BottomLinks from "./BottomLinks";
import { Crown } from "lucide-react";

export default function MobileSidebarContent({ onLinkClick, links, currentContextId, isAdmin, toggleExpand, hasSubItems, shouldShowSubItems }) {
  const location = useLocation();
  return (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      <div className="flex flex-col gap-1 px-2">
        {links.map((link) => {
          const isActive = link.id === currentContextId;
          const showSubs = shouldShowSubItems(link);

          return (
            <div key={link.id} className="w-full">
              {hasSubItems(link) ? (
                <button
                  onClick={() => toggleExpand(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                    }`}
                >
                  <div className="flex items-center justify-center relative">
                    {link.icon}
                    {link.unreadCount}
                  </div>
                  <span className="text-sm font-medium flex-1 text-left">{link.label}</span>
                </button>
              ) : (
                <Link
                  to={link.href}
                  onClick={onLinkClick}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                    }`}
                >
                  <div className="flex items-center justify-center relative">
                    {link.icon}
                    {link.unreadCount}
                  </div>
                  <span className="text-sm font-medium">{link.label}</span>
                </Link>
              )}

              {showSubs && (
                <div className="flex flex-col gap-0.5 mt-1 ml-4 pl-3 border-l border-zinc-700/50">
                  {link.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.id}
                        to={subItem.href}
                        onClick={onLinkClick}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${isSubActive
                            ? "bg-blue-600/30 text-white"
                            : "text-gray-500 hover:bg-[#2A2A2A] hover:text-white"
                          }`}
                      >
                        {subItem.icon || (
                          <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                        )}
                        <span className="text-xs font-medium">{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {isAdmin && (
          <Link
            to="/admin"
            onClick={onLinkClick}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${location.pathname === "/admin"
                ? "bg-yellow-600/20 text-yellow-400"
                : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
              }`}
          >
            <Crown size={22} />
            <span className="text-sm font-medium">Admin Panel</span>
          </Link>
        )}
      </div>

      <BottomLinks onLinkClick={onLinkClick} />
    </div>
  )
}