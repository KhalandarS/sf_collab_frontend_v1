import { useEffect, useState } from "react";
import axios from "axios";
import { ArrowRight, Crown, Shield, Star, Loader2 } from "lucide-react";
import { API_BASE_URL } from "@/utils/config";
import { Link } from "react-router-dom";

export default function CrowdfundingSection() {
  const [tiers, setTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(null);

  /* ================= FETCH PLANS ================= */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/payments/plans?type=crowdfunding`);
        
        // Flatten tiers from all roles and add role context
        const allTiers = res.data.roles.flatMap((roleGroup) =>
          roleGroup.tiers.map((tier) => ({
            ...tier,
            role: roleGroup.role,
            highlight: tier.price > 9900,
            accent: tier.price > 49900 ? "gold" : undefined,
            crown: tier.price > 99900,
            cta: "Choose Plan",
            currency: res.data.currency?.toUpperCase() || "USD",
          }))
        );
        console.log(allTiers);
        setTiers(allTiers);
      } catch (err) {
        console.error("❌ Failed to load plans", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  /* ================= PRICE FORMAT ================= */
  const formatPrice = (price, currency) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
    }).format(price);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <section className="py-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/60" />
      </section>
    );
  }

  return (
    <section className="relative py-24 px-6 bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white">
      <div className="w-full px-6 md:px-40 mx-auto space-y-16">

        {/* ================= HEADER ================= */}
        <header className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Support SFCollab.{" "}
            <span className="text-indigo-400">Unlock the future.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
            Early supporters unlock permanent advantages and help shape how
            collaboration platforms are built.
          </p>
        </header>

        {/* ================= TIERS ================= */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {tiers.length > 0 &&
            tiers.map((tier) => (
              <div
                key={tier?.id}
                className={`relative rounded-2xl border backdrop-blur-sm p-6 flex flex-col transition-transform duration-300 hover:-translate-y-1
                  ${
                    tier?.highlight
                      ? "border-violet-400/40 bg-violet-500/10 shadow-xl"
                      : tier?.accent === "gold"
                      ? "border-yellow-500/40 bg-yellow-500/5"
                      : "border-white/10 bg-white/5"
                  }`}
              >
                {/* Badges */}
                {tier?.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-3 py-1 rounded-full bg-violet-500 text-white font-semibold shadow">
                    Most Popular
                  </span>
                )}
                {tier?.crown && (
                  <Crown className="absolute -top-3 right-3 w-5 h-5 text-yellow-400" />
                )}

                {/* Title */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">{tier?.title}</h3>
                </div>

                {/* Description */}
                <p className="text-xs text-white/50 mb-4">{tier?.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-3xl font-bold">
                    {formatPrice(tier?.price, tier?.currency || "USD")}
                  </p>
                  {tier?.note && (
                    <p className="text-xs text-white/40">{tier?.note}</p>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 text-sm text-white/70 flex-1">
                  {tier?.features.map((feature) => (
                    <li key={feature} className="flex gap-2 items-start">
                      <Star className="w-4 h-4 text-indigo-400 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Limit */}
                {tier?.limit && (
                  <p className="mt-3 text-xs text-center text-red-400 font-medium">
                    🔥 Limited: {tier?.limit} spots
                  </p>
                )}

                {/* CTA Button */}
                <Link to={`/checkout/${tier?.id}`}>
                  <button
                    disabled={checkoutLoading === tier?.id}
                    className={`mt-6 w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all
                      ${
                        tier?.highlight
                          ? "bg-violet-500 hover:bg-violet-600"
                          : tier?.accent === "gold"
                          ? "bg-yellow-500 text-black hover:opacity-90"
                          : "border border-white/20 hover:bg-white/10"
                      }
                      disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {checkoutLoading === tier?.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting…
                      </>
                    ) : (
                      <>
                        {tier?.cta}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </Link>
              </div>
            ))}
        </div>

        {/* ================= INVESTOR ================= */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-8 grid md:grid-cols-2 gap-8 transition-all hover:shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-semibold">Investor Partner</h2>
            </div>
            <p className="text-white/60 mb-4">
              For strategic partners interested in equity or revenue alignment.
            </p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Equity or revenue participation</li>
              <li>• Quarterly updates</li>
              <li>• Founder communication channel</li>
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            <button className="rounded-xl border border-white/20 py-3 font-semibold hover:bg-white/10 transition-all">
              Request Investor Deck
            </button>
            <p className="text-xs text-white/40 mt-3">
              Application-based · $1k – $50k
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
