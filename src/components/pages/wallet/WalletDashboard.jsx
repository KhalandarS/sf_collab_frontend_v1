/**
 * WalletDashboard - SF Collab Virtual Economy Dashboard
 * Displays wallet balance, transactions, and currency management
 * 
 * FIXED: Quick Actions now use modals and valid routes instead of broken links
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Gem,
  Ticket,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownLeft,
  History,
  Gift,
  Send,
  ShoppingBag,
  Trophy,
  Sparkles,
  RefreshCw,
  ChevronRight,
  Zap,
  Target,
  Crown,
  X,
  User,
} from 'lucide-react';
import { walletAPI } from '@/utils/APIs/walletAPI';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';

// Currency configurations
const CURRENCY_COLORS = {
  sf_coins: {
    gradient: 'from-amber-500 to-yellow-600',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  premium_gems: {
    gradient: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/20',
  },
  event_tokens: {
    gradient: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    glow: 'shadow-cyan-500/20',
  },
};

const TRANSACTION_ICONS = {
  earn: { icon: ArrowDownLeft, color: 'text-green-400', bg: 'bg-green-500/10' },
  spend: { icon: ArrowUpRight, color: 'text-red-400', bg: 'bg-red-500/10' },
  purchase: { icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  refund: { icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  bonus: { icon: Gift, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  transfer: { icon: Send, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const WalletDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [wallet, setWallet] = useState(null);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  // Update tab from URL params
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'history', 'leaderboard'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      
      const [balanceRes, statsRes, historyRes, leaderboardRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getStats(),
        walletAPI.getHistory({ per_page: 10 }),
        walletAPI.getLeaderboard({ limit: 10 }),
      ]);

      if (balanceRes.success) setWallet(balanceRes.wallet);
      if (statsRes.success) setStats(statsRes);
      if (historyRes.success) setTransactions(historyRes.transactions || []);
      if (leaderboardRes.success) setLeaderboard(leaderboardRes.leaderboard || []);
      
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast.error('Failed to load wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchWalletData();
    setRefreshing(false);
    toast.success('Wallet refreshed!');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return '0';
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Coins className="w-6 h-6 text-blue-400" />
            </div>
            My Wallet
          </h1>
          <p className="text-gray-400 mt-1">Manage your SF Coins, Crystals & Event Tokens</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          
          <Link
            to="/store"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Visit Store</span>
          </Link>
        </div>
      </motion.div>

      {/* Currency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <CurrencyCard
          name="SF Coins"
          balance={wallet?.sf_coins || 0}
          icon={Coins}
          colors={CURRENCY_COLORS.sf_coins}
          subtitle="Earned through contributions"
          trend={wallet ? ((wallet.daily_earnings / wallet.daily_earning_limit) * 100) : 0}
          trendLabel="Daily Progress"
        />

        <CurrencyCard
          name="SF Crystals"
          balance={wallet?.premium_gems || 0}
          icon={Gem}
          colors={CURRENCY_COLORS.premium_gems}
          subtitle="Premium currency"
          action={
            <Link
              to="/pricing"
              className="text-xs px-3 py-1.5 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 transition-colors"
            >
              Get More
            </Link>
          }
        />

        <CurrencyCard
          name="Event Tokens"
          balance={wallet?.event_tokens || 0}
          icon={Ticket}
          colors={CURRENCY_COLORS.event_tokens}
          subtitle="Special event rewards"
          action={
            <span className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-300">
              Limited Time
            </span>
          }
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Earned"
          value={formatNumber(wallet?.total_coins_earned || 0)}
          icon={TrendingUp}
          color="text-green-400"
        />
        <StatCard
          label="Total Spent"
          value={formatNumber(wallet?.total_coins_spent || 0)}
          icon={TrendingDown}
          color="text-red-400"
        />
        <StatCard
          label="Daily Earnings"
          value={`${wallet?.daily_earnings || 0}/${wallet?.daily_earning_limit || 1000}`}
          icon={Target}
          color="text-amber-400"
        />
        <StatCard
          label="Net Balance"
          value={formatNumber((wallet?.total_coins_earned || 0) - (wallet?.total_coins_spent || 0))}
          icon={Zap}
          color="text-blue-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-xl w-fit">
        {['overview', 'history', 'leaderboard'].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <QuickActionsCard 
              onTransferClick={() => setShowTransferModal(true)} 
              onLeaderboardClick={() => handleTabChange('leaderboard')}
            />
            <DailyProgressCard stats={stats} />
            <div className="lg:col-span-2">
              <RecentActivityCard 
                transactions={transactions.slice(0, 5)} 
                formatDate={formatDate}
                onViewAll={() => handleTabChange('history')} 
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TransactionHistoryCard transactions={transactions} formatDate={formatDate} />
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LeaderboardCard leaderboard={leaderboard} currentUserId={user?.id} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <TransferModal
            wallet={wallet}
            onClose={() => setShowTransferModal(false)}
            onSuccess={() => {
              setShowTransferModal(false);
              fetchWalletData();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};


// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const CurrencyCard = ({ name, balance, icon: Icon, colors, subtitle, trend, trendLabel, action }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`relative overflow-hidden rounded-2xl ${colors.bg} border ${colors.border} p-6 group hover:scale-[1.02] transition-transform`}
  >
    <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${colors.gradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
    
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.gradient} shadow-lg ${colors.glow}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {action}
      </div>
      
      <p className="text-gray-400 text-sm mb-1">{name}</p>
      <h2 className="text-3xl font-bold text-white mb-2">
        {(balance || 0).toLocaleString()}
      </h2>
      <p className="text-gray-500 text-xs">{subtitle}</p>
      
      {trend !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">{trendLabel}</span>
            <span className={colors.text}>{Math.round(trend)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(trend, 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
            />
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

// FIXED: Quick Actions now use onClick handlers instead of broken routes
const QuickActionsCard = ({ onTransferClick, onLeaderboardClick }) => {
  const actions = [
    { 
      icon: Send, 
      label: 'Send Coins', 
      color: 'from-blue-500 to-cyan-500', 
      onClick: onTransferClick 
    },
    { 
      icon: ShoppingBag, 
      label: 'Shop', 
      color: 'from-purple-500 to-pink-500', 
      href: '/store' 
    },
    { 
      icon: Gift, 
      label: 'Daily Bonus', 
      color: 'from-amber-500 to-orange-500', 
      onClick: () => toast.info('🎁 Daily bonus system coming soon!') 
    },
    { 
      icon: Trophy, 
      label: 'Leaderboard', 
      color: 'from-green-500 to-emerald-500', 
      onClick: onLeaderboardClick 
    },
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-blue-400" />
        Quick Actions
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const content = (
            <>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
                <action.icon className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
            </>
          );

          // Use Link for routes that exist
          if (action.href) {
            return (
              <Link
                key={action.label}
                to={action.href}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group"
              >
                {content}
              </Link>
            );
          }

          // Use button with onClick for actions
          return (
            <button
              key={action.label}
              onClick={action.onClick}
              className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group text-left"
            >
              {content}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DailyProgressCard = ({ stats }) => {
  const progress = stats?.stats?.daily_progress;
  
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-amber-400" />
        Daily Earnings
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-semibold">
            {progress?.earned || 0} / {progress?.limit || 1000} Coins
          </span>
        </div>
        
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress?.percentage || 0}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full"
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {progress?.remaining || 1000} coins remaining
          </span>
          <span className="text-amber-400 font-medium">
            {progress?.percentage || 0}%
          </span>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <p className="text-gray-400 text-sm">
            💡 Complete tasks and contribute to earn more coins!
          </p>
        </div>
      </div>
    </div>
  );
};

const RecentActivityCard = ({ transactions, formatDate, onViewAll }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <History className="w-5 h-5 text-blue-400" />
        Recent Activity
      </h3>
      <button
        onClick={onViewAll}
        className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
      >
        View All <ChevronRight className="w-4 h-4" />
      </button>
    </div>
    
    {!transactions || transactions.length === 0 ? (
      <div className="text-center py-8">
        <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No recent transactions</p>
      </div>
    ) : (
      <div className="space-y-3">
        {transactions.map((tx) => {
          const txConfig = TRANSACTION_ICONS[tx.transaction_type] || TRANSACTION_ICONS.earn;
          const Icon = txConfig.icon;
          const isPositive = ['earn', 'bonus', 'refund'].includes(tx.transaction_type);
          
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${txConfig.bg}`}>
                  <Icon className={`w-4 h-4 ${txConfig.color}`} />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{tx.description || 'Transaction'}</p>
                  <p className="text-gray-500 text-xs">{formatDate(tx.created_at)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : '-'}{(tx.amount || 0).toLocaleString()}
                </p>
                <p className="text-gray-500 text-xs capitalize">
                  {tx.currency_type?.replace('_', ' ') || 'coins'}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

const TransactionHistoryCard = ({ transactions, formatDate }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
      <History className="w-5 h-5 text-blue-400" />
      Transaction History
    </h3>
    
    {!transactions || transactions.length === 0 ? (
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No transactions yet</p>
        <p className="text-gray-500 text-sm mt-2">Your transaction history will appear here</p>
      </div>
    ) : (
      <div className="space-y-3">
        {transactions.map((tx) => {
          const txConfig = TRANSACTION_ICONS[tx.transaction_type] || TRANSACTION_ICONS.earn;
          const Icon = txConfig.icon;
          const isPositive = ['earn', 'bonus', 'refund'].includes(tx.transaction_type);
          
          return (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] border border-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${txConfig.bg}`}>
                  <Icon className={`w-5 h-5 ${txConfig.color}`} />
                </div>
                <div>
                  <p className="text-white font-medium">{tx.description || 'Transaction'}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gray-500 text-sm">{formatDate(tx.created_at)}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-500 text-sm capitalize">{tx.transaction_type}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : '-'}{(tx.amount || 0).toLocaleString()}
                </p>
                <p className="text-gray-500 text-sm capitalize">{tx.currency_type?.replace('_', ' ') || 'coins'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    )}
  </div>
);

const LeaderboardCard = ({ leaderboard, currentUserId }) => {
  const RANK_STYLES = {
    1: { bg: 'bg-gradient-to-br from-amber-500/20 to-yellow-600/20', border: 'border-amber-500/30', text: 'text-amber-400' },
    2: { bg: 'bg-gradient-to-br from-gray-300/20 to-gray-400/20', border: 'border-gray-400/30', text: 'text-gray-300' },
    3: { bg: 'bg-gradient-to-br from-orange-600/20 to-orange-700/20', border: 'border-orange-600/30', text: 'text-orange-400' },
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-amber-400" />
        Top Earners Leaderboard
      </h3>
      
      {!leaderboard || leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No leaderboard data yet</p>
          <p className="text-gray-500 text-sm mt-2">Start earning to appear on the leaderboard!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((entry, index) => {
            const isCurrentUser = String(entry.user_id) === String(currentUserId);
            const rankStyle = RANK_STYLES[entry.rank];
            
            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                  isCurrentUser
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : rankStyle
                    ? `${rankStyle.bg} ${rankStyle.border}`
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    rankStyle ? rankStyle.text : 'text-gray-400'
                  } ${entry.rank <= 3 ? 'text-lg' : 'text-sm'}`}>
                    {entry.rank <= 3 ? (
                      <Crown className={`w-6 h-6 ${rankStyle?.text}`} />
                    ) : (
                      `#${entry.rank}`
                    )}
                  </div>
                  
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                    {entry.profile_picture ? (
                      <img src={entry.profile_picture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white font-semibold">
                        {entry.username?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-white font-medium flex items-center gap-2">
                      {entry.username || 'Unknown'}
                      {isCurrentUser && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">You</span>
                      )}
                    </p>
                    <p className="text-gray-500 text-sm">
                      Balance: {(entry.current_balance || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-amber-400 font-bold text-lg">
                    {(entry.total_earned || 0).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm">Total Earned</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Transfer Modal Component
const TransferModal = ({ wallet, onClose, onSuccess }) => {
  const [recipientId, setRecipientId] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!recipientId || !amount || parseInt(amount) <= 0) {
      toast.error('Please enter valid recipient and amount');
      return;
    }

    if (parseInt(amount) > (wallet?.sf_coins || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      setLoading(true);
      const result = await walletAPI.transfer({
        recipient_id: recipientId,
        amount: parseInt(amount),
        message: message
      });

      if (result.success) {
        toast.success(`Successfully transferred ${amount} SF Coins!`);
        onSuccess();
      } else {
        toast.error(result.error || 'Transfer failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-[#1a1a1a] border border-white/10 p-6"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Send className="w-5 h-5 text-blue-400" />
          Send SF Coins
        </h2>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Recipient User ID</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Enter user ID"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Amount</label>
            <div className="relative">
              <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="1"
                max={wallet?.sf_coins || 0}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Available: {(wallet?.sf_coins || 0).toLocaleString()} SF Coins
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Message (optional)</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note..."
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={loading || !recipientId || !amount}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Coins
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WalletDashboard;