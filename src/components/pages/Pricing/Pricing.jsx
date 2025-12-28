
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CollaboratorPricing from "../Pricing/CollaboratorPricing";
import FounderPricing from "../Pricing/FounderPricing";
import EquityAccess from "./EquityAccess";
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
      className="w-full bg-[#0b0b0b]"
    >
      {/* Hero Section */}
     

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