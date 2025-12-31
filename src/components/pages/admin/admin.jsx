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

  const fetchAllData = useCallback(async () => {
    try {
      const headers = {
        "Authorization": `Bearer ${access_token}`,
        "Content-Type": 'application/json',
      }
      const [usersRes, startupsRes, feedbackRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/users`, { headers }),
        axios.get(`${API_BASE_URL}/startups`, { headers }),
        axios.get(`${API_BASE_URL}/feedback`, { headers }),
      ]);

      const usersData = Array.isArray(usersRes.data.data) ? usersRes.data.data : usersRes.data.data.users || [];
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

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-br from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg border border-gray-600 hover:border-green-500 transition">
          <h2 className="font-semibold text-gray-300 text-sm uppercase tracking-wide">Total Users</h2>
          <p className="text-4xl font-bold mt-3 text-green-400">{stats.totalUsers}</p>
        </div>
        <div className="bg-linear-to-br from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg border border-gray-600 hover:border-blue-500 transition">
          <h2 className="font-semibold text-gray-300 text-sm uppercase tracking-wide">Total Startups</h2>
          <p className="text-4xl font-bold mt-3 text-blue-400">{stats.totalStartups}</p>
        </div>
        <div className="bg-linear-to-br from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg border border-gray-600 hover:border-yellow-500 transition">
          <h2 className="font-semibold text-gray-300 text-sm uppercase tracking-wide">Total Feedback</h2>
          <p className="text-4xl font-bold mt-3 text-yellow-400">{stats.totalFeedback}</p>
        </div>
        <div className="bg-linear-to-br from-gray-800 to-gray-700 p-6 rounded-lg shadow-lg border border-gray-600 hover:border-purple-500 transition">
          <h2 className="font-semibold text-gray-300 text-sm uppercase tracking-wide">Revenue</h2>
          <p className="text-4xl font-bold mt-3 text-purple-400">${stats.totalRevenue}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Overview Chart</h2>
          <Bar data={barData} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Revenue Distribution</h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
        <h2 className="text-xl font-semibold mb-4">Feedback</h2>
        <input
          type="text"
          placeholder="Filter feedback..."
          value={feedbackFilter}
          onChange={(e) => setFeedbackFilter(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none transition"
        />
        <ul className="space-y-3 max-h-80 overflow-y-auto">
          {filteredFeedback.map((item) => (
            <li key={item.id} className="p-4 bg-gray-700 rounded border border-gray-600 hover:border-gray-500 transition">
              <p className="text-white">{item.content}</p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(item.createdAt).toLocaleDateString()} • {new Date(item.createdAt).toLocaleTimeString()}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Users List</h2>
          <input
            type="text"
            placeholder="Filter users by name or email..."
            value={usersFilter}
            onChange={(e) => setUsersFilter(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none transition"
          />
          <ul className="max-h-80 overflow-y-auto space-y-2">
            {filteredUsers.map((u) => (
              <li key={u.id} className="p-3 bg-gray-700 rounded border border-gray-600 hover:bg-gray-600 transition">
                <div className="font-medium">{u.fullName}</div>
                <div className="text-xs text-gray-400 mt-1">Email: {u.email}</div>
                <div className="text-xs text-gray-400">Role: {u.role}</div>
                <div className="text-xs text-gray-400">Status: {u.status}</div>
                <div className="text-xs text-gray-400">Active Startups: {u.active_startups_count}</div>
                <div className="text-xs text-gray-400">Satisfaction: {u.satisfaction_percentage}%</div>
                <div className="text-xs text-gray-400">Email Verified: {u.isEmailVerified ? 'Yes' : 'No'}</div>
                <div className="text-xs text-gray-400">Created: {new Date(u.createdAt).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Startups List</h2>
          <input
            type="text"
            placeholder="Filter startups by name..."
            value={startupsFilter}
            onChange={(e) => setStartupsFilter(e.target.value)}
            className="w-full p-3 mb-4 rounded bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none transition"
          />
          <ul className="max-h-80 overflow-y-auto space-y-2">
            {filteredStartups.map((s) => (
              <li key={s.id} className="p-3 bg-gray-700 rounded border border-gray-600 hover:bg-gray-600 transition">
                {s.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
