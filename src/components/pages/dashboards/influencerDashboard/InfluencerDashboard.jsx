import {
  Megaphone,
  BarChart3,
  Link2,
  DollarSign,
  Users,
  Trophy,
  Layers,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardChangeSection from "../dashboardChangeSection";

export default function InfluencerDashboard({
  userRoles,
  activeRole,
  setActiveRole,
}) {
  return (
    <div className="relative my-6 space-y-10">
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

      <div className="relative z-10 space-y-10">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-pink-400" />
            Influencer Dashboard
          </h2>

          <p className="text-sm text-white/60 max-w-3xl">
            Run campaigns, track performance, manage payouts, and grow your
            influence inside the SF ecosystem.
          </p>

          <div className="flex flex-wrap gap-3">
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
          <div className="grid sm:grid-cols-2 gap-4">
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
            className="inline-block mt-4 text-pink-300 hover:underline text-sm"
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
          <div className="grid sm:grid-cols-3 gap-4">
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
          <div className="space-y-2 text-sm text-white">
            <Row label="Active Referral Links" value="5" />
            <Row label="UTM Campaigns" value="3" />
            <Row label="Media Kit Files" value="Available" />
          </div>

          <Link
            to="/influencer/referrals"
            className="inline-block mt-4 text-pink-300 hover:underline text-sm"
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
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat label="Earned" value="$3,260" />
            <Stat label="Pending" value="$740" />
            <Stat label="Paid Out" value="$2,520" />
          </div>

          <Link
            to="/influencer/payouts"
            className="inline-block mt-4 text-pink-300 hover:underline text-sm"
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
          <div className="space-y-2 text-sm text-white">
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
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat label="Rank" value="#12" />
            <Stat label="Total Influencers" value="1,240" />
            <Stat label="Bonus Tier" value="Silver" />
          </div>

          <Link
            to="/influencer/leaderboard"
            className="inline-block mt-4 text-pink-300 hover:underline text-sm"
          >
            View leaderboard →
          </Link>
        </Section>

      </div>
    </div>
  );
}

/* ================= SUBCOMPONENTS ================= */

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-pink-400" />
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
    <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function CampaignCard({ name, status, roi }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="font-semibold text-white">{name}</p>
      <p className="text-xs text-white/60 mt-1">
        Status: {status}
      </p>
      <p className="text-xs text-pink-300 mt-1">
        ROI: {roi}
      </p>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="text-xs text-white/60">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="text-white/70">{value}</span>
    </div>
  );
}
