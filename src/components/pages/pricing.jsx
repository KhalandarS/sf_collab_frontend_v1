// src/components/pages/Pricing.jsx
import CollaboratorPricing from "./Pricing/collaboratorPricing";
import FounderPricing from "./Pricing/founderPricing";
import EquityAccess from "./Pricing/equityAccess";
import InvestorPricing from "./Pricing/investorPricing";



const Pricing = () => {
  return (
    <main className="w-full">
      {/* Collaborators (Talent) */}
      <CollaboratorPricing />

      {/* Founders & Startups */}
      <FounderPricing />

      {/* Equity Access */}
      <EquityAccess />

      {/* Investors, Advisors & Accelerators */}
      <InvestorPricing />
    </main>
  );
};

export default Pricing;
