import React, { useEffect, useMemo, useState } from 'react';
import { Heart, Search, TrendingUp, Layers } from 'lucide-react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ideaAPI } from '@/utils/APIs/ideaAPI';
import usePaginatedFetch from '@/utils/hooks/usePaginated';
import InfiniteList from '@/components/InfiniteList';
import IdeationCard from './IdeationCard';
import { getProfilePicture } from '@/utils/getProfilePicture';
const calculateTimeAgo = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffMs = now - created;
    const diffHours = Math.abs(Math.floor(diffMs / (1000 * 60 * 60)));
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
  };
const SavedIdeas = () => {
  const { user } = useSelector((state) => state.auth);
  const { activeRole } = useSelector((state) => state.auth); // Adjust selector as needed

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [industryFilter, setIndustryFilter] = useState('all');

  const {
    items: rawIdeas,
    total,
    loading,
    targetRef,
    refetch
  } = usePaginatedFetch({
    fetchFn: ({ page, search }) =>
      ideaAPI.getIdeaBookmarks({
        page,
        search,
        industry: industryFilter !== 'all' ? industryFilter : undefined,
        stage: stageFilter !== 'all' ? stageFilter : undefined,
      }),
    search: searchQuery,
    objectKey: 'bookmarks',
    enabled: !!user,
  });

  // Parse ideas using the mapper
  const savedIdeas = useMemo(() => {
    return rawIdeas.map((idea) => ({
      id: idea.id,
      title: idea.title,
      description: idea.description,
      stage: idea.stage,
      category: idea.industry,
      privacy: idea.privacy,
      creatorId: idea.creator?.id,
      imageUrl: idea.imageUrl,
      author: {
        name: `${idea.creator?.firstName || ''} ${idea.creator?.lastName || ''}`,
        role: activeRole,
        avatar: idea.creator ? getProfilePicture(idea.creator) : '',
        id: idea.creator?.id,
      },
      createdAt: new Date(idea.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      timeAgo: calculateTimeAgo(idea.createdAt),
      likes: idea.likes,
      hasLiked: idea.hasLiked || false,
      hasBookmarked: idea.hasBookmarked || false,
      comments: idea.commentsCount,
      collaborators: idea.teamSize,
      tags: idea.tags || [],
    }));
  }, [rawIdeas, activeRole]);

  useEffect(() => {
    refetch();
  }, [stageFilter, industryFilter]);

  /* Derived Filters */
  const industries = useMemo(() => [
    'all',
    ...new Set(savedIdeas.map(i => i.category).filter(Boolean))
  ], [savedIdeas]);

  const stages = useMemo(() => [
    'all',
    ...new Set(savedIdeas.map(i => i.stage).filter(Boolean))
  ], [savedIdeas]);


  /* Motion */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' }
    }
  };

  const hasFilters = searchQuery || industryFilter !== 'all' || stageFilter !== 'all';

  /* KPIs */
  const kpis = [
    {
      label: 'Saved Ideas',
      value: total,
      icon: Heart,
      color: 'from-rose-500 to-pink-500'
    },
    {
      label: 'Industries',
      value: industries.length - 1,
      icon: Layers,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      label: 'Stages',
      value: stages.length - 1,
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-2 md:px-8 md:py-6">
      <div className="w-full mx-auto space-y-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 mt-10"
        >
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
              Saved Ideas
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Your personal collection of innovative ideas
          </p>
        </motion.div>

        {/* KPIs */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {kpis.map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className={`bg-gradient-to-br ${kpi.color} p-0.5 rounded-xl`}
              >
                <div className="bg-slate-900 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5 text-white/70" />
                    <span className="text-xs text-gray-500">Saved</span>
                  </div>
                  <p className="text-xs uppercase tracking-wider text-gray-400">
                    {kpi.label}
                  </p>
                  <p className="text-3xl font-bold">{kpi.value}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-3 w-5 h-5 text-gray-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved ideas..."
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 focus:ring-2 focus:ring-rose-500 outline-none transition"
          />
        </motion.div>

        {/* Filters */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-2">Industry</p>
            <div className="flex gap-2 flex-wrap">
              {industries.map(ind => (
                <motion.button
                  key={ind}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIndustryFilter(ind)}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    industryFilter === ind
                      ? 'bg-rose-500/30 text-rose-300 border-rose-500/50'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {ind === 'all' ? 'All' : ind}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-2">Stage</p>
            <div className="flex gap-2 flex-wrap">
              {stages.map(stage => (
                <motion.button
                  key={stage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStageFilter(stage)}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    stageFilter === stage
                      ? 'bg-pink-500/30 text-pink-300 border-pink-500/50'
                      : 'bg-white/5 border-white/10 text-gray-400'
                  }`}
                >
                  {stage === 'all' ? 'All' : stage}
                </motion.button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={() => {
                setSearchQuery('');
                setIndustryFilter('all');
                setStageFilter('all');
              }}
              className="text-sm text-rose-400 hover:text-rose-300"
            >
              ✕ Clear Filters
            </button>
          )}
        </div>

        {/* Results */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <InfiniteList
            items={savedIdeas}
            loading={loading}
            sentinelRef={targetRef}
            containerClassName="all-unset"
            renderItem={(item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
              >
                <IdeationCard
                  content={item}
                  index={index}
                />
              </motion.div>
            )}
          />
        </motion.div>

        {/* Empty State */}
        {!loading && savedIdeas.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="text-center space-y-4">
              <Heart className="h-16 w-16 text-gray-600 mx-auto" />
              <h3 className="text-xl font-semibold text-gray-300">
                No saved ideas yet
              </h3>
              <p className="text-gray-500 max-w-md">
                Start exploring and save ideas to build your personal collection.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SavedIdeas;