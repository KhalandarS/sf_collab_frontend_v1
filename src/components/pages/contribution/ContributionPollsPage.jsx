import { Vote, Clock, CheckCircle, ArrowRight } from "lucide-react";

const polls = [
  {
    id: 1,
    title: "What should we ship first?",
    description: "Help us prioritize the next major feature for SFCollab.",
    options: [
      "Startup public profiles",
      "Investor discovery",
      "Team matching",
      "Analytics dashboard",
    ],
    points: 2,
    status: "active",
    endsIn: "2 days",
  },
  {
    id: 2,
    title: "Preferred onboarding experience",
    description: "Choose how new users should be onboarded.",
    options: [
      "Guided step-by-step",
      "Minimal + self explore",
      "Founder-focused flow",
    ],
    points: 1,
    status: "active",
    endsIn: "5 days",
  },
  {
    id: 3,
    title: "Community role rewards",
    description: "Decide which contributors should earn higher multipliers.",
    options: ["Founders", "Builders", "Influencers", "Investors"],
    points: 3,
    status: "completed",
  },
];

export default function ContributionPollsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 px-6 py-10 text-white">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <section className="space-y-3">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Vote className="h-8 w-8 text-purple-400" />
            Vote in Community Polls
          </h1>
          <p className="text-gray-300 max-w-2xl">
            Your vote directly influences product decisions. Every vote earns
            points and improves your access priority.
          </p>
        </section>

        {/* ================= POLLS ================= */}
        <section className="space-y-6">
          {polls.map((poll) => (
            <div
              key={poll.id}
              className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {poll.title}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {poll.description}
                  </p>
                </div>

                <div className="text-right text-sm">
                  <p className="text-purple-400 font-medium">
                    +{poll.points} pts
                  </p>
                  {poll.status === "active" ? (
                    <p className="text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="h-4 w-4" />
                      Ends in {poll.endsIn}
                    </p>
                  ) : (
                    <p className="text-green-400 flex items-center gap-1 mt-1">
                      <CheckCircle className="h-4 w-4" />
                      Completed
                    </p>
                  )}
                </div>
              </div>

              {/* ================= OPTIONS ================= */}
              <div className="mt-6 grid gap-3">
                {poll.options.map((option, index) => (
                  <button
                    key={index}
                    disabled={poll.status !== "active"}
                    className={`w-full text-left rounded-xl px-4 py-3 border border-white/10 
                      ${
                        poll.status === "active"
                          ? "hover:bg-white/10 transition"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {poll.status === "active" && (
                <div className="mt-4 flex justify-end">
                  <button className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:underline">
                    Submit Vote
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* ================= FOOTER INFO ================= */}
        <section className="text-sm text-gray-400 max-w-3xl">
          Votes are weighted equally during early access. Future stages may
          introduce multipliers based on contribution history.
        </section>
      </div>
    </div>
  );
}
