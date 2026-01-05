import React, { useState, useEffect } from "react";
import { waitlistAPI } from "../../../utils/APIs/waitlistAPI";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Copy, Trophy, TrendingUp, Users, Zap, Target, Share2, Award, Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const RANK_REWARDS = [
  { rank: "Top 10", reward: "Lifetime free access", badge: "🔑 Keyholder", perks: ["Private team channel", "×3 voting weight", "Guaranteed early access to all future SF products"], discount: "N/A" },
  { rank: "Top 100", reward: "12 months free", badge: "🥇 Gold", perks: ["Priority support", "×2 voting weight"], discount: "N/A" },
  { rank: "Top 300", reward: "6 months free", badge: "🥈 Silver", perks: ["Priority support"], discount: "N/A" },
  { rank: "Top 1,000", reward: "1–2 months free", badge: "🥉 Bronze (MVP)", perks: ["Early feature access", "Founding Member badge"], discount: "N/A" },
];

const RANK_DISCOUNTS = [
  { rank: "Top 1–500", discount: "25% lifetime" },
  { rank: "501–1000", discount: "20% lifetime" },
  { rank: "1001–1500", discount: "15% lifetime" },
  { rank: "1501–2000", discount: "10% lifetime" },
  { rank: "2001–2500", discount: "5% lifetime" },
];

const CONTRIBUTION_SYSTEM = [
  { type: "Small Contribution", points: 15, examples: ["Feedback", "Minor bug reports", "Testing"] },
  { type: "Medium Contribution", points: 25, examples: ["Feature suggestions", "Documentation", "Demo projects"] },
  { type: "High-Impact Contribution", points: 50, examples: ["Critical bug fixes", "Integration creation", "Community support"] },
];

const ReferPage = () => {
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, access_token } = useSelector((state) => state.auth);

  const [userRankInfo, setUserRankInfo] = useState({
    position: 0,
    points: { total: 0, referral: 0, contribution: 0, activity: 0 },
  });
  const [referralLink] = useState(
    `${window.location.origin}/signup?ref=${user?.id || ""}`
  );
  const [leaderboard, setLeaderboard] = useState([]);
  const [mvpDeadline] = useState(new Date("2026-01-10"));

  // Fetch waitlist status
  useEffect(() => {
    const checkWaitlistStatus = async () => {
      try {
        const response = await waitlistAPI.isOnWaitlist(user?.email);
        setIsOnWaitlist(response.on_waitlist);
      } catch (error) {
        console.error("Error checking waitlist status:", error);
        setIsOnWaitlist(false);
      }
    };

    if (user?.email) {
      checkWaitlistStatus();
    }
  }, [user?.email]);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user?.id) return;
      try {
        const data = await waitlistAPI.getLeaderboard();
        const dataWithYouFlag = data.map((userEntry) => ({
          ...userEntry,
          isYou: userEntry.id === user.id,
        }));
        setLeaderboard(dataWithYouFlag);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, [user?.id]);

  // Fetch user ranking
  useEffect(() => {
    const fetchUserRank = async () => {
      if (!user?.id || !access_token) return;
      try {
        setLoading(true);
        const rankInfo = await waitlistAPI.getMyRanking(user.id, access_token);
        setUserRankInfo(rankInfo);
      } catch (error) {
        console.error("Error fetching user rank:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOnWaitlist) {
      fetchUserRank();
    }
  }, [user?.id, access_token, isOnWaitlist]);

  const daysRemaining = Math.max(
    0,
    Math.ceil((mvpDeadline - new Date()) / (1000 * 60 * 60 * 24))
  );

  // Not on waitlist - show redirect prompt
  if (!isOnWaitlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center shadow-xl">
            <div className="mb-4 flex justify-center">
              <Trophy className="h-12 w-12 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Join the Competition</h2>
            <p className="text-neutral-400 text-sm mb-6">
              You need to join the waitlist first to see rankings and compete for exclusive rewards.
            </p>
            <Link to="/waitlist" className="w-full">
              <button className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                Join Waitlist Now
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-lg">Loading your ranking...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white p-6 md:p-10">
      <div className="w-full mx-auto">

        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-6 w-6 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ranking & Competition
            </h1>
            <Zap className="h-6 w-6 text-yellow-400" />
          </div>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            MVP launches in{" "}
            <span className="font-bold text-yellow-400">{daysRemaining} days</span>
            . Climb the ranks to earn exclusive rewards!
          </p>
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Rank Card */}
          <motion.div
            variants={card}
            initial="hidden"
            animate="visible"
            className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-blue-500/30 rounded-2xl p-8 hover:border-blue-500/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-neutral-400 text-sm font-medium">Your Rank</p>
              <Trophy className="h-5 w-5 text-yellow-400" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-blue-400 mb-2">
              #{userRankInfo.position}
            </h2>
            <p className="text-xs text-neutral-500">
              out of {leaderboard.length} competitors
            </p>
          </motion.div>

          {/* Points Card */}
          <motion.div
            variants={card}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-neutral-400 text-sm font-medium">Total Points</p>
              <TrendingUp className="h-5 w-5 text-purple-400" />
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-purple-400 mb-2">
              {userRankInfo.points.total}
            </h2>
            <p className="text-xs text-neutral-500">
              {leaderboard[0]?.points?.total
                ? `${userRankInfo.points.total} of ${leaderboard[0].points.total} (leader)`
                : "accumulating"}
            </p>
          </motion.div>

          {/* Referral Card */}
          <motion.div
            variants={card}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-green-500/30 rounded-2xl p-8 hover:border-green-500/60 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-neutral-400 text-sm font-medium">Share & Earn</p>
              <Users className="h-5 w-5 text-green-400" />
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(referralLink);
                toast.success("Referral link copied! 🎉");
              }}
              className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Link
            </button>
            <div className="mt-4 pt-4 border-t border-neutral-700">
              <p className="text-xs text-neutral-400 mb-3">Referral Points: {userRankInfo.points.referral}</p>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Join SFCollab Waitlist",
                      text: "Join me on the SFCollab waitlist!",
                      url: referralLink,
                    });
                  } else {
                    navigator.clipboard.writeText(referralLink);
                    toast.info("Link copied to clipboard!");
                  }
                }}
                className="w-full px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded-lg text-green-400 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share Referral
              </button>
            </div>
          </motion.div>
        </div>

        {/* POINTS BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="h-6 w-6 text-orange-400" />
            Points Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                label: "Referrals",
                value: userRankInfo.points.referral,
                color: "from-green-500 to-green-600",
                icon: Users,
              },
              {
                label: "Contributions",
                value: userRankInfo.points.contribution,
                color: "from-blue-500 to-blue-600",
                icon: Zap,
              },
              {
                label: "Activity",
                value: userRankInfo.points.activity,
                color: "from-purple-500 to-purple-600",
                icon: TrendingUp,
              }
            ].map(({ label, value, color, icon: Icon }, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-xl p-4 border border-neutral-700">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-6 w-6 text-neutral-400" />
                  <p className="text-neutral-400 text-xs font-medium">{label}</p>
                </div>
                <p className={`text-3xl font-bold bg-linear-to-r ${color} bg-clip-text text-transparent`}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              How Rank Score is Calculated
            </h3>
            <div className="bg-neutral-800/50 rounded-lg p-4 mb-6 border border-neutral-700 font-mono text-sm text-blue-300">
              <p>Total Rank Score =</p>
              <p className="ml-4">(Referrals × 2) + Contribution Points</p>
              <p className="ml-4">+ Engagement Points + Early Commitment Bonus</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-2">✓ Referrals are optional, not mandatory</p>
                <p className="text-sm text-neutral-400 mb-2">✓ Contributions can outweigh referrals</p>
                <p className="text-sm text-neutral-400">✓ Introverts & solo builders have equal paths</p>
              </div>
              <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                <p className="text-sm text-neutral-400 mb-2">✓ Engagement rewards consistency</p>
                <p className="text-sm text-neutral-400 mb-2">✓ Early signup gets bonus points</p>
                <p className="text-sm text-neutral-400">✓ Only verified activity counts</p>
              </div>
            </div>

            <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <p className="text-sm text-purple-300 mb-3">
                <strong>Bonus Rewards:</strong>
              </p>
              <ul className="text-sm text-purple-300 space-y-2">
                <li>• <strong>New Startup Bonus:</strong> +30 points for founding members from new startups</li>
                <li>• <strong>Early Waitlist Bonus:</strong> Up to +50 points based on your entry position</li>
              </ul>
              <p className="text-xs text-purple-400 mt-3 font-mono">
                bonus_points = (2500 - position) / 50
              </p>
            </div>
          </motion.div>

          {/* CONTRIBUTION SYSTEM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            Contribution Points System
          </h3>
          <p className="text-neutral-400 text-sm mb-6">Contributions are the most valuable path. They reward builders and serious users.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {CONTRIBUTION_SYSTEM.map((contrib, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white text-sm">{contrib.type}</h4>
                  <span className="text-lg font-bold text-blue-400">+{contrib.points}</span>
                </div>
                <ul className="text-xs text-neutral-400 space-y-1">
                  {contrib.examples.map((ex, i) => (
                    <li key={i}>• {ex}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <strong>Why contributions matter:</strong> Feedback, bug reports, testing, documentation, and community support shape SF's future.
            </p>
          </div>
        </motion.div>

        {/* LEADERBOARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-400" />
            Top Ranked Users
          </h3>
          <div className="space-y-3">
            {leaderboard.slice(0, 10).map((leaderUser, index) => (
              <motion.div
                key={leaderUser.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  leaderUser.isYou
                    ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 border-blue-500/50"
                    : "bg-neutral-900 border-neutral-700 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm ${
                      leaderUser.position === 1
                        ? "bg-yellow-500/30 text-yellow-400"
                        : leaderUser.position === 2
                          ? "bg-gray-400/30 text-gray-300"
                          : leaderUser.position === 3
                            ? "bg-orange-500/30 text-orange-400"
                            : "bg-neutral-700 text-neutral-300"
                    }`}
                  >
                    #{leaderUser.position}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {leaderUser.name || leaderUser.email}
                      {leaderUser.isYou && (
                        <span className="ml-2 text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-neutral-400">{leaderUser.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-purple-400">
                    {leaderUser.points.total}
                  </p>
                  <p className="text-xs text-neutral-400">points</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RANK-BASED REWARDS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-2">
            <Award className="h-8 w-8 text-blue-400" />
            Rank-Based Rewards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RANK_REWARDS.map((tier, idx) => (
              <motion.div
                key={idx}
                variants={card}
                className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-6 hover:border-neutral-600 transition-all"
              >
                <div className="text-2xl font-bold text-blue-300 mb-2">{tier.badge}</div>
                <div className="text-sm text-neutral-400 font-semibold mb-1">{tier.rank}</div>
                <div className="font-semibold text-white mb-4">{tier.reward}</div>
                <ul className="text-sm text-neutral-300 space-y-2 mb-4">
                  {tier.perks.map((perk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* DISCOUNT TIERS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-400" />
            Lifetime Discount Tiers
          </h3>
          <p className="text-neutral-400 text-sm mb-6">Beyond free access, all ranked users receive permanent discounts on SF-developed features.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {RANK_DISCOUNTS.map((tier, idx) => (
              <div key={idx} className="bg-neutral-900 rounded-lg p-4 border border-neutral-700 text-center">
                <p className="text-xs text-neutral-400 mb-2">{tier.rank}</p>
                <p className="text-lg font-bold text-purple-400">{tier.discount}</p>
                <p className="text-xs text-neutral-500 mt-2">Lifetime</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <p className="text-sm text-purple-300">
              <strong>Note:</strong> Discounts apply only to SF-developed features. API overages and third-party tools follow their own limits.
            </p>
          </div>
        </motion.div>
        {/* LIFETIME DISCOUNT CLARIFICATION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.57 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Award className="h-6 w-6 text-purple-400" />
            Lifetime Discount Tiers - What's Included
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-green-300 mb-3">✓ Included in Discounts</p>
              <ul className="text-sm text-green-200 space-y-2">
                <li>• All SF-developed features</li>
                <li>• Core platform functionality</li>
                <li>• SF premium tools & integrations</li>
                <li>• Future SF product releases</li>
              </ul>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4">
              <p className="text-sm font-semibold text-orange-300 mb-3">✗ Excluded from Discounts</p>
              <ul className="text-sm text-orange-200 space-y-2">
                <li>• Third-party tool subscriptions</li>
                <li>• API overages & usage limits</li>
                <li>• Non-SF partnerships</li>
                <li>• External service fees</li>
              </ul>
            </div>
          </div>
          <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
            <p className="text-sm text-neutral-300">
              <strong>Remember:</strong> Your lifetime discount applies exclusively to features built and maintained by SForger. External services and third-party integrations follow their own pricing and discount policies.
            </p>
          </div>
        </motion.div>
        {/* WAITLIST SCARCITY EXPLANATION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-yellow-400" />
            Waitlist Access & Scarcity
          </h3>
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
              <p className="font-semibold text-white mb-3">How Remaining Waitlist Users Get Access</p>
              <ul className="text-sm text-neutral-300 space-y-2 list-disc list-inside">
                <li>After V1 launch (Feb 7th), remaining users are added in stages</li>
                <li>Rollout is gradual based on infrastructure capacity</li>
                <li>Without participation or investment, you may wait months for access</li>
              </ul>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-300 mb-3">
                <strong>Speed Up Your Access</strong>
              </p>
              <p className="text-sm text-yellow-200">
                Participate in rankings, contribute to the community, or consider investing in SForger's crowdfunding round to secure earlier priority access.
              </p>
            </div>
          </div>
        </motion.div>
        {/* SNAPSHOT & LOCKING RULES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-400" />
            Snapshot & Rewards Locking
          </h3>
          <div className="space-y-4">
            <div className="bg-neutral-900 rounded-lg p-4 border border-neutral-700">
              <p className="font-semibold text-white mb-2">How It Works</p>
              <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
                <li>Snapshot dates are announced in advance</li>
                <li>Your rank at snapshot time determines your rewards</li>
                <li>Rewards are locked and cannot be changed retroactively</li>
              </ol>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                <strong>Why snapshots?</strong> They ensure fairness, prevent disputes, and lock in rewards based on your actual contributions and rank at key moments.
              </p>
            </div>
          </div>
        </motion.div>

        {/* HOW IT WORKS */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
              How the Ranking System Works
            </h2>
            <p className="text-neutral-300 max-w-2xl mx-auto text-lg">
              Your rank is earned through contribution, consistency, and impact — not just referrals. Multiple paths exist for builders, introverts, and community members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Target,
                title: "Rank Score",
                desc: "Transparent scoring combining referrals, contributions, engagement & commitment.",
                color: "border-blue-500/30",
              },
              {
                icon: Zap,
                title: "Contributions Win",
                desc: "Feedback, testing, ideas & improvements earn the highest value points. No gatekeeping.",
                color: "border-purple-500/30",
              },
              {
                icon: Users,
                title: "Referrals Optional",
                desc: "+5 points each. They accelerate progress but don't guarantee rewards. Verify only. For every 5 successful referrals, a bonus of 25 points is awarded.",
                color: "border-green-500/30",
              },
              {
                icon: TrendingUp,
                title: "Snapshots Lock Rewards",
                desc: "At MVP & V1, rankings freeze. Rewards assigned based on your rank then. Fair for all.",
                color: "border-yellow-500/30",
              },
            ].map(({ icon: Icon, title, desc, color }, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className={`bg-neutral-900 border ${color} rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
              >
                <Icon className="h-8 w-8 mb-3 text-neutral-400" />
                <h4 className="text-lg font-bold mb-2">{title}</h4>
                <p className="text-sm text-neutral-400">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 text-center">
            <p className="text-neutral-300 text-lg">
              ⭐ <strong>Multiple paths to the top.</strong> You don't need referrals to succeed — consistent contribution, engagement, and impact always win.
            </p>
          </div>
        </motion.section>

        {/* CORE PRINCIPLES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-400" />
            Core Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Access is earned, not promised",
              "Contributions matter as much as referrals",
              "Early users are co-builders, not customers",
              "Rank snapshots lock rewards fairly",
              "No fake urgency or empty promises",
              "Quality over speed — measure twice, launch once"
            ].map((principle, idx) => (
              <motion.div
                key={idx}
                variants={card}
                className="flex items-start gap-3 bg-neutral-900 rounded-lg p-4 border border-neutral-700"
              >
                <span className="text-green-400 font-bold text-lg mt-0">✓</span>
                <span className="text-white/80">{principle}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RELEASE TIMELINE */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-8 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-400" />
            Release Timeline
          </h3>
          <p className="text-neutral-400 text-sm mb-6">Quality over speed. Your early actions determine your access.</p>

          <div className="space-y-4">
            <motion.div
              variants={card}
              className="flex gap-4 items-start bg-neutral-900 rounded-lg p-4 border border-blue-500/30"
            >
              <div className="text-2xl font-bold text-blue-400 w-12 text-center">1.</div>
              <div>
                <p className="font-semibold text-blue-300 text-lg">MVP (Jan 10)</p>
                <p className="text-sm text-neutral-300">1,000 ranked users + manually selected contributors</p>
                <p className="text-xs text-neutral-400 mt-1">Get: "Founding Member" badge, direct feedback channel, feature voting rights</p>
              </div>
            </motion.div>

            <motion.div
              variants={card}
              className="flex gap-4 items-start bg-neutral-900 rounded-lg p-4 border border-purple-500/30"
            >
              <div className="text-2xl font-bold text-purple-400 w-12 text-center">2.</div>
              <div>
                <p className="font-semibold text-purple-300 text-lg">V1 (Feb 7th)</p>
                <p className="text-sm text-neutral-300">2,500 users (MVP users + top referrers + active contributors + remaining waitlist)</p>
                <p className="text-xs text-neutral-400 mt-1">Get: Extended free access, permanent "Early 2.5k" badge</p>
              </div>
            </motion.div>

            <motion.div
              variants={card}
              className="flex gap-4 items-start bg-neutral-900 rounded-lg p-4 border border-pink-500/30"
            >
              <div className="text-2xl font-bold text-pink-400 w-12 text-center">3.</div>
              <div>
                <p className="font-semibold text-pink-300 text-lg">Permanent Status Labels</p>
                <p className="text-sm text-neutral-300">Founding 1K & Early 2.5k badges persist across all SF products</p>
                <p className="text-xs text-neutral-400 mt-1">Badge visibility, lifetime priority, future access consideration</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReferPage;