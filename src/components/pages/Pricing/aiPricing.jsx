import { motion, AnimatePresence } from "framer-motion";
const aiExtras = {
  bundle: {
    name: "AI Power Bundle",
    price: "$49",
    period: "/ month",
    highlight: true,
    includes: [
      "AI Assistant",
      "Business Plan Generator",
      "Pitch Deck Generator",
      "Image Generator",
      "Video Generator",
    ],
    note: "Best value · Uses credits",
  },
  items: [
    { name: "AI Assistant", price: "$39", desc: "Planning, reminders, summaries, voice, email drafting" },
    { name: "Business Plan Generator", price: "$19", desc: "Comprehensive business plans tailored to your needs" },
    { name: "Pitch Deck Generator", price: "$19", desc: "Create compelling pitch decks to attract investors" },
    { name: "Image Generator", price: "$15", desc: "Generate high-quality images for your projects" },
    { name: "Video Generator", price: "$29", desc: "Produce engaging videos to showcase your ideas" },
  ],
};
const ExtrasSection = () => (
  <section className="mt-24">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-4xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
    >
      Power Extras
    </motion.h2>

    <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
      Optional power features. Add only what helps you execute. Any plan can use them.
    </p>

    {/* AI BUNDLE */}
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/40 rounded-2xl p-8 mb-12"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold">🤖 AI Power Bundle</h3>
        <span className="text-3xl font-bold text-purple-400">$49/mo</span>
      </div>

      <p className="text-neutral-300 mb-4">
        Everything AI. Best value. Uses credits.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        {aiExtras.bundle.includes.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-neutral-200">
            <span className="text-green-400">✓</span> {item}
          </div>
        ))}
      </div>

      <button className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition font-semibold">
        Add AI Bundle
      </button>
    </motion.div>

    {/* INDIVIDUAL EXTRAS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {aiExtras.items.map((item) => (
        <div
          key={item.name}
          className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 hover:border-neutral-500 transition"
        >
          <h4 className="font-semibold mb-2">{item.name}</h4>
          <p className="text-sm text-neutral-400 mb-4">{item.desc}</p>
          <div className="flex items-center justify-between">
            <span className="font-bold text-purple-400">{item.price}/mo</span>
            <button className="text-sm text-purple-400 hover:underline">
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
);
const CreditPacks = () => (
  <section className="mt-24">
    <h3 className="text-3xl font-bold mb-6 text-center">Credits</h3>

    <p className="text-neutral-400 text-center mb-8">
      Used for AI, automation, heavy processing & external APIs.
      Core collaboration never uses credits.
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        ["1,000", "$19"],
        ["3,000", "$49"],
        ["7,000", "$99"],
        ["16,000", "$199"],
      ].map(([credits, price]) => (
        <div key={credits} className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-purple-400">{credits}</p>
          <p className="text-sm text-neutral-400 mb-2">credits / month</p>
          <p className="font-semibold">{price}</p>
        </div>
      ))}
    </div>
  </section>
);
export default function AIPricing() {
  return (
    <div className="w-full mx-auto px-6 lg:px-40 py-16">
      <h1 className="text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        AI & Credits Pricing
      </h1>
      <p className="text-center text-neutral-400 max-w-3xl mx-auto">
        Flexible AI-powered features and credit packs to supercharge your collaboration experience. Choose what fits your needs and scale as you grow.
      </p>

      <ExtrasSection />
      <CreditPacks />
      <div className="mt-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-purple-500/30 rounded-2xl p-8 text-center">
        <p className="text-xl text-neutral-200 font-semibold mb-4">
          SF is not about locking features.
        </p>
        <p className="text-neutral-300">
          Start free. Scale when ready.
          Use power only when it helps you execute.
        </p>
      </div>

    </div>
  );
};