import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import ShinyText from "../ui/ShinyText";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { usersAPI } from '@/utils/APIs/userApi';
import FilterSidebar from './FilterSidebar';
import UserCard from './UserCard';
import { chatAPI } from '@/utils/APIs/chatApi';

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
  const [messageText, setMessageText] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const { user, access_token } = useSelector((state) => state.auth);
  const ITEMS_PER_PAGE = 20;

  const fetchUsers = async (page) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: ITEMS_PER_PAGE.toString()
      });

      if (searchQuery) params.append('search', searchQuery);
      if (selectedRole) params.append('role', selectedRole);
      if (selectedStatus) params.append('status', selectedStatus);

      const response = await usersAPI.getAll(access_token, params);

      if (response.success) {
        setUsers(
          response.data.users.filter(u => u.id !== user?.id) || []
        );
        console.log(response);
        setTotalPages(response.data.pagination.total);
        setCurrentPage(page); 
      }
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers(1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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


  const sendMessage = async () => {
    if (!messageText.trim()) {
      toast.warning('Please enter a message');
      return;
    }

    try {
      setSendingMessage(true);
      const response = await chatAPI.sendDirectMessage(selectedUser.id, messageText, access_token);
      if (response) {
        toast.success(
          <div className="flex items-center justify-between w-full">
            <span>Message sent successfully!</span>
            <button
              onClick={() => window.location.href = `/chat?conversationId=${response.conversation.id}`}
              className="ml-4 px-3 py-1 bg-white text-blue-600 rounded text-sm font-medium hover:bg-gray-100"
            >
              Go to Chat
            </button>
          </div>,
          { autoClose: false }
        );
      } else {
        toast.error('Failed to send message');
      }
      setMessageText("");
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };



  const getVisiblePages = () => {
    const delta = 2;
    const start = Math.max(1, currentPage - delta);
    const end = Math.min(totalPages, currentPage + delta);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const roleOptions = ['admin', 'moderator', 'member', 'founder', 'investor'];
  const statusOptions = ['active', 'inactive', 'suspended'];

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8 relative overflow-hidden"
        >
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
              className="absolute -top-20 -left-20 w-40 h-40 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
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
              className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
            />
          </div>
        
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
        
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Swipe right to connect with <span className="font-semibold text-white">innovators, founders, and creators</span>.
            Build your network and discover new opportunities.
          </motion.p>
        
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

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Role</h4>
                  <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="All Roles" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="" className="text-white hover:bg-gray-700">All Roles</SelectItem>
                      {roleOptions.map(role => (
                        <SelectItem key={role} value={role} className="text-white hover:bg-gray-700">
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="" className="text-white hover:bg-gray-700">All Status</SelectItem>
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
          
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="hidden md:block"
          >
            <FilterSidebar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              clearFilters={clearFilters}
              activeFiltersCount={activeFiltersCount}
              roleOptions={roleOptions}
              statusOptions={statusOptions}
            />
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
              <div className="w-20 h-20 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
              <p className="text-gray-400 mb-6 text-center max-w-md">
                Try adjusting your filters or search query to discover more people
              </p>
              <Button onClick={clearFilters} variant="outline" className="border-gray-600 text-black">
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="flex flex-col items-center justify-center"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onOpen={(user) => {
                      setSelectedUser(user);
                      setShowModal(true);
                    }}
                  />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => fetchUsers(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {currentPage > 3 && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => fetchUsers(1)}>1</Button>
                      <span className="text-gray-500">…</span>
                    </>
                  )}

                  {getVisiblePages().map(page => (
                    <Button
                      key={page}
                      size="sm"
                      onClick={() => fetchUsers(page)}
                      className={
                        page === currentPage
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "border border-gray-600"
                      }
                    >
                      {page}
                    </Button>
                  ))}

                  {currentPage < totalPages - 2 && (
                    <>
                      <span className="text-gray-500">…</span>
                      <Button variant="outline" size="sm" onClick={() => fetchUsers(totalPages)}>
                        {totalPages}
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => fetchUsers(currentPage + 1)}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Detail Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-md bg-gray-900 border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedUser?.fullName}</span>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                </button>
              </DialogTitle>
            </DialogHeader>

            {selectedUser && (
              <div className="space-y-4">
                {/* Profile Picture */}
                {selectedUser.profile?.picture && (
                  <div className="flex justify-center">
                    <img
                      src={selectedUser.profile.picture}
                      alt={selectedUser.fullName}
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                    />
                  </div>
                )}

                {/* User Info */}
                <div className="space-y-2 text-sm">
                  <p><span className="font-semibold">Role:</span> {selectedUser.role}</p>
                  <p><span className="font-semibold">Status:</span> {selectedUser.status}</p>
                  {selectedUser.profile?.company && (
                    <p><span className="font-semibold">Company:</span> {selectedUser.profile.company}</p>
                  )}
                  {selectedUser.profile?.bio && (
                    <p><span className="font-semibold">Bio:</span> {selectedUser.profile.bio}</p>
                  )}
                  {(selectedUser.active_startups_count !== 0) && (
                    <p><span className="font-semibold">Startups:</span> {selectedUser.active_startups_count}</p>
                  )}
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-700">
                  <div className="text-center">
                    <p className="font-bold text-blue-400">{selectedUser.xp_points || 0}</p>
                    <p className="text-xs text-gray-400">XP Points</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-400">{selectedUser.streak_days || 0}</p>
                    <p className="text-xs text-gray-400">Streak Days</p>
                  </div>
                </div>

                {/* Message Input */}
                <div className="space-y-2 pt-2 border-t border-gray-700">
                  <label className="text-sm font-medium text-gray-300">Send a Message</label>
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Write your message..."
                    className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    rows="3"
                  />
                </div>

                {/* Action Button */}
                <Button
                  onClick={sendMessage}
                  disabled={sendingMessage || !messageText.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {sendingMessage ? "Sending..." : "Send Message"}
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DiscoverUsers;
