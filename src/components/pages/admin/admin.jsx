// src/components/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { API_BASE_URL } from '@/utils/config';
import { usersAPI } from '@/utils/APIs/userApi';
import { waitlistAPI } from '@/utils/APIs/waitlistAPI';
import { toast } from 'react-toastify';
import { applicationAPI } from '@/utils/APIs/applicationAPI';
import AdminIdeasReviewSection from '../contribution/AdminIdeasReviewSection';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { access_token } = useSelector((state) => state.auth);

  const [users, setUsers] = useState([]);
  const [startups, setStartups] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStartups: 0,
    totalFeedback: 0,
    totalRevenue: 0,
  });
  const [feedbackFilter, setFeedbackFilter] = useState('');
  const [usersFilter, setUsersFilter] = useState('');

  const [startupsFilter, setStartupsFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState({});
  const [pointsCategory, setPointsCategory] = useState('small_contribution');
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [loadingPoints, setLoadingPoints] = useState(false);
  const handleGivePoints = async () => {
    if (!selectedUser) return;

    try {
      setLoadingPoints(true);

      const response = await waitlistAPI.givePoints(
        selectedUser.id,
        pointsCategory,
        access_token
      );
      if (response.points) {
        setShowPointsModal(false);
        // Remove the feedback item from the list after giving points
        await axios.delete(`${API_BASE_URL}/feedback/${selectedUser.id}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        setFeedback((prevFeedback) =>
          prevFeedback.filter((item) => item.userId !== selectedUser.id)
        );
        toast.success(`Points added to ${selectedUser.fullName}`);

      }

    } catch (err) {
      console.error(err);
      toast.error('Failed to add points');
    } finally {
      setLoadingPoints(false);
    }
  };

  const fetchAllData = useCallback(async () => {
    try {
      const headers = {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": 'application/json',
      }
      const [usersRes, startupsRes, feedbackRes] = await Promise.all([
        usersAPI.getAll(access_token, { page, per_page: 1000 }),
        axios.get(`${API_BASE_URL}/startups`, { headers }),
        axios.get(`${API_BASE_URL}/feedback`, { headers }),
      ])

      const usersData = Array.isArray(usersRes.data) ? usersRes.data : usersRes.data.users || [];
      const startupsData = Array.isArray(startupsRes.data.data) ? startupsRes.data.data : startupsRes.data.data.startups || [];
      const feedbackData = Array.isArray(feedbackRes.data.data) ? feedbackRes.data.data : feedbackRes.data.data.feedback || [];

      setUsers(usersData);
      setStartups(startupsData);
      setFeedback(feedbackData);
      setStats({
        totalUsers: usersData.length,
        totalStartups: startupsData.length,
        totalFeedback: feedbackData.length
      });
    } catch (err) {
      console.error('Error fetching admin data:', err.response?.data || err.message);
    }
  }, [access_token]);

  useEffect(() => {
    if (access_token) {
      fetchAllData();
    }
  }, [access_token, fetchAllData]);

  const filteredFeedback = feedback.filter((item) =>
    item.content.toLowerCase().includes(feedbackFilter.toLowerCase())
  );

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(usersFilter.toLowerCase()) ||
    user.email.toLowerCase().includes(usersFilter.toLowerCase())
  );

  const filteredStartups = startups.filter((startup) =>
    startup.name.toLowerCase().includes(startupsFilter.toLowerCase())
  );

  // Chart data
  const barData = {
    labels: ['Users', 'Startups', 'Feedback'],
    datasets: [
      {
        label: 'Counts',
        data: [stats.totalUsers, stats.totalStartups, stats.totalFeedback],
        backgroundColor: ['#4ade80', '#60a5fa', '#facc15'],
      },
    ],
  };

  const pieData = {
    labels: ['Revenue', 'Remaining'],
    datasets: [
      {
        label: 'Revenue',
        data: [stats.totalRevenue, 100000 - stats.totalRevenue],
        backgroundColor: ['#f87171', '#a1a1aa'],
      },
    ],
  };
  const [allApplications, setAllApplications] = useState([]);
  useEffect(() => {
    async function fetchApplications() {
      const response = await applicationAPI.getAll(access_token, { page: 1, per_page: 1000 });
      console.log(response.data.applications);
      setAllApplications(response.data.applications || []);
    }
    fetchApplications();
  }, [access_token]);

  return (
    <div className="p-8 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 min-h-screen text-white">
      <div className="w-full mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-green-500 to-green-600', accent: 'green' },
            { label: 'Total Startups', value: stats.totalStartups, icon: '🚀', color: 'from-blue-500 to-blue-600', accent: 'blue' },
            { label: 'Total Feedback', value: stats.totalFeedback, icon: '💬', color: 'from-yellow-500 to-yellow-600', accent: 'yellow' },
            { label: 'Revenue', value: `$${stats?.totalRevenue || 0}`, icon: '💰', color: 'from-purple-500 to-purple-600', accent: 'purple' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-800/50 to-gray-700/30 p-6 rounded-xl shadow-xl border border-gray-700/50 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/50 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-gray-400 text-sm uppercase tracking-wide">{stat.label}</h2>
                  <p className={`text-4xl font-bold mt-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                </div>
                <span className="text-4xl opacity-20 group-hover:opacity-40 transition">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 p-6 rounded-xl shadow-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Overview Chart</h2>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <Bar data={barData} options={{ maintainAspectRatio: true }} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 p-6 rounded-xl shadow-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Revenue Distribution</h2>
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <Pie data={pieData} options={{ maintainAspectRatio: true }} />
            </div>
          </div>
        </div>
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 p-6 rounded-xl shadow-xl border border-gray-700/50 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">📋 Applications</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Applications */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-300">💼 Job Applications</h3>
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {allApplications
                    .filter(item => item.application_type === 'job')
                    .map((app) => (
                      <li key={app.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition">
                        <div className="font-medium text-blue-300">{app.name}</div>
                        <p className="text-xs text-gray-400 mt-1">📧 {app.email}</p>
                        <p className="text-xs text-gray-400">🌍 {app.country}</p>
                        <div className="text-xs text-gray-300 mt-2">
                          <p><strong>Area:</strong> {app.data?.area}</p>
                          <p><strong>Skills:</strong> {app.data?.skills}</p>
                          <p><strong>Availability:</strong> {app.data?.availability} hours/week</p>
                          <p><strong>Early CoBuilder:</strong> {app.data?.earlyCoBuilder}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{new Date(app.created_at).toLocaleDateString()}</p>
                      </li>
                    ))}
                </ul>
              </div>

              {/* Influencer Applications */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-300">⭐ Influencer Applications</h3>
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                  {allApplications
                    .filter(item => item.application_type === 'influencer')
                    .map((app) => (
                      <li key={app.id} className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition">
                        <div className="font-medium text-purple-300">{app.name}</div>
                        <p className="text-xs text-gray-400 mt-1">📧 {app.email}</p>
                        <p className="text-xs text-gray-400">🌍 {app.country}</p>
                        <div className="text-xs text-gray-300 mt-2">
                          <p><strong>Niche:</strong> {app.data?.niche}</p>
                          <p><strong>Followers:</strong> {app.data?.followers}</p>
                          <p><strong>Audience Fit:</strong> {app.data?.audienceFit}</p>
                          <p><strong>Early Partner:</strong> {app.data?.earlyPartner}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{new Date(app.created_at).toLocaleDateString()}</p>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 p-6 rounded-xl shadow-xl border border-gray-700/50 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-100">💬 Feedback</h2>
          <input
            type="text"
            placeholder="Filter feedback..."
            value={feedbackFilter}
            onChange={(e) => setFeedbackFilter(e.target.value)}
            className="w-full p-3 mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-500 border border-gray-600/50 focus:border-blue-500 focus:outline-none transition"
          />
          <ul className="space-y-3 max-h-80 overflow-y-auto">
            {filteredFeedback.map((item) => (
              <li
                key={item.id}
                className="p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition backdrop-blur"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-blue-300">
                    User ID: {item.userId}
                  </div>
                  
    
                  <button
                    onClick={() => {
                      setSelectedUser(users.find(u => u.id === item.userId));
                      setShowPointsModal(true);
                    }}
                    className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 rounded"
                  >
                    + Give Points
                  </button>
                </div>

                <p className="text-gray-100">User: {users.find(u => u.id === item.userId)?.fullName}</p>
                <p className="text-gray-100">{item.content}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(item.createdAt).toLocaleDateString()} •{' '}
                  {new Date(item.createdAt).toLocaleTimeString()}
                </p>
              </li>

            ))}
          </ul>
        </div>
        <AdminIdeasReviewSection />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 p-6 rounded-xl shadow-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">👥 Users List</h2>
            <input
              type="text"
              placeholder="Filter users by name or email..."
              value={usersFilter}
              onChange={(e) => setUsersFilter(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-500 border border-gray-600/50 focus:border-blue-500 focus:outline-none transition"
            />
            <ul className="max-h-80 overflow-y-auto space-y-2">
              {filteredUsers.map((u) => (
                <li key={u.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-600/40 transition">
                  <div className="font-medium text-green-300">{u.fullName}</div>
                  <div className="text-xs text-gray-400 mt-1">📧 {u.email}</div>
                  <div className="text-xs text-gray-400">👤 {u.role} • {u.status}</div>
                  <div className="text-xs text-gray-400">📊 {u.active_startups_count} startups • {u.satisfaction_percentage}% satisfied</div>
                  <div className="text-xs text-gray-400">✅ Verified {u.isEmailVerified ? '•' : '× Not'} • {new Date(u.createdAt).toLocaleDateString()}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-700/20 p-6 rounded-xl shadow-xl border border-gray-700/50">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">🚀 Startups List</h2>
            <input
              type="text"
              placeholder="Filter startups by name..."
              value={startupsFilter}
              onChange={(e) => setStartupsFilter(e.target.value)}
              className="w-full p-3 mb-4 rounded-lg bg-gray-700/50 text-white placeholder-gray-500 border border-gray-600/50 focus:border-blue-500 focus:outline-none transition"
            />
            <ul className="max-h-80 overflow-y-auto space-y-2">
              {filteredStartups.map((s) => (
                <li key={s.id} className="p-3 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:bg-gray-600/40 transition">
                  <span className="text-purple-300">{s.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {showPointsModal && selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl w-full max-w-md border border-gray-700/50 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                ⭐ Give Contribution Points
              </h2>
              <p className="text-sm text-gray-400 mb-6">
                User: <span className="text-green-300 font-medium">{selectedUser.fullName}</span>
              </p>

              <select
                value={pointsCategory}
                onChange={(e) => setPointsCategory(e.target.value)}
                className="w-full mb-6 p-3 rounded-lg bg-gray-700/50 border border-gray-600/50 text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="small_contribution">Small Contribution</option>
                <option value="medium_contribution">Medium Contribution</option>
                <option value="large_contribution">Large Contribution</option>
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowPointsModal(false)}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleGivePoints}
                  disabled={loadingPoints}
                  className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-lg disabled:opacity-50 transition font-medium"
                >
                  {loadingPoints ? 'Adding...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
