// src/components/pricing/EquityAccess.jsx

const EquityAccess = () => {
  return (
    <section className="py-24 bg-gray-900 text-white">
      <div className="mx-auto max-w-6xl px-4">
        
        {/* Header */}
        <h2 className="text-4xl font-bold text-center">
          Equity Access — $0/month
        </h2>

        <p className="mt-4 text-center text-gray-300 max-w-3xl mx-auto">
          Build under SF and give equity instead of paying monthly.
          This option is designed for founders with strong ideas but limited capital.
        </p>

        {/* What you get */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold mb-4">What You Get</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Unlimited usage across all tools</li>
              <li>• Unlimited SFManagers seats</li>
              <li>• Complete AI suite</li>
              <li>• Hiring, payments, legal & contracts</li>
              <li>• Team execution, dashboards & KPIs</li>
              <li>• Investor access & portfolio guidance</li>
            </ul>
          </div>

          {/* Equity details */}
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Equity Terms
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Equity range: 5% – 20% (based on startup stage)</li>
              <li>• Final percentage negotiated after evaluation</li>
              <li>• Equity cannot be diluted below 50% of original grant</li>
              <li>• Startup retains full IP (SF co-protects it)</li>
              <li>• Buyback clause available if leaving the ecosystem</li>
              <li>• No switching back to free plan after acceptance</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EquityAccess;
