import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomLinks from "./BottomLinks";
import { Crown } from "lucide-react";
import { getAllRoutes } from "./sidebar/links";

export default function MobileSidebarContent({ onLinkClick, links = [], currentContextId, isAdmin, toggleExpand, hasSubItems, shouldShowSubItems, callback }) {
  const location = useLocation();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  const subItemVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      <motion.div
        className="flex flex-col gap-1 px-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {links.map((link, index) => {
          const isActive = getAllRoutes(link).includes(location.pathname);
          const showSubs = shouldShowSubItems(link);

          return (
            <motion.div key={index} className="w-full" variants={itemVariants}>
              {hasSubItems(link) ? (
                <motion.button
                  onClick={() => {
                    if (link.href) {
                      navigate(link.href);
                      onLinkClick();
                      return;
                    }
                    toggleExpand(link.id);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600/20 text-blue-400"
                      : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-center relative">
                    {link.icon}
                    {link.unreadCount}
                  </div>
                  <span className="text-sm font-medium flex-1 text-left">
                    {link.label}
                  </span>
                </motion.button>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={link.href}
                    onClick={onLinkClick}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                      isActive
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
                </motion.div>
              )}

              {showSubs && (
                <motion.div
                  variants={subItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-0.5 mt-1 ml-4 pl-3 border-l border-zinc-700/50"
                >
                  {(link?.subItems || []).map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;

                    return (
                      <motion.div
                        key={subItem.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (subItem.onLinkClick) {
                            subItem.onLinkClick();
                            return;
                          }
                          navigate(subItem.href);
                        }
                        }
                      >
                        <Link
                          to={subItem.onLinkClick ? "#" : subItem.href}
                          onClick={onLinkClick}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors ${
                            isSubActive
                              ? "bg-blue-600/30 text-white"
                              : "text-gray-500 hover:bg-[#2A2A2A] hover:text-white"
                          }`}
                        >
                          {subItem.icon || (
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          )}
                          <span className="text-xs font-medium">
                            {subItem.label}
                          </span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {isAdmin && (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to="/admin"
              onClick={onLinkClick}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                location.pathname === "/admin"
                  ? "bg-yellow-600/20 text-yellow-400"
                  : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
              }`}
            >
              <Crown size={22} />
              <span className="text-sm font-medium">Admin Panel</span>
            </Link>
          </motion.div>
        )}
      </motion.div>

      <BottomLinks onLinkClick={onLinkClick} callback={callback} />
    </div>
  );
}