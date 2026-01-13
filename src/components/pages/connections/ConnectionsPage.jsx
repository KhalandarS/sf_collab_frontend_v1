/**
 * ConnectionsPage Component
 * ==========================
 * Put this in: src/components/pages/connections/ConnectionsPage.jsx
 * 
 * Dedicated Connections List page with:
 *   - Connections tab: All accepted connections
 *   - Incoming tab: Pending requests received
 *   - Outgoing tab: Pending requests sent
 * 
 * Each connection shows:
 *   - Name
 *   - Basic profile info
 *   - Actions (view profile, remove connection)
 */

import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Clock, Search, RefreshCw,
  Check, X, MessageCircle, User, Loader2, UserX
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { connectionAPI } from '@/utils/APIs/connectionAPI';
import { toast } from '@/hooks/use-toast';
import { API_URL } from '@/utils/config';

// Tab types
const TABS = {
  CONNECTIONS: 'connections',
  INCOMING: 'incoming',
  OUTGOING: 'outgoing',
};

export default function ConnectionsPage() {
  const navigate = useNavigate();
  const { access_token } = useSelector((state) => state.auth);

  // State
  const [activeTab, setActiveTab] = useState(TABS.CONNECTIONS);
  const [connections, setConnections] = useState([]);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [counts, setCounts] = useState({ connections: 0, incoming: 0, outgoing: 0 });

  // ==========================================================================
  // FETCH DATA
  // ==========================================================================

  const fetchCounts = useCallback(async () => {
    if (!access_token) return;
    try {
      const response = await connectionAPI.getCounts(access_token);
      const data = response.data || response;
      setCounts({
        connections: data.connections || 0,
        incoming: data.incoming || 0,
        outgoing: data.outgoing || 0,
      });
    } catch (err) {
      console.error('Failed to fetch counts:', err);
    }
  }, [access_token]);

  const fetchData = useCallback(async () => {
    if (!access_token) return;
    
    setLoading(true);
    
    try {
      switch (activeTab) {
        case TABS.CONNECTIONS: {
          const response = await connectionAPI.getConnections(access_token, {
            search: searchQuery,
            per_page: 50,
          });
          const data = response.data || response;
          setConnections(data.connections || []);
          break;
        }
        case TABS.INCOMING: {
          const response = await connectionAPI.getIncomingRequests(access_token, {
            per_page: 50,
          });
          const data = response.data || response;
          setIncoming(data.requests || []);
          break;
        }
        case TABS.OUTGOING: {
          const response = await connectionAPI.getOutgoingRequests(access_token, {
            per_page: 50,
          });
          const data = response.data || response;
          setOutgoing(data.requests || []);
          break;
        }
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
      toast.destructive?.({ title: 'Error', description: 'Failed to load data' }) ||
        toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [activeTab, access_token, searchQuery]);

  // Initial fetch
  useEffect(() => {
    fetchCounts();
  }, [fetchCounts]);

  // Fetch on tab change or search
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search
  useEffect(() => {
    if (activeTab !== TABS.CONNECTIONS) return;
    
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ==========================================================================
  // ACTIONS
  // ==========================================================================

  /**
   * Accept incoming request
   */
  const handleAccept = async (requestId) => {
    setActionLoading(requestId);
    try {
      await connectionAPI.acceptRequest(requestId, access_token);
      
      // Remove from incoming list
      setIncoming(prev => prev.filter(r => r.id !== requestId));
      setCounts(prev => ({
        ...prev,
        incoming: Math.max(0, prev.incoming - 1),
        connections: prev.connections + 1,
      }));
      
      toast.success?.({ title: 'Connection accepted!' }) ||
        toast({ title: 'Connection accepted!', variant: 'success' });
    } catch (err) {
      toast.destructive?.({ title: 'Failed to accept request' }) ||
        toast({ title: 'Failed to accept request', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Decline incoming request
   */
  const handleDecline = async (requestId) => {
    setActionLoading(requestId);
    try {
      await connectionAPI.declineRequest(requestId, access_token);
      
      setIncoming(prev => prev.filter(r => r.id !== requestId));
      setCounts(prev => ({
        ...prev,
        incoming: Math.max(0, prev.incoming - 1),
      }));
      
      toast.success?.({ title: 'Request declined' }) ||
        toast({ title: 'Request declined' });
    } catch (err) {
      toast.destructive?.({ title: 'Failed to decline request' }) ||
        toast({ title: 'Failed to decline request', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Cancel outgoing request
   */
  const handleCancel = async (requestId) => {
    setActionLoading(requestId);
    try {
      await connectionAPI.cancelRequest(requestId, access_token);
      
      setOutgoing(prev => prev.filter(r => r.id !== requestId));
      setCounts(prev => ({
        ...prev,
        outgoing: Math.max(0, prev.outgoing - 1),
      }));
      
      toast.success?.({ title: 'Request cancelled' }) ||
        toast({ title: 'Request cancelled' });
    } catch (err) {
      toast.destructive?.({ title: 'Failed to cancel request' }) ||
        toast({ title: 'Failed to cancel request', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Remove connection
   */
  const handleRemove = async (userId, connectionId) => {
    if (!confirm('Remove this connection? This will delete the connection for both users.')) {
      return;
    }
    
    setActionLoading(connectionId);
    try {
      await connectionAPI.removeConnection(userId, access_token);
      
      setConnections(prev => prev.filter(c => c.id !== connectionId));
      setCounts(prev => ({
        ...prev,
        connections: Math.max(0, prev.connections - 1),
      }));
      
      toast.success?.({ title: 'Connection removed' }) ||
        toast({ title: 'Connection removed' });
    } catch (err) {
      toast.destructive?.({ title: 'Failed to remove connection' }) ||
        toast({ title: 'Failed to remove connection', variant: 'destructive' });
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * Navigate to user profile
   */
  const goToProfile = (userId) => {
    navigate(`/user-profile/${userId}`);
  };

  /**
   * Navigate to chat
   */
  const goToChat = (userId) => {
    navigate(`/chat?user=${userId}`);
  };

  /**
   * Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  My Connections
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Manage your network and connection requests
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => { fetchData(); fetchCounts(); }}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Search (only for connections tab) */}
          {activeTab === TABS.CONNECTIONS && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search connections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700 mb-6">
          {[
            { key: TABS.CONNECTIONS, label: 'Connections', icon: Users, count: counts.connections },
            { key: TABS.INCOMING, label: 'Incoming', icon: UserPlus, count: counts.incoming, highlight: true },
            { key: TABS.OUTGOING, label: 'Sent', icon: Clock, count: counts.outgoing },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <Badge
                  className={`ml-1 ${
                    tab.highlight && tab.count > 0
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {tab.count}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {/* CONNECTIONS TAB */}
              {activeTab === TABS.CONNECTIONS && (
                connections.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No connections yet"
                    description="Start connecting with other users to build your network!"
                    action={{ label: 'Discover Users', onClick: () => navigate('/discover-users') }}
                  />
                ) : (
                  connections.map((conn) => (
                    <ConnectionCard
                      key={conn.id}
                      user={conn.connected_user}
                      subtitle={`Connected ${formatDate(conn.connected_at)}`}
                      isLoading={actionLoading === conn.id}
                      actions={
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => goToChat(conn.connected_user?.id)}
                            className="border-slate-600 text-slate-300 hover:bg-blue-600 hover:border-blue-600"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => goToProfile(conn.connected_user?.id)}
                            className="border-slate-600 text-slate-300"
                          >
                            <User className="w-4 h-4 mr-1" />
                            Profile
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemove(conn.connected_user?.id, conn.id)}
                            disabled={actionLoading === conn.id}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            {actionLoading === conn.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <UserX className="w-4 h-4" />
                            )}
                          </Button>
                        </>
                      }
                      onClick={() => goToProfile(conn.connected_user?.id)}
                    />
                  ))
                )
              )}

              {/* INCOMING TAB */}
              {activeTab === TABS.INCOMING && (
                incoming.length === 0 ? (
                  <EmptyState
                    icon={UserPlus}
                    title="No pending requests"
                    description="When someone wants to connect with you, their request will appear here."
                  />
                ) : (
                  incoming.map((req) => (
                    <ConnectionCard
                      key={req.id}
                      user={req.sender}
                      subtitle={`Requested ${formatDate(req.created_at)}`}
                      isLoading={actionLoading === req.id}
                      actions={
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAccept(req.id)}
                            disabled={actionLoading === req.id}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            {actionLoading === req.id ? (
                              <Loader2 className="w-4 h-4 animate-spin mr-1" />
                            ) : (
                              <Check className="w-4 h-4 mr-1" />
                            )}
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDecline(req.id)}
                            disabled={actionLoading === req.id}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      }
                      onClick={() => goToProfile(req.sender?.id)}
                    />
                  ))
                )
              )}

              {/* OUTGOING TAB */}
              {activeTab === TABS.OUTGOING && (
                outgoing.length === 0 ? (
                  <EmptyState
                    icon={Clock}
                    title="No sent requests"
                    description="Connection requests you send will appear here until they're accepted or declined."
                  />
                ) : (
                  outgoing.map((req) => (
                    <ConnectionCard
                      key={req.id}
                      user={req.receiver}
                      subtitle={`Sent ${formatDate(req.created_at)}`}
                      isLoading={actionLoading === req.id}
                      actions={
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(req.id)}
                          disabled={actionLoading === req.id}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          {actionLoading === req.id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-1" />
                          ) : (
                            <X className="w-4 h-4 mr-1" />
                          )}
                          Cancel
                        </Button>
                      }
                      onClick={() => goToProfile(req.receiver?.id)}
                    />
                  ))
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

/**
 * Connection/Request Card
 */
function ConnectionCard({ user, subtitle, actions, onClick, isLoading }) {
  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User'
    : 'Unknown User';

  const avatarUrl = user?.profile_picture
    ? (user.profile_picture.startsWith('http') ? user.profile_picture : `${API_URL}${user.profile_picture}`)
    : null;

  const initials = user
    ? `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`
    : '?';

  return (
    <Card
      className={`p-5 bg-slate-800/50 border-slate-700 hover:border-slate-600 
                  transition-colors cursor-pointer group ${isLoading ? 'opacity-60' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex-shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
              {initials}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
            {fullName}
          </h3>
          {user?.title && (
            <p className="text-sm text-slate-400 truncate">{user.title}</p>
          )}
          {user?.company && (
            <p className="text-xs text-slate-500 truncate">{user.company}</p>
          )}
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      </div>
    </Card>
  );
}

/**
 * Empty State
 */
function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex p-4 rounded-2xl bg-slate-800/50 border border-slate-700 mb-6">
        <Icon className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Button
          onClick={action.onClick}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}

/**
 * Loading Skeleton
 */
function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {[1, 2, 3].map((i) => (
        <Card key={i} className="p-5 bg-slate-800/50 border-slate-700">
          <div className="flex items-center gap-4 animate-pulse">
            <div className="w-14 h-14 bg-slate-700 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-slate-700 rounded w-1/3" />
              <div className="h-3 bg-slate-700 rounded w-1/4" />
            </div>
            <div className="flex gap-2">
              <div className="w-24 h-9 bg-slate-700 rounded-lg" />
              <div className="w-24 h-9 bg-slate-700 rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </motion.div>
  );
}
