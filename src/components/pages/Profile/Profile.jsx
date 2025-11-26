// Profile.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Award, BarChart3, Bookmark, 
  Calendar, Mail, MapPin, Globe, Briefcase,
  GraduationCap, Users, Star, Target, Rocket,
  Trophy, Zap, TrendingUp, Clock, Edit,
  Camera, Save, X, Plus, Trash2, Heart,
  MessageCircle, Share, Eye, Download,
  Linkedin, Github, Twitter, Facebook
} from 'lucide-react';

// Components
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileTabs from './ProfileTabs';
import AchievementSection from './AchievementSection';
import ActivityFeed from './ActivityFeed';
import ProfileSettings from './ProfileSettings';

// Mock data based on your backend model
const mockUserData = {
  id: 1,
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex.johnson@example.com",
  isEmailVerified: true,
  lastLogin: new Date().toISOString(),
  status: "active",
  role: "member",
  xp_points: 2450,
  streak_days: 15,
  last_activity_date: new Date().toISOString(),
  total_revenue: 125000,
  satisfaction_percentage: 92.5,
  active_startups_count: 3,
  profile: {
    picture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    bio: "Full-stack developer & startup enthusiast. Building the future one line of code at a time. Passionate about AI, blockchain, and creating impactful products.",
    company: "TechInnovate Inc.",
    socialLinks: {
      linkedin: "alexjohnson",
      github: "alexjohnson",
      twitter: "alexjohnson",
      portfolio: "alexjohnson.dev"
    },
    country: "United States",
    city: "San Francisco",
    timezone: "America/Los_Angeles"
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    privacy: "public",
    language: "en",
    timezone: "America/Los_Angeles",
    theme: "dark"
  },
  notificationSettings: {
    newComments: true,
    newLikes: true,
    newSuggestions: true,
    joinRequests: true,
    approvals: true,
    storyViews: false,
    postEngagement: true,
    emailDigest: "weekly",
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00"
    }
  },
  statistics: {
    total_ideas: 12,
    total_tasks: 45,
    completed_tasks: 38,
    total_startups: 3,
    total_achievements: 8,
    total_comments: 67,
    total_likes_received: 234,
    engagement_score: 85
  },
  recentActivity: [
    {
      type: 'task_completed',
      title: 'Implemented user authentication',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      data: { points: 50 }
    },
    {
      type: 'achievement_unlocked',
      title: 'Code Master',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      data: { xp: 100 }
    },
    {
      type: 'startup_created',
      title: 'LaunchPad AI',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      data: { category: 'AI' }
    }
  ]
};

const mockAchievements = [
  {
    id: 1,
    name: "Early Bird",
    description: "Complete 5 tasks before 9 AM",
    icon: "🐦",
    points: 100,
    category: "productivity",
    progress: 100,
    unlocked: true,
    unlocked_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    name: "Code Master",
    description: "Write 10,000 lines of code",
    icon: "💻",
    points: 250,
    category: "development",
    progress: 85,
    unlocked: false
  },
  {
    id: 3,
    name: "Startup Founder",
    description: "Launch your first startup",
    icon: "🚀",
    points: 500,
    category: "entrepreneurship",
    progress: 100,
    unlocked: true,
    unlocked_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    name: "Social Butterfly",
    description: "Get 100 likes on your posts",
    icon: "🦋",
    points: 150,
    category: "social",
    progress: 65,
    unlocked: false
  }
];

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(mockUserData);
  const [achievements, setAchievements] = useState(mockAchievements);
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Calculate level based on XP
  const calculateLevel = (xp) => {
    return Math.floor(xp / 1000) + 1;
  };

  const level = calculateLevel(userData.xp_points);
  const xpToNextLevel = (level * 1000) - userData.xp_points;
  const levelProgress = ((userData.xp_points % 1000) / 1000) * 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'activity', label: 'Activity', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (showSettings) {
    return <ProfileSettings userData={userData} onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <ProfileHeader 
          userData={userData}
          level={level}
          levelProgress={levelProgress}
          xpToNextLevel={xpToNextLevel}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          onSettingsClick={() => setShowSettings(true)}
        />

        {/* Stats Overview */}
        <ProfileStats 
          userData={userData}
          streakDays={userData.streak_days}
          activeStartups={userData.active_startups_count}
        />

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Level & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Level Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-800">
                    {level}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    PRO
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Level {level}</h3>
                <p className="text-sm text-gray-400">{userData.xp_points} XP</p>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Next: Level {level + 1}</span>
                    <span>{xpToNextLevel} XP needed</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${levelProgress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quick Stats
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Streak</span>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Zap className="w-4 h-4" />
                    {userData.streak_days} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Startups</span>
                  <span className="text-blue-400">{userData.active_startups_count} active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tasks Done</span>
                  <span className="text-green-400">{userData.statistics.completed_tasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Engagement</span>
                  <span className="text-purple-400">{userData.statistics.engagement_score}%</span>
                </div>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
            >
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                {userData.profile.socialLinks.linkedin && (
                  <a href={`https://linkedin.com/in/${userData.profile.socialLinks.linkedin}`} 
                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {userData.profile.socialLinks.github && (
                  <a href={`https://github.com/${userData.profile.socialLinks.github}`}
                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {userData.profile.socialLinks.twitter && (
                  <a href={`https://twitter.com/${userData.profile.socialLinks.twitter}`}
                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
                {userData.profile.socialLinks.portfolio && (
                  <a href={`https://${userData.profile.socialLinks.portfolio}`}
                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors">
                    <Globe className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Navigation Tabs */}
            <ProfileTabs 
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Recent Activity */}
                  <ActivityFeed activities={userData.recentActivity} />
                  
                  {/* Current Projects */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Active Projects
                    </h3>
                    <div className="grid gap-4">
                      {[1, 2, 3].map(project => (
                        <div key={project} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                          <div>
                            <h4 className="font-semibold">Project {project}</h4>
                            <p className="text-sm text-gray-400">In progress • 65% complete</p>
                          </div>
                          <div className="w-24 bg-gray-600 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <AchievementSection achievements={achievements} />
              )}

              {activeTab === 'activity' && (
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">Detailed Activity</h3>
                  {/* Activity timeline component would go here */}
                  <div className="text-center text-gray-500 py-12">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Detailed activity timeline coming soon...</p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">Projects & Startups</h3>
                  {/* Projects grid would go here */}
                  <div className="text-center text-gray-500 py-12">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Projects showcase coming soon...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;