import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { startupsAPI } from "@/utils/APIs/startupsAPI";
import AddMemberModal from "../../startupDetails/modals/AddMember";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getProfilePicture } from "@/utils/getProfilePicture";
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Crown,
  Shield,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Building2,
} from "lucide-react";
import DeleteConfirmationModal from "@/utils/confirm";

const FounderManageTeam = () => {
  const { user, access_token } = useSelector((state) => state.auth);
  const [startups, setStartups] = useState([]);
  const [expandedStartup, setExpandedStartup] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedStartupId, setSelectedStartupId] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    role: "",
    user_id: null,
  });

  useEffect(() => {
    fetchStartupsWithMembers();
  }, []);

  const fetchStartupsWithMembers = async () => {
    setLoading(true);
    try {
      const params = { my_startups: true };
      const response = await startupsAPI.getAll(params);
      
      if (response.success && response.data.startups.length > 0) {
        const startupsWithMembers = await Promise.all(
          response.data.startups.map(async (startup) => {
            try {
              const membersResponse = await startupsAPI.getMembers(startup.id);
              return {
                ...startup,
                members: membersResponse.success ? membersResponse.data.members || [] : [],
              };
            } catch (err) {
              console.error(`Failed to fetch members for startup ${startup.id}`, err);
              return { ...startup, members: [] };
            }
          })
        );
        setStartups(startupsWithMembers);
        setExpandedStartup(startupsWithMembers[0]?.id || null);
      }
    } catch (err) {
      setError("Failed to fetch startup details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedStartupId) {
      setError("Please select a startup");
      return;
    }

    try {
      const response = await startupsAPI.addMember(
        selectedStartupId,
        {
          user_id: formData.user_id,
          first_name: formData.first_name,
          last_name: formData.last_name,
          role: formData.role,
        },
        access_token
      );

      if (response.success) {
        setStartups((prev) =>
          prev.map((startup) =>
            startup.id === selectedStartupId
              ? { ...startup, members: [...startup.members, response.data.member] }
              : startup
          )
        );
        setIsAddMemberOpen(false);
        setFormData({ first_name: "", last_name: "", role: "", user_id: null });
      }
    } catch (err) {
      setError("Failed to add member");
      console.error(err);
    }
  };

  const handleRemoveMember = async (startupId, memberId) => {
    try {
      const response = await startupsAPI.removeMember(startupId, memberId);
      if (response.success) {
        setStartups((prev) =>
          prev.map((startup) =>
            startup.id === startupId
              ? {
                  ...startup,
                  members: startup.members.filter((m) => m.id !== memberId),
                }
              : startup
          )
        );
      }
    } catch (err) {
      setError("Failed to remove member");
    }
  };

  const handlePromoteToAdmin = async (startupId, memberId) => {
    try {
      const response = await startupsAPI.promoteMemberToAdmin(startupId, memberId);
      if (response.success) {
        setStartups((prev) =>
          prev.map((startup) =>
            startup.id === startupId
              ? {
                  ...startup,
                  members: startup.members.map((m) =>
                    m.id === memberId ? { ...m, admin: true } : m
                  ),
                }
              : startup
          )
        );
      }
    } catch (err) {
      setError("Failed to promote member");
    }
  };

  const handleDemoteAdmin = async (startupId, memberId) => {
    try {
      const response = await startupsAPI.demoteMemberAdmin(startupId, memberId);
      if (response.success) {
        setStartups((prev) =>
          prev.map((startup) =>
            startup.id === startupId
              ? {
                  ...startup,
                  members: startup.members.map((m) =>
                    m.id === memberId ? { ...m, admin: false } : m
                  ),
                }
              : startup
          )
        );
      }
    } catch (err) {
      setError("Failed to demote member");
    }
  };

  const getFilteredStartups = () => {
    if (!searchQuery) return startups;
    
    return startups.filter((startup) => {
      const startupMatches = startup.name.toLowerCase().includes(searchQuery.toLowerCase());
      const membersMatch = startup.members.some((member) =>
        `${member.firstName} ${member.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      return startupMatches || membersMatch;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const filteredStartups = getFilteredStartups();
  const totalMembers = startups.reduce((sum, s) => sum + s.members.length, 0);
  const totalAdmins = startups.reduce(
    (sum, s) => sum + s.members.filter((m) => m.admin).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white px-2 md:px-4 py-8">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Users className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Manage Team
              </h1>
              <p className="text-gray-400 text-lg mt-1">
                Manage your startup team members and roles
              </p>
            </div>
          </div>
        </motion.div>

        {/* KPI Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 rounded-xl"
          >
            <div className="bg-slate-900 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Building2 className="w-5 h-5 text-white/60" />
                <span className="text-xs text-gray-400">Startups</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Total Startups
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {startups.length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 rounded-xl"
          >
            <div className="bg-slate-900 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Users className="w-5 h-5 text-white/60" />
                <span className="text-xs text-gray-400">Team Size</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Total Members
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {totalMembers}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-green-500 to-emerald-500 p-0.5 rounded-xl"
          >
            <div className="bg-slate-900 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Shield className="w-5 h-5 text-white/60" />
                <span className="text-xs text-gray-400">Admins</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Admin Members
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {totalAdmins}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Search */}
        {/* <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 z-10" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search startups or members..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm text-blue-400 hover:text-blue-300 transition"
            >
              ✕ Clear Search
            </button>
          )}
        </motion.div> */}

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Startups List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="flex justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="rounded-full h-12 w-12 border-3 border-blue-500/20 border-t-blue-500"
              />
            </div>
          ) : filteredStartups.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Building2 className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg font-medium">
                No startups found
              </p>
            </motion.div>
          ) : (
            filteredStartups.map((startup, startupIndex) => (
              <motion.div
                key={startup.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: startupIndex * 0.1 }}
                className="rounded-xl border border-white/10 overflow-hidden bg-gradient-to-br from-slate-900/40 to-slate-800/40"
              >
                {/* Startup Header */}
                <motion.button
                  whileHover={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                  onClick={() =>
                    setExpandedStartup(
                      expandedStartup === startup.id ? null : startup.id
                    )
                  }
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-blue-500/10 transition"
                >
                  <div className="flex items-center gap-4 flex-1 text-left">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {startup.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {startup.members.length} member
                        {startup.members.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{
                      rotate: expandedStartup === startup.id ? 180 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.button>

                {/* Members List */}
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedStartup === startup.id ? "auto" : 0,
                    opacity: expandedStartup === startup.id ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden border-t border-white/10"
                >
                  <div className="p-6 space-y-4">
                    {startup.members.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">
                        No members in this startup
                      </p>
                    ) : (
                      <>
                        {/* Add Member Button */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedStartupId(startup.id);
                            setIsAddMemberOpen(true);
                          }}
                          className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium flex items-center justify-center gap-2 transition-all"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add Member to {startup.name}
                        </motion.button>

                        {/* Members */}
                        <div className="space-y-3">
                          {startup.members.map((member, memberIndex) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: memberIndex * 0.05 }}
                              whileHover={{
                                y: -2,
                                borderColor: "rgba(59, 130, 246, 0.5)",
                              }}
                              className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-blue-500/30 transition-all"
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Avatar className="h-10 w-10 shrink-0">
                                  <AvatarImage src={getProfilePicture(member)} />
                                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                                    {member.firstName?.[0]}
                                    {member.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>

                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-white truncate">
                                    {member.firstName} {member.lastName}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs capitalize">
                                      {member.role}
                                    </Badge>
                                    {member.admin && (
                                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        Admin
                                      </Badge>
                                    )}
                                    {member.joinedAt && (
                                      <p className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(member.joinedAt).toLocaleDateString()}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
                                {!member.admin ? (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      handlePromoteToAdmin(startup.id, member.id)
                                    }
                                    className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 transition font-medium text-sm flex items-center gap-1"
                                  >
                                    <Crown className="w-4 h-4" />
                                    Make Admin
                                  </motion.button>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() =>
                                      handleDemoteAdmin(startup.id, member.id)
                                    }
                                    className="px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/30 transition font-medium text-sm"
                                  >
                                    Demote
                                  </motion.button>
                                )}
                                {
                                  startup?.creator?.id !== member.userId && (
                                
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() =>
                                        setIsDeleteConfirmOpen({ startupId: startup.id, member: member.id })

                                      }
                                      className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition font-medium text-sm flex items-center gap-1"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Remove
                                    </motion.button>
                                  )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Add Member Modal */}
      {
        selectedStartupId && (
          <AddMemberModal
            isOpen={isAddMemberOpen}
            onClose={() => {
              setIsAddMemberOpen(false);
              setFormData({
                first_name: "",
                last_name: "",
                role: "",
                user_id: null,
              });
            }}
            roles={startups.find((s) => s.id === selectedStartupId)?.roles || []}
            onSubmit={handleAddMember}
            startupId={selectedStartupId}
            formData={formData}
            onFormChange={setFormData}
          />
        )}
      <DeleteConfirmationModal
        isOpen={!!isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(null)}
        onConfirm={() => {
          handleRemoveMember(isDeleteConfirmOpen.startupId, isDeleteConfirmOpen.member);
          setIsDeleteConfirmOpen(null);
        }}
        title="Remove Member"
        message="Are you sure you want to remove this member from the startup? This action cannot be undone."
        type="soft"
      />
    </div>
  );
};

export default FounderManageTeam;