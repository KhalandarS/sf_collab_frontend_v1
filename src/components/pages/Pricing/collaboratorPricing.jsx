
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, Zap, Users, TrendingUp, Star, Rocket, Award } from 'lucide-react';

export default function CollaboratorPricing(){
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const plans = [
    {
      name: "Community Plan",
      price: "$0",
      description: "For exploration and basic networking",
      recommended: false,
      role: "All user roles",
      features: [
        { icon: Users, text: "Basic user profile and networking", included: true },
        { icon: Zap, text: "Limited AI features (5 requests/month)", included: true },
        { icon: TrendingUp, text: "Basic idea creation (10/month)", included: true },
        { icon: Users, text: "Team size (max 5 members)", included: true },
        { icon: Star, text: "No private projects", included: false },
        { icon: Rocket, text: "No premium analytics", included: false },
        { icon: Award, text: "Basic achievement system", included: true },
      ],
      virtualCurrency: {
        xpMultiplier: "1x",
        exchangeBonus: "0%",
        monthlyCoins: "0 SF Coins",
      },
      targetRoles: ["All roles for exploration"],
      color: "border-gray-200 bg-white",
      buttonColor: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    },
    {
      name: "Builder Plan",
      price: "$9.99/month",
      description: "For individual contributors and specialists",
      recommended: true,
      role: "Engineers • Designers • Data Professionals",
      features: [
        { icon: Users, text: "Unlimited private projects", included: true },
        { icon: Zap, text: "Advanced task management", included: true },
        { icon: TrendingUp, text: "Full AI suite (50 requests/month)", included: true },
        { icon: Users, text: "Team collaboration (up to 10 members)", included: true },
        { icon: Star, text: "Basic analytics dashboard", included: true },
        { icon: Rocket, text: "Custom workflows", included: true },
        { icon: Award, text: "Early access to new features", included: true },
      ],
      virtualCurrency: {
        xpMultiplier: "1.2x",
        exchangeBonus: "10%",
        monthlyCoins: "50 SF Coins",
      },
      targetRoles: ["Individual Contributors", "All Engineering Roles", "Designers", "Data Roles", "Growth Roles"],
      color: "border-purple-500 bg-gradient-to-b from-purple-50 to-white",
      buttonColor: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700",
    },
    {
      name: "Team Lead Plan",
      price: "$29.99/month",
      description: "For team leaders and growing professionals",
      recommended: false,
      role: "Technical Leads • Senior Engineers • Managers",
      features: [
        { icon: Users, text: "Team management (up to 25 members)", included: true },
        { icon: Zap, text: "Advanced analytics & reporting", included: true },
        { icon: TrendingUp, text: "Priority 24-hour support", included: true },
        { icon: Users, text: "Unlimited AI requests", included: true },
        { icon: Star, text: "Third-party integrations (Slack, Jira)", included: true },
        { icon: Rocket, text: "Custom branding for projects", included: true },
        { icon: Award, text: "Advanced security (SSO, 2FA)", included: true },
      ],
      virtualCurrency: {
        xpMultiplier: "1.5x",
        exchangeBonus: "25%",
        monthlyCoins: "200 SF Coins",
      },
      targetRoles: ["Technical Leads", "Engineering Managers", "Senior Specialists", "Team Leaders"],
      color: "border-blue-500 bg-gradient-to-b from-blue-50 to-white",
      buttonColor: "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700",
    },
  ];

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-b from-white to-slate-50"
    >
      <div className="mx-auto max-w-7xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            For Technical & Creative Professionals
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Level up your skills, collaborate effectively, and accelerate your career growth 
            with role-specific tools and features.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
              className={`
                relative rounded-2xl border-2 p-6 shadow-lg transition-all duration-300
                ${plan.recommended ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
                ${plan.color}
              `}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-2 flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== "$0" && (
                    <span className="ml-2 text-gray-500">/month</span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-600">{plan.description}</p>
                <div className="mt-3 inline-block bg-gradient-to-r from-slate-100 to-gray-100 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-gray-700">{plan.role}</span>
                </div>
              </div>

              {/* Virtual Currency Benefits */}
              <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                <h4 className="font-semibold text-amber-800 mb-2">Virtual Currency Benefits</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-bold text-amber-600">{plan.virtualCurrency.xpMultiplier}</div>
                    <div className="text-xs text-amber-700">XP Multiplier</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-emerald-600">{plan.virtualCurrency.exchangeBonus}</div>
                    <div className="text-xs text-emerald-700">Exchange Bonus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{plan.virtualCurrency.monthlyCoins}</div>
                    <div className="text-xs text-purple-700">Monthly</div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    className="flex items-start"
                  >
                    {feature.included ? (
                      <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    ) : (
                      <span className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5">✗</span>
                    )}
                    <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                      {feature.text}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* Target Roles */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Ideal for:</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(plan.targetRoles) ? plan.targetRoles.map((role, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {role}
                    </span>
                  )) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {plan.targetRoles}
                    </span>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${plan.buttonColor}`}
              >
                {plan.price === "$0" ? "Get Started Free" : "Start Free Trial"}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Add-on Bundles */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="relative mt-16 bg-gradient-to-r from-gray-900 to-slate-800 rounded-2xl p-8 text-white overflow-hidden"
        >
          <h3 className="text-2xl font-bold mb-6">Role-Specific Add-on Bundles &nbsp; </h3>
          <span className='p-2 w-50 text-center bg-teal-500/40 text-teal-300 border border-teal-300 absolute top-6 -right-15 rotate-50'>Coming soon</span>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-green-900 to-emerald-800 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">Technical Bundle</h4>
              <p className="text-green-200 mb-4">$19.99/month</p>
              <ul className="space-y-2 text-sm text-green-100">
                <li>• Advanced code repository integration</li>
                <li>• CI/CD pipeline templates</li>
                <li>• Infrastructure as code generators</li>
                <li>• Technical debt tracking</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-900 to-pink-800 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">Data & AI Bundle</h4>
              <p className="text-purple-200 mb-4">$24.99/month</p>
              <ul className="space-y-2 text-sm text-purple-100">
                <li>• Advanced data visualization</li>
                <li>• Machine learning model templates</li>
                <li>• Data pipeline automation</li>
                <li>• AI model training environments</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-900 to-yellow-800 p-6 rounded-xl">
              <h4 className="text-xl font-bold mb-2">Design & Product Bundle</h4>
              <p className="text-orange-200 mb-4">$14.99/month</p>
              <ul className="space-y-2 text-sm text-orange-100">
                <li>• Advanced prototyping tools</li>
                <li>• Design system management</li>
                <li>• Product roadmap visualization</li>
                <li>• User feedback aggregation</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
