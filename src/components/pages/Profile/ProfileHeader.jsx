// sections/ProfileHeader.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Edit, Settings, MapPin, Calendar, Mail } from 'lucide-react';

const ProfileHeader = ({ 
  userData, 
  level, 
  levelProgress, 
  xpToNextLevel, 
  isEditing, 
  onEditToggle, 
  onSettingsClick 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative  mb-7  border border-gray-700 rounded-2xl overflow-hidden"
    >   
         {/* Dark Horizon Glow */}
         <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
          }}
        />
      {/* Cover Photo */}
      <div className="relative h-48 ">
        {/* <div className="absolute inset-0 bg-black/20" /> */}
        <button className="absolute top-4 right-4 p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
          <Camera className="w-4 h-4" />
        </button>
      </div>

      {/* Profile Info */}
      <div className="relative px-8 pb-6">
        {/* Profile Picture */}
        <div className="relative -top-12">
          <div className="relative w-32 h-32 rounded-2xl border-4 border-gray-800 bg-gray-700 overflow-hidden">
            <img 
              src={userData.profile.picture} 
              alt={userData.firstName}
              className="w-full h-full object-cover"
            />
            <button className="absolute top-2 right-2 p-1.5 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <Camera className="w-3 h-3" />
              </button>
          </div>
          
        </div>

        {/* User Info */}
        <div className="flex justify-between items-start -mt-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">
                {userData.firstName} {userData.lastName}
              </h1>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Level {level}
              </div>
            </div>
            
            <p className="text-gray-300 mb-4 max-w-2xl">
              {userData.profile.bio}
            </p>

            {/* User Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {userData.profile.city}, {userData.profile.country}
              </div>
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {userData.email}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(userData.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onEditToggle}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button
              onClick={onSettingsClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;