// pages/refer.jsx
import React, { useState, useEffect } from 'react';
import Head from 'react';

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
    totalReferred: 3,
    tierProgress: 0,
    earnedMonths: 0,

  });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const {user} = useSelector((state) => state.auth);
  
  const [linkShared] = useState(document.location.href + '/' + (user?.id || ''));
  // Fetch user's referral data
  useEffect(() => {
    fetchUserReferralData();
  }, []);

  const fetchUserReferralData = async () => {
    try {
      const response = await fetch('/api/referrals/stats');
      const data = await response.json();
      setUserStats(data);
      setReferredContacts(data.referredContacts || []);
    } catch (error) {
      console.error('Error fetching referral data:', error);
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
        const data = await response.json();
        setNewReferral('');
        fetchUserReferralData();
        toast.success('Invitation sent successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to send invitation');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(linkShared);
    setCopied(true);
  };

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join me on this amazing platform!',
        text: 'Get free tier access when you sign up using my referral link',
        url: linkShared
      });
    }
  };

  // Calculate progress based on referred contacts
  const calculateProgress = () => {
    const count = userStats.totalReferred;
    if (count >= 5) return 100;
    if (count >= 3) return 60;
    if (count >= 1) return 20;
    return 0;
  };

  // Get reward description
  const getRewardTier = () => {
    const count = userStats.totalReferred;
    if (count >= 5) return '3 Months Free Tier';
    if (count >= 3) return '1 Month Free Tier';
    if (count >= 1) return '0.5 Months Free Tier';
    return 'No rewards yet';
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <div className="min-h-screen bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              Invite Friends, Earn Free Months
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Share your referral link with friends. For every friend who joins,
              you both get closer to earning free tier access!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Stats & Progress */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Users, label: 'Referred Contacts', value: userStats.totalReferred, color: 'text-blue-400' },
                  { icon: Gift, label: 'Months Earned', value: userStats.earnedMonths, color: 'text-green-400' },
                  { icon: TrendingUp, label: 'Current Reward', value: getRewardTier(), color: 'text-purple-400' }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                      <div className="flex items-center justify-between mb-4">
                        <Icon className={`w-8 h-8 ${stat.color}`} />
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                      </div>
                      <h3 className="font-semibold text-gray-200">{stat.label}</h3>
                      <p className="text-sm text-gray-400 mt-1">Details here</p>
                    </div>
                  );
                })}
              </div>

              {/* Progress Section */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Your Progress</h2>
              
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-300">Free Tier Progress</span>
                    <span className="font-bold text-blue-400">{calculateProgress()}%</span>
                  </div>
                  <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${calculateProgress()}%` }}
                    />
                  </div>
                </div>

                {/* Milestones */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { count: 1, reward: '0.5 Months', completed: userStats.totalReferred >= 1 },
                    { count: 3, reward: '1 Month', completed: userStats.totalReferred >= 3 },
                    { count: 5, reward: '3 Months', completed: userStats.totalReferred >= 5 }
                  ].map((milestone) => (
                    <div
                      key={milestone.count}
                      className={`p-4 rounded-lg border-2 transition-colors ${milestone.completed
                          ? 'border-green-500 bg-green-900/20'
                          : 'border-gray-700 bg-gray-700/30'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xl text-white">{milestone.count}</span>
                            <span className="text-gray-400">contacts</span>
                          </div>
                          <div className="text-sm font-medium text-gray-300 mt-1">
                            {milestone.reward} Free
                          </div>
                        </div>
                        {milestone.completed && (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Referral List */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold text-white mb-6">Your Referrals</h2>
                {referredContacts.length > 0 ? (
                  <div className="space-y-4">
                    {referredContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Mail className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{contact.email}</div>
                            <div className="text-sm text-gray-400">
                              Joined {new Date(contact.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${contact.status === 'joined'
                            ? 'bg-green-900/50 text-green-300'
                            : 'bg-yellow-900/50 text-yellow-300'
                          }`}>
                          {contact.status === 'joined' ? 'Active' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-300 mb-2">No referrals yet</h3>
                    <p className="text-gray-500">Start inviting friends to earn rewards!</p>
                  </div>
                )}
              </div>
            </div>
                  <div className="space-y-8">
                    {/* Referral Link Card */}
                    <div className="bg-linear-to-br from-blue-900/40 to-purple-900/40 rounded-xl shadow-lg p-6 border border-blue-700/50">
                    <h3 className="text-xl font-bold text-white mb-4">Your Referral Link</h3>
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                      <Share2 className="w-5 h-5 text-blue-400" />
                      <span className="font-medium text-gray-300">Share this link</span>
                      </div>
                      <div className="grid grid-cols-[1fr_auto] gap-2">
                      <input
                        type="text"
                        value={linkShared}
                        readOnly
                        className="px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Share via...
                    </button>
                    </div>

                    {/* Invite Form */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Invite by Email</h3>
                <form onSubmit={handleSubmitReferral}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Friend's Email Address
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
                    className="w-full py-3 bg-linear-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </button>
                </form>
              </div>

              {/* How It Works */}
              <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Invite Friends', description: 'Share your unique link or invite via email' },
                    { step: '2', title: 'They Sign Up', description: 'Friends join using your referral link' },
                    { step: '3', title: 'Earn Rewards', description: 'Get free tier months based on total referrals' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3">
                      <div className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div>
                        <div className="font-medium text-white">{item.title}</div>
                        <div className="text-sm text-gray-400">{item.description}</div>
                      </div>
                    </div>
                  ))}
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
}


export default ReferPage;