import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TinderCard from 'react-tinder-card';
import { 
  Search, Filter, X, MapPin, Briefcase, Mail, CheckCircle, 
  AlertCircle, ChevronLeft, ChevronRight, Sparkles, 
  Users, TrendingUp, UserPlus, ExternalLink, Check,
  Eye, DollarSign, Building2, Code, Send
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ShinyText from "../ui/ShinyText";
import { useSelector } from 'react-redux';
// import { SidebarV2 } from './SidebarV2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slideIn">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
      } text-white`}>
        {type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
};

// User Swipe Card Component
const UserSwipeCard = ({ user, onViewProfile }) => {
  // Determine role color
  const getRoleColor = (role) => {
    const colors = {
      'admin': 'bg-red-100 text-red-700 border-red-200',
      'moderator': 'bg-purple-100 text-purple-700 border-purple-200',
      'member': 'bg-blue-100 text-blue-700 border-blue-200',
      'founder': 'bg-green-100 text-green-700 border-green-200',
      'investor': 'bg-yellow-100 text-yellow-700 border-yellow-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="absolute w-full h-[400px] cursor-grab select-none"  
      onMouseDown={(e) => {
        e.target.classList.remove('cursor-grab');
        e.target.classList.add('cursor-grabbing');
      }}
      onMouseUp={(e) => {
        e.target.classList.remove('cursor-grabbing');
        e.target.classList.add('cursor-grab');
      }}
    >
      <div className="relative w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 
                      rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/90 z-10" />
        
        {/* Content */}
        <div className="relative h-full flex flex-col p-6 z-20">
          {/* Avatar section */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              {user?.profile?.picture ? (
                <img
                  src={`${API_URL}${user?.profile?.picture}`}
                  alt={user?.fullName}
                  className="w-20 h-20 rounded-full border-4 border-slate-700 shadow-lg bg-slate-800 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-slate-700 shadow-lg flex items-center justify-center text-white font-bold text-2xl">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
              )}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full border-4 border-slate-700 shadow-lg flex items-center justify-center text-white font-bold text-2xl hidden">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 ${user?.status === 'active' ? 'bg-green-500' : 'bg-gray-500'} rounded-full border-4 border-slate-900`} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{user?.fullName}</h2>
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Briefcase size={14} />
                <span className="text-sm">{user?.profile?.company || 'No company'}</span>
              </div>
              <Badge className={`text-xs border ${getRoleColor(user?.role)}`}>
                {user?.role}
              </Badge>
            </div>
          </div>

          {/* Bio */}
          <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-3">
            {user?.profile?.bio || `${user?.fullName} is an active member of the community.`}
          </p>

          {/* Stats */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-slate-800/50 rounded-lg">
              <div className="text-lg font-bold text-white">{user?.xp_points || 0}</div>
              <div className="text-xs text-slate-400">XP</div>
            </div>
            <div className="text-center p-2 bg-slate-800/50 rounded-lg">
              <div className="text-lg font-bold text-white">{user?.streak_days || 0}</div>
              <div className="text-xs text-slate-400">Streak</div>
            </div>
            <div className="text-center p-2 bg-slate-800/50 rounded-lg">
              <div className="text-lg font-bold text-green-400">{user?.satisfaction_percentage || 100}%</div>
              <div className="text-xs text-slate-400">Satisfaction</div>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Bottom section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="text-sm">
                  {user?.profile?.city ? `${user?.profile.city}, ${user?.profile.country}` : 'Location not set'}
                </span>
              </div>
              <span className="text-sm">·</span>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm">{user?.active_startups_count || 0} startups</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(user);
              }}
              className="w-full py-3 bg-gradient-to-r from-blue-600/50 to-purple-600/50 hover:from-blue-500/50 
                       hover:to-purple-500/50 text-white rounded-xl border border-blue-500/20 
                       transition-all duration-200 font-medium flex items-center justify-center gap-2"
            >
              <Eye size={16} />
              View Full Profile
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

// Swipe Action Modal Component
const SwipeActionModal = ({ user, onClose, onFriendRequest, onMessage }) => {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFriendRequest = async () => {
    setLoading(true);
    await onFriendRequest(user?.id);
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    await onMessage(user?.id, message);
    setLoading(false);
  };

  // Message Box Component
  const MessageBox = ({ value, onChange, onSend, loading }) => (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-300">Your Message</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a personalized message..."
        className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl 
                   text-white placeholder-gray-500 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <button
        onClick={onSend}
        disabled={!value.trim() || loading}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 
                   hover:to-purple-500 text-white rounded-xl font-medium transition-all duration-200 
                   disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 
                      animate-scaleIn overflow-hidden">
        {/* Header */}
        <div className="relative px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-3">
            {user?.profile?.picture ? (
              <img
                src={`${API_URL}${user?.profile?.picture}`}
                alt={user?.fullName}
                className="w-12 h-12 rounded-full border-2 border-gray-700 object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">Connect with {user?.firstName}</h3>
              <p className="text-sm text-gray-400">{user?.profile?.company || 'No company'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showMessageBox ? (
            <div className="space-y-3">
              <p className="text-gray-300 text-sm mb-4">
                Choose how you'd like to connect with {user?.firstName}
              </p>
              
              <button
                onClick={handleFriendRequest}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 
                         hover:to-cyan-500 text-white rounded-xl font-medium transition-all duration-200 
                         flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Send Friend Request
                  </>
                )}
              </button>

              <button
                onClick={() => setShowMessageBox(true)}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl 
                         font-medium transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Mail size={18} />
                Send Message
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 text-gray-400 hover:text-white transition-colors text-sm"
              >
                Maybe Later
              </button>
            </div>
          ) : (
            <MessageBox
              value={message}
              onChange={setMessage}
              onSend={handleSendMessage}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="flex flex-col items-center justify-center py-20"
  >
    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4">
      <UserPlus className="w-10 h-10 text-blue-500" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No more users to discover</h3>
    <p className="text-gray-400 mb-6 text-center max-w-md">
      You've swiped through all available users. Check back later for more connections!
    </p>
    <Button 
      onClick={() => window.location.reload()} 
      variant="outline" 
      className="border-gray-600 text-gray-300"
    >
      Refresh Page
    </Button>
  </motion.div>
);

// Main Users Swipe Page
const DiscoverUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const { access_token } = useSelector((state) => state.auth);
  
  const itemsPerPage = 20;
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () => Array(users.length).fill(0).map(() => React.createRef()),
    [users.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  // Fetch users data
  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const token = access_token; 
      
      if (!token) {
        console.error('No access token found');
        return;
      }
  
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: itemsPerPage.toString()
      });
  
      if (searchQuery) params.append('search', searchQuery);
      if (selectedRole !== '') params.append('role', selectedRole);
      if (selectedStatus !== '') params.append('status', selectedStatus);

      const response = await fetch(`${API_URL}/users?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
  
      if (data.success) {
        const formattedUsers = data.data.users.map((u) => ({
          id: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          fullName: `${u.firstName} ${u.lastName}`,
          email: u.email,
          role: u.role,
          status: u.status,
          xp_points: u.xp_points,
          streak_days: u.streak_days,
          satisfaction_percentage: u.satisfaction_percentage,
          active_startups_count: u.active_startups_count,
          profile: {
            picture: u.profile?.picture,
            bio: u.profile?.bio,
            company: u.profile?.company,
            country: u.profile?.country,
            city: u.profile?.city,
            timezone: u.profile?.timezone
          }
        }));
        
        setUsers(formattedUsers);
        setTotalPages(data.data.pagination.total);
        setCurrentPage(data.data.pagination.page);
        
        // Set current index to last user
        if (formattedUsers.length > 0) {
          setCurrentIndex(formattedUsers.length - 1);
          currentIndexRef.current = formattedUsers.length - 1;
        }
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers(1);
  }, [searchQuery, selectedRole, selectedStatus]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedRole("");
    setSelectedStatus("");
  };

  const activeFiltersCount = [
    selectedRole !== "",
    selectedStatus !== "",
    searchQuery !== ""
  ].filter(Boolean).length;

  // Simulated API calls
  const sendFriendRequest = async (userId) => {
    try {
      // await fetch('/api/friends/request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ receiver_id: userId })
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setToast({ message: 'Friend request sent!', type: 'success' });
      setShowModal(false);
    } catch (error) {
      setToast({ message: 'Failed to send request', type: 'error' });
    }
  };

  const sendMessage = async (userId, message) => {
    try {
      // await fetch('/api/messages/send', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ receiver_id: userId, message })
      // });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setToast({ message: 'Message sent successfully!', type: 'success' });
      setShowModal(false);
    } catch (error) {
      setToast({ message: 'Failed to send message', type: 'error' });
    }
  };

  const swiped = (direction, user, index) => {
    if (direction === 'right') {
      setSelectedUser(user);
      setShowModal(true);
    }
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    currentIndexRef.current >= idx && childRefs[idx].current?.restoreCard?.();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < users.length) {
      await childRefs[currentIndex].current?.swipe?.(dir);
    }
  };

  const handleViewProfile = (user) => {
    setToast({ message: 'Profile view feature coming soon!', type: 'success' });
  };

  const roleOptions = ['admin', 'moderator', 'member', 'founder', 'investor'];
  const statusOptions = ['active', 'inactive', 'suspended'];

  // Desktop Filter Sidebar Component
  const FilterSidebar = () => (
    <Card className="p-6 bg-transparent border-0 w-full mb-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full items-end">
        {/* Search Bar */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Search</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-700 border-gray-600 text-white w-full"
              style={{ minWidth: '200px' }}
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Role</h4>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger style={{width:'150px'}} className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="--" className="text-white hover:bg-gray-700">All Roles</SelectItem>
              {roleOptions.map(role => (
                <SelectItem key={role} value={role} className="text-white hover:bg-gray-700">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger style={{width:'150px'}} className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="--" className="text-white hover:bg-gray-700">All Status</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status} className="text-white hover:bg-gray-700">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <div className="flex items-end">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="text-blue-400 hover:text-blue-300 text-xs h-8"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* <SidebarV2/> */}
        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
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
              className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
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
              className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            />
          </div>
        
          {/* Main Heading */}
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          >
            <span className="">
              <ShinyText 
                text="Discover Amazing" 
                disabled={false} 
                speed={3} 
              />
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ShinyText 
                text="People & Innovators" 
                disabled={false} 
                speed={3} 
              />
            </motion.span>
          </motion.h1>
        
          {/* Subheading */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Swipe right to connect with <span className="font-semibold text-white">innovators, founders, and creators</span>.
            Build your network and discover new opportunities.
          </motion.p>
        
          {/* Stats Grid */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">1.5K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">$2.1B</div>
              <div className="text-sm text-gray-400">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">240</div>
              <div className="text-sm text-gray-400">Startup Founders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white mb-1">98%</div>
              <div className="text-sm text-gray-400">Satisfaction Rate</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {/* Mobile Filter Toggle */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden h-12 relative border-gray-600 bg-gray-800 text-gray-300 mb-4">
                <Filter className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto bg-gray-800 border-gray-700">
              <div className="space-y-6 pt-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-white">Filters</h3>
                  {activeFiltersCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-blue-400 hover:text-blue-300 text-xs">
                      Clear all
                    </Button>
                  )}
                </div>

                {/* Search */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Search</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Role */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Role</h4>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="--" className="text-white hover:bg-gray-700">All Roles</SelectItem>
                      {roleOptions.map(role => (
                        <SelectItem key={role} value={role} className="text-white hover:bg-gray-700">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="--" className="text-white hover:bg-gray-700">All Status</SelectItem>
                      {statusOptions.map(status => (
                        <SelectItem key={status} value={status} className="text-white hover:bg-gray-700">
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Desktop Filters */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block"
          >
            <FilterSidebar />
          </motion.div>
        </motion.div>

        {/* Card Stack Container */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Try adjusting your filters or search query to discover more people
              </p>
              <Button onClick={clearFilters} variant="outline" className="border-gray-600 text-gray-300">
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="flex flex-col items-center justify-center"
            >
              <div className="w-full max-w-md h-[400px] relative mb-12">
                {users.map((user, index) => (
                  <TinderCard
                    ref={childRefs[index]}
                    key={user?.id}
                    onSwipe={(dir) => swiped(dir, user, index)}
                    onCardLeftScreen={() => outOfFrame(user?.fullName, index)}
                    preventSwipe={['up', 'down']}
                    className="absolute w-full h-full"
                    swipeRequirementType="position"
                    swipeThreshold={100}
                  >
                    <UserSwipeCard user={user} onViewProfile={handleViewProfile} />
                  </TinderCard>
                ))}
              </div>

              {/* Swipe buttons */}
              {canSwipe && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="flex justify-center gap-8 mb-8"
                >
                  <button
                    onClick={() => swipe('left')}
                    className="w-15 h-15 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center 
                             justify-center shadow-xl transition-all duration-200 border border-gray-700
                             hover:border-red-500 hover:shadow-red-500/20"
                  >
                    <X size={32} className="text-red-400" />
                  </button>
                  <button
                    onClick={() => swipe('right')}
                    className="w-15 h-15 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 
                             hover:to-purple-500 rounded-full flex items-center justify-center shadow-xl 
                             transition-all duration-200 hover:shadow-blue-500/20"
                  >
                    <UserPlus size={32} className="text-white" />
                  </button>
                </motion.div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-gray-600 text-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => fetchUsers(page)}
                      className={currentPage === page 
                        ? "bg-blue-500 hover:bg-blue-600" 
                        : "border-gray-600 text-black hover:text-white cursor-pointer hover:bg-gray-700"
                      }
                    >
                      {page}
                    </Button>
                  ))}
                  
                  {totalPages > 5 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        {totalPages}
                      </Button>
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fetchUsers(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-gray-600 text-gray-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal */}
        {showModal && selectedUser && (
          <SwipeActionModal
            user={selectedUser}
            onClose={() => setShowModal(false)}
            onFriendRequest={sendFriendRequest}
            onMessage={sendMessage}
          />
        )}

        {/* Toast */}
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
          .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
          .animate-slideIn { animation: slideIn 0.3s ease-out; }
        `}</style>
      </div>
    </div>
  );
};

export default DiscoverUsers;