import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import InfluencerApplicationForm from "./InfluencerApplicationForm";

export default function InfluencerApplication() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Become a Co-Builder</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Influencer Application
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Join us as a <span className="font-semibold text-blue-400">Strategic Partner</span> and help shape the future of SForger
          </p>
        </motion.div>

        {/* Form Card */}
        <InfluencerApplicationForm />
        
      </div>
    </div>
  );
}
