import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Clock,
  CheckCircle,
  X,
  AlertCircle,
  Search,
  Briefcase,
} from "lucide-react";
import { builderApplicationsAPI } from "@/services/builderAPI";
import { startupsAPI } from "@/utils/APIs/startupsAPI";
import usePaginatedFetch from "@/utils/hooks/usePaginated";
import InfiniteList from "@/components/InfiniteList";
import { motion } from "framer-motion";

const MyApplications = () => {
  const { user, access_token } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState(null);

  const {
    items: applications,
    setItems: setApplications,
    loading,
    targetRef,
    refetch
  } = usePaginatedFetch({
    fetchFn: ({ page }) =>
      startupsAPI.getApplications({
        page,
        per_page: 10,
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: searchQuery,
      }),
    search: searchQuery,
    objectKey: "join_requests",
    enabled: !!user && !!access_token,
  });

  const handleWithdraw = async (appId) => {
    try {
      const res = await startupsAPI.deleteJoinRequest(
        appId
      );
      if (res.success) {
        setApplications((prev) => prev.filter((a) => a.id !== appId));
      } else {
        setError("Failed to withdraw application");
      }
    } catch {
      setError("Failed to withdraw application");
    }
  };

  const statusUI = {
    pending: {
      label: "Pending",
      class: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      icon: <Clock className="w-4 h-4" />,
    },
    under_review: {
      label: "Under Review",
      class: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      icon: <AlertCircle className="w-4 h-4" />,
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white px-6 py-10">
      <div className="w-full mx-auto space-y-10">

        {/* Header */}
        <div className="flex items-center gap-4">
          <Briefcase className="w-9 h-9 text-blue-400" />
          <div>
            <h1 className="text-4xl font-bold">My Applications</h1>
            <p className="text-gray-400">
              Track your startup applications and decisions
            </p>
          </div>
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by startup or role..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value)
              refetch();
            }}
            className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="all" className="bg-slate-900">All Status</option>
            <option value="pending" className="bg-slate-900">Pending</option>
            <option value="under_review" className="bg-slate-900">Under Review</option>
            <option value="accepted" className="bg-slate-900">Accepted</option>
            <option value="rejected" className="bg-slate-900">Rejected</option>
          </select>
        </div>
        {/* Clear Filters */}
        {(searchQuery || filterStatus !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("all");
              refetch();
            }}
            className="text-sm text-blue-400 hover:underline"
          >
            Clear Filters
          </button>
        )}
        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-red-300">
            {error}
          </div>
        )}

        {/* List */}
        <InfiniteList
          items={applications}
          loading={loading}
          sentinelRef={targetRef}
          emptyText="No applications found"
          renderItem={(app, index) => {
            const status = statusUI[app.status] || {};
            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="bg-white/5 border my-2 border-white/10 rounded-2xl p-6 hover:border-blue-500/40 transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {app.startup?.name || "Startup"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {app.role_applied_for || "Role"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Applied on{" "}
                      {new Date(app.applied_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm border flex items-center gap-2 ${status.class}`}
                    >
                      {status.icon}
                      {status.label}
                    </span>

                    {(app.status === "pending" ||
                      app.status === "under_review") && (
                      <button
                        onClick={() => handleWithdraw(app.id)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 transition"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default MyApplications;
