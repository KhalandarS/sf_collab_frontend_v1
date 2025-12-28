// src/components/pages/Pricing.jsx
import CollaboratorPricing from "./Pricing/collaboratorPricing";
import FounderPricing from "./Pricing/founderPricing";
import EquityAccess from "./Pricing/equityAccess";
import InvestorPricing from "./Pricing/investorPricing";
import NavBar from "../landing-page/NavBar";
import Footer from "../landing-page/Footer";



const Pricing = () => {
  return (
    <>
      <NavBar />
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
      <Footer />
      </>
  );
};

export default Pricing;
