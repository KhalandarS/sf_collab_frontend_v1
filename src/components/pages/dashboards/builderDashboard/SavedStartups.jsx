import React, { useState, useEffect } from 'react';
import { Heart, Search, Filter, Briefcase, Users, TrendingUp, MapPin } from 'lucide-react';
import { useSelector } from 'react-redux';
import { builderSavedStartupsAPI } from '@/services/builderAPI';

const SavedStartups = () => {
  const { user, access_token } = useSelector((state) => state.auth);
  const [savedStartups, setSavedStartups] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterStage, setFilterStage] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch saved startups from backend
  useEffect(() => {
    const fetchSavedStartups = async () => {
      if (!user || !access_token) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await builderSavedStartupsAPI.getSavedStartups(access_token, {
          industry: filterIndustry !== 'all' ? filterIndustry : undefined,
          stage: filterStage !== 'all' ? filterStage : undefined,
        });
        if (response.success && response.data) {
          setSavedStartups(response.data);
        } else {
          setError(response.error || 'Failed to fetch saved startups');
        }
      } catch (err) {
        console.error('Failed to fetch saved startups:', err);
        setError('Failed to load saved startups');
      } finally {
        setLoading(false);
      }
    };
    fetchSavedStartups();
  }, [user, access_token, filterIndustry, filterStage]);

  const handleRemoveSaved = async (startupId) => {
    if (!access_token) return;
    
    try {
      const response = await builderSavedStartupsAPI.unsaveStartup(startupId, access_token);
      if (response.success) {
        setSavedStartups(prev => prev.filter(s => s.id !== startupId));
      } else {
        setError(response.error || 'Failed to remove from saved');
      }
    } catch (err) {
      console.error('Failed to remove from saved:', err);
      setError('Failed to remove startup');
    }
  };

  const filteredStartups = savedStartups.filter((startup) => {
    const startupName = startup.startup?.name || startup.name || '';
    const description = startup.startup?.description || startup.description || '';
    const industry = startup.startup?.industry || startup.industry || '';
    const stage = startup.startup?.stage || startup.stage || '';
    
    const matchesSearch = startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = filterIndustry === 'all' || industry === filterIndustry;
    const matchesStage = filterStage === 'all' || stage === filterStage;
    return matchesSearch && matchesIndustry && matchesStage;
  });

  const industries = ['all', ...new Set(savedStartups.map(s => s.startup?.industry || s.industry || '').filter(Boolean))];
  const stages = ['all', ...new Set(savedStartups.map(s => s.startup?.stage || s.stage || '').filter(Boolean))];


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
            <h1 className="text-4xl font-bold">Saved Startups</h1>
          </div>
          <p className="text-gray-400">
            {savedStartups.length} startup{savedStartups.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {industries.map(industry => (
                  <option key={industry} value={industry} className="bg-slate-900">
                    {industry === 'all' ? 'All Industries' : industry}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Stage</label>
              <select
                value={filterStage}
                onChange={(e) => setFilterStage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage} className="bg-slate-900">
                    {stage === 'all' ? 'All Stages' : stage}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-red-400">{error}</p>
          </div>
        ) : filteredStartups.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">{savedStartups.length === 0 
              ? 'No saved startups yet. Start saving startups to track them!' 
              : 'No startups found matching your filters'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStartups.map((item) => {
              const startup = item.startup || item;
              const startupName = startup.name || 'Unknown Startup';
              const description = startup.description || 'No description';
              const industry = startup.industry || 'N/A';
              const stage = startup.stage || 'N/A';
              const location = startup.location || 'Unknown';
              const teamSize = startup.team_size || startup.teamSize || 0;
              const savedDate = item.saved_date || item.savedDate || new Date().toISOString();
              
              return (
                <div
                  key={item.id || startup.id}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                          {startupName}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">{description}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveSaved(item.id || startup.id)}
                        className="p-2 hover:bg-rose-500/20 rounded-lg transition-colors"
                        title="Remove from saved"
                      >
                        <Heart className="w-5 h-5 text-rose-500" fill="currentColor" />
                      </button>
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-300">
                        {industry}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-300">
                        {stage}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>{teamSize} people</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-xs text-gray-500">
                        Saved {new Date(savedDate).toLocaleDateString()}
                      </span>
                      <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
                        View Details
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
  );
};

export default SavedStartups;
