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
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  Target,
  Zap,
  BrainCircuit,
  UserPlus,
  Eye,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardChangeSection from "../DashboardChangeSection";

export default function FounderDashboard({
  userRoles,
  activeRole,
  setActiveRole,
  userData,
}) {
  // Mock data - replace with actual data from API
  const startups = [
    {
      id: 1,
      name: "NeuroForge",
      stage: "Seed",
      traction: "Growing",
      team: 8,
      funding: "Raising",
      logo: "🧠",
      progress: 72,
      status: "active",
    },
    {
      id: 2,
      name: "MetaOps",
      stage: "Pre-Seed",
      traction: "Early",
      team: 4,
      funding: "Bootstrapped",
      logo: "⚡",
      progress: 45,
      status: "active",
    },
  ];

  const recentActivity = [
    { id: 1, type: "application", message: "4 new builder applications", time: "2h ago", icon: UserPlus },
    { id: 2, type: "investor", message: "Investor message received", time: "5h ago", icon: DollarSign },
    { id: 3, type: "milestone", message: "Milestone 'MVP Launch' completed", time: "1d ago", icon: Target },
    { id: 4, type: "task", message: "3 tasks due this week", time: "1d ago", icon: CheckSquare },
  ];

  const quickActions = [
    { label: "Create Startup", href: "/my-startups/create", icon: Plus, color: "from-purple-600 to-indigo-600" },
    { label: "Post Task", href: "/tasks/create", icon: CheckSquare, color: "from-emerald-600 to-teal-600" },
    { label: "Find Builders", href: "/team/recruiting", icon: Users, color: "from-blue-600 to-cyan-600" },
    { label: "AI Tools", href: "/ai-tools", icon: BrainCircuit, color: "from-pink-600 to-rose-600" },
  ];

  return (
    <div className="relative space-y-6 sm:space-y-8 px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
      {/* Background Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      {/* Role Selector */}
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

      <div className="relative z-10 space-y-6 sm:space-y-8">
        {/* ================= HEADER ================= */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-900/40 via-indigo-900/30 to-slate-900/40 border border-purple-500/20 backdrop-blur-xl p-6 sm:p-8">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex flex-col lg:flex-row justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/25">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    Founder Dashboard
                  </h1>
                  <p className="text-sm text-purple-200/60">
                    Welcome back, {userData?.firstName || "Founder"}
                  </p>
                </div>
              </div>
              
              <p className="text-sm sm:text-base text-white/60 max-w-2xl leading-relaxed">
                Manage your startups, coordinate teams, track progress, and run
                fundraising efforts from your central command center.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3">
              <QuickStat label="Startups" value={startups.length} icon={Rocket} trend="+1" />
              <QuickStat label="Team Members" value="12" icon={Users} />
              <QuickStat label="Open Tasks" value="14" icon={CheckSquare} trend="-3" />
            </div>
          </div>

          {/* KPI Row */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-white/10">
            <KPI label="Milestones Completed" value="72%" />
            <KPI label="Weekly Progress" value="8.6 / 10" />
            <KPI label="Funding Raised" value="$420k / $1M" />
            <KPI label="Builder Applications" value="23" highlight />
          </div>
        </header>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="group relative overflow-hidden rounded-xl bg-white/5 border border-white/10 p-4 hover:border-white/20 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${action.color} mb-3`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-medium text-white group-hover:text-white/90 transition-colors">
                {action.label}
              </p>
              <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>

        {/* ================= MY STARTUPS ================= */}
        <Section
          icon={Rocket}
          title="My Startups"
          subtitle="Your active ventures"
          action={{ label: "View All", href: "/my-startups" }}
          accentColor="purple"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {startups.map((startup) => (
              <StartupCard key={startup.id} startup={startup} />
            ))}
            
            {/* Add New Startup Card */}
            <Link
              to="/my-startups/create"
              className="group flex flex-col items-center justify-center min-h-[180px] rounded-xl border-2 border-dashed border-white/10 hover:border-purple-500/50 bg-white/[0.02] hover:bg-purple-500/5 transition-all duration-300"
            >
              <div className="p-3 rounded-full bg-white/5 group-hover:bg-purple-500/20 transition-colors mb-3">
                <Plus className="w-6 h-6 text-white/40 group-hover:text-purple-400 transition-colors" />
              </div>
              <span className="text-sm font-medium text-white/40 group-hover:text-purple-400 transition-colors">
                Create New Startup
              </span>
            </Link>
          </div>
        </Section>

        {/* ================= TWO COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team & Recruiting */}
          <Section
            icon={Users}
            title="Team & Recruiting"
            subtitle="Build your team"
            action={{ label: "Manage", href: "/team" }}
            accentColor="emerald"
          >
            <div className="space-y-3">
              <StatRow label="Active Team Members" value="12" />
              <StatRow label="Open Positions" value="3" />
              <StatRow label="Pending Applications" value="23" highlight />
              <StatRow label="Interviews Scheduled" value="5" />
            </div>
            
            <Link
              to="/team/recruiting"
              className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Find Builders
            </Link>
          </Section>

          {/* Recent Activity */}
          <Section
            icon={Bell}
            title="Recent Activity"
            subtitle="What needs attention"
            action={{ label: "View All", href: "/notifications" }}
            accentColor="amber"
          >
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </Section>
        </div>

        {/* ================= TASKS & MILESTONES ================= */}
        <Section
          icon={CheckSquare}
          title="Tasks & Milestones"
          subtitle="Track execution progress"
          action={{ label: "Task Board", href: "/tasks" }}
          accentColor="blue"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Stat label="Active Tasks" value="9" icon={CheckSquare} />
            <Stat label="Blocked" value="2" icon={AlertTriangle} variant="warning" />
            <Stat label="Completed This Week" value="7" icon={Target} variant="success" />
          </div>
          
          <div className="space-y-3">
            <MilestoneItem label="MVP Launch" progress={85} status="on-track" />
            <MilestoneItem label="Beta Users" progress={60} status="on-track" />
            <MilestoneItem label="Seed Round Close" progress={40} status="at-risk" />
          </div>
        </Section>

        {/* ================= FUNDRAISING ================= */}
        <Section
          icon={DollarSign}
          title="Fundraising"
          subtitle="Capital & investors"
          action={{ label: "Open Dashboard", href: "/fundraising" }}
          accentColor="green"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Stat label="Raised" value="$420k" icon={DollarSign} />
            <Stat label="Target" value="$1M" icon={Target} />
            <Stat label="Investor Leads" value="23" icon={Users} />
            <Stat label="Active Conversations" value="8" icon={Zap} />
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Funding Progress</span>
              <span className="text-green-400 font-medium">42%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                style={{ width: "42%" }}
              />
            </div>
          </div>
        </Section>

        {/* ================= REPORTS & FILES ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Reports */}
          <Section
            icon={BarChart3}
            title="Reports"
            subtitle="Operational KPIs"
            action={{ label: "View Reports", href: "/reports" }}
            accentColor="cyan"
          >
            <div className="space-y-3">
              <StatRow label="Growth" value="↑ 12% WoW" variant="success" />
              <StatRow label="Burn Rate" value="$38k / mo" />
              <StatRow label="Runway" value="11 months" />
              <StatRow label="Velocity" value="Stable" variant="success" />
            </div>
          </Section>

          {/* Files */}
          <Section
            icon={Folder}
            title="Files"
            subtitle="Core documents"
            action={{ label: "View All", href: "/files" }}
            accentColor="orange"
          >
            <div className="flex flex-wrap gap-2">
              <FileChip label="Pitch Deck" href="/files/pitch-deck" updated />
              <FileChip label="Business Plan" href="/files/business-plan" />
              <FileChip label="Legal Docs" href="/files/legal" />
              <FileChip label="Media Kit" href="/files/media-kit" />
              <FileChip label="Cap Table" href="/files/cap-table" />
              <FileChip label="Financials" href="/files/financials" />
            </div>
          </Section>
        </div>

        {/* ================= AI TOOLS PROMO ================= */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-indigo-900/30 border border-pink-500/20 p-6 sm:p-8">
          <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">AI-Powered Tools</h3>
                <p className="text-sm text-white/60">
                  Generate business plans, pitch decks, logos, and more
                </p>
              </div>
            </div>
            
            <Link
              to="/ai-tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium transition-all duration-300 hover:scale-105"
            >
              Explore AI Tools
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function Section({ icon: Icon, title, subtitle, children, action, accentColor = "purple" }) {
  const colorMap = {
    purple: "text-purple-400",
    emerald: "text-emerald-400",
    blue: "text-blue-400",
    amber: "text-amber-400",
    green: "text-green-400",
    cyan: "text-cyan-400",
    orange: "text-orange-400",
    pink: "text-pink-400",
  };

  return (
    <section className="rounded-xl bg-white/[0.03] border border-white/10 p-5 sm:p-6 space-y-4">
      <div className="flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className={`w-5 h-5 ${colorMap[accentColor]} flex-shrink-0`} />
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-white">{title}</h3>
            <p className="text-xs text-white/50">{subtitle}</p>
          </div>
        </div>
        
        {action && (
          <Link
            to={action.href}
            className="text-xs font-medium text-white/50 hover:text-white flex items-center gap-1 transition-colors"
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

function QuickStat({ label, value, icon: Icon, trend }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10">
      <Icon className="w-4 h-4 text-purple-400" />
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-lg font-semibold text-white">{value}</p>
          {trend && (
            <span className={`text-xs ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value, highlight }) {
  return (
    <div className={`rounded-lg px-4 py-2.5 ${highlight ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5 border border-white/10'}`}>
      <p className="text-xs text-white/50">{label}</p>
      <p className={`text-base sm:text-lg font-semibold ${highlight ? 'text-purple-300' : 'text-white'}`}>{value}</p>
    </div>
  );
}

function StartupCard({ startup }) {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 p-5 transition-all duration-300">
      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/5 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center text-2xl">
            {startup.logo}
          </div>
          <div>
            <h4 className="font-semibold text-white">{startup.name}</h4>
            <p className="text-xs text-white/50">{startup.stage} • {startup.traction}</p>
          </div>
        </div>
        
        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="w-4 h-4 text-white/50" />
        </button>
      </div>
      
      {/* Progress */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-white/50">Overall Progress</span>
          <span className="text-purple-400 font-medium">{startup.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400"
            style={{ width: `${startup.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">
          <Users className="w-3 h-3 inline mr-1" />
          {startup.team} members
        </span>
        <span className={`px-2 py-1 rounded-full ${startup.funding === 'Raising' ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}`}>
          {startup.funding}
        </span>
      </div>
      
      <Link
        to={`/my-startups/${startup.id}`}
        className="absolute inset-0"
        aria-label={`View ${startup.name}`}
      />
    </div>
  );
}

function ActivityItem({ activity }) {
  const Icon = activity.icon;
  
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] transition-colors cursor-pointer">
      <div className="p-2 rounded-lg bg-amber-500/10">
        <Icon className="w-4 h-4 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{activity.message}</p>
        <p className="text-xs text-white/40">{activity.time}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-white/30" />
    </div>
  );
}

function Stat({ label, value, icon: Icon, variant }) {
  const variantStyles = {
    default: "bg-white/5 border-white/10",
    success: "bg-green-500/10 border-green-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
  };
  
  const iconStyles = {
    default: "text-blue-400",
    success: "text-green-400",
    warning: "text-amber-400",
  };

  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant || 'default']}`}>
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className={`w-4 h-4 ${iconStyles[variant || 'default']}`} />}
        <p className="text-xs text-white/50">{label}</p>
      </div>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function StatRow({ label, value, variant, highlight }) {
  return (
    <div className={`flex justify-between items-center py-2 px-3 rounded-lg ${highlight ? 'bg-purple-500/10' : 'hover:bg-white/[0.02]'} transition-colors`}>
      <span className="text-sm text-white/70">{label}</span>
      <span className={`text-sm font-medium ${
        variant === 'success' ? 'text-green-400' : 
        variant === 'warning' ? 'text-amber-400' : 
        highlight ? 'text-purple-400' : 'text-white'
      }`}>
        {value}
      </span>
    </div>
  );
}

function MilestoneItem({ label, progress, status }) {
  const statusStyles = {
    "on-track": { bg: "bg-green-500", text: "text-green-400", label: "On Track" },
    "at-risk": { bg: "bg-amber-500", text: "text-amber-400", label: "At Risk" },
    "delayed": { bg: "bg-red-500", text: "text-red-400", label: "Delayed" },
  };
  
  const style = statusStyles[status];

  return (
    <div className="p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white">{label}</span>
        <span className={`text-xs ${style.text}`}>{style.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div 
            className={`h-full rounded-full ${style.bg}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-white/50 w-8">{progress}%</span>
      </div>
    </div>
  );
}

function FileChip({ label, href, updated }) {
  return (
    <Link
      to={href}
      className="group relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all"
    >
      <Folder className="w-3.5 h-3.5 text-orange-400" />
      <span className="text-xs font-medium text-white/80 group-hover:text-white transition-colors">
        {label}
      </span>
      {updated && (
        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
      )}
    </Link>
  );
}