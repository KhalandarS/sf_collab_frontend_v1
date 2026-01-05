import {
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Award,
  Users,
  MessageCircle,
  Layers,
} from "lucide-react";
import { Link } from "react-router-dom";
import DashboardChangeSection from "../dashboardChangeSection";

export default function BuilderDashboard({
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

      {/* Role switcher */}
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
            <Layers className="w-6 h-6 text-emerald-400" />
            Builder Dashboard
          </h2>

          <p className="text-sm text-white/60 max-w-3xl">
            Find work, collaborate with startups, deliver high-quality output,
            and earn rewards based on performance.
          </p>

          <div className="flex flex-wrap gap-3">
            <KPI label="Tasks Completed" value="18" />
            <KPI label="On-Time Delivery" value="94%" />
            <KPI label="Monthly Earnings" value="$1,240" />
            <KPI label="Reputation" value="★ 4.7" />
          </div>
        </div>

        {/* ================= TASKS AVAILABLE ================= */}
        <Section
          icon={Briefcase}
          title="Tasks Available"
          subtitle="Marketplace — apply and start building"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <TaskCard
              title="Landing Page (React)"
              reward="$300"
              type="Cash"
              difficulty="Medium"
            />
            <TaskCard
              title="AI Prompt Evaluation"
              reward="0.25% equity"
              type="Equity"
              difficulty="Hard"
            />
          </div>

          <Link
            to="/builder/tasks"
            className="inline-block mt-4 text-emerald-300 hover:underline text-sm"
          >
            Browse all tasks →
          </Link>
        </Section>

        {/* ================= MY APPLICATIONS ================= */}
        <Section
          icon={Clock}
          title="My Applications"
          subtitle="Track your applications status"
        >
          <StatusRow label="Pending" value={3} />
          <StatusRow label="Accepted" value={2} />
          <StatusRow label="Rejected" value={1} />
        </Section>

        {/* ================= MY WORK ================= */}
        <Section
          icon={CheckCircle}
          title="My Work"
          subtitle="Active tasks and deliverables"
        >
          <WorkItem
            title="Startup Website UI"
            due="Oct 18"
            status="In Progress"
          />
          <WorkItem
            title="Backend API Fixes"
            due="Oct 12"
            status="Review"
          />
        </Section>

        {/* ================= REWARDS ================= */}
        <Section
          icon={DollarSign}
          title="Rewards"
          subtitle="Earnings, equity & reputation"
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat label="Paid Earnings" value="$3,840" />
            <Stat label="Pending Payouts" value="$620" />
            <Stat label="Equity Promises" value="1.75%" />
          </div>
        </Section>

        {/* ================= SKILL PROFILE ================= */}
        <Section
          icon={Award}
          title="Skill Profile"
          subtitle="Verified skills and reputation"
        >
          <div className="flex flex-wrap gap-2">
            <SkillBadge label="React" />
            <SkillBadge label="Node.js" />
            <SkillBadge label="UI/UX" />
            <SkillBadge label="AI Prompting" />
          </div>

          <Link
            to="/builder/profile"
            className="inline-block mt-4 text-emerald-300 hover:underline text-sm"
          >
            View full profile →
          </Link>
        </Section>

        {/* ================= COLLABORATION ================= */}
        <Section
          icon={Users}
          title="Collaboration"
          subtitle="Teams, messages & recommendations"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <CollabCard
              icon={MessageCircle}
              title="Messages"
              desc="2 unread conversations"
            />
            <CollabCard
              icon={Star}
              title="Recommended Startups"
              desc="3 matches based on skills"
            />
          </div>
        </Section>

      </div>
    </div>
  );
}

/* ================= SHARED COMPONENTS ================= */

function Section({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-emerald-400" />
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

function TaskCard({ title, reward, type, difficulty }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4">
      <p className="font-medium text-white">{title}</p>
      <p className="text-sm text-white/60">
        {reward} • {type} • {difficulty}
      </p>
    </div>
  );
}

function StatusRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm text-white">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function WorkItem({ title, due, status }) {
  return (
    <div className="flex justify-between text-sm text-white">
      <span>{title}</span>
      <span className="text-white/60">
        Due {due} • {status}
      </span>
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

function SkillBadge({ label }) {
  return (
    <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-xs text-white">
      {label}
    </span>
  );
}

function CollabCard({ icon: Icon, title, desc }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
      <Icon className="w-5 h-5 text-emerald-400" />
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-white/60">{desc}</p>
      </div>
    </div>
  );
}
