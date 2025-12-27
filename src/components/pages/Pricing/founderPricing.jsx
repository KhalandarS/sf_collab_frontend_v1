// src/components/pricing/FounderPricing.jsx

const FounderPricing = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Pricing for Startups & Founders
        </h2>

        <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
          Founders don’t pay for access to tools. They pay for team execution,
          smart AI infrastructure, and professional scaling.
        </p>

        {/* Plans */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">

          {/* Startup Lite */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold">Startup Lite</h3>
            <p className="mt-2 text-sm text-gray-500">Free</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• 30 minutes/day</li>
              <li>• Up to 3 contributors</li>
              <li>• Basic startup page</li>
              <li>• Manual payouts only</li>
              <li>• AI tools restricted to weekly limits</li>
              <li>• No investor visibility</li>
            </ul>
          </div>

          {/* Founder Pro */}
          <div className="rounded-2xl border border-purple-500 bg-purple-50 p-6">
            <h3 className="text-xl font-semibold">Founder Pro</h3>
            <p className="mt-2 text-sm text-gray-700">$79 / month</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Unlimited creation & AI tools</li>
              <li>• Unlimited team invites (SFM seats billed separately)</li>
              <li>• Full AI Startup Suite (Pitch, Branding, Plan, Roadmap)</li>
              <li>• Smart talent matching & hiring</li>
              <li>• Legal onboarding + role agreements</li>
              <li>• Includes 3 SFManagers execution seats</li>
            </ul>
          </div>

          {/* Scale Founder */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="text-xl font-semibold">Scale Founder</h3>
            <p className="mt-2 text-sm text-gray-700">$499 / month</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Unlimited access + priority</li>
              <li>• Advanced KPI dashboards & forecasting</li>
              <li>• Funding & investor tools</li>
              <li>• Contract vault + legal automation</li>
              <li>• Full dev integrations (GitHub, CRM, Analytics)</li>
              <li>• Includes 10 SFManagers seats</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FounderPricing;
