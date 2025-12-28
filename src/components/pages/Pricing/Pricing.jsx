
import CollaboratorPricing from "../Pricing/CollaboratorPricing";
import FounderPricing from "../Pricing/FounderPricing";
import EquityAccess from "./EquityAccess";
import InvestorPricing from "../Pricing/InvestorPricing";
import RoleBasedPricing from "../Pricing/RoleBasedPricing";
import ComparePlans from "../Pricing/ComparePlans";
import FAQSection from "../Pricing/FAQSection";
import NavBar from '../../../components/sections/NavBar';
import Footer from '../../../components/sections/NavBar';

const Pricing = () => {
  return (
    <>
      <NavBar />
      <main className="w-full bg-[#0b0b0b]">
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
      </main>
      <Footer />
    </>
  );
};

export default Pricing;