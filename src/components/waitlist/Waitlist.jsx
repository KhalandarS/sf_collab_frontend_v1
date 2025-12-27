import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, 
  Gift, 
  Mail, 
  CheckCircle, 
  Copy,
  Share2,
  TrendingUp 
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

export default function Waitlist() {
  const { user } = useSelector(state => state?.auth);
  const userId = user?.id;
  const [userStatus, setUserStatus] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const [rank, setRank] = useState(null);
  const [referralCount, setReferralCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [referredContacts, setReferredContacts] = useState([]);
  const [newReferral, setNewReferral] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userId) return;
    
    const referralParams = new URLSearchParams(window.location.search);
    const refId = referralParams.get('ref');
    
    if (refId && refId !== userId) {
      trackReferral(userId, refId);
    }
    
    setReferralLink(`${document.location.origin}/waitlist?ref=${userId}`);
    fetchUserData(userId);
    fetchLeaderboard();
  }, [userId]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/waitlist/user/${userId}`);
      const data = await response.json();
      
      setUserStatus(data.status);
      setRank(data.rank);
      setReferralCount(data.referrals);
      setReferredContacts(data.referredContacts || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserStatus('waitlist');
      toast.error('Failed to load user data');
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('/api/waitlist/leaderboard');
      const data = await response.json();
      setLeaderboard(data.slice(0, 20));
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard');
    }
  };

  const trackReferral = async (userId, referrerId) => {
    try {
      await fetch('/api/waitlist/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, referrerId })
      });
    } catch (error) {
      console.error('Error tracking referral:', error);
    }
  };

  const handleSubmitReferral = async (e) => {
    e.preventDefault();
    if (!newReferral.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/waitlist/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newReferral })
      });

      if (response.ok) {
        setNewReferral('');
        fetchUserData(userId);
        toast.success('Invitation sent!');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to send invitation');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join SForger',
        text: 'Get early access and boost your priority by joining the waitlist with my referral link.',
        url: referralLink
      });
    }
  };

  const calculateScore = () => {
    return (referralCount * 2) + 5; // Adjust based on early signup bonus logic
  };

  const getStatusBadge = () => {
    if (userStatus === 'mvp') {
      return { label: 'Founding Member', color: 'bg-purple-900/50 text-purple-300', icon: '⭐' };
    }
    if (userStatus === 'early_10k') {
      return { label: 'Early 10K', color: 'bg-blue-900/50 text-blue-300', icon: '🚀' };
    }
    return { label: 'Waitlist', color: 'bg-gray-700/50 text-gray-300', icon: '📋' };
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4">SF Waitlist</h1>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
            You are early. Your actions decide when you enter.
          </p>
          <div className="mt-4">
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadge.color}`}>
              {statusBadge.icon} {statusBadge.label}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
          {/* Stats - Compact Cards */}
          {[
            { icon: Users, label: 'Referrals', value: referralCount, color: 'from-blue-500 to-cyan-500' },
            { icon: TrendingUp, label: 'Score', value: calculateScore(), color: 'from-purple-500 to-pink-500' },
            { icon: Gift, label: 'Rank', value: rank ? `#${rank}` : '—', color: 'from-green-500 to-emerald-500' }
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="group relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-20 group-hover:opacity-30 rounded-2xl blur-xl transition-all`}></div>
                <div className="relative bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600/50 transition-all">
                  <Icon className={`w-6 h-6 mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Share Section */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">Share Your Link</h3>
                <div className="flex gap-3 mb-4">
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-sm focus:outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl font-semibold flex items-center gap-2"
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <button
                  onClick={shareReferralLink}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold"
                >
                  Share via Platform
                </button>
              </div>
            </div>

            {/* Invite by Email */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">Direct Invite</h3>
              <form onSubmit={handleSubmitReferral} className="space-y-4">
                <input
                  type="email"
                  value={newReferral}
                  onChange={(e) => setNewReferral(e.target.value)}
                  placeholder="Enter friend's email"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Invite'}
                </button>
              </form>
            </div>

            {/* Referral List */}
            {referredContacts.length > 0 && (
              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-6">Your Invites</h3>
                <div className="space-y-3">
                  {referredContacts.map((contact, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{contact.email}</div>
                          <div className="text-xs text-gray-500">{new Date(contact.joinedAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${contact.status === 'joined' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                        {contact.status === 'joined' ? '✓ Active' : '⏳ Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Leaderboard */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-2xl font-bold mb-6">🏆 Top Referrers</h3>
              <div className="space-y-2">
                {leaderboard.map((user, i) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="text-xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text w-8">
                        #{i + 1}
                      </span>
                      <span className="font-medium">{user.referrals} referrals</span>
                    </div>
                    <span className="text-xs text-gray-400">{user.status === 'mvp' ? '⭐' : '📋'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Access Phases & Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 sticky top-8">
              <h3 className="text-xl font-bold mb-6">📊 Scoring System</h3>
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <div className="font-semibold text-blue-300 mb-1">Your Formula</div>
                  <div className="text-gray-300">Score = (Referrals × 2) + Early Signup Bonus</div>
                </div>
                <div className="text-xs text-gray-400">
                  Only verified referrals count. Rank updates weekly based on community performance.
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6">🚀 Access Phases</h3>
              <div className="space-y-4 text-sm">
                {[
                  { num: 1, title: 'MVP', desc: 'Top 1K users', icon: '⭐' },
                  { num: 2, title: 'V1', desc: 'Early 10K', icon: '🚀' },
                  { num: 3, title: 'Open', desc: 'Everyone else', icon: '🌍' }
                ].map((phase, i) => (
                  <div key={i} className="flex gap-3 p-3 bg-slate-700/30 rounded-xl">
                    <div className="text-lg">{phase.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold">{phase.title}</div>
                      <div className="text-xs text-gray-400">{phase.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </div>
  );
}
