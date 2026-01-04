import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function InfluencerApplicationForm() { 
  const [loading, setLoading] = useState(false);
  const [agreement, setAgreement] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    platform: "",
    profileLink: "",
    followers: "",
    niche: "",
    contribution: "",
    audienceFit: "",
    earlyPartner: "",
    agreement: false,
  });
    const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      if (!agreement) {
        toast.error("You must accept the agreement to continue.");
        return;
      }
      setLoading(true);
      if (!form.name || !form.email || !form.platform || !form.profileLink || !form.followers || !form.niche || !form.contribution || !form.earlyPartner) {
        toast.error("Please fill in all required fields.");
        setLoading(false);
        return;
      }

      try {
        await fetch("/api/influencer/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
  
        toast.success("Application submitted successfully!");
        setForm({
          name: "",
          email: "",
          platform: "",
          profileLink: "",
          followers: "",
          niche: "",
          contribution: "",
          audienceFit: "",
          earlyPartner: "",
          agreement: false,
        });
      } catch (err) {
        toast.error("Failed to submit application. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
  return (
    <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl shadow-2xl">
            <CardContent className="pt-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-blue-400 to-purple-400 rounded" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Name / Brand *</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Email *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Main Platform *</Label>
                      <Input
                        placeholder="TikTok, YouTube, X, LinkedIn..."
                        value={form.platform}
                        onChange={(e) => update("platform", e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Profile Link *</Label>
                      <Input
                        type="url"
                        value={form.profileLink}
                        onChange={(e) => update("profileLink", e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>
                </motion.section>

                {/* Audience */}
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-pink-400 rounded" />
                    Audience
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Followers / Subscribers *</Label>
                      <Input
                        type="number"
                        value={form.followers}
                        onChange={(e) => update("followers", e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-300">Niche *</Label>
                      <Input
                        placeholder="Tech, Education, Finance..."
                        value={form.niche}
                        onChange={(e) => update("niche", e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400"
                        required
                      />
                    </div>
                  </div>
                </motion.section>

                {/* Contribution */}
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-pink-400 to-orange-400 rounded" />
                    Contribution
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-slate-300">How would you help co-build SF? *</Label>
                    <Textarea
                      rows={4}
                      value={form.contribution}
                      onChange={(e) => update("contribution", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Why is your audience a good fit?</Label>
                    <Textarea
                      rows={3}
                      value={form.audienceFit}
                      onChange={(e) => update("audienceFit", e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-400 resize-none"
                    />
                  </div>
                </motion.section>

                {/* Partnership */}
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-orange-400 to-red-400 rounded" />
                    Partnership
                  </h3>

                  <div className="space-y-2">
                    <Label className="text-slate-300">
                      Open to early-stage partnership with delayed compensation? *
                    </Label>
                    <Select onValueChange={(v) => update("earlyPartner", v)} required>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.section>

                {/* Agreement */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3 p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg"
                >
                  <input type="checkbox" className="" id="agreement"
                    onChange={() => setAgreement(!agreement)} checked={agreement}
                  />
                  <label
                    htmlFor="agreement"
                    className="text-sm text-slate-300 leading-relaxed cursor-pointer"
                  >
                    I understand this is a selective application and acceptance is not guaranteed. I commit to actively contributing to the SForger ecosystem.
                  </label>
                
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-6 text-lg rounded-xl transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
      </Card>
      </motion.div>
  )
}