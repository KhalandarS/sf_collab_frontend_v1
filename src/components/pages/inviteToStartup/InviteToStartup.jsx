import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { startupsAPI } from "@/utils/APIs/startupsAPI";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  CheckCircle,
  X,
  AlertCircle,
  Search,
  Building2,
  Calendar,
  User,
  Clock,
} from "lucide-react";

const InviteToStartup = () => {
const { user } = useSelector((state) => state.auth);
const [searchQuery, setSearchQuery] = useState("");
const [filterStatus, setFilterStatus] = useState("pending");
const [invitations, setInvitations] = useState([]);
const [error, setError] = useState(null);
const [success, setSuccess] = useState(null);
const [loading, setLoading] = useState(true);

// Fetch invitations
useEffect(() => {
  fetchInvitations();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [user]);

const fetchInvitations = async () => {
  setLoading(true);
  try {
    const res = await startupsAPI.getMyInvitations({
      status: filterStatus === "all" ? undefined : filterStatus,
      page: 1,
      per_page: 100,
    });
    console.log("Fetched invitations:", res.data?.invitations || res.invitations || res);

    setInvitations(res.data?.invitations || res.invitations || []);
    setError(null);
  } catch (err) {
    console.error("❌ Failed to load invitations", err);
    setError("Failed to load invitations");
  } finally {
    setLoading(false);
  }
};

const handleAccept = async (startupId, invitationId) => {
  try {
    const res = await startupsAPI.acceptInvitation(startupId, invitationId);
    if (res.success || res.data) {
      setInvitations((prev) =>
        prev.map((inv) =>
          inv.id === invitationId ? { ...inv, status: "accepted" } : inv
        )
      );
      setSuccess("Invitation accepted! You've joined the startup.");
      setTimeout(() => setSuccess(null), 3000);
    }
  } catch (err) {
    console.error("❌ Failed to accept invitation", err);
    setError("Failed to accept invitation");
  }
};

const handleReject = async (startupId, invitationId) => {
  try {
    const res = await startupsAPI.rejectInvitation(startupId, invitationId);
    if (res.success || res.data) {
      setInvitations((prev) =>
        prev.filter((inv) => inv.id !== invitationId)
      );
      setSuccess("Invitation rejected");
      setTimeout(() => setSuccess(null), 3000);
    }
  } catch (err) {
    console.error("❌ Failed to reject invitation", err);
    setError("Failed to reject invitation");
  }
};

const statusUI = {
  pending: {
    label: "Pending",
    class: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    icon: <Clock className="w-4 h-4" />,
  },
  accepted: {
    label: "Accepted",
    class: "bg-green-500/20 text-green-300 border-green-500/30",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  rejected: {
    label: "Rejected",
    class: "bg-red-500/20 text-red-300 border-red-500/30",
    icon: <X className="w-4 h-4" />,
  },
};

const getFilteredInvitations = () => {
  return invitations
    .filter((inv) =>
      filterStatus === "all" || inv?.status === filterStatus
    )
    .filter((inv) => {
      const startupName = inv.startup_name || "";
      return startupName.toLowerCase().includes(searchQuery.toLowerCase());
    });
};

const getTotalStats = () => {
  return {
    total: invitations.length,
    pending: invitations.filter((inv) => inv?.status === "pending").length,
    accepted: invitations.filter((inv) => inv?.status === "accepted").length,
  };
};

const stats = getTotalStats();
const filteredInvitations = getFilteredInvitations();

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

          >
            <Mail className="w-8 h-8 text-blue-400" />
          </motion.div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              My Invitations
            </h1>
            <p className="text-gray-400 text-lg mt-1">
              Manage startup invitations
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
              <Mail className="w-5 h-5 text-white/60" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Total Invitations
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.total}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4 }}
          className="bg-gradient-to-br from-yellow-500 to-amber-500 p-0.5 rounded-xl"
        >
          <div className="bg-slate-900 rounded-xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-white/60" />
              <span className="text-xs text-gray-400">Pending</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Awaiting Response
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.pending}
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
              <CheckCircle className="w-5 h-5 text-white/60" />
              <span className="text-xs text-gray-400">Accepted</span>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Total Accepted
              </p>
              <p className="text-3xl font-bold text-white mt-1">
                {stats.accepted}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 z-10" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by startup name..."
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

        <div className="flex flex-wrap gap-2">
          {[
            { value: "pending", label: "Pending" },
            { value: "accepted", label: "Accepted" },
            { value: "rejected", label: "Rejected" },
            { value: "all", label: "All" },
          ].map((filter) => (
            <motion.button
              key={filter.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === filter.value
                  ? "bg-blue-500 text-white border-blue-400 border"
                  : "bg-white/5 border border-white/10 text-gray-300 hover:border-white/20"
              }`}
            >
              {filter.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Messages */}
      {success && (
        <motion.div
          className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3 text-green-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

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

      {/* Invitations List */}
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
        ) : filteredInvitations.length === 0 ? (
          <motion.div
            className="text-center py-16 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
            <p className="text-gray-400 text-lg font-medium">
              No invitations found
            </p>
            <p className="text-gray-500 text-sm mt-2">
              You'll see invitations from startups here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredInvitations.map((invitation, index) => {
              const status = statusUI[invitation?.status] || {};

              return (
                <motion.div
                  key={invitation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    y: -2,
                    borderColor: "rgba(59, 130, 246, 0.5)",
                  }}
                  className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    {console.log("Rendering invitation:", invitation)}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white truncate">
                        {invitation.startup_name || "Unknown Startup"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          {invitation.role || "Team Member"}
                        </Badge>
                        {invitation.created_at && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(
                              invitation.created_at
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
                    <Badge
                      className={`flex items-center gap-2 whitespace-nowrap ${status.class}`}
                    >
                      {status.icon}
                      {status.label}
                    </Badge>

                    {invitation.status === "pending" && (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleReject(
                              invitation.startup_id,
                              invitation.id
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition font-medium text-sm flex items-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Decline
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleAccept(
                              invitation.startup_id,
                              invitation.id
                            )
                          }
                          className="px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 transition font-medium text-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  </div>
);
};

export default InviteToStartup;