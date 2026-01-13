import { useEffect, useState } from "react";
import { Check, X, Settings } from "lucide-react";
import { useSelector } from "react-redux";
import { contributionAPI } from "@/utils/APIs/contributionAPI";
import { toast } from "react-toastify";
import { waitlistAPI } from "@/utils/APIs/waitlistAPI";

export default function AdminIdeasReviewSection() {
  const { access_token } = useSelector((state) => state.auth);
  const [ideas, setIdeas] = useState([]);
  const [filteredIdeas, setFilteredIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      
      fetchIdeas()
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    setFilteredIdeas(ideas);
  }, [ideas]);
  const fetchIdeas = async () => {
    setLoading(true);
    const params = {
      status: "pending",
      page: 1,
      per_page: 50,
    }
    const res = await contributionAPI.getAllIdeas(params, access_token);
    console.log(res.data.ideas);
    if (!res.success) {
      toast.error("Failed to load ideas");
      setLoading(false);
      return;
    }

    setIdeas(res.data.ideas.sort((a, b) => {
      const statusOrder = { pending: 0, approved: 1, rejected: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }));
    setLoading(false);
    return res.data.ideas
  };

  const updateIdea = async (id, payload) => {
    const res = await contributionAPI.updateIdea(id, payload, access_token);
    console.log(res);
    if (!res.success) {
      toast.error(res.message || "Action failed");
      return;
    }
    if (payload.status === "rejected") {
      setIdeas(ideas.filter((idea) => idea.id !== id));
      toast.success("Idea rejected");
      return;
    }
    if (payload.status === "approved") {

    
      
      // Points
      await waitlistAPI.givePoints(res.data.user_id,
        `${res.data.impact}_contribution`, access_token);
    }
    toast.success("Idea updated");
      setIdeas(
        ideas.map((idea) =>
          idea.id === id ? { ...idea, ...payload } : idea
        )
      );
      setFilteredIdeas(
        ideas.map((idea) =>
          idea.id === id ? { ...idea, ...payload } : idea
        )
      );
  };

  if (loading) {
    return <div className="text-center text-gray-400 py-20">Loading ideas…</div>;
  }

  return (
    <div className="px-6 py-10 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="w-full mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin · Idea Review</h1>

        {ideas.length === 0 && (
          <p className="text-gray-400">No pending ideas 🎉</p>
        )}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilteredIdeas(ideas)}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium"
          >
            All
          </button>
          <button
            onClick={() => setFilteredIdeas(ideas.filter((idea) => idea.status === "pending"))}
            className="px-4 py-2 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 text-sm font-medium text-yellow-300"
          >
            Pending
          </button>
          <button
            onClick={() => setFilteredIdeas(ideas.filter((idea) => idea.status === "approved"))}
            className="px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-sm font-medium text-emerald-300"
          >
            Approved
          </button>
          <button
            onClick={() => setFilteredIdeas(ideas.filter((idea) => idea.status === "rejected"))}
            className="px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-sm font-medium text-red-300"
          >
            Rejected
          </button>
        </div>
        <div className="space-y-6 max-h-128 overflow-y-auto">
          {filteredIdeas.map((idea) => (
            <div
              key={idea.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{idea.title}</h2>
                  {/* <p className="text-xs text-gray-400">
                    Area: {idea.area} · Submitted by {idea.user_name}
                  </p> */}
                </div>
                {
                  idea.status === "pending" ? null : idea.status === "approved" ? (
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">
                    Approved
                  </span>
                ) : (
                  <span className="text-xs px-3 py-1 rounded-full bg-red-500/10 text-red-400">
                    Rejected
                  </span>
                )
                }
                
              </div>

              {/* Description */}
              <p className="text-sm text-gray-300">{idea.description}</p>
              {
                idea.status === "pending" && (<>
              
                  {/* Impact selector */}
                  <div className="flex items-center gap-3">
                    <Settings className="h-4 w-4 text-gray-400" />
                    <select
                      value={idea.impact}
                      onChange={(e) =>
                        updateIdea(idea.id, { impact: e.target.value })
                      }
                      className="rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm"
                    >
                      <option value="small">Small (10 pts)</option>
                      <option value="medium">Medium (25 pts)</option>
                      <option value="large">High (50 pts)</option>
                    </select>
                  </div>

                  {/* Actions */}
              
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() =>
                        updateIdea(idea.id, { status: "approved" })
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/80 hover:bg-emerald-500 px-4 py-2 text-sm font-semibold"
                    >
                      <Check className="h-4 w-4" />
                      Approve
                    </button>

                    <button
                      onClick={() =>
                        updateIdea(idea.id, { status: "rejected" })
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-red-500/70 hover:bg-red-500 px-4 py-2 text-sm font-semibold"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                </>)}
            </div>

          ))}
        </div>
      </div>
    </div>
  );
}
