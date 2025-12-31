import { Link } from 'react-router-dom'
import { WaitlistSignup } from './components/WaitlistSignup'
import { Toaster } from './components/ui/toaster'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Button } from './components/ui/button'
import { Sparkles, Users, Gift, ArrowRight, User } from 'lucide-react'
import { useSelector } from 'react-redux'

export default function Waitlist() {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="bg-neutral-950 w-full h-full text-white relative min-h-screen overflow-y-auto">
      {/* Floating blobs background */}
      <div className="absolute inset-0 -z-10">
    
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-600/20 to-purple-700/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4 animate-bounce-in">
            <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Waitlist Program
            </h1>
          </div>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            Join early and earn rewards! Get free months through the waitlist.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <WaitlistSignup />
        </div>

        <div className="my-12 max-w-2xl mx-auto">
          <div className="rounded-2xl bg-neutral-900 border border-neutral-800 backdrop-blur-sm p-6 hover:border-neutral-700 transition-all duration-300">
            <div className="z-10">
              <div className="mb-6">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-white mb-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  Waitlist System
                </h3>
                <p className="text-neutral-400 text-sm">
                  Early access before Feb 1st
                </p>
              </div>

              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-center gap-3">
                  <span className="text-blue-400 font-bold">✓</span>
                  <span className="text-neutral-300">First 1,000 by Jan 10th = <span className="font-semibold text-blue-300">3 months free</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-purple-400 font-bold">✓</span>
                  <span className="text-neutral-300">First 2,500 by Feb 7th = <span className="font-semibold text-purple-300">1 month free</span></span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-pink-400 font-bold">✓</span>
                  <span className="text-neutral-300"><span className="font-semibold text-pink-300">Limited time</span> offer</span>
                </li>
              </ul>
              {user.role === 'admin' && (
                <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
                  {/* <Link to="/refer" className="w-full">
                  <Button className="w-full group bg-purple-600/80 hover:bg-purple-700 text-white border border-purple-400/50 hover:border-purple-300">
                    <Gift className="h-4 w-4 mr-2 transition-transform duration-300 group-hover:rotate-12" />
                    Check Out Referral Program
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </Link> */}
                
                  <Link to="/admin" className="w-full">
                    <Button className="w-full bg-blue-600/80 hover:bg-blue-700 text-white border border-blue-400/50 hover:border-blue-300">
                      Admin Dashboard
                    </Button>
                  </Link>
                
                </div>)}
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full -translate-x-12 translate-y-12"></div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
