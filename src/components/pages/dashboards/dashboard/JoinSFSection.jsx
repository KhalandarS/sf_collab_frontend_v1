import { Link } from "react-router-dom";

export default function JoinSFSection({
  setShowJobApplication,
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500/20 to-teal-500/20 border border-cyan-400/30 backdrop-blur-sm p-5 sm:p-6 lg:p-8">
    
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:20px_20px]" />
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Join the SForger Team
                </h2>
      <div className="relative z-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
      
        {/* Text content */}
        <div className="text-center">
          
          <p className="text-white/80 text-center max-w-2xl m-auto text-sm sm:text-base">
            We’re hiring developers, content creators, and 3D designers to help build the future of SForger.
          </p>

          {/* Roles */}
          <div className="flex flex-wrap items-center justify-center w-full gap-2 mt-4">
            <span className="px-3 py-1.5 bg-blue-500/40 border border-blue-400/50 rounded-full text-white text-xs sm:text-sm">
              💻 Developers
            </span>
            <span className="px-3 py-1.5 bg-purple-500/40 border border-purple-400/50 rounded-full text-white text-xs sm:text-sm">
              ✍️ Content Creators
            </span>
            <span className="px-3 py-1.5 bg-pink-500/40 border border-pink-400/50 rounded-full text-white text-xs sm:text-sm">
              🎨 3D Designers
            </span>
            <span className="px-3 py-1.5 bg-green-500/40 border border-green-400/50 rounded-full text-white text-xs sm:text-sm">
              + More
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="md:absolute md:bottom-1 flex-col gap-4 md:right-1 flex lg:justify-end items-end">
          <Link
            to="/join-sf"
            className="inline-flex w-full items-center justify-center h-12 px-6 sm:px-8 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold rounded-xl transition-all duration-300 border border-cyan-300/50 hover:scale-105"
          >
            Apply Now
          </Link>
          <div
              onClick={() => {
              localStorage.setItem('preferences:showJobApplication', 'true');
              setShowJobApplication(true);
              }}
              className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-gray-700 hover:bg-gray-600 px-6 py-3 font-semibold text-white transition-all duration-300 border border-gray-600 hover:scale-105"
            >
              Not interested
            </div>
        </div>

      </div>
    </div>
  )
}