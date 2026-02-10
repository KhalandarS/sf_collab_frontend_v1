import { useEffect, useState } from "react";

export default function OverviewWebsite() {
  const [accepted, setAccepted] = useState(localStorage.getItem("overviewAccepted") === "true");
  const [acceptedTempAccess, setAcceptedTempAccess] = useState(localStorage.getItem("overviewTempAccessAccepted") === "true");
  useEffect(() => {
    localStorage.setItem("overviewAccepted", accepted);
  }, [accepted]);
  useEffect(() => {
    localStorage.setItem("overviewTempAccessAccepted", acceptedTempAccess);
  }, [acceptedTempAccess]);
  return (
    <>
      <div className="w-full mb-4 text-center">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 border border-white/20 backdrop-blur-sm p-6">
          <h2 className="text-2xl font-bold text-white mb-2">OVERVIEW WEBSITE</h2>
          <p className="text-white/70">Stay updated with the latest features and improvements!</p>
        </div>
      </div>
      {!accepted &&
        <div className="w-full flex flex-col items-center justify-center mb-4">
          <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-blue-900/30 border border-blue-500/50 backdrop-blur-sm py-3 px-6 w-full">
            <div className="rounded-lg text-center">
              <p className="text-sm bg-gradient-to-r from-blue-200 via-blue-100 to-blue-200 bg-clip-text text-transparent leading-relaxed">
                <span className="font-semibold">SFCollab is currently in active testing and early rollout.</span> Features, point values, visuals, and rewards may evolve as we refine the system — always with fairness and transparency in mind.
              </p>
            </div>
            <button
              onClick={() => setAccepted(true)}
              className="mt-3 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
              Accept
            </button>
          </div>
        </div>
      }
      {
        !acceptedTempAccess &&
      
        <div className="w-full mb-4 text-center">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/80 to-orange-500/80 border border-white/20 backdrop-blur-sm p-6">
            <h2 className="text-2xl font-bold text-white mb-2">TEMPORARY EARLY ACCESS</h2>
            <p className="text-white/70 mb-3">Everyone has free access to Founder (Explorer) & Builder (Supporter) Pro features</p>
            <p className="text-sm text-white/60">This complimentary access will reset when V1 launches</p>
            <button
              onClick={() => setAcceptedTempAccess(true)}
              className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200">
              Accept
            </button>
          </div>
            
        </div>}
    </>
  );
}