import { useEffect, useState } from "react";

export default function OverviewWebsite() {
  const [accepted, setAccepted] = useState(localStorage.getItem("overviewAccepted") === "true");
  useEffect(() => {
    localStorage.setItem("overviewAccepted", accepted);
  }, [accepted]);
  return (
    <>
    <div className="w-full mb-4 text-center">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 border border-white/20 backdrop-blur-sm p-6">
        <h2 className="text-2xl font-bold text-white mb-2">OVERVIEW WEBSITE UNTIL 15TH OF JANUARY</h2>
        <p className="text-white/70">Stay updated with the latest features and improvements!</p>
        
      </div>
      </div>
      {!accepted &&
        <div className="w-full mb-4 text-center">
          <div className="relative overflow-hidden rounded-2xl bg-black border border-red-500  backdrop-blur-sm p-6">
            <p className=" text-md mt-4 text-red-400">
              Currently in testing stages. We reserve the right to modify, cancel features, or change values. Users will be compensated with free subscriptions accordingly. Data collected will be used to support these improvements.
            </p>
          
            <button
              onClick={() => setAccepted(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
              Accept
            </button>
          
          </div>

        </div>
      }
    </>
  )
}