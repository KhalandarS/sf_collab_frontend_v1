import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DashboardSelectorModal({
  sections = [],
  activeRole,
  onSelect,
  onClose,
}) {
  const navigate = useNavigate();
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClose}
    >
      {/* Modal Card */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
        }}
        className="
          w-full max-w-md
          rounded-2xl
          bg-gradient-to-br from-slate-900 via-slate-900/95 to-black
          border border-white/10
          shadow-2xl shadow-black/50
          p-6
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-white">
            Choose your dashboard
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Options */}
        <div className="grid gap-3">
          {sections.map((section) => {
            const isActive = section.id === activeRole;

            return (
              <motion.button
                key={section.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(section.id)}
                className={`
                  flex items-center justify-between
                  px-4 py-3 rounded-xl
                  border transition-all
                  ${
                    isActive
                      ? "bg-blue-500/15 border-blue-400/40 text-blue-300"
                      : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                  }
                `}
              >
                <span className="font-medium">
                  {section.label || section.name}
                </span>

                {isActive && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
                    Active
                  </span>
                )}
              </motion.button>
            );
          })}
          <motion.button
            onClick={() => navigate("/user-profile?page=settings")}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="
              mt-4 w-full
              px-4 py-3 rounded-xl
              bg-blue-600/20 border border-blue-500/30
              text-blue-400 font-medium
              hover:bg-blue-600/30
              transition-colors
            "
          >
            Add New Dashboard
          </motion.button>  
        </div>
      </motion.div>
    </motion.div>
  );
}
