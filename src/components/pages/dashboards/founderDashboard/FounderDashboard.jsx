import {
  Rocket,
  Users,
  CheckSquare,
  DollarSign,
  BarChart3,
  Folder,
  Bell,
  Layers,
  Target,
  Zap,
  BrainCircuit,
  UserPlus,
  Plus,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
  MapPin,
  Lightbulb,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import DashboardChangeSection from "../DashboardChangeSection";
import OverviewWebsite from "../dashboard/OverviewWebsite";
import AnnouncementsSection from "../dashboard/AnnouncementsSection";
import { dashboardAPI } from "@/utils/APIs/dashboardAPI";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "@/utils/config";
import Calendar from "@/components/sections/Calendar";
import WorldClock from "@/components/sections/WorldClock";

/* ================= MAIN ================= */

export default function FounderDashboard({
  userRoles,
  activeRole,
  setActiveRole,
  userData,
}) {
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardAPI.getFounderDashboard();
        console.log("Data:", response.data);
        setData(response.data);
      } catch (err) {
        console.error("❌ Failed to load founder dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  /* ================= DERIVED STATS ================= */

  const startups = useMemo(() => data?.startups ?? [], [data]);

  const totals = useMemo(() => {
    return startups.reduce(
      (acc, s) => {
        acc.members += s.stats.members;
        acc.tasks += s.stats.tasks;
        acc.pending += s.stats.pendingJoinRequests;
        acc.revenue += s.stats.revenue || 0;
        return acc;
      },
      { members: 0, tasks: 0, pending: 0, revenue: 0 }
    );
  }, [startups]);

  if (loading) {
    return (
      <div className="p-8 text-white/60">Loading founder dashboard…</div>
    );
  }

  /* ================= RENDER ================= */

  return (
    <div className="space-y-6 px-4 py-6">
      <OverviewWebsite />

      <DashboardChangeSection
        sections={userRoles.map((r) => ({
          id: r,
          label: r.charAt(0).toUpperCase() + r.slice(1),
        }))}
        activeRole={activeRole}
        onSectionChange={(r) => {
          setActiveRole(r);
          localStorage.setItem("activeRole", r);
        }}
      />

      <AnnouncementsSection userRoles={userRoles} />

      {/* ================= HEADER ================= */}
      <header className="rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900/40 border border-purple-500/20 p-6">
        <div className="flex flex-col lg:flex-row justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-purple-600">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Founder Dashboard
              </h1>
            </div>
            <p className="text-sm text-white/60">
              Welcome back, {user?.firstName || "Founder"}
            </p>
          </div>

          <div className="flex gap-3">
            <QuickStat label="Startups" value={startups.length} icon={Rocket} />
            <QuickStat label="Team Members" value={totals.members} icon={Users} />
            <QuickStat label="Open Tasks" value={totals.tasks} icon={CheckSquare} />
          </div>
        </div>
      </header>

      {/* ================= QUICK ACTIONS ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <QuickAction label="Create Startup" href="/register-startup" icon={Plus} />
        <QuickAction label="Ideation" href="/ideation" icon={Lightbulb} />
        {/* <QuickAction label="Post Task" href="/tasks/create" icon={CheckSquare} /> */}
        <QuickAction label="Find Builders" href="/discover-users" icon={Users} />
        <QuickAction label="AI Tools" href="/ai-dashboard" icon={BrainCircuit} />
      </div>

      {/* ================= MY STARTUPS ================= */}
      <Section
        icon={Rocket}
        title="My Startups"
        subtitle="Your active ventures"
        action={{ label: "View All", href: "/my-startups" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {startups.map(({ startup, stats }) => (
            <StartupCard
              key={startup.id}
              startup={startup}
              stats={stats}
            />
          ))}

          <Link
            to="/register-startup"
            className="flex flex-col items-center justify-center min-h-[180px] rounded-xl border-2 border-dashed border-white/10 hover:border-purple-500/50 text-white/50 hover:text-purple-400 transition"
          >
            <Plus className="w-6 h-6 mb-2" />
            Create New Startup
          </Link>
        </div>
      </Section>
      <div className="relative w-full mx-auto p-4 overflow-x-hidden">
            
              <Calendar />
              <WorldClock />
            </div>
            <div className="text-sm text-white/50 italic">
              More features coming soon to enhance your founder experience!
            </div>
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function Section({ icon: Icon, title, subtitle, action, children }) {
  return (
    <section className="rounded-xl bg-white/[0.03] border border-white/10 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Icon className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/50">{subtitle}</p>
          </div>
        </div>
        {action && (
          <Link
            to={action.href}
            className="text-xs text-white/50 hover:text-white flex items-center gap-1"
          >
            {action.label}
            <ChevronRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function QuickStat({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
      <Icon className="w-4 h-4 text-purple-400" />
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function QuickAction({ label, href, icon: Icon }) {
  return (
    <Link
      to={href}
      className="rounded-xl bg-white/5 border border-white/10 p-4 hover:border-purple-500/30 transition"
    >
      <Icon className="w-5 h-5 text-purple-400 mb-2" />
      <p className="text-sm font-medium text-white">{label}</p>
    </Link>
  );
}

function StartupCard({ startup, stats }) {
  return (
    <Link to={`/startup-details/${startup.id}`} 
    className="relative rounded-xl bg-gradient-to-br from-purple-900/20 to-slate-900/20 border border-purple-500/20 p-5 hover:border-purple-500/50 transition overflow-hidden group">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-purple-500/10 transition" />
      
      <div className="relative z-10 space-y-4">
        {/* Header with icon and name */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {startup.logo_url ? (
              <img
                src={
                  startup.logo_url.startsWith("http")
                    ? startup.logo_url
                    : `${API_BASE_URL}/${startup.logo_url}`
                }
                alt={startup.name}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Rocket className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="min-w-0">
              <h4 className="font-semibold text-white truncate">{startup.name}</h4>
              <p className="text-xs text-white/50 truncate">{startup.industry}</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-white/40 flex-shrink-0" />
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <Stat label="Members" value={stats.members} />
          <Stat label="Tasks" value={stats.tasks} />
          <Stat label="Requests" value={stats.pendingJoinRequests} />
          <Stat label="Revenue" value={`$${(stats.revenue || 0).toLocaleString()}`} />
        </div>

        {/* Location and stage */}
        <div className="flex items-center gap-4 text-xs text-white/50 pt-2 border-t border-white/10">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {startup.location || "Remote"}
          </span>
          <span className="px-2 py-1 rounded bg-purple-600/30 text-purple-300">
            {startup.stage}
          </span>
        </div>
      </div>

      <Link
        to={`/startup-details/${startup.id}`}
        className="absolute inset-0"
      />
    </Link>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-white/40">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}
