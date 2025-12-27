import { useState } from 'react';
import { Mail, Zap, Star, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import Footer from "../landing-page/Footer";
import NavBar from "../sections/NavBar";
import SideBar from '../sections/sidebar/SideBar';

export default function Waitlist() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [joined, setJoined] = useState(false);

  const handleJoinWaitlist = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setJoined(true);
        setEmail('');
        toast.success('Welcome to the waitlist!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to join waitlist');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <SideBar />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-gray-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
              <span className="text-blue-300 text-sm font-semibold">🚀 EARLY ACCESS</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Be the First to Experience the Future
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
              Join our exclusive waitlist and get early access to cutting-edge features before anyone else
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Zap, title: 'Early Access', desc: 'Be among the first to try new features' },
              { icon: Star, title: 'Exclusive Perks', desc: 'Special rewards and bonuses for early members' },
              { icon: Users, title: 'VIP Community', desc: 'Join an elite group of innovators' }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
                  <Icon className="w-10 h-10 text-blue-400 mb-3" />
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Main Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl shadow-2xl p-10 mb-12">
            {!joined ? (
              <>
                <h2 className="text-3xl font-bold mb-6">Join the Waitlist</h2>
                <form onSubmit={handleJoinWaitlist} className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="flex-1 px-6 py-4 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2 whitespace-nowrap justify-center"
                    >
                      {loading ? 'Joining...' : (
                        <>
                          Join Now
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-400">✓ No spam, unsubscribe anytime</p>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">You're In!</h3>
                <p className="text-gray-300 mb-4">Check your email for exclusive early access details</p>
                <button
                  onClick={() => setJoined(false)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Invite Another Email
                </button>
              </div>
            )}
          </div>

          {/* Benefits List */}
          <div className="grid md:grid-cols-2 gap-6">
            {[
              'Priority access to new features',
              'Lifetime beta tester badge',
              'Direct feedback channel with team',
              'Exclusive Discord community',
              'Special founding member pricing',
              'Monthly feature previews'
            ].map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-800/30 p-4 rounded-lg border border-gray-700/50">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-200">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </>
  );
}