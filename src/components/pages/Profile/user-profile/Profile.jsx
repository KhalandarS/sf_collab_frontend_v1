// Profile.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Settings, Award, BarChart3,
  Rocket, TrendingUp, Zap, Globe, Briefcase
} from 'lucide-react';

import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import ProfileTabs from './ProfileTabs';
import AchievementSection from './AchievementSection';
import ActivityFeed from './ActivityFeed';
import ProfileSettings from '../profileSettings/ProfileSettings';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [queryParams] = useSearchParams();
  const [showSettings, setShowSettings] = useState(queryParams.get("page") === "settings");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  const calculateLevel = (xp) => Math.floor(xp / 1000) + 1;
  const level = calculateLevel(user?.xpPoints || 0);
  const xpToNextLevel = (level * 1000) - (user?.xpPoints || 0);
  const levelProgress = (((user?.xpPoints || 0) % 1000) / 1000) * 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'activity', label: 'Activity', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (showSettings) {
    return <ProfileSettings user={user} back={() => setShowSettings(false)} />;
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Loading profile...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      
      <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader 
          user={user}
          level={level || 0}
          levelProgress={levelProgress}
          xpToNextLevel={xpToNextLevel}
          isEditing={isEditing}
          onEditToggle={() => setIsEditing(!isEditing)}
          onSettingsClick={() => setShowSettings(true)}
        />

        <ProfileStats 
          user={user}
          streakDays={user.streakDays}
          activeStartups={user.activeStartupsCount}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            {/* Level Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
            >
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-800">
                    {level}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">
                    PRO
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Level {level}</h3>
                <p className="text-sm text-gray-400">{user.xpPoints} XP</p>
                
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Next: Level {level + 1}</span>
                    <span>{xpToNextLevel} XP needed</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
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
                    {user.streakDays} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Startups</span>
                  <span className="text-blue-400">{user?.activeStartupsCount} active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Tasks Done</span>
                  <span className="text-green-400">{user?.statistics?.completed_tasks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Engagement</span>
                  <span className="text-purple-400">{user?.statistics?.engagement_score}%</span>
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
                {user.profile?.socialLinks?.linkedin && (
                  <a href={`https://linkedin.com/in/${user?.profile?.socialLinks?.linkedin}`} 
                     className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    LinkedIn
                  </a>
                )}
                {user.profile?.socialLinks?.github && (
                  <a href={`https://github.com/${user?.profile?.socialLinks?.github}`}
                    className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors">
                    GitHub
                  </a>
                )}
                {user.profile?.socialLinks?.portfolio && (
                  <a href={`https://${user?.profile?.socialLinks?.portfolio}`}
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
            <ProfileTabs 
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            <div className="min-h-150">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <ActivityFeed activities={user?.recentActivity || []} />
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6"
                  >
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Rocket className="w-5 h-5" />
                      Active Projects
                    </h3>
                    {user.relationships?.assignedTasks?.length > 0 ? (
                      <div className="grid gap-4">
                        {user.relationships.assignedTasks.map((task, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-xl">
                            <div>
                              <h4 className="font-semibold">{task.title}</h4>
                              <p className="text-sm text-gray-400">In progress</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 py-8">No active projects</p>
                    )}
                  </motion.div>
                </div>
              )}

              {activeTab === 'achievements' && (
                <AchievementSection achievements={user.relationships?.achievements || []} />
              )}

              {activeTab === 'activity' && (
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">Detailed Activity</h3>
                  <div className="text-center text-gray-500 py-12">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Detailed activity timeline coming soon...</p>
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
                  <h3 className="text-xl font-semibold mb-6">Projects & Startups</h3>
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
