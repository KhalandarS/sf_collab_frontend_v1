// sections/AchievementSection.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Lock, Check } from 'lucide-react';

const AchievementSection = ({ achievements }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-6">
      <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        Achievements & Badges
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-xl border ${
              achievement.unlocked 
                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20' 
                : 'bg-gray-700/30 border-gray-600'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${
                achievement.unlocked 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-600 text-gray-400'
              }`}>
                {achievement.unlocked ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Lock className="w-6 h-6" />
                )}
              </div>
              
              <div className="flex-1">
                <h4 className="font-semibold flex items-center gap-2">
                  {achievement.name}
                  {achievement.unlocked && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      Unlocked
                    </span>
                  )}
                </h4>
                <p className="text-sm text-gray-400 mt-1">
                  {achievement.description}
                </p>
                
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{achievement.points} XP</span>
                    <span>{achievement.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlocked 
                          ? 'bg-green-500' 
                          : 'bg-blue-500'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AchievementSection;