// // src/components/pricing/FounderPricing.jsx

// const FounderPricing = () => {
//   return (
//     <section className="py-20 bg-gray-50">
//       <div className="mx-auto max-w-7xl px-4">
        
//         {/* Section Header */}
//         <h2 className="text-3xl font-bold text-gray-900 text-center">
//           Pricing for Startups & Founders
//         </h2>

//         <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
//           Founders don’t pay for access to tools. They pay for team execution,
//           smart AI infrastructure, and professional scaling.
//         </p>

//         {/* Plans */}
//         <div className="mt-12 grid gap-8 md:grid-cols-3">

//           {/* Startup Lite */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6">
//             <h3 className="text-xl font-semibold">Startup Lite</h3>
//             <p className="mt-2 text-sm text-gray-500">Free</p>

//             <ul className="mt-4 space-y-2 text-sm text-gray-700">
//               <li>• 30 minutes/day</li>
//               <li>• Up to 3 contributors</li>
//               <li>• Basic startup page</li>
//               <li>• Manual payouts only</li>
//               <li>• AI tools restricted to weekly limits</li>
//               <li>• No investor visibility</li>
//             </ul>
//           </div>

//           {/* Founder Pro */}
//           <div className="rounded-2xl border border-purple-500 bg-purple-50 p-6">
//             <h3 className="text-xl font-semibold">Founder Pro</h3>
//             <p className="mt-2 text-sm text-gray-700">$79 / month</p>

//             <ul className="mt-4 space-y-2 text-sm text-gray-700">
//               <li>• Unlimited creation & AI tools</li>
//               <li>• Unlimited team invites (SFM seats billed separately)</li>
//               <li>• Full AI Startup Suite (Pitch, Branding, Plan, Roadmap)</li>
//               <li>• Smart talent matching & hiring</li>
//               <li>• Legal onboarding + role agreements</li>
//               <li>• Includes 3 SFManagers execution seats</li>
//             </ul>
//           </div>

//           {/* Scale Founder */}
//           <div className="rounded-2xl border border-gray-200 bg-white p-6">
//             <h3 className="text-xl font-semibold">Scale Founder</h3>
//             <p className="mt-2 text-sm text-gray-700">$499 / month</p>

//             <ul className="mt-4 space-y-2 text-sm text-gray-700">
//               <li>• Unlimited access + priority</li>
//               <li>• Advanced KPI dashboards & forecasting</li>
//               <li>• Funding & investor tools</li>
//               <li>• Contract vault + legal automation</li>
//               <li>• Full dev integrations (GitHub, CRM, Analytics)</li>
//               <li>• Includes 10 SFManagers seats</li>
//             </ul>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default FounderPricing;


// src/components/pricing/FounderPricing.jsx
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Zap, Users, TrendingUp, Star, Rocket, Award, Target, Building2, LineChart } from 'lucide-react';

const FounderPricing = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: "Community Plan",
      price: "$0",
      description: "For idea validation and basic networking",
      role: "Early-stage Founders",
      features: [
        { icon: Users, text: "Basic startup page", included: true },
        { icon: TrendingUp, text: "Team size (max 5 members)", included: true },
        { icon: Zap, text: "AI tools (weekly limits)", included: true },
        { icon: Star, text: "Manual payouts only", included: false },
        { icon: Rocket, text: "No investor visibility", included: false },
        { icon: Target, text: "No custom branding", included: false },
      ],
      virtualCurrency: {
        xpMultiplier: "1x",
        exchangeBonus: "0%",
        monthlyCoins: "0 SF Coins",
      },
      support: "Community forums only",
      color: "border-gray-200 bg-white",
    },
    {
      name: "Builder Plan",
      price: "$9.99/month",
      description: "For solo founders and small teams",
      role: "Individual Founders • Small Teams",
      features: [
        { icon: Users, text: "Unlimited private projects", included: true },
        { icon: TrendingUp, text: "Team size (up to 10 members)", included: true },
        { icon: Zap, text: "Full AI suite (50 requests/month)", included: true },
        { icon: Star, text: "Basic analytics dashboard", included: true },
        { icon: Rocket, text: "Custom workflows", included: true },
        { icon: Target, text: "Data export capabilities", included: true },
      ],
      virtualCurrency: {
        xpMultiplier: "1.2x",
        exchangeBonus: "10%",
        monthlyCoins: "50 SF Coins",
      },
      support: "Email support • 24-hour response",
      color: "border-blue-200 bg-gradient-to-b from-blue-50 to-white",
    },
    {
      name: "Team Lead Plan",
      price: "$29.99/month",
      description: "For growing startups with teams",
      recommended: true,
      role: "Founders • Engineering Managers • Product Managers",
      features: [
        { icon: Users, text: "Team management (up to 25 members)", included: true },
        { icon: TrendingUp, text: "Advanced analytics & reporting", included: true },
        { icon: Zap, text: "Priority 24-hour support", included: true },
        { icon: Star, text: "Unlimited AI requests", included: true },
        { icon: Rocket, text: "Third-party integrations", included: true },
        { icon: Target, text: "Custom branding for projects", included: true },
      ],
      virtualCurrency: {
        xpMultiplier: "1.5x",
        exchangeBonus: "25%",
        monthlyCoins: "200 SF Coins",
      },
      support: "Priority email/chat • 12-hour response",
      color: "border-purple-500 bg-gradient-to-b from-purple-50 to-white ring-2 ring-purple-500 ring-offset-2",
    },
    {
      name: "Startup Pro Plan",
      price: "$99.99/month",
      description: "For scaling startups and serious ventures",
      role: "Scaling Startups • Investors • Advisors",
      features: [
        { icon: Building2, text: "Unlimited team members", included: true },
        { icon: LineChart, text: "Dedicated account manager", included: true },
        { icon: Zap, text: "Custom contract drafting (AI)", included: true },
        { icon: TrendingUp, text: "Investor matching system", included: true },
        { icon: Rocket, text: "Market research tools", included: true },
        { icon: Target, text: "Advanced financial modeling", included: true },
      ],
      virtualCurrency: {
        xpMultiplier: "2x",
        exchangeBonus: "50%",
        monthlyCoins: "500 SF Coins",
      },
      support: "Dedicated account manager • 4-hour response",
      color: "border-indigo-500 bg-gradient-to-b from-indigo-50 to-white",
    },
  ];

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      className="py-20 bg-gradient-to-b from-slate-50 to-gray-100"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600">
            For Founders & Startup Leaders
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive tools for building, managing, and scaling your startup with 
            investor-grade analytics and team collaboration.
          </p>
        </div>

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
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    RECOMMENDED
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

              {/* Virtual Currency Card */}
              <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-amber-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-amber-800">Virtual Economy</span>
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    SF Coins
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="font-bold text-amber-600">{plan.virtualCurrency.xpMultiplier}</div>
                    <div className="text-xs text-amber-700">XP Multiplier</div>
                  </div>
                  <div>
                    <div className="font-bold text-emerald-600">{plan.virtualCurrency.exchangeBonus}</div>
                    <div className="text-xs text-emerald-700">Exchange Bonus</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{plan.virtualCurrency.monthlyCoins}</div>
                    <div className="text-xs text-purple-700">Monthly</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>

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
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700' 
                    : plan.price === "$0"
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600'
                  }
                `}
              >
                {plan.price === "$0" ? "Get Started" : "Start 7-Day Trial"}
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

        {/* Business Development Bundle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="relative overflow-hidden mt-12 bg-gradient-to-r from-blue-900 to-indigo-800 rounded-2xl p-8 text-white"
        >
          <span className='p-2 w-50 text-center bg-teal-500/40 text-teal-300 border border-teal-300 absolute top-6 -right-15 rotate-50'>Coming soon</span>
        
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Business Development Bundle</h3>
              <p className="text-blue-200">For Founders, Investors, Advisors</p>
              <ul className="mt-4 space-y-2 text-sm text-blue-100">
                <li>• Advanced financial modeling</li>
                <li>• Investor pitch coaching (AI-powered)</li>
                <li>• Market sizing tools</li>
                <li>• Competitive analysis databases</li>
              </ul>
            </div>
            <div className="mt-6 md:mt-0 text-center">
              <div className="text-3xl font-bold">$29.99<span className="text-lg">/month</span></div>
              <p className="text-blue-200 mt-1">Add to any plan</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
              >
                Add to Plan
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FounderPricing;