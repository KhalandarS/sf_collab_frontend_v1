import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Copy, Instagram, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useGetPlanId from "@/utils/hooks/useGetPlanId";

export default function CrowdfundingSection() {
  const [roles, setRoles] = useState([]); // builder / founder
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("USD");
  const [totalCrowdfunding, setTotalCrowdfunding] = useState(80);
  const [planId] = useGetPlanId();
  const { access_token } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchTotalCrowdfunding = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/payments/total-crowdfunding`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
        );
        
        setTotalCrowdfunding(res?.data?.data?.total_crowdfunding / 100   || 80);
      } catch (err) {
        console.error("❌ Failed to load total crowdfunding amount", err);
      }
    };

    fetchTotalCrowdfunding();
  }, [access_token]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/payments/plans?type=crowdfunding`);
        if (res.data.length > 0) {
          const plan = res.data[0];
          setRoles(plan.roles || []);
          setCurrency(plan.currency?.toUpperCase() || "USD");
        }
      } catch (err) {
        console.error("❌ Failed to load crowdfunding plans", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency, minimumFractionDigits: 0 }).format(price);

  if (loading) {
    return (
      <section className="py-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
      </section>
    );
  }

  const activeRole = roles[activeIndex] || { tiers: [] };
  const FUNDING_GOAL = 25000; // USD goal (change anytime)

const progressPercent = Math.min(
  ((totalCrowdfunding / FUNDING_GOAL) * 100).toFixed(2),
  100
);

  return (
    <section className="relative mb-20 py-24 px-6 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="w-full px-6 md:px-40 mx-auto space-y-16">
        {/* HEADER */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Support SFCollab. <span className="text-indigo-400">Unlock the future.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Early supporters unlock permanent advantages and help shape how collaboration platforms are built.
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => {
                navigator.clipboard.writeText("support@sfcollab.com")
                toast.success("Email copied to clipboard!")
              }
              }
              className="px-6 py-2 flex gap-3 rounded-lg bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 transition"
            >
              <Copy size={22} />
              Email
            </button>
            <a
              href="https://instagram.com/sfcollab_official"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 flex gap-3 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              <Instagram size={22} className="inline-block mr-2" />
              Instagram
            </a>
          </div>
        </header>
        {/* CROWDFUNDING METER */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex justify-between text-sm text-white/70">
            <span>
              Raised{" "}
              <span className="text-white font-semibold">
                {formatPrice(totalCrowdfunding)}
              </span>
            </span>
            <span>
              Goal{" "}
              <span className="text-white font-semibold">
                {formatPrice(FUNDING_GOAL)}
              </span>
            </span>
          </div>

          {/* Progress Bar */}
          <div className="relative h-4 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(139,92,246,0.6)] transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Percentage + Hype */}
          <div className="flex justify-between items-center text-xs text-white/60">
            <span>{progressPercent}% funded</span>
            <span className="text-indigo-400 font-medium">
              Early supporters get permanent advantages 🚀
            </span>
          </div>
        </div>

        {/* ROLE TOGGLE */}
        <div className="relative mt-12 bg-neutral-900 border border-neutral-800 rounded-full flex p-1 max-w-md mx-auto">
          <div
            className="absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
            style={{ left: activeIndex === 0 ? "0%" : "50%" }}
          />
          {roles.map((role, i) => (
            <button
              key={role.role}
              onClick={() => setActiveIndex(i)}
              className={`relative z-10 w-1/2 py-3 text-sm font-semibold transition ${activeIndex === i ? "text-white" : "text-neutral-400"
                }`}
            >
              {role.role.charAt(0).toUpperCase() + role.role.slice(1)}
            </button>
          ))}
        </div>

        {/* TIERS */}
        <div className="flex flex-row items-stretch justify-center flex-wrap gap-6 mt-12">
          {activeRole.tiers.map((tier) => (
            <Link key={tier.id} to={tier.id !== planId ?`/checkout/${tier.id}?`: "#"} className="min-w-[20rem] flex-1">
              <div className="flex flex-col justify-between bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-2xl p-6 h-full">
                <div>
                  <h3 className="text-xl font-semibold mb-3">{tier.title}</h3>
                  <p className="text-4xl font-bold text-blue-400 mb-2">{formatPrice(tier.price / 100)}</p>

                  {/* Money Before Fee */}
                  {tier.money_before_fee && (
                    <p className="text-xs text-white/50 mb-4">
                      Potential earnings before platform fees: {formatPrice(tier.money_before_fee / 100)}
                    </p>
                  )}

                  {/* Features */}
                  {tier.features && (
                    <ul className="space-y-2 text-sm text-neutral-300 mb-6">
                      {tier.features.map((f, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-green-400 flex-shrink-0">✓</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {
                  tier.id === planId ? (
                    <span className="text-sm text-green-400 font-semibold mb-4">
                      ✓ Current Plan
                    </span>
                  ) :
                
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 font-semibold hover:opacity-90 transition">
                      Choose Plan <ArrowRight className="w-4 h-4 inline-block ml-2" />
                    </button>
                }
              </div>
            </Link>
          ))}
        </div>
      </div>
      {/* DISCLAIMER */}
      <div className="mt-16 max-w-3xl mx-auto bg-neutral-900/50 border border-neutral-700 rounded-xl p-6 text-sm text-neutral-300 space-y-2">
        <p>● Platform fees apply only when you earn</p>
        <p>● Crowdfunding does not guarantee work or income</p>
        <p>● Priority affects matching order, not selection outcomes</p>
        <p>● All core tools remain free for builders</p>
      </div>
    </section>
  );
}