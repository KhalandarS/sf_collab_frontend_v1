import { useEffect, useState } from "react";
import { API_URL } from "@/utils/config";
import { UserPlus, X, List, Grid3x3, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { getProfilePicture } from "@/utils/getProfilePicture";

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
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function TeamSection({ members, onJoinClick, isCreator, onRemoveMember }) {
  const [view, setView] = useState(localStorage.getItem("teamView") || "list");

  useEffect(() => {
    localStorage.setItem("teamView", view);
  }, [view]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-wrap items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Team Members
          </h2>
          <p className="text-gray-400 text-sm mt-1">{members.length} members</p>
        </div>

        <div className="flex items-center gap-2">
          {/* View switch */}
          <div className="flex rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant={view === "list" ? "default" : "ghost"}
                onClick={() => setView("list")}
                className={view === "list" ? "bg-gradient-to-r from-blue-600 to-cyan-600 border-0" : "border-gray-600 hover:border-gray-500"}
              >
                <List className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant={view === "grid" ? "default" : "ghost"}
                onClick={() => setView("grid")}
                className={view === "grid" ? "bg-gradient-to-r from-blue-600 to-cyan-600 border-0" : "border-gray-600 hover:border-gray-500"}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                variant={view === "compact" ? "default" : "ghost"}
                onClick={() => setView("compact")}
                className={view === "compact" ? "bg-gradient-to-r from-blue-600 to-cyan-600 border-0" : "border-gray-600 hover:border-gray-500"}
              >
                <Users className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {isCreator && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                onClick={onJoinClick}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Views */}
      {view === "list" && (
        <TeamListView members={members} isCreator={isCreator} onRemoveMember={onRemoveMember} />
      )}
      {view === "grid" && (
        <TeamGridView members={members} isCreator={isCreator} onRemoveMember={onRemoveMember} />
      )}
      {view === "compact" && (
        <TeamCompactView members={members} isCreator={isCreator} onRemoveMember={onRemoveMember} />
      )}
    </div>
  );
}

const TeamListView = ({ members, isCreator, onRemoveMember }) => (
  <motion.div
    className="space-y-3"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {members.map((member) => (
      <motion.div key={member.id} variants={itemVariants}>
        <Card className="bg-gray-800 border-gray-700 hover:border-blue-500 transition-all">
          <CardContent className="p-0">
            <Link
              to={`/user-profile?userId=${member.userId}`}
              className="flex items-center justify-between p-4"
            >
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarImage
                    src={
                      getProfilePicture(member)
                    }
                  />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {member.firstName?.[0]}
                    {member.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {member.firstName} {member.lastName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={`text-xs capitalize ${getRoleBadgeColor(member.role)}`}>
                      {member.role}
                    </Badge>
                    <p className="text-xs text-gray-400">
                      {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              {isCreator && member.role !== "founder" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onRemoveMember(e, member.id)}
                  className="h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-500 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
);

const TeamGridView = ({ members, isCreator, onRemoveMember }) => (
  <motion.div
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {members.map((member) => (
      <motion.div key={member.id} variants={itemVariants}>
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-blue-500 transition-all h-full">
          <CardContent className="p-4">
            <Link
              to={`/user-profile?userId=${member.userId}`}
              className="flex flex-col items-center text-center"
            >
              <Avatar className="h-16 w-16 mb-3">
                <AvatarImage
                  src={
                    getProfilePicture(member)
                  }
                />
                <AvatarFallback className="bg-blue-600 text-white text-lg">
                  {member.firstName?.[0]}
                  {member.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <p className="text-sm font-semibold text-white">
                {member.firstName} {member.lastName}
              </p>
              <Badge className={`text-xs capitalize mt-2 ${getRoleBadgeColor(member.role)}`}>
                {member.role}
              </Badge>
              <p className="text-xs text-gray-400 mt-2">
                Joined {new Date(member.joinedAt).toLocaleDateString()}
              </p>
            </Link>
            {isCreator && member.role !== "founder" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => onRemoveMember(e, member.id)}
                className="h-8 w-8 text-red-400 hover:bg-red-500/10 hover:text-red-500 mt-3 w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </motion.div>
);

const TeamCompactView = ({ members, isCreator, onRemoveMember }) => (
  <motion.div
    className="flex flex-wrap gap-2"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
  >
    {members.map((member) => (
      <motion.div key={member.id} variants={itemVariants}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Link to={`/user-profile?userId=${member.userId}`}>
                <Avatar className="h-10 w-10 border-2 border-blue-500 hover:border-cyan-400 cursor-pointer object-cover">
                  <AvatarImage
                    src={
                      getProfilePicture(member)
                    }
                  />
                  <AvatarFallback className="bg-blue-600 text-white text-xs">
                    {member.firstName?.[0]}
                    {member.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </TooltipTrigger>
            <TooltipContent className="bg-gray-900 border-gray-700">
              <div className="text-sm">
                <p className="font-semibold text-white">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-gray-400 capitalize">{member.role}</p>
                {isCreator && member.role !== "founder" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => onRemoveMember(e, member.id)}
                    className="text-red-400 hover:bg-red-500/10 mt-2 w-full"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    ))}
  </motion.div>
);

const getRoleBadgeColor = (role) => {
  switch (role) {
    case "founder":
      return "bg-purple-500/20 text-purple-400";
    case "co-founder":
      return "bg-blue-500/20 text-blue-400";
    default:
      return "bg-gray-500/20 text-gray-400";
  }
};
