import { Link } from "react-router-dom";
import {
  Lightbulb,
  Users,
  Vote,
  BookOpen,
  Rocket,
  ArrowRight,
  Lock,
  Gift
} from "lucide-react";
const contributionActions = [
  {
    title: "Submit an Idea",
    description:
      "Share product ideas, features, or improvements that help shape SFCollab.",
    points: "5–75 points",
    icon: Lightbulb,
    cta: "Submit Idea",
    to: "/contribute-ideas",
    // Thinking / creation → indigo (calm, smart)
    color: "from-indigo-500/20 to-indigo-400/10",
    available: true,
  },
  {
    title: "Refer Friends",
    description:
      "Invite builders, founders, or creators. Earn points for each successful referral.",
    points: "5 points / referral",
    bonus: "+25 points every 5 referrals",
    icon: Users,
    cta: "Get Referral Link",
    to: "/refer",
    // Networking → slate + blue accent
    color: "from-slate-500/20 to-blue-500/10",
    available: true,
  },
  {
    title: "Vote in Polls",
    description:
      "Help us make decisions by voting on community and product polls.",
    points: "1–3 points per vote",
    icon: Vote,
    cta: "View Polls",
    to: "/contribute-polls",
    // Community / governance → purple (on-brand)
    color: "from-purple-500/20 to-pink-500/10",
    available: true,
  },
  {
    title: "Crowdfunding Access",
    description:
      "Support SFCollab early and unlock discounted lifetime access.",
    points: "Early access + bonuses",
    icon: Rocket,
    cta: "Coming Soon",
    // Premium / future → muted amber (not hype)
    color: "from-amber-400/20 to-orange-400/10",
    available: false,
  },
];


export default function ContributionPage() {
  // These will later come from backend
  const userPoints = 42;
  const currentStage = "Waitlist – Stage 2";
  const nextUnlock = "Stage 3 (75 points)";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 px-6 py-10 text-white">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* ================= HERO ================= */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold">
            Contribute to Move Faster 🚀
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            SFCollab rewards real contributions. The more you help shape the
            platform, the faster you unlock access and benefits.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <StatusCard label="Your Points" value={`${userPoints}`} />
            <StatusCard label="Current Stage" value={currentStage} />
            <StatusCard label="Next Unlock" value={nextUnlock} />
          </div>
        </section>

        {/* ================= ACTIONS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {contributionActions.map((action) => {
            const Icon = action.icon;

            return (
              <div
                key={action.title}
                className={`relative rounded-2xl border border-white/10 bg-gradient-to-br ${action.color} backdrop-blur-sm overflow-hidden`}
              >
                <div
                  className='absolute inset-0 opacity-20  '
                />

                <div className="relative z-10 p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-black/30 border border-white/10">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">
                      {action.title}
                    </h3>
                  </div>

                  <p className="text-sm text-gray-300 flex-1">
                    {action.description}
                  </p>

                  <div className="mt-4 space-y-1 text-sm">
                    <p className="text-white font-medium">
                      {action.points}
                    </p>
                    {action.bonus && (
                      <p className="text-green-400 text-xs">
                        {action.bonus}
                      </p>
                    )}
                  </div>

                  <div className="mt-6">
                    {action.available ? (
                      <Link
                        to={action.to}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:underline"
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
              </div>
            );
          })}
        </section>

        {/* ================= POINTS EXPLANATION ================= */}
        <section className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Gift className="h-6 w-6 text-yellow-400" />
            How Points Work
          </h2>

          <ul className="text-sm text-gray-300 space-y-2 list-disc list-inside">
            <li>Small contributions earn <b>5–15 points</b></li>
            <li>Medium contributions earn <b>15–35 points</b></li>
            <li>High-impact contributions earn <b>25–75 points</b></li>
            <li>
              Every <b>5 successful referrals</b> grants a <b>25-point bonus</b>
            </li>
            <li>
              Points determine waitlist priority and early access eligibility
            </li>
          </ul>
        </section>

        {/* ================= SCARCITY ================= */}
        <section className="text-center text-sm text-gray-400 max-w-3xl mx-auto">
          Access is released in <b>stages</b>. Users who do not contribute may
          wait <b>months</b> for access. Contributing — or participating in early
          crowdfunding — significantly improves your position.
        </section>
      </div>
    </div>
  );
}

function StatusCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 px-6 py-4 min-w-[160px]">
      <p className="text-xs uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <p className="text-lg font-semibold text-white mt-1">
        {value}
      </p>
    </div>
  );
}
