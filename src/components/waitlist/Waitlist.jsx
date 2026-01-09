import { Link } from "react-router-dom";
import { WaitlistSignup } from "./components/WaitlistSignup";
import { Toaster } from "./components/ui/toaster";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Sparkles, Users, Award, Zap, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const POINT_VALUES = {
  referral: { points: 2, label: "Valid Referral" },
  small_contribution: { points: 10, label: "Small Contribution" },
  contribution: { points: 25, label: "Medium Contribution" },
  large_contribution: { points: 50, label: "High-Impact Contribution" },
  // engagement: { points: 1, label: "Weekly Engagement" },
  early_signup: { points: 15, label: "Early Signup Bonus" },
};

const RANK_REWARDS = [
  { rank: "Top 10", reward: "Lifetime free access", badge: "🔑 Keyholder", perks: ["Private team channel", "×3 voting weight", "Guaranteed early access"] },
  { rank: "Top 100", reward: "12 months free", badge: "🥇 Gold", perks: ["Priority support", "×2 voting weight"] },
  { rank: "Top 300", reward: "6 months free", badge: "🥈 Silver", perks: ["Priority support"] },
  { rank: "Top 1,000", reward: "1–2 months free", badge: "🥉 Bronze (MVP)", perks: ["Early feature access", "Founding Member badge"] },
];

const CONTRIBUTION_PATHS = [
  { icon: "🔗", title: "Referrals", description: "Invite verified users (+5 pts each), each 5 users invited you get +25 extra points", fastest: true },
  { icon: "🛠", title: "Contributions", description: "Bug reports, features, testing, docs (+5–20 pts)", valuable: true },
  { icon: "💬", title: "Engagement", description: "Polls, feedback, active testing (+1 pt recurring)" },
  { icon: "⏳", title: "Early Commitment", description: "Stay active before launch (one-time bonus)" },
];

export default function Waitlist() {
  const { user } = useSelector((state) => state.auth);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-neutral-950 h-full text-white relative min-h-screen overflow-y-auto">
      {/* Floating blobs background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-linear-to-r from-blue-600/20 to-purple-700/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-linear-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12 w-full relative z-10">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4 animate-bounce-in">
            <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Waitlist Program
            </h1>
          </div>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Access is earned. Climb the ranks through contributions, referrals, and early commitment.
          </p>
        </div>

        <div className="w-full mx-auto mb-12">
          <WaitlistSignup />
        </div>
      <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="rounded-2xl bg-neutral-900 border border-neutral-800 backdrop-blur-sm p-6 hover:border-neutral-700 transition-all duration-300 w-full mx-auto mb-12"
        >
          <motion.h3 variants={itemVariants} className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
            <Zap className="h-5 w-5 text-yellow-400" />
            Waitlist Scarcity Explanation
          </motion.h3>
          <ul className="space-y-3 text-sm">
            <motion.li variants={itemVariants} className="text-white/80">
              Remaining waitlist users are added in stages.
            </motion.li>
            <motion.li variants={itemVariants} className="text-white/80">
              Without participation, users may wait months for access.
            </motion.li>
            <motion.li variants={itemVariants} className="text-white/80">
              Crowdfunding investment can provide earlier access.
            </motion.li>
          </ul>
        </motion.div>
        {/* Four Paths to Rank */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 w-full mx-auto"
        >
          {CONTRIBUTION_PATHS.map((path, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-all"
            >
              <div className="text-2xl mb-2">{path.icon}</div>
              <h3 className="font-semibold text-white mb-1">{path.title}</h3>
              <p className="text-sm text-neutral-400">{path.description}</p>
              {path.fastest && <span className="text-xs text-blue-400 font-semibold mt-2 inline-block">⚡ Fastest</span>}
              {path.valuable && <span className="text-xs text-purple-400 font-semibold mt-2 inline-block">✨ Most Valuable</span>}
            </motion.div>
          ))}
        </motion.div>

        {/* Rank & Rewards Tiers */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-12 w-full mx-auto"
        >
          <motion.h2 variants={itemVariants} className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-blue-400" />
            Rank-Based Rewards (Lifetime)
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RANK_REWARDS.map((tier, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 hover:border-neutral-700 transition-all"
              >
                <div className="text-lg font-bold text-blue-300 mb-1">{tier.badge}</div>
                <div className="text-sm text-neutral-400 mb-2">{tier.rank}</div>
                <div className="font-semibold text-white mb-3">{tier.reward}</div>
                <ul className="text-xs text-neutral-400 space-y-1">
                  {tier.perks.map((perk, i) => (
                    <li key={i}>✓ {perk}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Points System */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="rounded-2xl bg-neutral-900 border border-neutral-800 backdrop-blur-sm p-6 hover:border-neutral-700 transition-all duration-300 w-full mx-auto mb-12 relative overflow-hidden"
        >
          <div className="z-10 relative">
            <motion.h3
              variants={itemVariants}
              className="text-xl font-semibold flex items-center gap-2 text-white mb-4"
            >
              <Zap className="h-5 w-5 text-yellow-400" />
              Rank Score Formula
            </motion.h3>
            <motion.div
              variants={itemVariants}
              className="bg-neutral-800/50 rounded p-3 mb-6 border border-neutral-700 font-mono text-sm text-blue-300"
            >
              Score = (Referrals × 2) + Contributions + Engagement + Early Bonus
            </motion.div>

            <motion.h4 variants={itemVariants} className="text-sm font-semibold text-white mb-3">
              How to Earn Points
            </motion.h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(POINT_VALUES).map(([key, { points, label }]) => (
                <motion.div key={key} variants={itemVariants} className="flex justify-between bg-neutral-800/30 p-2 rounded">
                  <span className="text-neutral-400">{label}</span>
                  <span className="text-blue-300 font-semibold">+{points} pts</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full -translate-x-12 translate-y-12"></div>
        </motion.div>
        
        {/* Key Principles */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="rounded-2xl bg-neutral-900 border border-neutral-800 backdrop-blur-sm p-6 hover:border-neutral-700 transition-all duration-300 w-full mx-auto mb-12"
        >
          <motion.h3 variants={itemVariants} className="text-xl font-semibold flex items-center gap-2 text-white mb-4">
            <Heart className="h-5 w-5 text-red-400" />
            Core Principles
          </motion.h3>
          <ul className="space-y-3 text-sm">
            {[
              "Access is earned, not promised",
              "Contributions matter as much as referrals",
              "Early users are co-builders, not customers",
              "Rank snapshots lock rewards fairly",
              "No fake urgency or empty promises"
            ].map((principle, idx) => (
              <motion.li key={idx} variants={itemVariants} className="flex items-start gap-3">
                <span className="text-green-400 font-bold mt-0.5">✓</span>
                <span className="text-white/80">{principle}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <div className="my-8 w-full mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-2xl bg-neutral-900 border border-neutral-800 backdrop-blur-sm p-6 hover:border-neutral-700 transition-all duration-300"
          >
            <div className="z-10">
              <div className="mb-6">
                <motion.h3
                  variants={itemVariants}
                  className="text-xl font-semibold flex items-center gap-2 text-white mb-2"
                >
                  <Users className="h-5 w-5 text-blue-400" />
                  Release Timeline
                </motion.h3>
                <p className="text-neutral-400 text-sm">
                  Quality over speed. Your early actions determine your access.
                </p>
              </div>

              <ul className="space-y-3 text-sm mb-6">
                <motion.li
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <span className="text-blue-400 font-bold">1.</span>
                  <span className="text-white/80">
                    <span className="font-semibold text-blue-300">MVP (Jan 10)</span> — Top 1,000 ranked users + contributors
                  </span>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <span className="text-purple-400 font-bold">2.</span>
                  <span className="text-white/80">
                    <span className="font-semibold text-purple-300">V1 (Feb 7th)</span> — 2,500 users (MVP + top referrers + active contributors)
                  </span>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <span className="text-pink-400 font-bold">3.</span>
                  <span className="text-white/80">
                    Permanent status labels: <span className="font-semibold text-pink-300">"Founding 1K"</span> & <span className="font-semibold text-pink-300">"Early 10K"</span>
                  </span>
                </motion.li>
              </ul>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                {user?.role === "admin" && (
                  <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
                    <Link to="/admin" className="w-full">
                      <motion.div variants={itemVariants}>
                        <Button className="w-full bg-blue-600/80 hover:bg-blue-700 text-white border border-blue-400/50 hover:border-blue-300">
                          Admin Dashboard
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full -translate-x-12 translate-y-12"></div>
          </motion.div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
