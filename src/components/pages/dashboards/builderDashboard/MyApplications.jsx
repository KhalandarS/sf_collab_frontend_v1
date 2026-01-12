import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Clock, CheckCircle, X, AlertCircle, Search, Filter } from 'lucide-react';
import { builderApplicationsAPI } from '@/services/builderAPI';

const MyApplications = () => {
  const { user, access_token } = useSelector((state) => state.auth);
  const [applications, setApplications] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  // Fetch applications from backend
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || !access_token) return;

      setLoading(true);
      setError(null);
      try {
        const response = await builderApplicationsAPI.getApplications(access_token, {
          limit: 50,
          offset: 0,
        });
        if (response.success && response.data) {
          setApplications(response.data);
        } else {
          setError(response.error || 'Failed to fetch applications');
        }
      } catch (err) {
        console.error('Failed to fetch applications:', err);
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user, access_token]);

  const handleWithdraw = async (appId) => {
    if (!access_token) return;
    
    try {
      const response = await builderApplicationsAPI.withdrawApplication(appId, access_token);
      if (response.success) {
        setApplications(prev => prev.filter(a => a.id !== appId));
      } else {
        setError(response.error || 'Failed to withdraw application');
      }
    } catch (err) {
      console.error('Failed to withdraw application:', err);
      setError('Failed to withdraw application');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'rejected':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'under-review':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'pending':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5" />;
      case 'rejected':
        return <X className="w-5 h-5" />;
      case 'under-review':
        return <AlertCircle className="w-5 h-5" />;
      case 'pending':
        return <Clock className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const filteredApplications = applications.filter((app) => {
    const startupName = app.startup?.name || app.startupName || '';
    const roleTitle = app.role_applied_for || app.roleTitle || '';
    const matchesSearch =
      startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    'under-review': applications.filter(a => a.status === 'under_review').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold">My Applications</h1>
          </div>
          <p className="text-gray-400">
            Track all your startup applications and their status
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', count: statusCounts.all, color: 'blue' },
            { label: 'Pending', count: statusCounts.pending, color: 'yellow' },
            { label: 'Under Review', count: statusCounts['under-review'], color: 'purple' },
            { label: 'Accepted', count: statusCounts.accepted, color: 'green' },
            { label: 'Rejected', count: statusCounts.rejected, color: 'red' },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg bg-${stat.color}-500/10 border border-${stat.color}-500/30`}
            >
              <p className={`text-sm text-${stat.color}-300`}>{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.count}</p>
            </div>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all" className="bg-slate-900">All Status</option>
                <option value="pending" className="bg-slate-900">Pending</option>
                <option value="under-review" className="bg-slate-900">Under Review</option>
                <option value="accepted" className="bg-slate-900">Accepted</option>
                <option value="rejected" className="bg-slate-900">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-500/10 border border-red-500/20 rounded-xl">
            <X className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
            <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {applications.length === 0 
                ? 'No applications yet. Start applying to startups!' 
                : 'No applications match your filters'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const startupName = app.startup?.name || app.startupName || 'Unknown Startup';
              const roleTitle = app.role_applied_for || app.roleTitle || 'Position';
              const appliedDate = app.applied_date || app.appliedDate;
              const description = app.cover_letter || app.description || 'No description provided';
              
              return (
                <div
                  key={app.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {startupName}
                          </h3>
                          <p className="text-sm text-gray-400">{roleTitle}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{description}</p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full border text-sm flex items-center gap-2 whitespace-nowrap ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {getStatusIcon(app.status)}
                          {app.status ? app.status.replace('_', ' ').charAt(0).toUpperCase() + app.status.slice(1) : 'Unknown'}
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                        <span>Applied: {new Date(appliedDate).toLocaleDateString()}</span>
                        {app.review_date && (
                          <span>Reviewed: {new Date(app.review_date).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                        View Details
                      </button>
                      {(app.status === 'pending' || app.status === 'under_review') && (
                        <button
                          onClick={() => handleWithdraw(app.id)}
                          className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-300 text-sm font-medium border border-red-500/30 transition-colors"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;