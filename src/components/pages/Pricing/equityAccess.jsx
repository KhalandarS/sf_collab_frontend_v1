
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, Shield, FileText, Target, Zap } from 'lucide-react';

export default function EquityAccess(){
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section 
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900"
    >
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-cyan-300">
            Equity Access Program
          </h2>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mx-auto">
            For founders with strong vision but limited capital. 
            Build with our complete platform in exchange for equity.
          </p>
        </motion.div>

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Benefits Card */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Zap className="w-6 h-6 mr-3 text-cyan-400" />
              What You Get
            </h3>
            <ul className="space-y-4">
              {[
                { icon: TrendingUp, text: "Unlimited usage across all tools", color: "text-green-400" },
                { icon: Users, text: "Unlimited SFManagers seats", color: "text-blue-400" },
                { icon: Shield, text: "Complete AI suite & infrastructure", color: "text-purple-400" },
                { icon: FileText, text: "Hiring, payments, legal & contracts", color: "text-yellow-400" },
                { icon: Target, text: "Team execution dashboards & KPIs", color: "text-pink-400" },
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="flex items-start group"
                >
                  <item.icon className={`w-5 h-5 mr-3 mt-1 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-gray-200 group-hover:text-white transition-colors">
                    {item.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Virtual Currency Bonus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
              className="mt-8 p-4 bg-gradient-to-r from-cyan-900/40 to-blue-900/40 rounded-xl border border-cyan-500/30"
            >
              <h4 className="font-semibold text-cyan-300 mb-2">Exclusive Virtual Economy</h4>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">3x</div>
                  <div className="text-xs text-cyan-300">XP Multiplier</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-emerald-300">Exchange Bonus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">1000</div>
                  <div className="text-xs text-purple-300">Monthly Coins</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Equity Terms Card */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            animate={inView ? { x: 0, opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Equity Terms</h3>
            <div className="space-y-6">
              {[
                {
                  title: "Equity Range",
                  value: "5% – 20%",
                  description: "Based on startup stage, traction, and valuation",
                  gradient: "from-yellow-500 to-orange-500"
                },
                {
                  title: "Protection",
                  value: "Anti-dilution",
                  description: "Equity cannot be diluted below 50% of original grant",
                  gradient: "from-green-500 to-emerald-500"
                },
                {
                  title: "IP Protection",
                  value: "Full Retention",
                  description: "Startup retains full IP with SF co-protection",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  title: "Flexibility",
                  value: "Buyback Option",
                  description: "Available if leaving the ecosystem",
                  gradient: "from-purple-500 to-pink-500"
                },
              ].map((term, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="p-4 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl border border-gray-700/50"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-white">{term.title}</h4>
                    <span className={`bg-gradient-to-r ${term.gradient} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {term.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{term.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.9 }}
              className="mt-8 p-4 bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-xl border border-red-500/30"
            >
              <p className="text-sm text-red-200 text-center">
                ⚠️ Important: Once accepted, cannot switch back to free plan.
                Commitment required for serious ventures only.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col md:flex-row gap-4 items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-xl"
            >
              Apply for Equity Access
            </motion.button>
            <p className="text-gray-400">
              Requires pitch deck, team info, and traction metrics
              <br />
              <span className="text-sm">Response within 7 business days</span>
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};
