// // src/components/pricing/InvestorPricing.jsx

// const InvestorPricing = () => {
//   return (
//     <section className="py-20">
//       <div className="mx-auto max-w-7xl px-4">
        
//         {/* Section Header */}
//         <h2 className="text-3xl font-bold text-gray-900 text-center">
//           Pricing for Investors, Advisors & Accelerators
//         </h2>

//         <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
//           Investors don’t pay for software. They pay for deal access,
//           portfolio insights, and startup governance.
//         </p>

//         {/* Plans */}
//         <div className="mt-12 grid gap-8 md:grid-cols-3">

//           {/* Observer */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6">
//             <h3 className="text-xl font-semibold">Observer</h3>
//             <p className="mt-2 text-sm text-gray-500">Free</p>

//             <ul className="mt-4 space-y-2 text-sm text-gray-700">
//               <li>• Browse startups</li>
//               <li>• View basic metrics</li>
//               <li>• Follow founders</li>
//             </ul>
//           </div>

//           {/* Investor Access */}
//           <div className="rounded-2xl border border-purple-500 bg-purple-50 p-6">
//             <h3 className="text-xl font-semibold">Investor Access</h3>
//             <p className="mt-2 text-sm text-gray-700">$99 / month</p>

//             <ul className="mt-4 space-y-2 text-sm text-gray-700">
//               <li>• Message founders</li>
//               <li>• Access KPI insights & histories</li>
//               <li>• Team productivity & contribution scoring</li>
//               <li>• Due diligence data rooms</li>
//               <li>• Smart startup filters</li>
//             </ul>
//           </div>

//           {/* Portfolio Master */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6">
//             <h3 className="text-xl font-semibold">Portfolio Master</h3>
//             <p className="mt-2 text-sm text-gray-700">
//               $499 / month + 1% deal fee
//             </p>

//             <ul className="mt-4 space-y-2 text-sm text-gray-700">
//               <li>• Multi-startup investment dashboard</li>
//               <li>• Team & talent pool access</li>
//               <li>• Risk scoring & AI valuation forecasting</li>
//               <li>• Legal docs & contract automation</li>
//               <li>• Exclusive investor badge</li>
//               <li>• Access to private deal auctions</li>
//             </ul>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default InvestorPricing;


// src/components/pricing/InvestorPricing.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Eye, TrendingUp, BarChart3, Shield, Target, Users, Zap } from 'lucide-react';

const InvestorPricing = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: "Community Plan",
      price: "$0",
      description: "Basic platform access for evaluation",
      role: "Observers • New Investors",
      features: [
        { icon: Eye, text: "Browse startups directory", included: true },
        { icon: TrendingUp, text: "View basic metrics", included: true },
        { icon: Users, text: "Follow founders & companies", included: true },
        { icon: BarChart3, text: "No advanced analytics", included: false },
        { icon: Shield, text: "No due diligence access", included: false },
        { icon: Target, text: "No messaging access", included: false },
      ],
      dealFee: "N/A",
      support: "Community forums only",
      color: "border-gray-200 bg-white",
    },
    {
      name: "Builder Plan",
      price: "$9.99/month",
      description: "For individual angel investors",
      role: "Angel Investors • Individual VCs",
      features: [
        { icon: Eye, text: "Message founders directly", included: true },
        { icon: TrendingUp, text: "Basic KPI insights", included: true },
        { icon: Users, text: "Team productivity scoring", included: true },
        { icon: BarChart3, text: "Limited due diligence data", included: true },
        { icon: Shield, text: "Basic startup filters", included: true },
        { icon: Target, text: "Weekly deal updates", included: true },
      ],
      dealFee: "None",
      support: "Email support • 24-hour response",
      color: "border-blue-200 bg-gradient-to-b from-blue-50 to-white",
    },
    {
      name: "Team Lead Plan",
      price: "$29.99/month",
      description: "For active investors and small funds",
      recommended: true,
      role: "VC Associates • Syndicate Leads",
      features: [
        { icon: Eye, text: "Full due diligence data rooms", included: true },
        { icon: TrendingUp, text: "Advanced KPI insights & histories", included: true },
        { icon: Users, text: "Team & talent pool access", included: true },
        { icon: BarChart3, text: "Smart startup filters & alerts", included: true },
        { icon: Shield, text: "Portfolio health monitoring", included: true },
        { icon: Target, text: "Priority deal notifications", included: true },
      ],
      dealFee: "None",
      support: "Priority support • 12-hour response",
      color: "border-purple-500 bg-gradient-to-b from-purple-50 to-white ring-2 ring-purple-500 ring-offset-2",
    },
    {
      name: "Startup Pro Plan",
      price: "$99.99/month",
      description: "For institutional investors and funds",
      role: "VC Partners • Accelerators • Family Offices",
      features: [
        { icon: Eye, text: "Multi-startup investment dashboard", included: true },
        { icon: TrendingUp, text: "AI valuation forecasting", included: true },
        { icon: Users, text: "Advanced team analytics", included: true },
        { icon: BarChart3, text: "Risk scoring & portfolio optimization", included: true },
        { icon: Shield, text: "Legal docs & contract automation", included: true },
        { icon: Target, text: "Private deal auctions access", included: true },
      ],
      dealFee: "1% on funded deals",
      support: "Dedicated account manager • 4-hour response",
      color: "border-indigo-500 bg-gradient-to-b from-indigo-50 to-white",
    },
  ];

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      className="py-20 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-indigo-600">
            For Investors & Strategic Advisors
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Advanced deal flow management, portfolio analytics, and startup intelligence 
            for informed investment decisions.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className={`
                relative rounded-2xl border-2 p-6 shadow-lg transition-all duration-300
                ${plan.color}
              `}
            >
              {plan.recommended && (
                <div className="absolute  w-full -top-3 left-1/2 transform -translate-x-20">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    PROFESSIONAL TIER
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="ml-1 text-gray-500">/month</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-3">
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    {plan.role}
                  </span>
                </div>
              </div>

              {/* Deal Fee Indicator */}
              {plan.dealFee !== "None" && plan.dealFee !== "N/A" && (
                <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-orange-800">Deal Fee</span>
                    <span className="text-lg font-bold text-red-600">{plan.dealFee}</span>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">Applied on funded deals only</p>
                </div>
              )}

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="flex items-start"
                  >
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5">✗</span>
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                      {feature.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Virtual Currency Benefits */}
              <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-slate-100 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Investor Perks</h4>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-lg font-bold text-amber-600">2x</div>
                    <div className="text-xs text-amber-700">Deal Priority</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-emerald-600">24h</div>
                    <div className="text-xs text-emerald-700">Response Time</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-600">VIP</div>
                    <div className="text-xs text-purple-700">Access</div>
                  </div>
                </div>
              </div>

              {/* Support Level */}
              <div className="mb-6 p-3 bg-gradient-to-r from-slate-50 to-gray-100 rounded-lg">
                <span className="text-xs font-medium text-gray-600">Support:</span>
                <p className="text-sm text-gray-700 mt-1">{plan.support}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  w-full py-3 rounded-xl font-semibold transition-all duration-300
                  ${plan.recommended 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                    : plan.price === "$0"
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                  }
                `}
              >
                {plan.price === "$0" ? "Browse Startups" : "Start 7-Day Trial"}
              </motion.button>

              {plan.price !== "$0" && (
                <p className="text-center text-xs text-gray-500 mt-2">
                  Annual: ${parseInt(plan.price.slice(1)) * 10.8}/year
                  <br />
                  <span className="text-green-600">(Save 17%)</span>
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Enterprise Tier */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-12 bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-8 text-white"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Enterprise Plan</h3>
              <p className="text-gray-300 mb-6">For large funds, accelerators, and institutions</p>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-center">
                  <Zap className="w-5 h-5 text-cyan-400 mr-3" />
                  Custom SLAs and 24/7 premium support
                </li>
                <li className="flex items-center">
                  <Shield className="w-5 h-5 text-green-400 mr-3" />
                  On-premise deployment options
                </li>
                <li className="flex items-center">
                  <Target className="w-5 h-5 text-purple-400 mr-3" />
                  Custom feature development
                </li>
                <li className="flex items-center">
                  <Users className="w-5 h-5 text-yellow-400 mr-3" />
                  Dedicated success manager
                </li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <div className="mb-4">
                <div className="text-3xl font-bold">Custom Pricing</div>
                <p className="text-gray-300">Starting at $499/month</p>
              </div>
              <p className="text-gray-400 mb-6">Minimum 10 seats • Volume discounts available</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
              >
                Contact Enterprise Sales
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default InvestorPricing;