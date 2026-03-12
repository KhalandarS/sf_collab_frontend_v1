import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft,
  History, ShoppingBag, Sparkles, RefreshCw, ChevronRight,
  Zap, X, Plus, Minus, RotateCcw, DollarSign, Gem, Ticket,
} from 'lucide-react';
import { walletAPI } from '@/utils/APIs/walletAPI';
import { paymentAPI } from '@/utils/APIs/paymentAPI';
import useGetCredits from '@/utils/hooks/useGetCredits';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Link, useSearchParams } from 'react-router-dom';

const TRANSACTION_ICONS = {
  earn:     { icon: TrendingUp,    bg: 'bg-green-500/20',  color: 'text-green-400' },
  spend:    { icon: TrendingDown,  bg: 'bg-red-500/20',    color: 'text-red-400' },
  purchase: { icon: TrendingDown,  bg: 'bg-red-500/20',    color: 'text-red-400' },
  deposit:  { icon: ArrowDownLeft, bg: 'bg-cyan-500/20',   color: 'text-cyan-400' },
  withdraw: { icon: ArrowUpRight,  bg: 'bg-orange-500/20', color: 'text-orange-400' },
  refund:   { icon: RotateCcw,     bg: 'bg-yellow-500/20', color: 'text-yellow-400' },
  bonus:    { icon: Sparkles,      bg: 'bg-purple-500/20', color: 'text-purple-400' },
  transfer: { icon: ArrowUpRight,  bg: 'bg-blue-500/20',   color: 'text-blue-400' },
};

const CURRENCY_CONFIG = {
  sf_coins:     { label: 'SF Coins',      icon: Coins,  color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  gradient: 'from-amber-500 to-yellow-500' },
  premium_gems: { label: 'SF Crystals',   icon: Gem,    color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', gradient: 'from-purple-500 to-pink-500' },
  event_tokens: { label: 'Event Tokens',  icon: Ticket, color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   gradient: 'from-cyan-500 to-blue-500' },
  credits:      { label: 'Balance ($)',   icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', gradient: 'from-green-500 to-emerald-500' },
};

// ─────────────────────────────────────────────────────────────────────────────

const WalletDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const sfCoins = useGetCredits(); // live sf_coins from Redux/hook

  const [wallet, setWallet] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0); // real money in cents
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => { fetchWalletData(); }, []);

  // Keep sf_coins in sync with live hook
  useEffect(() => {
    if (wallet) setWallet(prev => ({ ...prev, sf_coins: sfCoins }));
  }, [sfCoins]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'history'].includes(tab)) setActiveTab(tab);
  }, [searchParams]);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceRes, historyRes, paymentRes] = await Promise.all([
        walletAPI.getBalance(),
        walletAPI.getHistory({ per_page: 20 }),
        paymentAPI.getWalletBalance().catch(() => null),
      ]);

      if (balanceRes?.success && balanceRes.wallet) {
        setWallet(prev => ({
          ...balanceRes.wallet,
          sf_coins: sfCoins ?? balanceRes.wallet.sf_coins,
        }));
      }
      if (historyRes?.success) setTransactions(historyRes.transactions || []);
      if (paymentRes?.data) setWalletBalance(paymentRes.data.balance || 0);
    } catch (err) {
      console.error(err);
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

  const handleTabChange = tab => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const formatNumber = num => {
    if (!num && num !== 0) return '0';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return num.toLocaleString();
  };

  const formatCurrency = cents => `$${(cents / 100).toFixed(2)}`;

  const formatDate = dateStr => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const diff = Date.now() - date.getTime();
    if (diff < 60_000) return 'Just now';
    if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
    if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
    if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const totalEarned = transactions
    .filter(tx => ['earn', 'deposit', 'refund', 'bonus'].includes(tx.transaction_type))
    .reduce((s, tx) => s + (tx.amount || 0), 0);
  const totalSpent = transactions
    .filter(tx => ['spend', 'withdraw', 'purchase'].includes(tx.transaction_type))
    .reduce((s, tx) => s + (tx.amount || 0), 0);

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
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <Coins className="w-6 h-6 text-blue-400" />
            </div>
            My Wallet
          </h1>
          <p className="text-gray-400 mt-1">SF Coins · Crystals · Event Tokens · Balance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh} disabled={refreshing}
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

      {/* ── All 4 currency cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {/* SF Coins */}
        <CurrencyCard
          label="SF Coins"
          value={wallet?.sf_coins ?? 0}
          icon={Coins}
          gradient="from-amber-500/10 to-yellow-600/10"
          border="border-amber-500/30"
          iconGradient="from-amber-500 to-yellow-500"
          iconShadow="shadow-amber-500/20"
          subtext="Earned through activities"
          delay={0}
        />
        {/* Crystals */}
        <CurrencyCard
          label="SF Crystals"
          value={wallet?.premium_gems ?? 0}
          icon={Gem}
          gradient="from-purple-500/10 to-pink-600/10"
          border="border-purple-500/30"
          iconGradient="from-purple-500 to-pink-500"
          iconShadow="shadow-purple-500/20"
          subtext="For visibility boosts"
          delay={0.05}
        />
        {/* Event Tokens */}
        <CurrencyCard
          label="Event Tokens"
          value={wallet?.event_tokens ?? 0}
          icon={Ticket}
          gradient="from-cyan-500/10 to-blue-600/10"
          border="border-cyan-500/30"
          iconGradient="from-cyan-500 to-blue-500"
          iconShadow="shadow-cyan-500/20"
          subtext="For event-specific use"
          delay={0.1}
        />
        {/* Real money balance */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/30 p-5 group hover:scale-[1.02] transition-transform"
        >
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 blur-3xl group-hover:opacity-20 transition-opacity" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg shadow-green-500/20">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30 transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className="text-xs px-2 py-1 rounded-lg bg-orange-500/20 text-orange-300 hover:bg-orange-500/30 transition-colors flex items-center gap-1"
                >
                  <Minus className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-1">Balance</p>
            <h2 className="text-3xl font-bold text-white mb-1">{formatCurrency(walletBalance)}</h2>
            <p className="text-gray-500 text-xs">Real money · deposit / withdraw</p>
          </div>
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Earned"   value={formatNumber(totalEarned)} subtext="SF Coins" icon={TrendingUp}  color="text-green-400" />
        <StatCard label="Total Spent"    value={formatNumber(totalSpent)}  subtext="SF Coins" icon={TrendingDown} color="text-red-400" />
        <StatCard label="Current Balance" value={formatNumber(wallet?.sf_coins ?? 0)} subtext="SF Coins" icon={Zap} color="text-blue-400" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 p-1 bg-white/5 rounded-xl w-fit">
        {['overview', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
            <QuickActionsCard onDepositClick={() => setShowDepositModal(true)} onWithdrawClick={() => setShowWithdrawModal(true)} />
            <RecentActivityCard transactions={transactions.slice(0, 5)} formatDate={formatDate} onViewAll={() => handleTabChange('history')} />
          </motion.div>
        )}
        {activeTab === 'history' && (
          <motion.div key="history" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <TransactionHistoryCard transactions={transactions} formatDate={formatDate} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {showDepositModal && (
          <DepositModal onClose={() => setShowDepositModal(false)} onSuccess={() => { setShowDepositModal(false); fetchWalletData(); }} />
        )}
        {showWithdrawModal && (
          <WithdrawModal walletBalance={walletBalance} onClose={() => setShowWithdrawModal(false)} onSuccess={() => { setShowWithdrawModal(false); fetchWalletData(); }} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Sub-components ──────────────────────────────────────────────────────────

const CurrencyCard = ({ label, value, icon: Icon, gradient, border, iconGradient, iconShadow, subtext, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
    className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} border ${border} p-5 group hover:scale-[1.02] transition-transform`}
  >
    <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-gradient-to-br ${iconGradient} opacity-10 blur-3xl group-hover:opacity-20 transition-opacity`} />
    <div className="relative z-10">
      <div className={`p-2.5 rounded-xl bg-gradient-to-br ${iconGradient} shadow-lg ${iconShadow} w-fit mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <h2 className="text-3xl font-bold text-white mb-1">{value.toLocaleString()}</h2>
      <p className="text-gray-500 text-xs">{subtext}</p>
    </div>
  </motion.div>
);

const StatCard = ({ label, value, subtext, icon: Icon, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/[0.07] transition-colors">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-white/5 ${color}`}><Icon className="w-4 h-4" /></div>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white font-semibold">{value}</p>
        {subtext && <p className="text-gray-500 text-xs">{subtext}</p>}
      </div>
    </div>
  </div>
);

const QuickActionsCard = ({ onDepositClick, onWithdrawClick }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <Sparkles className="w-5 h-5 text-blue-400" /> Quick Actions
    </h3>
    <div className="grid grid-cols-2 gap-3">
      {[
        { icon: Plus,  label: 'Deposit Money',   color: 'from-green-500 to-emerald-500', onClick: onDepositClick },
        { icon: Minus, label: 'Withdraw Money',  color: 'from-orange-500 to-red-500',    onClick: onWithdrawClick },
      ].map(action => (
        <button
          key={action.label} onClick={action.onClick}
          className="flex items-center gap-3 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all group text-left"
        >
          <div className={`p-2 rounded-lg bg-gradient-to-br ${action.color}`}>
            <action.icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
        </button>
      ))}
    </div>
  </div>
);

const TransactionRow = ({ tx, formatDate, large = false }) => {
  const txConfig = TRANSACTION_ICONS[tx.transaction_type] || TRANSACTION_ICONS.earn;
  const Icon = txConfig.icon;
  const isPositive = ['earn', 'deposit', 'refund', 'bonus', 'transfer_in'].includes(tx.transaction_type)
    || (tx.transaction_type === 'transfer' && tx.reference_type === 'transfer_in');
  const currCfg = CURRENCY_CONFIG[tx.currency_type] || CURRENCY_CONFIG.sf_coins;
  const CurrIcon = currCfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className={`flex items-center justify-between ${large ? 'p-4' : 'p-3'} rounded-xl bg-white/5 hover:bg-white/[0.07] ${large ? 'border border-white/5' : ''} transition-colors`}
    >
      <div className="flex items-center gap-3">
        <div className={`${large ? 'p-3' : 'p-2'} rounded-${large ? 'xl' : 'lg'} ${txConfig.bg}`}>
          <Icon className={`${large ? 'w-5 h-5' : 'w-4 h-4'} ${txConfig.color}`} />
        </div>
        <div>
          <p className="text-white text-sm font-medium">{tx.description || 'Transaction'}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-gray-500 text-xs">{formatDate(tx.created_at)}</span>
            {large && <><span className="text-gray-600">·</span><span className="text-gray-500 text-xs capitalize">{tx.transaction_type}</span></>}
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className={`${large ? 'text-lg' : 'text-sm'} font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : '-'}{(tx.amount || 0).toLocaleString()}
        </p>
        <div className="flex items-center gap-1 justify-end">
          <CurrIcon className={`w-3 h-3 ${currCfg.color}`} />
          <span className="text-gray-500 text-xs">{currCfg.label}</span>
        </div>
      </div>
    </motion.div>
  );
};

const RecentActivityCard = ({ transactions, formatDate, onViewAll }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <History className="w-5 h-5 text-blue-400" /> Recent Activity
      </h3>
      <button onClick={onViewAll} className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
        View All <ChevronRight className="w-4 h-4" />
      </button>
    </div>
    {!transactions?.length ? (
      <div className="text-center py-8">
        <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-400">No recent transactions</p>
      </div>
    ) : (
      <div className="space-y-2">
        {transactions.map(tx => <TransactionRow key={tx.id} tx={tx} formatDate={formatDate} />)}
      </div>
    )}
  </div>
);

const TransactionHistoryCard = ({ transactions, formatDate }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
      <History className="w-5 h-5 text-blue-400" /> Transaction History
    </h3>
    {!transactions?.length ? (
      <div className="text-center py-12">
        <History className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">No transactions yet</p>
      </div>
    ) : (
      <div className="space-y-3">
        {transactions.map(tx => <TransactionRow key={tx.id} tx={tx} formatDate={formatDate} large />)}
      </div>
    )}
  </div>
);

const DepositModal = ({ onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    try {
      setLoading(true);
      const result = await paymentAPI.createCheckoutSession({
        type: 'deposit', title: 'Wallet Deposit',
        price: parseFloat(amount) * 100,
        description: `Deposit $${amount} to wallet`,
      });
      if (result.success && result.url) { window.location.href = result.url; onSuccess(); }
      else toast.error('Failed to create checkout session');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Deposit failed');
    } finally { setLoading(false); }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Plus className="w-5 h-5 text-green-400" /> Deposit Money
      </h2>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Amount (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
              min="1" step="0.01"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-green-500/50" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Minimum: $1.00</p>
        </div>
        <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-300">💳 Secure payment via Stripe. Balance added instantly.</p>
        </div>
        <button onClick={handleDeposit} disabled={loading || !amount}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium hover:shadow-lg hover:shadow-green-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus className="w-4 h-4" />}
          Deposit ${amount || '0.00'}
        </button>
      </div>
    </ModalWrapper>
  );
};

const WithdrawModal = ({ walletBalance, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const available = walletBalance / 100;

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter a valid amount'); return; }
    if (parseFloat(amount) > available) { toast.error('Insufficient balance'); return; }
    try {
      setLoading(true);
      const result = await paymentAPI.withdrawFunds(Math.round(parseFloat(amount) * 100));
      if (result.success) { toast.success(`$${amount} withdrawal initiated!`); onSuccess(); }
      else toast.error(result.error || 'Withdrawal failed');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Withdrawal failed');
    } finally { setLoading(false); }
  };

  return (
    <ModalWrapper onClose={onClose}>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Minus className="w-5 h-5 text-orange-400" /> Withdraw Money
      </h2>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <p className="text-sm text-blue-300">💡 Processed within 2–3 business days.</p>
        </div>
        <div>
          <label className="text-sm text-gray-400 mb-2 block">Amount (USD)</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
              min="1" max={available} step="0.01"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Available: ${available.toFixed(2)}</p>
        </div>
        <button onClick={handleWithdraw} disabled={loading || !amount}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Minus className="w-4 h-4" />}
          Withdraw ${amount || '0.00'}
        </button>
      </div>
    </ModalWrapper>
  );
};

const ModalWrapper = ({ onClose, children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
      onClick={e => e.stopPropagation()}
      className="relative w-full max-w-md rounded-2xl bg-[#1a1a1a] border border-white/10 p-6">
      <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors">
        <X className="w-5 h-5 text-gray-400" />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

export default WalletDashboard;