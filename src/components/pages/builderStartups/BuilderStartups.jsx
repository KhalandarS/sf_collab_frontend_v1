import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { startupsAPI } from '@/utils/APIs/startupsAPI';
import usePaginatedFetch from '@/utils/hooks/usePaginated';
import InfiniteList from '@/components/InfiniteList';
import StartupCard from '@/components/pages/discoverStartups/StartupCard';
import StartupCardSkeleton from '@/components/pages/discoverStartups/StartupCardSkeleton';
import { Button } from '@/components/ui/button';

const BuilderStartups = () => {
  const navigate = useNavigate();
  const { user, access_token } = useSelector((state) => state.auth);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [industries, setIndustries] = useState([]);
  const [stages, setStages] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedStage, setSelectedStage] = useState('All');

  const {
    items: startups,
    total,
    loading,
    targetRef,
  } = usePaginatedFetch({
    fetchFn: ({ page, search }) =>
      startupsAPI.getAll({
        page,
        per_page: 30,
        search: searchQuery,
        builder: true,
        industry: selectedIndustry !== 'All' ? selectedIndustry : undefined,
        stage: selectedStage !== 'All' ? selectedStage : undefined,
      }),
    search: searchQuery,
    objectKey: 'startups',
    enabled: !!access_token && !!user,
  });

  const fetchFilters = async () => {
    try {
      const [industriesData, stagesData] = await Promise.all([
        startupsAPI.getIndustries(),
        startupsAPI.getStages()
      ]);

      if (industriesData.success) setIndustries(industriesData.data.industries);
      if (stagesData.success) setStages(stagesData.data.stages);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  const getStageBadgeVariant = (stage) => {
    const variants = {
      idea: 'bg-blue-100 text-blue-700 border-blue-200',
      seed: 'bg-green-100 text-green-700 border-green-200',
      early: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      growth: 'bg-orange-100 text-orange-700 border-orange-200',
      scale: 'bg-purple-100 text-purple-700 border-purple-200'
    };
    return variants[stage] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedIndustry('All');
    setSelectedStage('All');
  };

  const activeFiltersCount = [
    selectedIndustry !== 'All',
    selectedStage !== 'All',
    searchQuery !== ''
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Builder Startups
                </h1>
                <p className="text-gray-400 text-lg mt-2">
                  Discover startups looking for builders and makers
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/register-startup')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Startup
            </Button>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 relative"
        >
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search builder startups..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
          />
        </motion.div>

        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Industry Filter */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Industry</p>
            <div className="flex gap-2 flex-wrap">
              {['All', ...industries].map((ind) => (
                <motion.button
                  key={ind}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedIndustry(ind)}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    selectedIndustry === ind
                      ? 'bg-blue-500/30 text-blue-300 border-blue-500/50'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {ind === 'All' ? 'All Industries' : ind}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Stage Filter */}
          <div>
            <p className="text-sm text-gray-400 mb-2">Stage</p>
            <div className="flex gap-2 flex-wrap">
              {['All', ...stages].map((stage) => (
                <motion.button
                  key={stage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedStage(stage)}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    selectedStage === stage
                      ? 'bg-cyan-500/30 text-cyan-300 border-cyan-500/50'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-300'
                  }`}
                >
                  {stage === 'All' ? 'All Stages' : stage}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            {total} {total === 1 ? 'startup' : 'startups'} found
          </p>
        </div>

        {/* Startup Grid */}
        {loading && startups.length === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <StartupCardSkeleton key={i} />
            ))}
          </div>
        ) : startups.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Building2 className="w-16 h-16 text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No startups found
            </h3>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              Try adjusting your filters or search query to discover more builder startups
            </p>
            <Button variant="outline" onClick={clearFilters} className="border-gray-600 text-black">
              Clear All Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            <InfiniteList
              items={startups}
              loading={loading}
              sentinelRef={targetRef}
              renderItem={(startup, index) => (
                <motion.div
                  key={startup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <StartupCard
                    startup={startup}
                    index={index}
                    getStageBadgeVariant={getStageBadgeVariant}
                  />
                </motion.div>
              )}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BuilderStartups;