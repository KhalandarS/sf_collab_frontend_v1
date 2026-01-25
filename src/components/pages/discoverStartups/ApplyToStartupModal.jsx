import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";
import { startupsAPI } from "@/utils/APIs/startupsAPI";
import { Briefcase, Users, Sparkles, X } from "lucide-react";

const ROLES = [
  // { value: "member", label: "Team Member" },
  { value: "builder", label: "Builder" },
  { value: "advisor", label: "Advisor" },
  { value: "investor", label: "Investor" },
  { value: "influencer", label: "Influencer" },
];

const ApplyToStartupModal = ({ isOpen, onClose, startup }) => {
  const [role, setRole] = useState("member");
  const [message, setMessage] = useState("");
  const [links, setLinks] = useState({
    portfolio: "",
    github: "",
    linkedin: "",
  });
  const [loading, setLoading] = useState(false);

  const submitApplication = async () => {
    if (!message.trim()) {
      toast.error("Tell the founder why you want to join");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        startup_id: startup.id,
        role,
        message,
        portfolio_url: links.portfolio || null,
        github_url: links.github || null,
        linkedin_url: links.linkedin || null,
      };

      const res = await startupsAPI.sendJoinRequest(startup.id, payload);

      if (res?.success || res?.data?.success) {
        toast.success("🚀 Application sent!");
        onClose();
        setMessage("");
        setLinks({ portfolio: "", github: "", linkedin: "" });
        setRole("member");
      } else {
        toast.error(res?.message || "Failed to apply");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        toast.error("You already applied to this startup");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!startup) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="
          !w-[96vw]
          !max-w-[1100px]
          h-[96vh] lg:h-auto
          bg-[#0E0F13]
          border border-white/10
          p-0
          overflow-hidden
        "
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 h-full">

          {/* LEFT / HEADER PANEL */}
          <div className="
            lg:col-span-2
            bg-gradient-to-br from-blue-600/20 to-purple-600/10
            p-5 sm:p-6
            space-y-4
          ">
            <div className="flex items-start justify-between">
              <Badge>{startup.stage}</Badge>
              <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">
                {startup.name}
              </h2>
              <p className="text-sm text-gray-400 mt-2">
                {startup.description || "Join this startup and help shape its future."}
              </p>
            </div>

            <div className="space-y-3 text-sm text-gray-300 hidden sm:block">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                {startup.industry}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" />
                {startup.team_size || "Early team"}
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                High-impact opportunity
              </div>
            </div>
          </div>

          {/* RIGHT / FORM PANEL */}
          <div className="
            lg:col-span-3
            p-5 sm:p-6
            space-y-6
            overflow-y-auto
          ">

            {/* Role selection */}
            <div>
              <h3 className="text-white font-semibold mb-3">
                Desired Role
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`
                      px-4 py-3 rounded-lg border text-sm font-medium
                      transition-all
                      ${role === r.value
                        ? "bg-blue-500/20 border-blue-500 text-blue-300"
                        : "bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500"
                      }
                    `}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="text-sm text-gray-300 mb-2 block font-semibold">
                Why do you want to join?
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Explain how you can help this startup grow..."
                className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
              />
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-3">
              <Input
                placeholder="Portfolio"
                value={links.portfolio}
                onChange={(e) => setLinks({ ...links, portfolio: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="GitHub"
                value={links.github}
                onChange={(e) => setLinks({ ...links, github: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Input
                placeholder="LinkedIn"
                value={links.linkedin}
                onChange={(e) => setLinks({ ...links, linkedin: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {/* Footer */}
            <div className="
              flex flex-col-reverse sm:flex-row
              justify-end gap-3
              pt-4 border-t border-gray-800
            ">
              <Button
                variant="outline"
                onClick={onClose}
                className="border-gray-600 text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={submitApplication}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? "Sending..." : "Apply to Startup"}
              </Button>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyToStartupModal;
