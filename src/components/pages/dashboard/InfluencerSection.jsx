import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Heart, Share2, BarChart3, Target, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../../ui/SpotlightCard';

export default function InfluencerSection({ userData }) {
  const [metrics] = useState({
    followers: 125400,
    engagement: 8.2,
    totalReaches: 2500000,
    collaborations: 12,
    avgLikes: 15800,
    avgComments: 2340
  });

  const stats = [
    { icon: Users, label: 'Followers', value: metrics.followers.toLocaleString(), color: 'from-blue-500 to-blue-600' },
    { icon: TrendingUp, label: 'Engagement Rate', value: `${metrics.engagement}%`, color: 'from-purple-500 to-purple-600' },
    { icon: Share2, label: 'Total Reach', value: (metrics.totalReaches / 1000000).toFixed(1) + 'M', color: 'from-pink-500 to-pink-600' },
    { icon: Target, label: 'Collaborations', value: metrics.collaborations, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="relative my-4 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/20 backdrop-blur-sm p-5">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">Influencer Dashboard</h2>
          <p className="text-white/70">Welcome back, {userData?.name || 'Creator'}! Track your campaigns, engagement metrics, and collaborations in one place.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 flex-shrink-0">
          <Link to="/influencer" className="w-full sm:w-auto group relative px-6 py-3 bg-blue-500/80 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border border-blue-400/50 hover:border-blue-300">
            <span className="relative flex items-center gap-2">
              View Dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
