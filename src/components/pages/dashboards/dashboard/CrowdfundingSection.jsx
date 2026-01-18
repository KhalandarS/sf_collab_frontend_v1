import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function CrowdfundingSection() {
  return (
    <section className="flex flex-col relative py-2 px-6 gap-2 bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-2xl overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-pink-500/20 blur-3xl" />
      
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Be Part of the Future
          </h2>
          <p className="text-lg text-white/80">
            Become an early supporter and secure permanent benefits. Your support today helps build the collaboration platform of tomorrow, with lifetime access reserved for our first believers.
          </p>
        </div>


          <Link
            to="/crowdfunding"
            className="inline-flex items-center gap-2 px-8 py-3 my-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Explore Crowdfunding
            <ArrowRight className="w-5 h-5" />
          </Link>
      </div>
    </section>
  );
}