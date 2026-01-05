import {
  PieChart,
  TrendingUp,
  AlertTriangle,
  FileText,
  BarChart3,
  Layers,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardChangeSection from "../dashboardChangeSection";

export default function InvestorDashboard({
  userRoles, activeRole, setActiveRole
}) {
  return (
    <div className="relative my-6 space-y-10">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none
  bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_1px)]
  bg-[length:20px_20px]" />
      <DashboardChangeSection  sections={userRoles.map(role => ({
                    id: role,
                    label: role.charAt(0).toUpperCase() + role.slice(1)
                  }))} onSectionChange={(sectionId) => {
                    setActiveRole(sectionId);
                    localStorage.setItem('activeRole', sectionId);
                  }} activeRole={activeRole}/>
      <div className="relative z-10 space-y-8">

        {/* ================= HEADER ================= */}
        <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm p-5 sm:p-6 lg:p-8">
          <header className="flex flex-col lg:flex-row justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                <Layers className="w-7 h-7 text-blue-300" />
                Investor Dashboard
              </h2>
              <p className="text-white/70 max-w-2xl mt-2">
                Track portfolio performance, startup progress, risk exposure,
                and investment outcomes in real time.
              </p>
            </div>

            <div className="flex gap-3">
              <KPI label="Portfolio Health" value="82%" />
              <KPI label="Risk Level" value="Moderate" />
            </div>
          </header>
        </div>
      
        {/* ================= PORTFOLIO ================= */}
        <Section
          icon={PieChart}
          title="Portfolio Allocation"
          subtitle="Active investments and capital distribution"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <PortfolioCard name="NeuroForge" allocation="35%" stage="Seed" />
            <PortfolioCard name="BuildAI" allocation="25%" stage="Pre-Seed" />
            <PortfolioCard name="MetaOps" allocation="40%" stage="Series A" />
          </div>
        </Section>

        {/* ================= PROGRESS ================= */}
        <Section
          icon={TrendingUp}
          title="Startup Progress"
          subtitle="Execution vs plan"
        >
          <ProgressRow label="Milestones" value={68} />
          <ProgressRow label="Traction" value={54} />
          <ProgressRow label="Fundraising" value={80} />
        </Section>

        {/* ================= ANALYTICS ================= */}
        <Section
          icon={BarChart3}
          title="Investment Analytics (MVP)"
          subtitle="Model-assisted estimates"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <StatCard
              label="Expected Return Range"
              value="2.1× – 4.6×"
            />
            <StatCard
              label="Risk Score"
              value="0.38"
              hint="Lower is better"
            />
            <StatCard
              label="Potential Success"
              value="High"
            />
          </div>
        </Section>

        {/* ================= UPDATES ================= */}
        <Section
          icon={FileText}
          title="Founder Updates"
          subtitle="Reports, posts, documents"
        >
          <ul className="space-y-3 text-sm text-white/80">
            <li>📄 NeuroForge — Monthly Progress Report</li>
            <li>📢 BuildAI — Founder Update: Pivot Announcement</li>
            <li>📄 MetaOps — Updated Pitch Deck</li>
          </ul>

          <Link
            to="/investor/updates"
            className="inline-block mt-4 text-blue-300 hover:underline"
          >
            View all updates →
          </Link>
        </Section>

        {/* ================= DEAL FLOW ================= */}
        <Section
          icon={Star}
          title="Deal Flow"
          subtitle="Recommended & watchlisted startups"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <DealCard name="GridMind" tag="Recommended" />
            <DealCard name="VisionStack" tag="Watchlist" />
          </div>
        </Section>

        {/* ================= DOCUMENTS ================= */}
        <Section
          icon={FileText}
          title="Documents"
          subtitle="Legal & financial (early)"
        >
          <div className="flex flex-wrap gap-3 text-sm">
            <DocChip label="Pitch Decks" />
            <DocChip label="Term Sheets" disabled />
            <DocChip label="Cap Tables" disabled />
          </div>
        </Section>

      </div>
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm p-5 sm:p-6 lg:p-8 space-y-4">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-300" />
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-xs text-white/60">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function KPI({ label, value }) {
  return (
    <div className="rounded-xl bg-blue-500/20 border border-blue-400/30 px-4 py-3 text-center">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function PortfolioCard({ name, allocation, stage }) {
  return (
    <div className="rounded-xl bg-blue-500/10 border border-blue-400/30 p-4">
      <p className="font-semibold text-white">{name}</p>
      <p className="text-sm text-white/60">{stage}</p>
      <p className="text-blue-300 font-medium mt-2">{allocation}</p>
    </div>
  );
}

function ProgressRow({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-white">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full bg-green-400"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-xl bg-blue-500/10 border border-blue-400/30 p-4">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
      {hint && <p className="text-xs text-white/40">{hint}</p>}
    </div>
  );
}

function DealCard({ name, tag }) {
  return (
    <div className="rounded-xl bg-red-500/10 border border-red-400/30 p-4 flex justify-between items-center">
      <span className="text-white">{name}</span>
      <span className="text-xs px-2 py-1 rounded-full bg-red-500/30 border border-red-400/40 text-white">
        {tag}
      </span>
    </div>
  );
}

function DocChip({ label, disabled }) {
  return (
    <span
      className={`px-3 py-1.5 rounded-full border text-xs ${
        disabled
          ? "bg-white/5 border-white/10 text-white/40"
          : "bg-purple-500/20 border-purple-400/40 text-white"
      }`}
    >
      {label}
    </span>
  );
}
