import { useEffect, useMemo, useState } from "react";
import CrowdfundingSection from "./CrowdfundingSection";
import DonationSection from "./DonationSection";
import WaitlistSection from "./WaitlistSection";
import { useSelector } from "react-redux";
import JoinSFSection from "./JoinSFSection";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Zap, Users, FileText, ChevronDown } from "lucide-react";
import InfluencerProfileSection from "./InfluencerSection";

export default function AnnouncementsSection({ userRoles }) {
  const { user } = useSelector((state) => state.auth);
  const [isExpanded, setIsExpanded] = useState(() => {
    const stored = localStorage.getItem('preferences:announcementsExpanded');
    return stored === null ? true : stored === 'true';
  });

  const [activeTab, setActiveTab] = useState(() => {
    const stored = localStorage.getItem('announcements:activeTab');
    return stored ? stored : 'crowdfunding';
  });

  useEffect(() => {
    localStorage.setItem('announcements:activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('preferences:announcementsExpanded', isExpanded);
  }, [isExpanded]);

  const [hideInfluencerInfo, setHideInfluencerInfo] = useState(false);
  
  const [hideShowJobApplication, setHideJobApplication] = useState(false);

  const tabs = useMemo(() => [
    { id: 'waitlist', label: 'Waitlist', icon: Bell },
    { id: 'crowdfunding', label: 'Crowdfunding', icon: Zap },
    ...(user && (!hideShowJobApplication || !hideInfluencerInfo) 
      ? [{ id: 'applications', label: 'Jobs', icon: FileText }]
      : [])
  ], [user, hideShowJobApplication, hideInfluencerInfo]);

  return (
    <div className="mx-1 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-neutral-800 to-neutral-900 border-b border-neutral-700 px-6 md:px-8 py-2 flex items-center justify-between">
        <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Bell className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Announcements</h2>
        </motion.div>
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 0 : -90 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-5 w-5 text-neutral-400" />
          </motion.div>
        </motion.button>
      </div>

      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 px-6 md:px-8 py-4 border-b border-neutral-700 bg-neutral-900/50">
              {tabs.map(({ id, label, icon: Icon }) => (
                <motion.button
                  key={id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 border border-neutral-700'
                  }`}
                  layout
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </motion.button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'waitlist' && (
                    <div className="space-y-6">
                      <WaitlistSection />
                    </div>
                  )}
                  {activeTab === 'crowdfunding' && (
                    <div className="space-y-6">
                      <CrowdfundingSection />
                      <DonationSection />
                    </div>
                  )}
                  {activeTab === 'applications' && user && (!hideShowJobApplication || !hideInfluencerInfo) && (
                    <div className="space-y-6">
                      {!hideShowJobApplication && (
                        <JoinSFSection setHideJobApplication={setHideJobApplication} />
                      )}
                      {user && !hideInfluencerInfo && (
                        <InfluencerProfileSection userData={user} setHideInfluencerInfo={setHideInfluencerInfo} />
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}