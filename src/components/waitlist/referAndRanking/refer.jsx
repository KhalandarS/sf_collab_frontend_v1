import React, { useState, useEffect, use } from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { waitlistAPI } from "../components/lib/api";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const card = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ReferPage = () => {
  const [isOnWaitlist, setIsOnWaitlist] = useState(false);
  const { user, access_token } = useSelector((state) => state.auth);
  useEffect(() => {
    async function checkUserWaitlistStatus() {
      try {
        const response = await waitlistAPI.isOnWaitlist(user.email)
        setIsOnWaitlist(response.on_waitlist);
      } catch (error) {
        console.error("Error checking waitlist status:", error);
        setIsOnWaitlist(false);
      }
      
    }
    if (user && user.email) {
      checkUserWaitlistStatus();
    }
  }, [user]);
  const [userRankInfo, setUserRankInfo] = useState({ position: 0, points: { total: 0, referral: 0, contribution: 0, activity: 0 } });
  const [referralLink] = useState(`${window.location.origin}/signup?ref=${user?.id || ""}`);

  /*
  [
    {
      "created_at": datetime,
      "email": string,
      "id": number,
      "name": string,
      "points": {
        "activity": 0,
        "contribution": 0,
        "referral": 0,
        "total": 0
      },
      "position": number,
                "rank": number,
                "isYou": boolean
    }
  ]
  */
  const [leaderboard, setLeaderboard] = useState([]);
  useEffect(() => {
    async function fetchLeaderboard() {
      if (!user?.id) return;
      const data = await waitlistAPI.getLeaderboard();
      const dataWithYouFlag = data.map((userEntry) => ({
        ...userEntry,
        isYou: userEntry.id === user.id,
      }));
      setLeaderboard(dataWithYouFlag);
    }
    fetchLeaderboard();
  }, [user.id]);


  const [mvpDeadline] = useState(new Date("2026-01-10"));
  useEffect(() => {
    // mock fetch for now
    async function fetchData() {
      // Fetch user rank
      const userRankInfo = await waitlistAPI.getMyRanking(user.id, access_token);
      console.log(userRankInfo);
      setUserRankInfo(userRankInfo);

    }
    if (user?.id) {
      fetchData();
    }
  }, [user, access_token]);

  const daysRemaining = Math.max(
    0,
    Math.ceil((mvpDeadline - new Date()) / (1000 * 60 * 60 * 24))
  );

  if (!isOnWaitlist) {
    return (
      <Link to="/waitlist">
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
      </Link>
    );
  }

  if (!userRankInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 text-white">
        <p>Loading your ranking...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6 md:p-10">
      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Ranking & Competition
            </h1>
          </div>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            MVP launches in <span className="text-white font-semibold">{daysRemaining} days</span>. Climb the ranks and earn exclusive rewards!
          </p>
        </div>
      </div>

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
          <h2 className="text-5xl font-bold mt-2">#{userRankInfo.position}</h2>
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
          <h2 className="text-5xl font-bold mt-2">{userRankInfo.points.total}</h2>
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
              onClick={() => {
                navigator.clipboard.writeText(referralLink)
                toast.success("Referral link copied to clipboard!")
              }
              }
              className="px-4 rounded-r-xl bg-white text-black text-sm font-medium cursor-pointer"
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
            {Object.entries({
              Referral: userRankInfo.points.referral,
              Contribution: userRankInfo.points.contribution,
              Activity: userRankInfo.points.activity,
            }).map(([key, value]) => (
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
          {leaderboard.map((user, index) => (
            <motion.div
              key={user.position}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between rounded-xl px-4 py-3
          ${user.isYou
                  ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30"
                  : "bg-neutral-800"
                }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-semibold
              ${user.position === 1
                      ? "bg-yellow-500/20 text-yellow-400"
                      : user.position === 2
                        ? "bg-gray-400/20 text-gray-300"
                        : user.position === 3
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-neutral-700 text-neutral-300"
                    }`}
                >
                  #{user.position}
                </div>

                <div>
                  <p className="font-medium">
                    {user.name}
                    {user.isYou && (
                      <span className="ml-2 text-xs text-blue-400">(You)</span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {user.points.total} points
                  </p>
                </div>
              </div>

              {user.position <= 3 && (
                <span className="text-xs font-medium bg-neutral-700 px-2 py-1 rounded-full">
                  Top {user.position}
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

export default ReferPage;
