import React, { useEffect, useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { useSelector } from 'react-redux';
import { startupsAPI } from '@/utils/APIs/startupsAPI';
import usePaginatedFetch from '@/utils/hooks/usePaginated';
import InfiniteList from '@/components/InfiniteList';
import StartupCard from '@/components/pages/discoverStartups/StartupCard';

const SavedStartups = () => {
  const { user, access_token } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('all');
  const [filterStage, setFilterStage] = useState('all');

  const {
    items: savedStartups,
    total: totalSavedStartups,
    loading,
    targetRef,
    refetch
  } = usePaginatedFetch({
    fetchFn: ({ page, search }) =>
      startupsAPI.getBookmarkedStartups(user.id, {
        page,
        search,
        industry: filterIndustry !== 'all' ? filterIndustry : undefined,
        stage: filterStage !== 'all' ? filterStage : undefined,
      }),
    search: searchQuery,
    objectKey: 'startups',
    enabled: !!access_token && !!user,
  });

  useEffect(() => {
    if (filterIndustry || filterStage) {
      refetch();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterIndustry, filterStage]);

  const industries = [
    'all',
    ...new Set(
      savedStartups
        .map((s) => s.startup?.industry || s.industry || '')
        .filter(Boolean)
    ),
  ];
  const stages = [
    'all',
    ...new Set(
      savedStartups
        .map((s) => s.startup?.stage || s.stage || '')
        .filter(Boolean)
    ),
  ];

  const getStageBadgeVariant = (stage) => {
    const variants = {
      'Pre-seed': 'bg-red-500/20 text-red-300',
      Seed: 'bg-orange-500/20 text-orange-300',
      'Series A': 'bg-yellow-500/20 text-yellow-300',
      'Series B': 'bg-green-500/20 text-green-300',
      'Series C+': 'bg-blue-500/20 text-blue-300',
    };
    return variants[stage] || 'bg-gray-500/20 text-gray-300';
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 to-slate-950 text-white p-6">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
            <h1 className="text-4xl font-bold">Saved Startups</h1>
          </div>
          <p className="text-gray-400">
            {totalSavedStartups} startup{totalSavedStartups !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search startups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
              <select
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {industries.map((industry) => (
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
                {stages.map((stage) => (
                  <option key={stage} value={stage} className="bg-slate-900">
                    {stage === 'all' ? 'All Stages' : stage}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterIndustry('all');
                  setFilterStage('all');
                  refetch();
                }}
                className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>


        {/* Results */}
        <InfiniteList
          items={savedStartups}
          renderItem={(item, index) => {
            const startup = item.startup || item;

            return (
              <StartupCard
                key={item.id || startup.id}
                startup={startup}
                index={index}
                getStageBadgeVariant={getStageBadgeVariant}
              />
            );
          }}
          containerClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          sentinelRef={targetRef}
          loading={loading}
          emptyText={
            totalSavedStartups === 0
              ? 'No saved startups yet. Start saving startups to track them!'
              : 'No startups found matching your filters'
          }
        />


      </div>
    </div>
  );
};

export default SavedStartups;
