import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Building2,
  ChevronLeft, ChevronRight, Plus
} from 'lucide-react';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { startupAPI } from '../startupDetails/startUpAPI';
import { toast } from 'react-toastify';
import StartupCard from './StartupCard';
import StartupCardSkeleton from './StartupCardSkeleton';
import StartupsHeader from './StartupsHeader';
import StartupSearchAndFilter from './StartupSearchAndFilter';
import ApplyToStartupModal from './ApplyToStartupModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const FUNDING_RANGES = [
  { label: 'Any', min: null, max: null },
  { label: 'Bootstrapped ($0)', min: 0, max: 0 },
  { label: 'Pre-seed ($10K - $500K)', min: 10000, max: 500000 },
  { label: 'Seed ($500K - $2M)', min: 500000, max: 2000000 },
  { label: 'Series A ($2M - $15M)', min: 2000000, max: 15000000 },
  { label: 'Series B+ ($15M+)', min: 15000000, max: null },
  { label: 'Custom', min: null, max: null, custom: true }
];

// Mode configuration
const MODES = {
  discover: {
    headerTitle: 'Discover Your Next',
    headerSubtitle: 'Career Adventure',
    subtitle: 'Join thousands of innovators building the future at fast-growing startups. From pre-seed to Series C, find your perfect match.',
    ctaButton: 'Add Startup',
    ctaRoute: '/register-startup',
    cardCta: 'View Details',
    stats: [
      // { value: '1.2K+', label: 'Active Startups' },
      // { value: '$4.8B', label: 'Total Funding' },
      // { value: '15K+', label: 'Open Roles' },
      // { value: '94%', label: 'Hire Success Rate' }
    ],
    emptyState: {
      title: 'No startups found',
      message: 'Try adjusting your filters or search query to discover more opportunities'
    }
  },
  myStartups: {
    headerTitle: 'My',
    headerSubtitle: 'Startups',
    subtitle: 'Manage and grow your startup portfolio. Monitor your companies, edit details, and track performance.',
    ctaButton: 'Create New Startup',
    ctaRoute: '/register-startup',
    cardCta: 'Manage',
    stats: null, // Dynamic based on user data
    emptyState: {
      title: "You haven't created any startups yet",
      message: 'Create your first startup to get started. Build something amazing and find the right talent.'
    }
  }
};

const DiscoverStartups = ({ myStartupsOnly = false }) => {
  const [startups, setStartups] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  const [selectedStage, setSelectedStage] = useState("All");
  const [selectedFundingRange, setSelectedFundingRange] = useState("Any");
  const [customMinFunding, setCustomMinFunding] = useState("");
  const [customMaxFunding, setCustomMaxFunding] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  
  const { user, access_token } = useSelector((state) => state.auth);
  
  const itemsPerPage = 9;
  const mode = myStartupsOnly ? 'myStartups' : 'discover';
  const modeConfig = MODES[mode];

  const getFundingRangeValues = () => {
    if (selectedFundingRange === 'Custom') {
      return {
        min: customMinFunding ? parseFloat(customMinFunding) : null,
        max: customMaxFunding ? parseFloat(customMaxFunding) : null
      };
    }
    
    const range = FUNDING_RANGES.find(r => r.label === selectedFundingRange);
    return {
      min: range?.min || null,
      max: range?.max || null
    };
  };

  const fetchStartups = async (page = 1) => {
    try {
      setLoading(true);
      const token = access_token;
      if (!token) {
        console.error('No access token found');
        return;
      }
  
      const fundingRange = getFundingRangeValues();
      

      const params = {
        page,
        search: searchQuery,
        per_page: itemsPerPage,
        min_funding: fundingRange.min,
        max_funding: fundingRange.max,
        industry: selectedIndustry !== 'All' ? selectedIndustry : undefined,
        stage: selectedStage !== 'All' ? selectedStage : undefined,
        my_startups: myStartupsOnly ? 'true' : 'false'
      }
      const response = await startupAPI.getAll(token, params);

      const data = response;
  
      if (data.success) {
        const startups = data.data.startups
        setStartups(startups);
        setTotalPages(data.data.pagination.pages);
        setCurrentPage(data.data.pagination.page);
      }
    } catch (error) {
      console.error('Error fetching startups:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const token = access_token;
      if (!token) return;
  
      const [industriesRes, stagesRes] = await Promise.all([
        fetch(`${API_URL}/startups/industries`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch(`${API_URL}/startups/stages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);
  
      const industriesData = await industriesRes.json();
      const stagesData = await stagesRes.json();
  
      if (industriesData.success) setIndustries(industriesData.data.industries);
      if (stagesData.success) setStages(stagesData.data.stages);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  useEffect(() => {
    fetchStartups();
    if (mode === 'discover') {
      fetchFilters();
    }
  }, []);

  useEffect(() => {
    fetchStartups(1);
  }, [searchQuery, selectedIndustry, selectedStage, selectedFundingRange, customMinFunding, customMaxFunding, myStartupsOnly]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedIndustry("All");
    setSelectedStage("All");
    setSelectedFundingRange("Any");
    setCustomMinFunding("");
    setCustomMaxFunding("");
  };



  const activeFiltersCount = [
    selectedIndustry !== "All",
    selectedStage !== "All",
    searchQuery !== "",
    selectedFundingRange !== "Any"
  ].filter(Boolean).length;

  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    }
    return `$${amount}`;
  };

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

  return (
    <>
    <div className="min-h-screen">
      <div className="w-full mx-auto px-4 sm:px-6 py-2">
        {/* Navigation */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {
                !(startups.length > 0 &&
                !user?.plan_id) &&
              
                <div className="hidden md:flex items-center gap-4 ml-auto">
                  <Button
                    variant={mode === 'myStartups' ? "default" : "ghost"}
                    size="sm"
                    className={mode === 'myStartups' ? "bg-blue-600 hover:bg-blue-700 text-white" : "text-gray-300 hover:text-black"}
                    onClick={() => navigate(modeConfig.ctaRoute)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {modeConfig.ctaButton}
                  </Button>
                </div>
              }
            </div>
          </div>
        </motion.nav>
        
        <StartupsHeader mode={mode} modeConfig={modeConfig} />

        <StartupSearchAndFilter
          mode={mode}
          industries={industries}
          stages={stages}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedIndustry={selectedIndustry}
          setSelectedIndustry={setSelectedIndustry}
          selectedStage={selectedStage}
          setSelectedStage={setSelectedStage}
          selectedFundingRange={selectedFundingRange}
          setSelectedFundingRange={setSelectedFundingRange}
          customMinFunding={customMinFunding}
          setCustomMinFunding={setCustomMinFunding}
          customMaxFunding={customMaxFunding}
          setCustomMaxFunding={setCustomMaxFunding}
          clearFilters={clearFilters}
          activeFiltersCount={activeFiltersCount}
          formatCurrency={formatCurrency}
          mobileFiltersOpen={mobileFiltersOpen}
          setMobileFiltersOpen={setMobileFiltersOpen}
          FUNDING_RANGES={FUNDING_RANGES}
        />

        <div className="flex flex-wrap relative gap-8">
        
          {/* Startup Grid */}
          <div className="flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-400">
                {startups.length} {startups.length === 1 ? 'startup' : 'startups'} found
              </p>
              {mode === 'discover' && activeFiltersCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-black">
                  Clear all filters
                </Button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <StartupCardSkeleton key={i} />
                  ))}
                </div>
              ) : startups.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <div className="w-20 h-20 bg-linear-to-br from-blue-500/10 to-blue-600/10 rounded-2xl flex items-center justify-center mb-4">
                    {mode === 'discover' ? (
                      <Search className="w-10 h-10 text-blue-500" />
                    ) : (
                      <Building2 className="w-10 h-10 text-blue-500" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {modeConfig.emptyState.title}
                  </h3>
                  <p className="text-gray-400 mb-6 text-center max-w-md">
                    {modeConfig.emptyState.message}
                  </p>
                  {mode === 'discover' ? (
                    <Button onClick={clearFilters} variant="outline" className="border-gray-600 text-black">
                      Clear all filters
                    </Button>
                  ) : (
                    <Button
                      onClick={() => navigate(modeConfig.ctaRoute)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {modeConfig.ctaButton}
                    </Button>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="md:grid flex flex-col gap-6 w-full"
                  style={{
                    gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))'
                  }}
                >
                  {startups.map((startup, index) => (
                    <StartupCard
                      key={startup.id}
                      startup={startup}
                      index={index}
                      getStageBadgeVariant={getStageBadgeVariant}
                      mode={mode}
                    />
                  ))}
                                      {/* !user?.plan_id && (*/}
{/*
                      {mode === "myStartups" &&
                        
                    startups.length > 0 && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="w-full"
                      >
                        <div
                          onClick={() => {
                            toast.info("You've reached the maximum number of startups for your plan");
                            navigate("/crowdfunding");
                          }}
                          className="
          relative h-full min-h-[220px] cursor-pointer rounded-xl
          border-2 border-dashed border-gray-700
          bg-gray-900/40 backdrop-blur-sm
          flex flex-col items-center justify-center gap-3
          transition-all
          hover:border-blue-500/50 hover:bg-gray-900/60
          hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.25)]
          group
        "
                        >
                          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-800/60 group-hover:bg-blue-500/10 transition">
                            <Plus className="w-7 h-7 text-gray-400 group-hover:text-blue-400 transition-colors" />
                          </div>

                          <div className="text-center">
                            <p className="text-sm font-semibold text-gray-300 group-hover:text-blue-400 transition-colors">
                              Upgrade your plan
                            </p>
                            <p className="text-xs text-gray-500 mt-1 max-w-[240px]">
                              Unlock more startups and advanced features
                            </p>
                          </div>

                          <span className="mt-2 text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            View plans →
                          </span>
                        </div>
                      </motion.div>
                    )} */}

                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchStartups(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="border-gray-600 text-gray-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => fetchStartups(page)}
                    className={currentPage === page
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "border-gray-600 text-gray-300 hover:bg-gray-700"
                    }
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchStartups(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="border-gray-600 text-gray-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
  </>
  );
};

export default DiscoverStartups;