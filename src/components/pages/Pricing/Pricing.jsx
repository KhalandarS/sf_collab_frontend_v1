import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import NavBar from "../../landing-page/Navbar";
import Footer from "../../../components/landing-page/Footer";
import AIPricing from "./aiPricing";
import { Link } from "react-router-dom";

const Pricing = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const plans = [
    {
      title: "Builder",
      description: "People Who Contribute",
      subtitle: "Builders never pay upfront. They only pay when they earn.",
      tiers: [
        {
          id: "builder-free",
          name: "Builder Free",
          price: "$0",
          platformFee: "20%",
          features: [
            "Work on 1 project at a time",
            "Core tools & dashboard",
            "Ads visible",
            "Basic project matching",
            "Community support",
          ],
        },
        {
          id: "builder-pro",
          name: "Builder Pro",
          price: "$9/mo",
          platformFee: "10%",
          features: [
            "Work on up to 3 projects simultaneously",
            "Higher priority in project matching",
            "Ad-free experience",
            "Advanced filtering & search",
            "Access to priority support",
          ],
        },
        {
          id: "builder-plus",
          name: "Builder Plus",
          price: "$19/mo",
          platformFee: "5%",
          features: [
            "Everything in Builder Pro +",
            "Unlimited simultaneous projects",
            "Top-tier project matching algorithm",
            "Direct messaging with founders",
            "Portfolio showcase",
          ],
        },
        {
          id: "builder-elite",
          name: "Builder Elite",
          price: "$49/mo",
          platformFee: "2%",
          features: [
            "Everything in Builder Plus +",
            "Maximum visibility to founders",
            "Access to high-value projects",
            "Priority support",
            "Skill endorsements",
          ],
        },
      ],
    },
    {
      title: "Founder",
      description: "People Who Create Projects",
      subtitle: "Unlock creation, visibility, and execution readiness.",
      tiers: [
        {
          id: "founder-free",
          name: "Founder Free",
          price: "$0",
          features: [
            "Create 1 project at a time",
            "Recruit & manage contributors",
            "Ads visible",
            "Basic contributor search",
          ],
        },
        {
          id: "founder-starter",
          name: "Founder Starter",
          price: "$49/mo",
          features: [
            "Everything in Founder Free +",
            "Create up to 3 projects simultaneously",
            "Ad-free platform experience",
            "Boosted visibility in search",
          ],
        },
        {
          id: "founder-pro",
          name: "Founder Pro",
          price: "$149/mo",
          features: [
            "Everything in Founder Starter +",
            "Create up to 10 projects simultaneously",
            "Featured placement on homepage",
            "Advanced team management tools",
            "Contributor rating system",
          ],
        },
        {
          id: "founder-scale",
          name: "Founder Scale",
          price: "$299/mo",
          features: [
            "Everything in Founder Pro +",
            "Unlimited projects",
            "Maximum platform exposure",
            "Priority customer support",
            "Analytics dashboard",
          ],
        },
        {
          id: "founder-partner",
          name: "Founder Partner",
          price: "$499/mo",
          features: [
            "Everything in Founder Scale +",
            "Top-tier access & white-glove support",
            "Early access to beta features",
            "Dedicated account manager",
            "Custom branding options",
          ],
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <NavBar />

      {/* HEADER */}
      <div className="w-full mx-auto px-6 lg:px-40 pt-24">
        <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Pricing & Plans
        </h1>
        <p className="text-neutral-400 text-center mt-4 max-w-2xl mx-auto">
          Choose how you participate. Builders earn. Founders build.
        </p>

        {/* TOGGLE */}
        <div className="relative mt-12 bg-neutral-900 border border-neutral-800 rounded-full flex p-1 max-w-md mx-auto">
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ left: activeIndex === 0 ? "0%" : "50%" }}
          />
          {plans.map((plan, i) => (

            <button
              key={plan.title}
              onClick={() => setActiveIndex(i)}
              className={`relative z-10 w-1/2 py-3 text-sm font-semibold transition ${
                activeIndex === i ? "text-white" : "text-neutral-400"
              }`}
            >
              {plan.title}
              </button>

          ))}
        </div>

        {/* CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="mt-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">{plans[activeIndex].description}</h2>
              <p className="text-neutral-400 mt-2">{plans[activeIndex].subtitle}</p>
            </div>

            <div className="flex flex-row items-stretch justify-center flex-wrap gap-6">
              {plans[activeIndex].tiers.map((tier, idx) => (
                <Link to={`/checkout/${tier.id}`}>
                <motion.div
                  key={tier.name}
                  whileHover={{ y: -6 }}
                  className="min-w-[20rem] flex-1 h-full bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-xl font-semibold mb-3">{tier.name}</h3>
                    <p className="text-4xl font-bold text-blue-400 mb-2">{tier.price}</p>
                    
                    {/* Platform Fee Highlight */}
                    {tier.platformFee && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-2 mb-4">
                        <p className="text-sm font-semibold text-red-400">
                          Platform Fee: {tier.platformFee}
                        </p>
                      </div>
                    )}

                    <ul className="space-y-2 text-sm text-neutral-300 mb-6">
                      {tier.features.map((f, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-green-400 flex-shrink-0">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                    <button
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:opacity-90 transition">
                    Choose Plan
                    </button>
                  
                  </motion.div>
                  </Link>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <AIPricing />
      <Footer />
    </div>
  );
};

export default Pricing;