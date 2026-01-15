import { useState, useMemo } from "react";
import {
  Rocket,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  ExternalLink,
  Edit3,
  Trash2,
  Eye,
  Settings,
  ChevronDown,
  Grid3X3,
  List,
  Star,
  Clock,
  Target,
  BarChart3,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function MyStartups() {
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showDropdown, setShowDropdown] = useState(null);

  // Mock data - replace with actual API data
  const startups = [
    {
      id: 1,
      name: "NeuroForge",
      tagline: "AI-powered neural interface platform",
      stage: "Seed",
      status: "active",
      logo: "🧠",
      coverColor: "from-purple-600 to-indigo-600",
      teamSize: 8,
      funding: { raised: 420000, target: 1000000, status: "Raising" },
      traction: { users: "12.5k", growth: "+24%", mrr: "$8.2k" },
      progress: 72,
      lastUpdated: "2 hours ago",
      featured: true,
      milestones: { completed: 8, total: 12 },
      tasks: { open: 14, overdue: 2 },
    },
    {
      id: 2,
      name: "MetaOps",
      tagline: "Operations automation for modern teams",
      stage: "Pre-Seed",
      status: "active",
      logo: "⚡",
      coverColor: "from-amber-500 to-orange-600",
      teamSize: 4,
      funding: { raised: 0, target: 500000, status: "Bootstrapped" },
      traction: { users: "2.1k", growth: "+45%", mrr: "$1.8k" },
      progress: 45,
      lastUpdated: "1 day ago",
      featured: false,
      milestones: { completed: 3, total: 10 },
      tasks: { open: 8, overdue: 0 },
    },
    {
      id: 3,
      name: "CloudSync Pro",
      tagline: "Enterprise cloud synchronization",
      stage: "Series A",
      status: "active",
      logo: "☁️",
      coverColor: "from-cyan-500 to-blue-600",
      teamSize: 15,
      funding: { raised: 2500000, target: 5000000, status: "Raising" },
      traction: { users: "45k", growth: "+18%", mrr: "$52k" },
      progress: 85,
      lastUpdated: "5 hours ago",
      featured: true,
      milestones: { completed: 15, total: 18 },
      tasks: { open: 23, overdue: 5 },
    },
    {
      id: 4,
      name: "DataVault",
      tagline: "Secure data storage solution",
      stage: "Idea",
      status: "draft",
      logo: "🔐",
      coverColor: "from-emerald-500 to-teal-600",
      teamSize: 1,
      funding: { raised: 0, target: 0, status: "Planning" },
      traction: { users: "0", growth: "N/A", mrr: "$0" },
      progress: 10,
      lastUpdated: "3 days ago",
      featured: false,
      milestones: { completed: 1, total: 8 },
      tasks: { open: 5, overdue: 0 },
    },
  ];

  // Filter and sort startups
  const filteredStartups = useMemo(() => {
    let result = [...startups];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.tagline.toLowerCase().includes(query)
      );
    }

    // Stage filter
    if (filterStage !== "all") {
      result = result.filter(
        (s) => s.stage.toLowerCase() === filterStage.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "progress":
        result.sort((a, b) => b.progress - a.progress);
        break;
      case "team":
        result.sort((a, b) => b.teamSize - a.teamSize);
        break;
      case "recent":
      default:
        // Keep original order (most recent first)
        break;
    }

    return result;
  }, [startups, searchQuery, filterStage, sortBy]);

  const stages = ["all", "Idea", "Pre-Seed", "Seed", "Series A"];

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                My Startups
              </h1>
            </div>
            <p className="text-sm text-white/60">
              Manage and monitor all your ventures in one place
            </p>
          </div>

          <Link
            to="/my-startups/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/25"
          >
            <Plus className="w-4 h-4" />
            Create Startup
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            label="Total Startups"
            value={startups.length}
            icon={Rocket}
            color="purple"
          />
          <StatCard
            label="Team Members"
            value={startups.reduce((acc, s) => acc + s.teamSize, 0)}
            icon={Users}
            color="blue"
          />
          <StatCard
            label="Total Raised"
            value={`$${(startups.reduce((acc, s) => acc + s.funding.raised, 0) / 1000).toFixed(0)}k`}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            label="Active Tasks"
            value={startups.reduce((acc, s) => acc + s.tasks.open, 0)}
            icon={Target}
            color="amber"
          />
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/[0.07] transition-all"
            />
          </div>

          {/* Stage Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
            {stages.map((stage) => (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  filterStage === stage
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                }`}
              >
                {stage === "all" ? "All Stages" : stage}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-purple-500/20 text-purple-400"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-purple-500/20 text-purple-400"
                  : "text-white/40 hover:text-white/60"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(showDropdown === "sort" ? null : "sort")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Sort</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showDropdown === "sort" && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-50 overflow-hidden">
                {[
                  { value: "recent", label: "Most Recent" },
                  { value: "name", label: "Name" },
                  { value: "progress", label: "Progress" },
                  { value: "team", label: "Team Size" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowDropdown(null);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                      sortBy === option.value
                        ? "bg-purple-500/20 text-purple-300"
                        : "text-white/70 hover:bg-white/5"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Startups Grid/List */}
        {filteredStartups.length > 0 ? (
          viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredStartups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}

              {/* Create New Card */}
              <Link
                to="/my-startups/create"
                className="group flex flex-col items-center justify-center min-h-[320px] rounded-2xl border-2 border-dashed border-white/10 hover:border-purple-500/40 bg-white/[0.01] hover:bg-purple-500/5 transition-all duration-300"
              >
                <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-purple-500/20 transition-colors mb-4">
                  <Plus className="w-8 h-8 text-white/30 group-hover:text-purple-400 transition-colors" />
                </div>
                <span className="text-base font-medium text-white/30 group-hover:text-purple-400 transition-colors">
                  Create New Startup
                </span>
                <span className="text-xs text-white/20 group-hover:text-purple-400/60 mt-1 transition-colors">
                  Start your next venture
                </span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredStartups.map((startup) => (
                <StartupListItem key={startup.id} startup={startup} />
              ))}
            </div>
          )
        ) : (
          <EmptyState searchQuery={searchQuery} filterStage={filterStage} />
        )}
      </div>
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    purple: "from-purple-500/20 to-indigo-500/20 border-purple-500/20 text-purple-400",
    blue: "from-blue-500/20 to-cyan-500/20 border-blue-500/20 text-blue-400",
    green: "from-green-500/20 to-emerald-500/20 border-green-500/20 text-green-400",
    amber: "from-amber-500/20 to-orange-500/20 border-amber-500/20 text-amber-400",
  };

  return (
    <div className={`rounded-xl bg-gradient-to-br ${colors[color]} border p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${colors[color].split(' ').pop()}`} />
        <span className="text-xs text-white/50">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function StartupCard({ startup }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5">
      {/* Cover Gradient */}
      <div className={`h-24 bg-gradient-to-br ${startup.coverColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        {startup.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
            <span className="text-xs font-medium text-white">Featured</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-white" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-50 overflow-hidden">
              <Link
                to={`/my-startups/${startup.id}`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                <Eye className="w-4 h-4" /> View Details
              </Link>
              <Link
                to={`/my-startups/${startup.id}/edit`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit Startup
              </Link>
              <Link
                to={`/my-startups/${startup.id}/settings`}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/70 hover:bg-white/5 transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <hr className="border-white/10 my-1" />
              <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Logo */}
      <div className="absolute top-16 left-5">
        <div className="w-16 h-16 rounded-xl bg-zinc-900 border-4 border-zinc-900 flex items-center justify-center text-3xl shadow-lg">
          {startup.logo}
        </div>
      </div>

      {/* Content */}
      <div className="pt-10 px-5 pb-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
              {startup.name}
            </h3>
            <p className="text-xs text-white/50 line-clamp-1">{startup.tagline}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              startup.status === "active"
                ? "bg-green-500/20 text-green-400"
                : "bg-white/10 text-white/50"
            }`}
          >
            {startup.stage}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-xs">
            <span className="text-white/50">Progress</span>
            <span className="text-purple-400 font-medium">{startup.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${startup.coverColor}`}
              style={{ width: `${startup.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-white/[0.03]">
            <p className="text-xs text-white/40 mb-0.5">Team</p>
            <p className="text-sm font-semibold text-white">{startup.teamSize}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.03]">
            <p className="text-xs text-white/40 mb-0.5">Users</p>
            <p className="text-sm font-semibold text-white">{startup.traction.users}</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.03]">
            <p className="text-xs text-white/40 mb-0.5">MRR</p>
            <p className="text-sm font-semibold text-white">{startup.traction.mrr}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-1 text-xs text-white/40">
            <Clock className="w-3 h-3" />
            {startup.lastUpdated}
          </div>
          <Link
            to={`/my-startups/${startup.id}`}
            className="flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            View Details
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StartupListItem({ startup }) {
  return (
    <Link
      to={`/my-startups/${startup.id}`}
      className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all"
    >
      {/* Logo */}
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${startup.coverColor} flex items-center justify-center text-2xl`}>
        {startup.logo}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
            {startup.name}
          </h3>
          {startup.featured && (
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          )}
          <span
            className={`px-2 py-0.5 rounded-full text-xs ${
              startup.status === "active"
                ? "bg-green-500/20 text-green-400"
                : "bg-white/10 text-white/50"
            }`}
          >
            {startup.stage}
          </span>
        </div>
        <p className="text-sm text-white/50 truncate">{startup.tagline}</p>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6">
        <div className="text-center">
          <p className="text-xs text-white/40">Team</p>
          <p className="text-sm font-semibold text-white">{startup.teamSize}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40">Progress</p>
          <p className="text-sm font-semibold text-purple-400">{startup.progress}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-white/40">Tasks</p>
          <p className="text-sm font-semibold text-white">{startup.tasks.open}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="hidden md:block w-32">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${startup.coverColor}`}
            style={{ width: `${startup.progress}%` }}
          />
        </div>
      </div>

      {/* Arrow */}
      <ArrowUpRight className="w-4 h-4 text-white/30 group-hover:text-purple-400 transition-colors" />
    </Link>
  );
}

function EmptyState({ searchQuery, filterStage }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 rounded-2xl bg-white/5 mb-4">
        <Rocket className="w-12 h-12 text-white/20" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        {searchQuery || filterStage !== "all"
          ? "No startups found"
          : "No startups yet"}
      </h3>
      <p className="text-sm text-white/50 max-w-md mb-6">
        {searchQuery || filterStage !== "all"
          ? "Try adjusting your search or filters"
          : "Create your first startup to get started on your entrepreneurial journey"}
      </p>
      <Link
        to="/my-startups/create"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:scale-105 transition-transform"
      >
        <Plus className="w-4 h-4" />
        Create Your First Startup
      </Link>
    </div>
  );
}