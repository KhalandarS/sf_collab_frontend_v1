import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BottomLinks from "./BottomLinks";
import { Crown } from "lucide-react";
import { getAllRoutes } from "./sidebar/links";

export default function DesktopSidebarContent({ links = [], currentContextId, toggleExpand, hasSubItems, shouldShowSubItems, isAdmin }) {
  const location = useLocation();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } }
  };

  const subItemVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.2 }
    },
    exit: { opacity: 0, height: 0, transition: { duration: 0.2 } }
  };

  return (
    <div className="flex flex-col justify-between h-full w-full py-2.5 overflow-y-auto">
      <motion.div
        className="flex flex-col gap-1 items-center px-1"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {links.map((link) => {
          const isActive = getAllRoutes(link).includes(location.pathname);
          const showSubs = shouldShowSubItems(link);

          return (
            <motion.div key={link.id} className="w-full" variants={itemVariants}>
              <div className="relative group w-full flex justify-center">
                {hasSubItems(link) ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (link.href) {
                        navigate(link.href);
                        return
                      }
                      toggleExpand(link.id)
                    }}
                    className={`flex items-center justify-center px-2 py-3 rounded-lg transition-colors ${isActive
                        ? "bg-blue-600/20 text-blue-400"
                        : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                      }`}
                  >
                    {link.icon}
                    {link.unreadCount}
                  </motion.button>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    asChild
                  >
                    <Link
                      to={link.href}
                      className={`flex items-center justify-center px-2 py-3 rounded-lg transition-colors ${isActive
                          ? "bg-blue-600/20 text-blue-400"
                          : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                        }`}
                    >
                      {link.icon}
                      {link.unreadCount}
                    </Link>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap 
  opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg z-[99999999999]"
                >
                  {link.label}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-[6px] border-transparent border-b-zinc-800" />
                </motion.div>
              </div>

              {showSubs && (
                <motion.div
                  variants={subItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-0.5 mt-1 ml-1.5 pl-1.5 border-l border-zinc-700/50"
                >
                  {(link?.subItems || []).map((subItem) => {
                    const isSubActive = location.pathname === subItem.href;

                    return (
                      <motion.div key={subItem.id} className="relative group" whileHover={{ x: 4 }}>
                        <Link
                          to={subItem.href}
                          className={`flex items-center justify-center px-2 py-2 rounded-md transition-colors ${isSubActive
                              ? "bg-blue-600/30 text-white"
                              : "text-gray-500 hover:bg-[#2A2A2A] hover:text-white"
                            }`}
                        >
                          {subItem.icon || (
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                          )}
                        </Link>

                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg"
                        >
                          {subItem.label}
                          <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-zinc-800" />
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {isAdmin && (
          <motion.div className="relative group w-full" variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} asChild>
              <Link
                to="/admin"
                className={`w-full flex items-center justify-center px-2 py-3 rounded-lg transition-colors ${location.pathname === "/admin"
                    ? "bg-yellow-600/20 text-yellow-400"
                    : "text-gray-400 hover:bg-[#2A2A2A] hover:text-white"
                  }`}
              >
                <Crown size={22} />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none shadow-lg"
            >
              Admin Panel
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-zinc-800" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <BottomLinks />
    </div>
  )
}