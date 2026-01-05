import { motion } from 'framer-motion';
import { API_URL } from "@/utils/config";
import { MessageCircle } from 'lucide-react';

export default function UserCard({ user, onOpen }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-gray-900 border border-gray-700 rounded-xl p-5 cursor-pointer
                hover:border-blue-600 transition-all w-full h-full"
      onClick={() => onOpen(user)}
    >
      {/* Profile Picture */}
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
          <img
            src={user.profile?.picture ? `${API_URL}${user.profile.picture}` : "/default-user.jpeg"}
            alt={user.fullName}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-700"
            onError={(e) => {
              e.target.src = "/default-user.jpeg";
            }}
          />
          <div className={`absolute bottom-0 right-0 w-5 h-5 ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-2 border-gray-900`} />
        </div>

        {/* Name & Role */}
        <h3 className="text-white font-semibold text-base truncate w-full mb-1">{user.fullName}</h3>
        <p className="text-sm text-gray-400 capitalize mb-4">{user.role}</p>

        {/* Message Button */}
        <button 
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2.5 px-4 rounded-lg transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(user);
          }}
        >
          <MessageCircle size={16} />
          Message
        </button>
      </div>
    </motion.div>
  );
}