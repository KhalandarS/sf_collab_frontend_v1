import { motion } from 'framer-motion';
import { Badge } from '../ui/badge';
import { API_URL } from "@/utils/config";
import { MapPin, Users } from 'lucide-react';

export default function UserCard({ user, onOpen }) {
  console.log(user);
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="bg-gray-900 border min-w-[24rem] border-gray-700 rounded-xl p-6 cursor-pointer
                hover:border-blue-600 transition-shadow shadow-lg hover:shadow-xl"
      onClick={() => onOpen(user)}
    >
      <div className="flex items-center gap-5 mb-5">
        <div className="relative">
          <img
            src={user.profile.picture ? `${API_URL}${user.profile.picture}` : "/default-user.jpeg"}
            alt={user.fullName}
            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
            onError={(e) => {
              e.target.src = "/default-user.jpeg"; // Fallback to default image
            }}
          />
          <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-gray-900`} />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">{user.fullName}</h3>
          <p className="text-sm text-gray-300 capitalize">{user.role}</p>
        </div>
      </div>

      <p className="text-sm text-gray-400 line-clamp-3 mb-5">
        {user.bio || "No bio provided"}
      </p>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="text-center p-2 bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-white">{user.xp_points || 0}</div>
          <div className="text-xs text-gray-400">XP</div>
        </div>
        <div className="text-center p-2 bg-gray-800 rounded-lg">
          <div className="text-lg font-bold text-white">{user.active_startups_count || 0}</div>
          <div className="text-xs text-gray-400">Startups</div>
        </div>
      </div>

      <div className="flex items-center justify-between text-gray-400">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span className="text-sm">
            {user.profile.city ? `${user.profile.city}, ${user.profile.country}` : 'Location not set'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={16} />
          <span className="text-sm">{user.active_startups_count || 0} startups</span>
        </div>
      </div>
    </motion.div>
  );
}
