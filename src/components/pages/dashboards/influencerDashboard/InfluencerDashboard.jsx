import {
  Megaphone,
  BarChart3,
  Link2,
  DollarSign,
  Users,
  Trophy,
  Layers,
  TrendingUp,
  Zap,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardChangeSection from "../dashboardChangeSection";
import KnowledgeResources from "@/components/pages/dashboards/influencerDashboard/components/KnowledgeResources";
import DashboardTopNav from "@/components/common/DashboardTopNav";
import { useDashboardNavHide } from "@/components/common/DashboardTopNav";

export default function InfluencerDashboard({
  userRoles,
  activeRole,
  setActiveRole,
}) {
  // Sticky navigation visibility
  const isNavHidden = useDashboardNavHide();

  // Navigation links
  const dashboardLinks = [
    { label: 'Overview', href: '/dashboard', icon: Zap },
    { label: 'My Campaigns', href: '/influencer/campaigns', icon: Megaphone },
    { label: 'Performance', href: '/influencer/performance', icon: TrendingUp },
  ];

  return (
    <>
      {/* Sticky top navigation */}
      <DashboardTopNav links={dashboardLinks} isHidden={isNavHidden} />

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
            <Layers className="w-5 sm:w-6 h-5 sm:h-6 text-pink-400 flex-shrink-0" />
            <span>Influencer Dashboard</span>
          </h2>

          <p className="text-xs sm:text-sm text-white/60 max-w-3xl leading-relaxed">
            Run campaigns, track performance, manage payouts, and grow your
            influence inside the SF ecosystem.
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <KPI label="Total Clicks" value="18,420" />
            <KPI label="Conversion Rate" value="4.8%" />
            <KPI label="Revenue Generated" value="$3,260" />
            <KPI label="Payout Balance" value="$740" />
          </div>
        </div>

        {/* ================= CAMPAIGNS ================= */}
        <Section
          icon={Megaphone}
          title="Campaigns"
          subtitle="Active, upcoming, and completed"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
            <CampaignCard
              name="NeuroForge Launch"
              status="Active"
              roi="2.4×"
            />
            <CampaignCard
              name="BuildAI Waitlist"
              status="Completed"
              roi="1.9×"
            />
          </div>

          <Link
            to="/influencer/campaigns"
            className="inline-block mt-3 sm:mt-4 text-pink-300 hover:underline text-xs sm:text-sm"
          >
            View all campaigns →
          </Link>
        </Section>

        {/* ================= STATISTICS ================= */}
        <Section
          icon={BarChart3}
          title="Performance Statistics"
          subtitle="Core campaign metrics"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <Stat label="Views" value="92k" />
            <Stat label="Clicks" value="18.4k" />
            <Stat label="Conversions" value="884" />
            <Stat label="CTR" value="4.8%" />
            <Stat label="CPA" value="$3.69" />
            <Stat label="ROI" value="2.1×" />
          </div>
        </Section>

        {/* ================= REFERRAL LINKS ================= */}
        <Section
          icon={Link2}
          title="Referral Links & Assets"
          subtitle="Tracking links and promo materials"
        >
          <div className="space-y-2 text-xs sm:text-sm text-white">
            <Row label="Active Referral Links" value="5" />
            <Row label="UTM Campaigns" value="3" />
            <Row label="Media Kit Files" value="Available" />
          </div>

          <Link
            to="/influencer/referrals"
            className="inline-block mt-3 sm:mt-4 text-pink-300 hover:underline text-xs sm:text-sm"
          >
            Manage referral assets →
          </Link>
        </Section>

        {/* ================= PAYOUTS ================= */}
        <Section
          icon={DollarSign}
          title="Payouts"
          subtitle="Earnings and withdrawals"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <Stat label="Earned" value="$3,260" />
            <Stat label="Pending" value="$740" />
            <Stat label="Paid Out" value="$2,520" />
          </div>

          <Link
            to="/influencer/payouts"
            className="inline-block mt-3 sm:mt-4 text-pink-300 hover:underline text-xs sm:text-sm"
          >
            View payouts →
          </Link>
        </Section>

        {/* ================= AUDIENCE PROFILE ================= */}
        <Section
          icon={Users}
          title="Audience Profile"
          subtitle="Who you reach"
        >
          <div className="space-y-2 text-xs sm:text-sm text-white">
            <Row label="Primary Niche" value="Tech / Startups" />
            <Row label="Top Regions" value="US, EU, LATAM" />
            <Row label="Platforms" value="X, YouTube, TikTok" />
            <Row label="Verification" value="Verified" />
          </div>
        </Section>

        {/* ================= LEADERBOARD ================= */}
        <Section
          icon={Trophy}
          title="Leaderboard"
          subtitle="Your position in the ecosystem"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
            <Stat label="Rank" value="#12" />
            <Stat label="Total Influencers" value="1,240" />
            <Stat label="Bonus Tier" value="Silver" />
          </div>

          <Link
            to="/influencer/leaderboard"
            className="inline-block mt-3 sm:mt-4 text-pink-300 hover:underline text-xs sm:text-sm"
          >
            View leaderboard →
          </Link>
        </Section>

        {/* ================= KNOWLEDGE RESOURCES ================= */}
        <section className="rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6">
          <KnowledgeResources />
        </section>

      </div>
    </div>
    </>
  );
}

/* ================= SUBCOMPONENTS ================= */

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-lg sm:rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 space-y-3 sm:space-y-4">
      <div className="flex items-start sm:items-center gap-2 sm:gap-3">
        <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-pink-400 flex-shrink-0 mt-0.5 sm:mt-0" />
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

function CampaignCard({ name, status, roi }) {
  return (
    <div className="rounded-lg sm:rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4 min-h-[80px] flex flex-col justify-between">
      <div>
        <p className="font-semibold text-sm sm:text-base text-white break-words">{name}</p>
        <p className="text-xs text-white/60 mt-1 sm:mt-2">
          Status: {status}
        </p>
      </div>
      <p className="text-xs text-pink-300 mt-2 sm:mt-3">
        ROI: {roi}
      </p>
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
      <span className="text-white truncate">{label}</span>
      <span className="text-white/70 flex-shrink-0">{value}</span>
    </div>
  );
}
