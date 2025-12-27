// src/components/pricing/InvestorPricing.jsx

const InvestorPricing = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Pricing for Investors, Advisors & Accelerators
        </h2>

        <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
          Investors don’t pay for software. They pay for deal access,
          portfolio insights, and startup governance.
        </p>

        {/* Plans */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">

          {/* Observer */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold">Observer</h3>
            <p className="mt-2 text-sm text-gray-500">Free</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Browse startups</li>
              <li>• View basic metrics</li>
              <li>• Follow founders</li>
            </ul>
          </div>

          {/* Investor Access */}
          <div className="rounded-2xl border border-purple-500 bg-purple-50 p-6">
            <h3 className="text-xl font-semibold">Investor Access</h3>
            <p className="mt-2 text-sm text-gray-700">$99 / month</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Message founders</li>
              <li>• Access KPI insights & histories</li>
              <li>• Team productivity & contribution scoring</li>
              <li>• Due diligence data rooms</li>
              <li>• Smart startup filters</li>
            </ul>
          </div>

          {/* Portfolio Master */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold">Portfolio Master</h3>
            <p className="mt-2 text-sm text-gray-700">
              $499 / month + 1% deal fee
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Multi-startup investment dashboard</li>
              <li>• Team & talent pool access</li>
              <li>• Risk scoring & AI valuation forecasting</li>
              <li>• Legal docs & contract automation</li>
              <li>• Exclusive investor badge</li>
              <li>• Access to private deal auctions</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default InvestorPricing;
