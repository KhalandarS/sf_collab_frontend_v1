// pages/refer.jsx
import React, { useState, useEffect } from 'react';
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
import Footer from '../landing-page/Footer';
import NavBar from '../sections/NavBar';
import { useSelector } from 'react-redux';
import SideBar from '../sections/sidebar/SideBar';

const ReferPage = () => {
  const [referredContacts, setReferredContacts] = useState([]);
  const [newReferral, setNewReferral] = useState('');
  const [userStats, setUserStats] = useState({
    totalReferred: 0,
    rank: null,
    earlySignupBonus: 5,
    score: 0,
    status: 'waitlist' // 'waitlist' | 'founding_member' | 'early_10k'
  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useSelector((state) => state.auth);
  
  const referralLink = `${document.location.origin}/join/${user?.id || ''}`;

  // Fetch user's referral data
  useEffect(() => {
    fetchUserReferralData();
  }, []);

  const fetchUserReferralData = async () => {
    try {
      const response = await fetch('/api/referrals/stats');
      const statsData = await response.json();
      setUserStats(statsData);
      setReferredContacts(statsData.referredContacts || []);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Failed to load referral data');
    }
  };

  const handleSubmitReferral = async (e) => {
    e.preventDefault();
    if (!newReferral.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/referrals/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newReferral })
      });

      if (response.ok) {
        setNewReferral('');
        fetchUserReferralData();
        toast.success('Invitation sent! They\'ll join the waitlist.');
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
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join SF – Shape the Future',
        text: 'Get early access and boost your priority by joining the waitlist with my referral link.',
        url: referralLink
      });
    }
  };

  // Score formula: (Referrals × 2) + Early Signup Bonus
  const calculateScore = () => {
    return (userStats.totalReferred * 2) + userStats.earlySignupBonus;
  };

  const getStatusBadge = () => {
    if (userStats.status === 'founding_member') {
      return { label: 'Founding Member', color: 'bg-purple-900/50 text-purple-300', icon: '⭐' };
    }
    if (userStats.status === 'early_10k') {
      return { label: 'Early 10K', color: 'bg-blue-900/50 text-blue-300', icon: '🚀' };
    }
    return { label: 'Waitlist', color: 'bg-gray-700/50 text-gray-300', icon: '📋' };
  };

  const statusBadge = getStatusBadge();

  return (
    <>
      <NavBar />
      <SideBar />
      <div className="min-h-screen bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">{statusBadge.icon}</span>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadge.color}`}>
                {statusBadge.label}
              </span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              You Are Early
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Your actions decide when you enter. Invite others and move up the priority list.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Rank */}
            <div className="lg:col-span-2 space-y-8">
              {/* Score & Rank Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Users, label: 'Referrals (Verified)', value: userStats.totalReferred, color: 'text-blue-400' },
                  { icon: TrendingUp, label: 'Your Score', value: calculateScore(), color: 'text-green-400' },
                  { icon: Gift, label: 'Rank', value: userStats.rank ? `#${userStats.rank}` : 'Pending', color: 'text-purple-400' }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                      </div>
                      <h3 className="font-semibold text-gray-200">{stat.label}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        {stat.label === 'Your Score' ? 'Score = (Referrals × 2) + Early Signup Bonus' : 'Relative rank updates weekly'}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Scoring Explanation */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">How Your Rank Works</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300 mb-2"><span className="font-bold text-white">Formula:</span> Score = (Referrals × 2) + Early Signup Bonus</p>
                    <p className="text-xs text-gray-400">Only verified referrals count. Your rank is relative and updates as others refer.</p>
                  </div>
                  <div className="p-4 bg-gray-700/30 rounded-lg border border-gray-700">
                    <p className="text-sm text-gray-300"><span className="font-bold text-white">Why this matters:</span> Higher rank = higher priority when we roll out access.</p>
                  </div>
                </div>
              </div>

              {/* Referral List */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">People You've Invited</h2>
                {referredContacts.length > 0 ? (
                  <div className="space-y-4">
                    {referredContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{contact.email}</div>
                            <div className="text-sm text-gray-400">
                              Joined {new Date(contact.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          contact.status === 'joined'
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {contact.status === 'joined' ? '✓ Active' : '⏳ Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No invitations yet</h3>
                    <p className="text-gray-500">Invite friends to boost your score and priority.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Actions */}
            <div className="space-y-8">
              {/* Referral Link Card */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 rounded-xl shadow-lg p-6 border border-blue-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Your Referral Link</h3>
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Share2 className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-gray-300">Share with friends</span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  onClick={shareReferralLink}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share via...
                </button>
              </div>

              {/* Invite by Email Form */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Invite by Email</h3>
                <form onSubmit={handleSubmitReferral}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Friend's Email
                    </label>
                    <input
                      type="email"
                      value={newReferral}
                      onChange={(e) => setNewReferral(e.target.value)}
                      placeholder="friend@example.com"
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-3">
                  They'll join the waitlist with your referral. No product access yet.
                </p>
              </div>

              {/* How Access Works */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Access Phases</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
                    <div>
                      <div className="font-medium text-white">MVP (1,000 users)</div>
                      <div className="text-xs text-gray-400">Top ranked + invited builders</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
                    <div>
                      <div className="font-medium text-white">V1 (10,000 users)</div>
                      <div className="text-xs text-gray-400">All MVP + top referrers + contributors</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
                    <div>
                      <div className="font-medium text-white">Open</div>
                      <div className="text-xs text-gray-400">Remaining waitlist</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </>
  );
};

export default ReferPage;
