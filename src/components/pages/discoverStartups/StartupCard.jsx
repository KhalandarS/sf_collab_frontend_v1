import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { startupsAPI } from "@/utils/APIs/startupsAPI";
import { API_URL } from "@/utils/config";
import { motion } from "framer-motion";
import { Building2, MapPin, Eye, Briefcase, ChevronDown, Bookmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function StartupCard({
  startup,
  index,
  getStageBadgeVariant,
  recommendedRole,
  setSelectedStartup,
}) {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [expandedRoles, setExpandedRoles] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  useEffect(() => {
    async function checkIfBookmarked() {
      try {
        const response = await startupsAPI.getBookmarkStatus({
          startupId: startup.id,
          userId: user.id,
        });
        if (!response.success) {
          setIsBookmarked(false);
          return;
        }
        setIsBookmarked(response.data.bookmarked);
      } catch (error) {
        console.error("Failed to check bookmark status:", error);
      }
    }
    checkIfBookmarked();
  }, [startup?.id, user?.id]);
  async function bookmarkStartup() {
    try {
      const response = await startupsAPI.toggleBookmarkStartup({
        startupId: startup.id,
        userId: user.id,
      })
      console.log("Bookmark response:", response);
      if (!response.success) {
        setIsBookmarked(isBookmarked);
        return;
      }
      setIsBookmarked(response.data.bookmarked)
      // await fetch(`${API_URL}/bookmarks`, { ... })
    } catch (error) {
      console.error("Failed to bookmark startup:", error);
      setIsBookmarked(!isBookmarked);
    }
  }
  const formatViews = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className=""
      onClick={() => navigate(`/startup-details/${startup.id}`)}
    >
      <Card className="cursor-pointer border border-gray-600 bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 shadow-2xl hover:shadow-2xl hover:border-gray-500 transition-all duration-300 overflow-hidden group">
        {/* Banner with overlay */}
        {/* Banner */}
        <div className="relative h-36 w-full overflow-hidden">
          {startup.banner_url ? (
            <img
              src={`${API_URL}${startup.banner_url}`}
              alt={startup.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700" />
          )}

          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

          {/* Subtle texture / depth */}
          <div className="absolute inset-0 backdrop-blur-[1px]" />

          {/* Top-right actions */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-gray-900/60 hover:bg-gray-900/80"
              onClick={(e) => {
                e.stopPropagation();
                bookmarkStartup(startup.id);
              }}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                  }`}
              />
            </Button>

            <Badge
              className={`text-xs font-semibold ${getStageBadgeVariant(
                startup.stage
              )}`}
            >
              {startup.stage}
            </Badge>
          </div>
        </div>


        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {startup.name}
            </h3>
            <p className="text-lg font-semibold text-blue-400">
              {formatCurrency(startup.funding_amount) || "No Funding"}
            </p>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              {startup.industry}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              {startup.location || "Remote"}
            </span>
            <span className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              {formatViews(startup.views)}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
            {startup.description || "No description available"}
          </p>

          {/* Recommended Role */}
          {recommendedRole && startup.roles[recommendedRole] && (
            <div className="bg-gradient-to-r from-blue-600/20 to-blue-500/10 p-4 rounded-lg border border-blue-500/30">
              <p className="text-xs font-semibold text-blue-300 mb-2">
                ⭐ RECOMMENDED ROLE
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-white">
                  {recommendedRole}
                </span>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStartup(startup);
                  }}
                >
                  Apply Now
                </Button>
              </div>
            </div>
          )}

          {/* Roles Toggle */}
          {Object.keys(startup.roles).length > 0 && (
            <div className="space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedRoles(!expandedRoles);
                }}
                className="w-full flex justify-between items-center p-3 rounded-lg border border-gray-600 hover:border-gray-500 bg-gray-750 hover:bg-gray-700 transition-all"
              >
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Other Opportunities ({Object.keys(startup.roles).length - (recommendedRole ? 1 : 0)})
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${expandedRoles ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Expandable Roles Container */}
              {expandedRoles && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 pt-2"
                >
                  {Object.entries(startup.roles)
                    .filter(([role]) => role !== recommendedRole)
                    .map(([roleName]) => (
                      <div
                        key={roleName}
                        className="flex justify-between items-center bg-gray-750 p-3 rounded-lg border border-gray-600 hover:border-gray-500 transition-all"
                      >
                        <span className="text-sm font-medium text-gray-200">
                          {roleName}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-500 hover:bg-gray-600 text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStartup(startup);
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-3 border-t border-gray-700 bg-gray-800/50">
          <Button
            size="sm"
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium"
            onClick={() => navigate(`/startup-details/${startup.id}`)}
          >
            View Full Details
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
