import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { startupsAPI } from "@/utils/APIs/startupsAPI";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle,
  X,
  AlertCircle,
  Search,
  Briefcase,
  Calendar,
  Users,
  ChevronDown,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const FounderManageApplications = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [expandedStartup, setExpandedStartup] = useState(null);
  const [startups, setStartups] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startupApplications, setStartupApplications] = useState({});

  // Fetch startups and their applications
  useEffect(() => {
    const fetchStartupsAndApplications = async () => {
      setLoading(true);
      try {
        if (user?.id) {
          const res = await startupsAPI.getAll({
            my_startups: true
          })
          const startupsList = res.data.startups || [];
          setStartups(startupsList);

          // Fetch applications for each startup
          const applicationsMap = {};
          for (const startup of startupsList) {
            try {
              const appsRes = await startupsAPI.getJoinRequests(startup.id, {
                page: 1,
                per_page: 100,
              });
              applicationsMap[startup.id] = appsRes.data.join_requests || [];
            } catch {
              applicationsMap[startup.id] = [];
            }
          }
          setStartupApplications(applicationsMap);

          if (startupsList.length > 0) {
            setExpandedStartup(startupsList[0].id);
          }
        }
      } catch (err) {
        console.log("❌ Failed to load startups or applications", err); 
        setError("Failed to load startups");
      } finally {
        setLoading(false);
      }
    };

    fetchStartupsAndApplications();
  }, [user]);

  const handleAccept = async (startupId, requestId) => {
    try {
      const res = await startupsAPI.acceptJoinRequest(startupId, requestId);
      if (res.success || res.data) {
        setStartupApplications((prev) => ({
          ...prev,
          [startupId]: prev[startupId].map((a) =>
            a.id === requestId ? { ...a, status: "approved" } : a
          ),
        }));
        setSuccess("Application accepted!");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.log("❌ Failed to accept application", err);
      setError("Failed to accept application");
    }
  };

  const handleReject = async (startupId, requestId) => {
    try {
      const res = await startupsAPI.rejectJoinRequest(startupId, requestId);
      if (res.success || res.data) {
        setStartupApplications((prev) => ({
          ...prev,
          [startupId]: prev[startupId].map((a) =>
            a.id === requestId ? { ...a, status: "rejected" } : a
          ),
        }));
        setSuccess("Application rejected");
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      console.log("❌ Failed to reject application", err);
      setError("Failed to reject application");
    }
  };

  const statusUI = {
    pending: {
      label: "Pending",
      class: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      icon: <Clock className="w-4 h-4" />,
    },
    approved: {
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

  const getFilteredApplications = (apps) => {
    return apps
      .filter((app) =>
        filterStatus === "all" || app.status === filterStatus
      )
      .filter((app) => {
        const fullName = `${app.user?.first_name || ""} ${
          app.user?.last_name || ""
        }`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      });
  };

  const getTotalStats = () => {
    let totalApplications = 0;
    let pendingApplications = 0;
    let acceptedApplications = 0;

    Object.values(startupApplications).forEach((apps) => {
      totalApplications += apps.length;
      pendingApplications += apps.filter((a) => a.status === "pending").length;
      acceptedApplications += apps.filter((a) => a.status === "approved").length;
    });

    return { totalApplications, pendingApplications, acceptedApplications };
  };

  const stats = getTotalStats();

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
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Users className="w-8 h-8 text-blue-400" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Manage Applications
              </h1>
              <p className="text-gray-400 text-lg mt-1">
                Review and manage join requests for your startups
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
                <Briefcase className="w-5 h-5 text-white/60" />
                <span className="text-xs text-gray-400">Total</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                  Total Applications
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.totalApplications}
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
                  Awaiting Review
                </p>
                <p className="text-3xl font-bold text-white mt-1">
                  {stats.pendingApplications}
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
                  {stats.acceptedApplications}
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
              placeholder="Search by applicant name..."
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
              { value: "approved", label: "Accepted" },
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

        {/* Startups with Applications */}
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
          ) : startups.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
              <p className="text-gray-400 text-lg font-medium">No startups found</p>
              <p className="text-gray-500 text-sm mt-2">
                Create a startup to manage applications
              </p>
            </motion.div>
          ) : (
            <Accordion
              type="single"
              value={expandedStartup?.toString()}
              onValueChange={(value) =>
                setExpandedStartup(value ? parseInt(value) : null)
              }
              className="space-y-4"
            >
              {startups.map((startup, startupIndex) => {
                const applications = startupApplications[startup.id] || [];
                const filteredApps = getFilteredApplications(applications);

                return (
                  <motion.div
                    key={startup.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: startupIndex * 0.1 }}
                    className="rounded-xl border border-white/10 overflow-hidden bg-gradient-to-br from-slate-900/40 to-slate-800/40"
                  >
                    <AccordionItem value={startup.id.toString()} className="border-0">
                      <AccordionTrigger className="px-6 py-4 hover:bg-blue-500/10 transition data-[state=open]:bg-blue-500/10">
                        <div className="flex items-center justify-between gap-4 flex-1 text-left">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white">
                              {startup.name}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {applications.length} total application
                              {applications.length !== 1 ? "s" : ""}
                              {filteredApps.length < applications.length &&
                                ` • ${filteredApps.length} matching filters`}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <Badge variant="outline" className="text-white">
                              {filteredApps.length}
                            </Badge>
                          </div>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-6 py-4 border-t border-white/10">
                        {filteredApps.length === 0 ? (
                          <p className="text-gray-400 text-center py-8">
                            No applications matching filters
                          </p>
                        ) : (
                          <div className="space-y-3">
                            {filteredApps.map((app, appIndex) => {
                              const status = statusUI[app.status] || {};
                              const applicantName = `${
                                app.user?.firstName || ""
                              } ${app.user?.lastName || ""}`.trim() || "Anonymous";

                              return (
                                <motion.div
                                  onClick={() => {
                                    navigate(`/user-profile?id=${app.user?.id}`)
                                  }}
                                  key={app.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: appIndex * 0.05 }}
                                  whileHover={{
                                    y: -2,
                                    borderColor: "rgba(59, 130, 246, 0.5)",
                                  }}
                                  className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center p-4 rounded-lg bg-slate-800/50 border border-white/5 hover:border-blue-500/30 transition-all"
                                >
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                      {applicantName.charAt(0).toUpperCase()}
                                      
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-white truncate">
                                        {applicantName}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                          {app.role || "Role not specified"}
                                        </Badge>
                                        {app.createdAt && (
                                          <p className="text-xs text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(
                                              app.createdAt
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

                                    {app.status === "pending" && (
                                      <div className="flex gap-2">
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleReject(startup.id, app.id)
                                          }
                                          }
                                          className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition font-medium text-sm flex items-center gap-1"
                                        >
                                          <X className="w-4 h-4" />
                                          Reject
                                        </motion.button>
                                        <motion.button
                                          whileHover={{ scale: 1.05 }}
                                          whileTap={{ scale: 0.95 }}
                                          onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handleAccept(startup.id, app.id)
                                          }
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
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                );
              })}
            </Accordion>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FounderManageApplications;