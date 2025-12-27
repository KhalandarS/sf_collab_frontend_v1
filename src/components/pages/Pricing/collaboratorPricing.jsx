// src/components/pricing/CollaboratorPricing.jsx

const CollaboratorPricing = () => {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-gray-900 text-center">
          Pricing for Collaborators (Talent)
        </h2>

        <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
          Collaborators don’t pay for ideas; they pay for the ability to earn,
          get hired, and build a professional career.
        </p>

        {/* Plans */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          
          {/* Explorer */}
          <div className="rounded-2xl border border-gray-200 p-6 bg-white">
            <h3 className="text-xl font-semibold">Explorer</h3>
            <p className="mt-2 text-sm text-gray-500">Free</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• 10 minutes/day full access</li>
              <li>• Join 1 startup</li>
              <li>• Earn CP (withdraw disabled)</li>
              <li>• Full AI tools (time-limited)</li>
              <li>• Watermark on exports</li>
              <li>• No recruitment board access</li>
            </ul>
          </div>

          {/* Pro Collaborator */}
          <div className="rounded-2xl border border-purple-500 p-6 bg-purple-50">
            <h3 className="text-xl font-semibold">Pro Collaborator</h3>
            <p className="mt-2 text-sm text-gray-700">$9.99 / month</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• 2 hours/day full access</li>
              <li>• Withdraw earnings</li>
              <li>• Full chat + video upload</li>
              <li>• Recruitment visibility boost</li>
              <li>• Join unlimited startups</li>
              <li>• Eligible for artifacts & rewards</li>
            </ul>
          </div>

          {/* Elite Contributor */}
          <div className="rounded-2xl border border-gray-200 p-6 bg-white">
            <h3 className="text-xl font-semibold">Elite Contributor</h3>
            <p className="mt-2 text-sm text-gray-700">$19.99 / month</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Unlimited access</li>
              <li>• Top ranking in recruitment</li>
              <li>• AI career advisor</li>
              <li>• Auto-generated CV from portfolio</li>
              <li>• Reduced payout fee (3%)</li>
              <li>• Exclusive artifact drops & badges</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CollaboratorPricing;
