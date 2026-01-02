// sections/ProfileStats.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Target, Rocket, Users, Star, TrendingUp } from 'lucide-react';

const ProfileStats = ({ user, streakDays, activeStartups }) => {
  console.log(user);
  const stats = [
    {
      icon: Zap,
      label: 'Current Streak',
      value: streakDays,
      suffix: 'days',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    {
      icon: Target,
      label: 'Tasks Completed',
      value: user?.statistics?.completed_tasks,
      suffix: 'tasks',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    {
      icon: Rocket,
      label: 'Active Startups',
      value: activeStartups,
      suffix: 'projects',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    {
      icon: Users,
      label: 'Community Impact',
      value: user?.statistics?.total_likes_received,
      suffix: 'likes',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    },
    {
      icon: Star,
      label: 'Achievements',
      value: user?.statistics?.total_achievements,
      suffix: 'unlocked',
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10'
    },
    {
      icon: TrendingUp,
      label: 'Engagement Score',
      value: user?.statistics?.engagement_score,
      suffix: '%',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} backdrop-blur-xl border border-gray-700 rounded-2xl p-4 text-center`}
        >
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.bgColor} mb-3`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className={`text-2xl font-bold ${stat.color} mb-1`}>
            {stat.value}
          </div>
          <div className="text-xs text-gray-400">
            {stat.label}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {stat.suffix}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProfileStats;