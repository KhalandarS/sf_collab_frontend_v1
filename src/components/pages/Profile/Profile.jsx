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
  Linkedin, Github, Twitter, Facebook,
  ChevronRight, ChevronLeft, Sparkles, Trophy as TrophyIcon,
  Target as TargetIcon, Users as UsersIcon, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { useSelector } from 'react-redux';

// Components
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileTabs from './ProfileTabs';
import AchievementSection from './AchievementSection';
import ActivityFeed from './ActivityFeed';
import ProfileSettings from './ProfileSettings';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Transform Redux user data to match component structure
  const transformUserData = () => {
    if (!user) return null;
    
    return {
      id: user.id,
      firstName: user.firstName || user.first_name || '',
      lastName: user.lastName || user.last_name || '',
      email: user.email || '',
      isEmailVerified: user.isEmailVerified || user.is_email_verified || false,
      lastLogin: user.lastLogin || user.last_login || new Date().toISOString(),
      status: user.status || 'active',
      role: user.role || 'member',
      xp_points: user.xpPoints || user.xp_points || 0,
      streak_days: user.streakDays || user.streak_days || 0,
      last_activity_date: user.lastActivityDate || user.last_activity_date || new Date().toISOString(),
      total_revenue: user.totalRevenue || user.total_revenue || 0,
      satisfaction_percentage: user.satisfactionPercentage || user.satisfaction_percentage || 0,
      active_startups_count: user.activeStartupsCount || user.active_startups_count || 0,
      
      profile: {
        picture: user.profile?.picture || user.profile_picture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
        bio: user.profile?.bio || user.profile_bio || 'No bio provided',
        company: user.profile?.company || user.profile_company || 'Add company',
        socialLinks: user.profile?.socialLinks || user.profile_social_links || {},
        country: user.profile?.country || user.profile_country || 'Add country',
        city: user.profile?.city || user.profile_city || 'Add city',
        timezone: user.profile?.timezone || user.profile_timezone || 'UTC'
      },
      
      accountSecurity: {
        password: "",
        newPassword: "",
        confirmPassword: "",
        twoFactorEnabled: false,
        backupCodes: [],
        sessions: [],
        connectedAccounts: {
          google: false,
          github: false,
          linkedin: false,
        }
      },
      
      preferences: {
        emailNotifications: user.preferences?.emailNotifications || user.pref_email_notifications || true,
        pushNotifications: user.preferences?.pushNotifications || user.pref_push_notifications || true,
        privacy: user.preferences?.privacy || user.pref_privacy || 'public',
        language: user.preferences?.language || user.pref_language || 'en',
        timezone: user.preferences?.timezone || user.pref_timezone || 'UTC',
        theme: user.preferences?.theme || user.pref_theme || 'dark'
      },
      
      notificationSettings: {
        newComments: user.notificationSettings?.newComments || user.notif_new_comments || true,
        newLikes: user.notificationSettings?.newLikes || user.notif_new_likes || true,
        newSuggestions: user.notificationSettings?.newSuggestions || user.notif_new_suggestions || true,
        joinRequests: user.notificationSettings?.joinRequests || user.notif_join_requests || true,
        approvals: user.notificationSettings?.approvals || user.notif_approvals || true,
        storyViews: user.notificationSettings?.storyViews || user.notif_story_views || false,
        postEngagement: user.notificationSettings?.postEngagement || user.notif_post_engagement || true,
        emailDigest: user.notificationSettings?.emailDigest || user.notif_email_digest || 'weekly',
        quietHours: {
          enabled: user.notificationSettings?.quietHours?.enabled || user.notif_quiet_hours_enabled || true,
          start: user.notificationSettings?.quietHours?.start || user.notif_quiet_hours_start || "22:00",
          end: user.notificationSettings?.quietHours?.end || user.notif_quiet_hours_end || "08:00"
        }
      },
      
      savedItems: {
        ideas: [],
        startups: [],
        posts: [],
        resources: [],
        archived: []
      },
      
      statistics: {
        total_ideas: user.statistics?.total_ideas || user.relationshipCounts?.ideas || 0,
        total_tasks: user.statistics?.total_tasks  || user.relationshipCounts?.tasks || 0,
        completed_tasks: user.statistics?.completed_tasks || 0,
        total_startups: user.statistics?.total_startups || user.relationshipCounts?.startups || 0,
        total_achievements: user.statistics?.total_achievements || user.relationshipCounts?.achievements || 0,
        total_comments: user.statistics?.total_comments  || 0,
        total_likes_received: user.statistics?.total_likes_received || 0,
        engagement_score: user.statistics?.engagement_score || user.dashboardMetrics?.growthMetrics?.marketShare || 85
      },
      
      recentActivity: user.recentActivity || [
        {
          type: 'task_completed',
          title: 'Completed first task',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          data: { points: 50 }
        },
        {
          type: 'achievement_unlocked',
          title: 'Early Bird',
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          data: { xp: 100 }
        },
        {
          type: 'startup_created',
          title: 'First Startup',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          data: { category: 'Tech' }
        }
      ],
      
      createdAt: user.createdAt || new Date().toISOString(),
      dashboardMetrics: user.dashboardMetrics || {
        teamPerformance: {
          score: 85,
          activeMembers: 5,
          tasksCompleted: 42,
          productivityLevel: 'high'
        },
        projectGoals: {
          progress: 75,
          milestonesCompleted: 3,
          nextGoal: 'Launch MVP',
          totalGoals: 5
        },
        growthMetrics: {
          growthPercentage: 45,
          userGrowth: 120,
          revenue: 25000,
          marketShare: 85
        },
        achievements: {
          total: 8,
          thisMonth: 2,
          nextTarget: 13
        }
      }
    };
  };

  const [userData, setUserData] = useState(() => transformUserData());
  const [achievements, setAchievements] = useState([]);

  // Load achievements from relationships
  useEffect(() => {
    if (user?.relationships?.achievements) {
      const transformedAchievements = user.relationships.achievements.map((achievement, index) => ({
        id: achievement.id || index,
        name: achievement.name || `Achievement ${index + 1}`,
        description: achievement.description || 'Earned through hard work',
        icon: "🏆",
        points: achievement.points || 100,
        category: achievement.category || 'general',
        progress: achievement.progress || 100,
        unlocked: achievement.is_completed || true,
        unlocked_at: achievement.unlocked_at || new Date(Date.now() - index * 24 * 60 * 60 * 1000)
      }));
      setAchievements(transformedAchievements);
    }
  }, [user]);

  // Calculate level based on XP
  const calculateLevel = (xp) => {
    return Math.floor(xp / 1000) + 1;
  };

  const level = calculateLevel(userData?.xp_points || 0);
  const xpToNextLevel = (level * 1000) - (userData?.xp_points || 0);
  const levelProgress = ((userData?.xp_points % 1000) / 1000) * 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'activity', label: 'Activity', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (showSettings) {
    return <ProfileSettings userData={userData} onBack={() => setShowSettings(false)} />;
  }

  return (
    <div className="min-h-screen  text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>
        
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Animated Header Badge */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-6 py-2 backdrop-blur-sm">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Level {level} Adventurer • {userData.xp_points} XP
            </span>
          </div>
        </motion.div>

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

        {/* Gamified Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <ProfileStats 
            userData={userData}
            streakDays={userData.streak_days}
            activeStartups={userData.active_startups_count}
          />
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Level & Quick Stats */}
          <div className="lg:col-span-1 space-y-6">
            {/* Level Card with Gamified Design */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 relative overflow-hidden group"
            >
              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="relative w-24 h-24">
                      {/* XP Ring */}
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          className="text-gray-700"
                        />
                        <circle
                          cx="50%"
                          cy="50%"
                          r="45%"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="transparent"
                          strokeLinecap="round"
                          className="text-gradient-to-r from-blue-500 to-purple-500"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={2 * Math.PI * 45 * (1 - levelProgress / 100)}
                        />
                      </svg>
                      
                      {/* Level Number */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                          {level}
                        </div>
                      </div>
                    </div>
                    
                    {/* PRO Badge */}
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                      <Sparkles className="w-3 h-3 inline mr-1" />
                      PRO
                    </div>
                  </div>
                  
                  <h3 className="mt-6 text-lg font-semibold">Level {level} Adventurer</h3>
                  <p className="text-sm text-gray-400 mt-1">{userData.xp_points} Total XP</p>
                  
                  {/* Progress Bar */}
                  <div className="mt-6">
                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                      <span className="flex items-center gap-1">
                        <TargetIcon className="w-3 h-3" />
                        Next: Level {level + 1}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {xpToNextLevel} XP needed
                      </span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${levelProgress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </motion.div>
                    </div>
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
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg">
                      <Zap className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-sm">Streak</span>
                  </div>
                  <span className="text-yellow-400 font-semibold">{userData.streak_days} days</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Rocket className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm">Active Startups</span>
                  </div>
                  <span className="text-blue-400 font-semibold">{userData.active_startups_count}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <Target className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm">Tasks Done</span>
                  </div>
                  <span className="text-green-400 font-semibold">{userData.statistics.completed_tasks}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <UsersIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm">Engagement</span>
                  </div>
                  <span className="text-purple-400 font-semibold">{userData.statistics.engagement_score}%</span>
                </div>
              </div>
            </motion.div>

            {/* Dashboard Metrics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <TrophyIcon className="w-4 h-4" />
                Dashboard Metrics
              </h4>
              <div className="space-y-4">
                <div className="p-3 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Team Performance</span>
                    <span className="text-lg font-bold text-blue-400">
                      {userData.dashboardMetrics?.teamPerformance?.score || 85}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {userData.dashboardMetrics?.teamPerformance?.activeMembers || 5} active members
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Project Goals</span>
                    <span className="text-lg font-bold text-green-400">
                      {userData.dashboardMetrics?.projectGoals?.progress || 75}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {userData.dashboardMetrics?.projectGoals?.milestonesCompleted || 3} milestones completed
                  </div>
                </div>
                
                <div className="p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-300">Growth</span>
                    <span className="text-lg font-bold text-purple-400">
                      +{userData.dashboardMetrics?.growthMetrics?.growthPercentage || 45}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    ${(userData.dashboardMetrics?.growthMetrics?.revenue || 25000).toLocaleString()} revenue
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Navigation Tabs with Gamified Style */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ProfileTabs 
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </motion.div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Recent Activity */}
                  <ActivityFeed activities={userData.recentActivity} />
                  
                  {/* Projects Summary */}
                  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-semibold flex items-center gap-2">
                        <Rocket className="w-5 h-5" />
                        Active Projects
                      </h3>
                      <button className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                        View All <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.relationships?.startups?.slice(0, 4).map((startup, index) => (
                        <motion.div
                          key={startup.id || index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:border-blue-500/50 transition-colors group cursor-pointer"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                              <Rocket className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-semibold group-hover:text-blue-400 transition-colors">
                                {startup.name || `Startup ${index + 1}`}
                              </h4>
                              <p className="text-xs text-gray-400">{startup.industry || 'Tech'}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-300 line-clamp-2">
                            {startup.description || 'No description available'}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'achievements' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <AchievementSection achievements={achievements} />
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-6">Detailed Activity Timeline</h3>
                  <div className="space-y-4">
                    {user.relationships?.ideas?.slice(0, 5).map((idea, index) => (
                      <motion.div
                        key={idea.id || index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl"
                      >
                        <div className="p-3 bg-blue-500/10 rounded-lg">
                          <Sparkles className="w-5 h-5 text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{idea.title || `Idea ${index + 1}`}</h4>
                          <p className="text-sm text-gray-400">
                            Created • {idea.created_at ? new Date(idea.created_at).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                        <div className="text-sm text-gray-500">
                          {idea.likes || 0} likes
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'projects' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
                >
                  <h3 className="text-xl font-semibold mb-6">Projects & Startups</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.relationships?.startups?.map((startup, index) => (
                      <motion.div
                        key={startup.id || index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:border-blue-500/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold group-hover:text-blue-400 transition-colors">
                              {startup.name || `Startup ${index + 1}`}
                            </h4>
                            <p className="text-xs text-gray-400">{startup.industry || 'Tech'}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-300 mb-4 line-clamp-2">
                          {startup.description || 'No description available'}
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{startup.stage || 'Early Stage'}</span>
                          <span>{startup.funding_amount ? `$${startup.funding_amount}` : 'Bootstrapped'}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;