import { Link } from "react-router-dom";
import { WaitlistSignup } from "./components/WaitlistSignup";
import { Toaster } from "./components/ui/toaster";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const POINT_VALUES = {
  referral: { points: 5, multiplier: 2, label: "Referral" },
  small_contribution: { points: 5, label: "Small Contribution" },
  contribution: { points: 10, label: "Contribution" },
  large_contribution: { points: 20, label: "Large Contribution" },
  // activity: { points: 1, label: "Activity" },
  new_startup: { points: 30, label: "New Startup" },
};

export default function Waitlist() {
  const { user } = useSelector((state) => state.auth);
  
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="bg-neutral-950 w-full h-full text-white relative min-h-screen overflow-y-auto">
      {/* Floating blobs background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-linear-to-r from-blue-600/20 to-purple-700/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-linear-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        <div className="text-center mb-12 animate-fade-in-down">
          <div className="flex items-center justify-center gap-2 mb-4 animate-bounce-in">
            <Sparkles className="h-8 w-8 text-blue-400 animate-pulse" />
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
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
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-2xl bg-neutral-900 border border-neutral-800 backdrop-blur-sm p-6 hover:border-neutral-700 transition-all duration-300"
          >
            <div className="z-10">
              <div className="mb-6">
                <motion.h3
                  variants={itemVariants}
                  className="text-xl font-semibold flex items-center gap-2 text-white mb-2"
                >
                  <Users className="h-5 w-5 text-blue-400" />
                  Waitlist System
                </motion.h3>
                <p className="text-neutral-400 text-sm">
                  Early access before Feb 7th
                </p>
              </div>

              <ul className="space-y-3 text-sm mb-6">
                <motion.li
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <span className="text-blue-400 font-bold">✓</span>
                  <span className="text-white/80">
                    First 1,000 by Jan 10th ={" "}
                    <span className="font-semibold text-blue-300">
                      3 months free
                    </span>
                  </span>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <span className="text-purple-400 font-bold">✓</span>
                  <span className="text-white/80">
                    First 2,500 by Feb 2nd ={" "}
                    <span className="font-semibold text-purple-300">
                      1 month free
                    </span>
                  </span>
                </motion.li>
                <motion.li
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <span className="text-pink-400 font-bold">✓</span>
                  <span className="text-white/80">
                    <span className="font-semibold text-pink-300">
                      Limited time
                    </span>{" "}
                    offer
                  </span>
                </motion.li>
              </ul>

              {/* Points Info Section */}
              <div className="mb-6 p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
                <motion.h4
                  variants={itemVariants}
                  className="text-sm font-semibold text-white mb-3"
                >
                  How to Earn Points
                </motion.h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(POINT_VALUES).map(([key, { points, label }]) => (
                    <motion.div key={key} variants={itemVariants} className="flex justify-between">
                      <span className="text-neutral-400">{label}:</span>
                      <span className="text-blue-300 font-semibold">{points}pts</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                {user?.role === "admin" && (
                  <div className="pt-4 border-t border-neutral-800 flex flex-col gap-2">
                    <Link to="/admin" className="w-full">
                      <motion.div variants={itemVariants}>
                        <Button className="w-full bg-blue-600/80 hover:bg-blue-700 text-white border border-blue-400/50 hover:border-blue-300">
                          Admin Dashboard
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full -translate-x-12 translate-y-12"></div>
          </motion.div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
