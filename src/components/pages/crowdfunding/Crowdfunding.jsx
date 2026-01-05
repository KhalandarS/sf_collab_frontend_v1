import { ArrowRight, Crown, Shield, Rocket, Star } from "lucide-react";

const tiers = [
  {
    id: "early",
    title: "Early Pioneer",
    price: "$39",
    note: "One-time",
    description: "For early believers",
    accent: "indigo",
    cta: "Claim Early Access",
    features: [
      "Lifetime Pro access",
      "Beta access",
      "Pioneer badge",
      "Priority support",
    ],
    limit: "100 spots",
  },
  {
    id: "builder",
    title: "Professional Builder",
    price: "$99",
    note: "One-time",
    description: "Most popular",
    highlight: true,
    accent: "violet",
    cta: "Upgrade to Pro",
    features: [
      "2 years Pro access",
      "Advanced analytics",
      "Custom domain (1 year)",
      "Priority support",
    ],
  },
  {
    id: "agency",
    title: "Agency Partner",
    price: "$299",
    note: "One-time",
    description: "Teams & studios",
    accent: "slate",
    cta: "Scale with SFCollab",
    features: [
      "3 years Pro access",
      "5 team seats",
      "White-label options",
      "Dev team access",
    ],
  },
  {
    id: "founder",
    title: "Founding Member",
    price: "$999",
    note: "Lifetime",
    description: "Shape the platform",
    accent: "gold",
    crown: true,
    cta: "Become a Member",
    features: [
      "Lifetime access (10 users)",
      "Monthly founder calls",
      "Feature priority",
      "All future products",
    ],
    limit: "50 spots",
  },
];

export default function CrowdfundingSection() {
  return (
    <section className="h-full relative py-24 px-6 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto space-y-16">

        {/* ================= HEADER ================= */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Support SFCollab.{" "}
            <span className="text-indigo-400">Unlock the future.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Early supporters unlock permanent advantages and help shape how
            collaboration platforms are built.
          </p>
        </header>

        {/* ================= TIERS ================= */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border backdrop-blur-sm p-6 flex flex-col
                ${
                  tier.highlight
                    ? "border-violet-400/40 bg-violet-500/10 shadow-xl"
                    : tier.accent === "gold"
                    ? "border-yellow-500/40 bg-yellow-500/5"
                    : "border-white/10 bg-white/5"
                }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-violet-500 text-white font-semibold">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-2 mb-2">
                {tier.crown && <Crown className="w-5 h-5 text-yellow-400" />}
                <h3 className="text-lg font-semibold">{tier.title}</h3>
              </div>

              <p className="text-xs text-white/50 mb-4">{tier.description}</p>

              <div className="mb-6">
                <p className="text-3xl font-bold">{tier.price}</p>
                <p className="text-xs text-white/40">{tier.note}</p>
              </div>

              <ul className="space-y-2 text-sm text-white/70 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Star className="w-4 h-4 text-indigo-400" />
                    {f}
                  </li>
                ))}
              </ul>
                {tier.limit && (
                <p className="mt-3 text-xs text-center text-red-400">
                  🔥 Limited: {tier.limit}
                </p>
              )}
              <button
                className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition
                  ${
                    tier.highlight
                      ? "bg-violet-500 hover:bg-violet-600"
                      : tier.accent === "gold"
                      ? "bg-yellow-500 text-black hover:opacity-90"
                      : "border border-white/20 hover:bg-white/10"
                  }`}
              >
                {tier.cta}
                <ArrowRight className="w-4 h-4" />
              </button>

              
            </div>
          ))}
        </div>

        {/* ================= INVESTOR ================= */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold">Investor Partner</h2>
            </div>
            <p className="text-white/60 mb-4">
              For strategic partners interested in equity or revenue alignment.
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Equity or revenue participation</li>
              <li>• Quarterly updates</li>
              <li>• Founder communication channel</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <button className="rounded-xl border border-white/20 py-3 font-semibold hover:bg-white/10">
              Request Investor Deck
            </button>
            <p className="text-xs text-white/40 mt-3">
              Application-based · $1k – $50k
            </p>
          </div>
        </section>

      </div>
    </section>
  );
}
