
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CollaboratorPricing from "../Pricing/CollaboratorPricing";
import FounderPricing from "../Pricing/FounderPricing";
import EquityAccess from "../Pricing/EquityAccess";
import InvestorPricing from "../Pricing/InvestorPricing";
import RoleBasedPricing from "../Pricing/RoleBasedPricing";
import ComparePlans from "../Pricing/ComparePlans";
import FAQSection from "../Pricing/FAQSection";

const Pricing = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="w-full bg-gradient-to-b from-slate-50 to-white"
    >
      {/* Hero Section */}
      <motion.section 
        ref={ref}
        initial={{ y: 50, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="py-20 bg-gradient-to-r from-purple-900 via-purple-800 to-indigo-900"
      >
        <div className="mx-auto max-w-7xl px-4 text-center">
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={inView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200"
          >
            Intelligent Pricing for Every Role
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-xl text-purple-100 max-w-3xl mx-auto"
          >
            Tailored subscriptions that grow with your journey. From individual contributors 
            to scaling enterprises, every plan unlocks maximum value for your specific role.
          </motion.p>
        </div>
      </motion.section>

      {/* Interactive Role Selector */}
      <RoleBasedPricing />

      {/* Collaborators (Talent) */}
      <CollaboratorPricing />

      {/* Founders & Startups */}
      <FounderPricing />

      {/* Equity Access */}
      <EquityAccess />

      {/* Investors, Advisors & Accelerators */}
      <InvestorPricing />

      {/* Compare All Plans */}
      <ComparePlans />

      {/* FAQ Section */}
      <FAQSection />
    </motion.main>
  );
};

export default Pricing;