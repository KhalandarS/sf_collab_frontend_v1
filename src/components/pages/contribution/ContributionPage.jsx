import { Link } from "react-router-dom";
import {
  Lightbulb,
  Users,
  Vote,
  Rocket,
  ArrowRight,
  Lock,
  Gift,
} from "lucide-react";

/* ================= DATA ================= */

const contributionActions = [
  {
    title: "Submit an Idea",
    description:
      "Propose product ideas, features, or improvements that shape SFCollab.",
    points: "5–75 points",
    icon: Lightbulb,
    cta: "Submit Idea",
    to: "/contribute-ideas",
    tone: "primary",
    available: true,
  },
  {
    title: "Refer Friends",
    description:
      "Invite builders or founders. Earn points for every verified referral.",
    points: "5 points / referral",
    bonus: "+25 points every 5 referrals",
    icon: Users,
    cta: "Get Referral Link",
    to: "/refer",
    tone: "neutral",
    available: true,
  },
  {
    title: "Vote in Polls",
    description:
      "Help guide product decisions by voting on community polls.",
    points: "1–3 points per vote",
    icon: Vote,
    cta: "View Polls",
    to: "/contribute-polls",
    tone: "neutral",
    available: true,
  },
  {
    title: "Crowdfunding Access",
    description:
      "Support SFCollab early and unlock discounted lifetime access.",
    points: "Early access + bonuses",
    icon: Rocket,
    cta: "Coming Soon",
    to: "/crowdfunding",
    tone: "locked",
    available: true,
  },
];

/* ================= PAGE ================= */

export default function ContributionPage() {
  const userPoints = 42;
  const currentStage = "Waitlist — Stage 2";
  const nextUnlock = "Stage 3 (75 points)";

  return (
    <div className="min-h-screen bg-radial from-purple-950 to-black px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ================= HEADER ================= */}
        <section className="space-y-4">
          <h1 className="text-4xl font-semibold">
            Contribute to Unlock Access
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Meaningful contributions move you forward. Earn points to unlock
            features, access, and early benefits.
          </p>

          <div className="flex flex-wrap gap-4 pt-6">
            <StatusCard label="Your Points" value={userPoints} />
            <StatusCard label="Current Stage" value={currentStage} />
            <StatusCard label="Next Unlock" value={nextUnlock} />
          </div>
        </section>

        {/* ================= ACTIONS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contributionActions.map((action) => (
            <ActionCard key={action.title} action={action} />
          ))}
        </section>

        {/* ================= INFO ================= */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Gift className="h-5 w-5 text-indigo-400" />
            How Points Work
          </h2>

          <ul className="text-sm text-gray-400 space-y-2 list-disc list-inside">
            <li>Small contributions: <b>5–15 points</b></li>
            <li>Medium contributions: <b>15–35 points</b></li>
            <li>High-impact contributions: <b>25–75 points</b></li>
            <li>
              Every <b>5 referrals</b> grants a <b>25-point bonus</b>
            </li>
            <li>Points affect waitlist priority and feature access</li>
          </ul>
        </section>

        {/* ================= FOOT NOTE ================= */}
        <p className="text-sm text-gray-500 max-w-3xl">
          Access is released in stages. Active contributors progress
          significantly faster than inactive users.
        </p>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ActionCard({ action }) {
  const Icon = action.icon;

  const toneStyles = {
    primary:
      "border-indigo-400/30 bg-indigo-500/10 hover:bg-indigo-500/15",
    neutral:
      "border-white/10 bg-white/5 hover:bg-white/10",
    locked:
      "border-amber-400/20 bg-amber-500/10 opacity-70",
  };

  return (
    <div
      className={`rounded-2xl border p-6 transition-colors ${toneStyles[action.tone]}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-xl bg-black/40 border border-white/10">
          <Icon className="h-5 w-5 text-indigo-300" />
        </div>
        <h3 className="text-lg font-semibold">{action.title}</h3>
      </div>

      <p className="text-sm text-gray-400 mb-4">
        {action.description}
      </p>

      <div className="text-sm space-y-1">
        <p className="text-white font-medium">{action.points}</p>
        {action.bonus && (
          <p className="text-emerald-400 text-xs">{action.bonus}</p>
        )}
      </div>

      <div className="mt-6">
        {action.available ? (
          <Link
            to={action.to}
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-200"
          >
            {action.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <Lock className="h-4 w-4" />
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}

function StatusCard({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 min-w-[160px]">
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="text-lg font-semibold mt-1">{value}</p>
    </div>
  );
}
