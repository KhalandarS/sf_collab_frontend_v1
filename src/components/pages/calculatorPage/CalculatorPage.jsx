import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  PieChart,
  Percent,
  Clock,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import NormalCalculator from './NormalCalculatorSection';

const CalculatorPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(localStorage.getItem("calculatorActiveTab") || "normal-calculator");
  
  useEffect(() => {
    localStorage.setItem("calculatorActiveTab", activeTab);
  }, [activeTab]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10"
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5 text-white/70 hover:text-white" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                    Calculator Suite
                  </h1>
                  <p className="text-xs text-white/50 mt-1">Professional financial calculations</p>
                </div>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-400/30 px-3 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5" />
              Tools
            </Badge>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 relative z-10">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="overflow-x-auto"
          >
            <TabsList className="inline-flex bg-white/5 backdrop-blur-xl border border-white/10 p-1.5 rounded-xl w-full justify-start sm:justify-center">
              <TabsTrigger
                value="normal-calculator"
                className="rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500/30 data-[state=active]:to-cyan-500/30 data-[state=active]:border data-[state=active]:border-blue-400/50 data-[state=active]:text-blue-100 text-white/70 hover:text-white/90"
              >
                <Calculator className="w-4 h-4 mr-2" />
                <span>Basic Calculator</span>
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="normal-calculator" className="space-y-6 mt-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <NormalCalculator />
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Future Calculators Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-400/20 backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-blue-500/20 rounded-lg border border-blue-400/30 flex-shrink-0">
              <TrendingUp className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white mb-2">More Tools Coming Soon</h3>
              <p className="text-sm text-white/70">
                Burn Rate, Runway, Valuation, Equity Dilution, CAC/LTV, Break Even, ROI, and MRR/ARR calculators will be available soon.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CalculatorPage;
