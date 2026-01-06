import {
  Rocket,
  Settings,
  Users,
  CheckSquare,
  DollarSign,
  BarChart3,
  Folder,
  Bell,
  Layers,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardChangeSection from "../dashboardChangeSection";

export default function FounderDashboard({
  userRoles,
  activeRole,
  setActiveRole,
}) {
  return (
    <div className="relative space-y-6 sm:space-y-8 lg:space-y-10 px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none
  bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_1px)]
  bg-[length:20px_20px]" />

      {/* Role selector */}
      <DashboardChangeSection
        sections={userRoles.map((role) => ({
          id: role,
          label: role.charAt(0).toUpperCase() + role.slice(1),
        }))}
        onSectionChange={(sectionId) => {
          setActiveRole(sectionId);
          localStorage.setItem("activeRole", sectionId);
        }}
        activeRole={activeRole}
      />

      <div className="relative z-10 space-y-6 sm:space-y-8 lg:space-y-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 sm:w-6 h-5 sm:h-6 text-purple-400 flex-shrink-0" />
            <span>Founder Dashboard</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed">
            Manage your startups, coordinate teams, track progress, and run
            fundraising efforts from a single control center.
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <KPI label="Milestones Completed" value="72%" />
            <KPI label="Open Tasks" value="14" />
            <KPI label="Weekly Progress" value="8.6 / 10" />
            <KPI label="Funding Raised" value="$420k / $1M" />
          </div>
        </div>

        {/* ================= MY STARTUPS ================= */}
        <Section
          icon={Rocket}
          title="My Startups"
          subtitle="Overview of companies you operate"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            <StartupCard
              name="NeuroForge"
              stage="Seed"
              traction="Growing"
              team="8"
              funding="Raising"
            />
            <StartupCard
              name="MetaOps"
              stage="Pre-Seed"
              traction="Early"
              team="4"
              funding="Bootstrapped"
            />
          </div>

          <Link
            to="/founder/startups"
            className="inline-block mt-3 sm:mt-4 text-purple-300 hover:underline text-xs sm:text-sm"
          >
            Manage startups →
          </Link>
        </Section>

        {/* ================= STARTUP MANAGEMENT ================= */}
        <Section
          icon={Settings}
          title="Startup Management"
          subtitle="Core configuration and planning"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            <ActionCard label="Startup Profile & Pitch" />
            <ActionCard label="Milestones & Roadmap" />
          </div>
        </Section>

        {/* ================= TASKS & TEAM ================= */}
        <Section
          icon={Users}
          title="Tasks & Team"
          subtitle="Execution and delivery"
        >
          <div className="space-y-2 text-xs sm:text-sm text-white">
            <Row label="Active Tasks" value="9" />
            <Row label="Blocked Tasks" value="2" />
            <Row label="Pending Deliverables" value="3" />
          </div>

          <Link
            to="/founder/tasks"
            className="inline-block mt-3 sm:mt-4 text-purple-300 hover:underline text-xs sm:text-sm"
          >
            View task board →
          </Link>
        </Section>

        {/* ================= FUNDRAISING ================= */}
        <Section
          icon={DollarSign}
          title="Fundraising"
          subtitle="Capital, investors & campaigns"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <Stat label="Raised" value="$420k" />
            <Stat label="Target" value="$1M" />
            <Stat label="Investor Leads" value="23" />
          </div>

          <Link
            to="/founder/fundraising"
            className="inline-block mt-3 sm:mt-4 text-purple-300 hover:underline text-xs sm:text-sm"
          >
            Open fundraising →
          </Link>
        </Section>

        {/* ================= REPORTS ================= */}
        <Section
          icon={BarChart3}
          title="Reports"
          subtitle="Operational KPIs"
        >
          <div className="space-y-2 text-xs sm:text-sm text-white">
            <Row label="Growth" value="↑ 12% WoW" />
            <Row label="Burn Rate" value="$38k / mo" />
            <Row label="Runway" value="11 months" />
            <Row label="Velocity" value="Stable" />
          </div>
        </Section>

        {/* ================= FILES ================= */}
        <Section
          icon={Folder}
          title="Files"
          subtitle="Core startup documents"
        >
          <div className="flex flex-wrap gap-2">
            <FileChip label="Pitch Deck" />
            <FileChip label="Business Plan" />
            <FileChip label="Legal Docs" />
            <FileChip label="Media Kit" />
          </div>
        </Section>

        {/* ================= NOTIFICATIONS ================= */}
        <Section
          icon={Bell}
          title="Notifications"
          subtitle="What needs your attention"
        >
          <ul className="space-y-2 text-xs sm:text-sm text-white/80">
            <li>🧑‍💻 4 new builder applications</li>
            <li>💰 Investor message received</li>
            <li>🚀 Campaign performance update</li>
          </ul>

          <Link
            to="/founder/notifications"
            className="inline-block mt-3 sm:mt-4 text-purple-300 hover:underline text-xs sm:text-sm"
          >
            View all notifications →
          </Link>
        </Section>

      </div>
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3">
        <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-purple-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/60">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function KPI({ label, value }) {
  return (
    <div className="rounded-lg sm:rounded-xl bg-white/5 border border-white/10 px-3 sm:px-4 py-2 sm:py-3 min-h-[56px] flex flex-col justify-center">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-base sm:text-lg font-semibold text-white mt-1">{value}</p>
    </div>
  );
}

function StartupCard({ name, stage, traction, team, funding }) {
  return (
    <div className="rounded-lg sm:rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 min-h-[90px] flex flex-col justify-between">
      <div>
        <p className="font-semibold text-sm sm:text-base text-white break-words">{name}</p>
        <p className="text-xs text-white/60 mt-1 sm:mt-2">
          {stage} • {traction}
        </p>
      </div>
      <p className="text-xs text-white/60 mt-2 sm:mt-3">
        Team: {team} • Funding: {funding}
      </p>
    </div>
  );
}

function ActionCard({ label }) {
  return (
    <div className="rounded-lg sm:rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 text-xs sm:text-sm text-white min-h-[80px] flex items-center">
      {label}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg sm:rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 min-h-[80px] flex flex-col justify-center">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-base sm:text-lg font-semibold text-white mt-1">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-2 pb-2 last:pb-0">
      <span className="text-white text-xs sm:text-sm truncate">{label}</span>
      <span className="text-white/70 text-xs sm:text-sm flex-shrink-0">{value}</span>
    </div>
  );
}

function FileChip({ label }) {
  return (
    <span className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-xs text-white whitespace-nowrap">
      {label}
    </span>
  );
}
