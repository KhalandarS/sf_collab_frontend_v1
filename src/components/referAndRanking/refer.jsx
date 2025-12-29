import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Ref = () => {
  const [userJoinedWaitlist, setUserJoinedWaitlist] = useState(true);
  const [topRankings, setTopRankings] = useState([]);

  const [userRank, setUserRank] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [referralLink, setReferralLink] = useState("");
  const [pointsBreakdown, setPointsBreakdown] = useState({
    referrals: 0,
    contributions: 0,
    activity: 0,
  });
  const [mvpDeadline] = useState(new Date("2025-03-31"));
  useEffect(() => {
  // mock fetch for now
  setUserRank(128);
  setTotalPoints(920);
  setReferralLink("https://sfcollab.com/ref/ivan");
  setPointsBreakdown({ referrals: 420, contributions: 300, activity: 200 });

  // mock top rankings
  setTopRankings([
    { rank: 1, name: "Alex Chen", points: 2450 },
    { rank: 2, name: "María López", points: 2210 },
    { rank: 3, name: "Daniel Park", points: 1980 },
    { rank: 4, name: "Sofia Müller", points: 1760 },
    { rank: 5, name: "You", points: 920, isYou: true },
  ]);
}, []);

  useEffect(() => {
    // mock fetch for now
    setUserRank(128);
    setTotalPoints(920);
    setReferralLink("https://sfcollab.com/ref/ivan");
    setPointsBreakdown({ referrals: 420, contributions: 300, activity: 200 });
  }, []);

  const daysRemaining = Math.max(
    0,
    Math.ceil((mvpDeadline - new Date()) / (1000 * 60 * 60 * 24))
  );

  if (!userJoinedWaitlist) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-neutral-900 border border-neutral-800 p-10 rounded-2xl text-center max-w-md"
        >
          <h2 className="text-2xl font-semibold">Join the waitlist</h2>
          <p className="text-neutral-400 mt-2">
            You need to join before accessing rankings.
          </p>
          <button className="mt-6 px-6 py-2 rounded-xl bg-white text-black font-medium">
            Join waitlist
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tight">Referral & Ranking</h1>
        <p className="text-neutral-400 mt-2">
          MVP launches in <span className="text-white">{daysRemaining} days</span>
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rank */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="visible"
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
        >
          <p className="text-neutral-400">Your Rank</p>
          <h2 className="text-5xl font-bold mt-2">#{userRank}</h2>
        </motion.div>

        {/* Points */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
        >
          <p className="text-neutral-400">Total Points</p>
          <h2 className="text-5xl font-bold mt-2">{totalPoints}</h2>
        </motion.div>

        {/* Referral */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
        >
          <p className="text-neutral-400 mb-2">Referral Link</p>
          <div className="flex">
            <input
              readOnly
              value={referralLink}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-l-xl px-3 py-2 text-sm"
            />
            <button
              onClick={() => navigator.clipboard.writeText(referralLink)}
              className="px-4 rounded-r-xl bg-white text-black text-sm font-medium"
            >
              Copy
            </button>
          </div>
        </motion.div>

        {/* Breakdown */}
        <motion.div
          variants={card}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Points Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(pointsBreakdown).map(([key, value]) => (
              <div
                key={key}
                className="bg-neutral-800 rounded-xl p-4"
              >
                <p className="text-neutral-400 capitalize">{key}</p>
                <p className="text-2xl font-semibold mt-1">+{value}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <p className="mt-10 text-sm text-neutral-500">
        Rankings update every 24h. Stay active.
      </p>

      {/* ================= RANKING ================= */}
      {/* ================= TOP RANKING ================= */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="mt-12 bg-neutral-900 border border-neutral-800 rounded-2xl p-6"
>
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-xl font-semibold">Top Ranked Users</h3>
    <span className="text-sm text-neutral-400">Live leaderboard</span>
  </div>

  <div className="space-y-3">
    {topRankings.map((user, index) => (
      <motion.div
        key={user.rank}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`flex items-center justify-between rounded-xl px-4 py-3
          ${
            user.isYou
              ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
              : "bg-neutral-800"
          }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold
              ${
                user.rank === 1
                  ? "bg-yellow-500/20 text-yellow-400"
                  : user.rank === 2
                  ? "bg-gray-400/20 text-gray-300"
                  : user.rank === 3
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-neutral-700 text-neutral-300"
              }`}
          >
            #{user.rank}
          </div>

          <div>
            <p className="font-medium">
              {user.name}
              {user.isYou && (
                <span className="ml-2 text-xs text-blue-400">(You)</span>
              )}
            </p>
            <p className="text-xs text-neutral-400">
              {user.points} points
            </p>
          </div>
        </div>

        {user.rank <= 3 && (
          <span className="text-xs font-medium bg-neutral-700 px-2 py-1 rounded-full">
            Top {user.rank}
          </span>
        )}
      </motion.div>
    ))}
  </div>
</motion.div>

      {/* ================= HOW THE SYSTEM WORKS ================= */}
<motion.section
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  viewport={{ once: true }}
  className="mt-24 max-w-6xl mx-auto relative"
>
  {/* Section Header */}
  <div className="text-center mb-14 relative">
    {/* Gradient glow */}
    <div className="absolute inset-0 flex justify-center">
      <div className="w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
    </div>

    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative text-4xl sm:text-5xl font-bold mb-4"
    >
      <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        How the ranking system works
      </span>
    </motion.h2>

    <p className="relative text-gray-400 max-w-2xl mx-auto text-lg">
      Your position is earned through contribution, consistency, and impact — not
      just referrals.
    </p>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {/* Card 1 */}
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-blue-400 mb-2">
        Rank Score
      </h3>
      <p className="text-sm text-gray-300 leading-relaxed">
        Your rank is based on a transparent score that combines referrals,
        contributions, engagement, and early commitment.
      </p>
    </motion.div>

    {/* Card 2 */}
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-purple-400 mb-2">
        Contributions
      </h3>
      <p className="text-sm text-gray-300 leading-relaxed">
        Helping build the product matters most. Feedback, testing, ideas and
        improvements earn the highest value points.
      </p>
    </motion.div>

    {/* Card 3 */}
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-green-400 mb-2">
        Referrals
      </h3>
      <p className="text-sm text-gray-300 leading-relaxed">
        Referrals accelerate progress (+2 points each), but they are optional and
        never guarantee rewards.
      </p>
    </motion.div>

    {/* Card 4 */}
    <motion.div
      whileHover={{ y: -6 }}
      className="bg-gray-800/60 backdrop-blur-sm border border-yellow-500/20 rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-yellow-400 mb-2">
        Snapshots
      </h3>
      <p className="text-sm text-gray-300 leading-relaxed">
        At key milestones (MVP, V1), rankings are frozen. Rewards and access are
        assigned based on your rank at that moment.
      </p>
    </motion.div>
  </div>

  {/* Footer Note */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="mt-12 text-center"
  >
    <p className="text-gray-400 text-sm">
      There are multiple paths to the top. You do not need referrals to succeed —
      consistent contribution always wins.
    </p>
  </motion.div>
</motion.section>

  
    </div>
  );
};

export default Ref;
