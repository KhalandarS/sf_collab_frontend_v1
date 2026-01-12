import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CheckCircle, Clock, AlertCircle, Search } from 'lucide-react';
import { builderTasksAPI } from '@/services/builderAPI';

const MyWork = () => {
  const { user, access_token } = useSelector((state) => state.auth);
  const [activeTasks, setActiveTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active tasks from backend
  useEffect(() => {
    const fetchActiveTasks = async () => {
      if (!user || !access_token) return;

      setLoading(true);
      setError(null);
      try {
        const response = await builderTasksAPI.getActiveTasks(access_token);
        if (response.success && response.data) {
          setActiveTasks(response.data);
        } else {
          setError(response.error || 'Failed to fetch tasks');
        }
      } catch (err) {
        console.error('Failed to fetch active tasks:', err);
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTasks();
  }, [user, access_token]);

  const handleUpdateProgress = async (taskId, newProgress) => {
    if (!access_token) return;
    
    try {
      const response = await builderTasksAPI.updateTaskProgress(taskId, newProgress, access_token);
      if (response.success) {
        setActiveTasks(prev => prev.map(t => t.id === taskId ? {...t, progress: newProgress} : t));
      } else {
        setError(response.error || 'Failed to update progress');
      }
    } catch (err) {
      console.error('Failed to update progress:', err);
      setError('Failed to update progress');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
      case 'in-progress':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-300';
      case 'review':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300';
      case 'completed':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-300';
    }
  };

  const filteredTasks = activeTasks.filter((task) => {
    const title = task.title || '';
    const startup = task.startup_name || task.startupName || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           startup.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const kpis = [
    { label: 'Tasks Completed', value: activeTasks.filter(t => t.status === 'completed').length, change: 'in progress' },
    { label: 'On-Time Delivery', value: '94%', change: '+3% from last month' },
    { label: 'Reputation Score', value: '4.8/5', change: '+0.2 this month' },
    { label: 'Monthly Earnings', value: '$3,840', change: '+$500 this month' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <h1 className="text-4xl font-bold">My Work</h1>
          </div>
          <p className="text-gray-400">Track your active tasks and deliverables</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
              <p className="text-2xl font-bold text-white mb-2">{kpi.value}</p>
              <p className="text-xs text-green-400">{kpi.change}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Active Tasks */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Tasks</h2>
          {error && (
            <div className="text-center py-8 bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
              <CheckCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No active tasks at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const title = task.title || 'Task';
                const startup = task.startup_name || task.startupName || 'Unknown Startup';
                const description = task.description || 'No description';
                const progress = task.progress || 0;
                const dueDate = task.due_date || task.dueDate;
                
                return (
                <div
                  key={task.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{title}</h3>
                        <p className="text-sm text-gray-400">{startup}</p>
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full border text-sm whitespace-nowrap ${getStatusColor(
                          task.status
                        )}`}
                      >
                        {(task.status || 'pending').replace(/_/g, ' ').replace('-', ' ')}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-semibold text-white">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-sm text-gray-400">
                        Due: {dueDate ? new Date(dueDate).toLocaleDateString() : 'No due date'}
                      </span>
                      <button 
                        onClick={() => handleUpdateProgress(task.id, Math.min(progress + 10, 100))}
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                      >
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyWork;