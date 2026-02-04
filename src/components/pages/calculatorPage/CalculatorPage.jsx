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
  ArrowLeft
} from 'lucide-react';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS
import NormalCalculator from './NormalCalculatorSection';


const CalculatorPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(localStorage.getItem("calculatorActiveTab") || "normal-calculator");
  useEffect(() => {
    localStorage.setItem("calculatorActiveTab", activeTab);
  }, [activeTab]);

  // Normal Calculator State
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  const calculate = () => {
    try {
      // Evaluate the expression using Function constructor
      const evalResult = new Function(`'use strict'; return (${expression})`)();
      setResult(evalResult);
    } catch (error) {
      setResult('Error');
    }
  };
  // Burn Rate Calculator
  const [burnRate, setBurnRate] = useState({
    monthlyExpenses: 50000,
    currentRunway: 300000
  });

  // Valuation Calculator
  const [valuation, setValuation] = useState({
    revenue: 100000,
    growthRate: 25,
    margin: 30,
    multiples: 10
  });

  // Equity/Dilution Calculator
  const [equity, setEquity] = useState({
    totalShares: 1000000,
    investmentAmount: 500000,
    postMoneyValuation: 5000000
  });

  // CAC/LTV Calculator
  const [metrics, setMetrics] = useState({
    customerAcquisitionCost: 500,
    averageRevenue: 10000,
    grossMargin: 70,
    churnRate: 5
  });

  // Break Even Calculator
  const [breakeven, setBreakeven] = useState({
    fixedCosts: 100000,
    unitPrice: 100,
    variableCost: 30
  });

  // Runway Projection
  const [runway, setRunway] = useState({
    currentCash: 500000,
    monthlyBurn: 50000,
    monthlyRevenue: 20000
  });

  // ROI Calculator
  const [roi, setRoi] = useState({
    initialInvestment: 100000,
    finalValue: 150000,
    timeFrame: 12
  });

  // MRR/ARR Calculator
  const [mrr, setMrr] = useState({
    activeSubscriptions: 150,
    monthlySubscriptionPrice: 99,
    oneTimeRevenue: 5000
  });

  // CALCULATIONS
  const burnRateCalc = useMemo(() => {
    const monthlyBurn = burnRate.monthlyExpenses;
    const runwayMonths = burnRate.monthlyExpenses > 0 ? burnRate.currentRunway / monthlyBurn : 0;
    return {
      monthlyBurn,
      runwayMonths: runwayMonths.toFixed(1),
      runoutDate: new Date(Date.now() + runwayMonths * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
  }, [burnRate]);

  const valuationCalc = useMemo(() => {
    const annualRevenue = valuation.revenue * 12;
    const projectedRevenue = annualRevenue * (1 + valuation.growthRate / 100);
    const enterpriseValue = projectedRevenue * (valuation.multiples / 100);
    return {
      annualRevenue: annualRevenue.toFixed(0),
      projectedRevenue: projectedRevenue.toFixed(0),
      enterpriseValue: enterpriseValue.toFixed(0),
      valuation: (enterpriseValue * (valuation.margin / 100)).toFixed(0)
    };
  }, [valuation]);

  const equityCalc = useMemo(() => {
    const newShares = (equity.investmentAmount / equity.postMoneyValuation) * equity.totalShares;
    const newTotalShares = equity.totalShares + newShares;
    const dilution = ((newShares / newTotalShares) * 100).toFixed(2);
    const pricePerShare = (equity.postMoneyValuation / newTotalShares).toFixed(4);
    return {
      newShares: newShares.toFixed(0),
      newTotalShares: newTotalShares.toFixed(0),
      dilution,
      pricePerShare,
      ownershipBefore: ((equity.totalShares / newTotalShares) * 100).toFixed(2)
    };
  }, [equity]);

  const metricsCalc = useMemo(() => {
    const ltv = (metrics.averageRevenue * (metrics.grossMargin / 100)) / (metrics.churnRate / 100);
    const ratio = ltv / metrics.customerAcquisitionCost;
    return {
      ltv: ltv.toFixed(0),
      ratio: ratio.toFixed(2),
      paybackMonths: ((metrics.customerAcquisitionCost / (metrics.averageRevenue * (metrics.grossMargin / 100))) * 12).toFixed(1)
    };
  }, [metrics]);

  const breakevenCalc = useMemo(() => {
    const contribution = breakeven.unitPrice - breakeven.variableCost;
    const units = contribution > 0 ? breakeven.fixedCosts / contribution : 0;
    const revenue = units * breakeven.unitPrice;
    return {
      unitsToBreakeven: units.toFixed(0),
      revenueToBreakeven: revenue.toFixed(0),
      contributionMargin: ((contribution / breakeven.unitPrice) * 100).toFixed(2)
    };
  }, [breakeven]);

  const runwayCalc = useMemo(() => {
    const netBurn = runway.monthlyBurn - runway.monthlyRevenue;
    const months = netBurn > 0 ? runway.currentCash / netBurn : 999;
    return {
      netMontlyBurn: netBurn.toFixed(0),
      runwayMonths: months.toFixed(1),
      runoutDate: new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
  }, [runway]);

  const roiCalc = useMemo(() => {
    const gain = roi.finalValue - roi.initialInvestment;
    const percentage = ((gain / roi.initialInvestment) * 100).toFixed(2);
    const annualROI = (percentage / (roi.timeFrame / 12)).toFixed(2);
    return {
      gain: gain.toFixed(0),
      percentage,
      annualROI
    };
  }, [roi]);

  const mrrCalc = useMemo(() => {
    const mrr_value = (metrics.activeSubscriptions * metrics.monthlySubscriptionPrice) + metrics.oneTimeRevenue;
    const arr = mrr_value * 12;
    return {
      mrr: mrr_value.toFixed(0),
      arr: arr.toFixed(0),
      avgRevenuePerUser: (mrr_value / metrics.activeSubscriptions).toFixed(2)
    };
  }, [metrics, mrr]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 backdrop-blur-md border-b border-gray-700/50"
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  SFCollab Calculator Suite
                </h1>
              </div>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
              Financial Tools
            </Badge>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-x-auto"
          >
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-9 gap-2 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm">
              {[
                { value: 'normal-calculator', label: 'Calculator', icon: Calculator }, // New tab for normal calculator

                { value: 'burn-rate', label: 'Burn Rate', icon: TrendingUp },
                { value: 'runway', label: 'Runway', icon: Clock },
                { value: 'valuation', label: 'Valuation', icon: DollarSign },
                { value: 'equity', label: 'Equity', icon: Percent },
                { value: 'metrics', label: 'CAC/LTV', icon: BarChart3 },
                { value: 'breakeven', label: 'Break Even', icon: Target },
                { value: 'roi', label: 'ROI', icon: TrendingUp },
                { value: 'mrr', label: 'MRR/ARR', icon: PieChart }
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white text-white"
                >
                  <tab.icon className="w-3 h-3 mr-1" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>
          <TabsContent value="normal-calculator" className="space-y-6">
            <NormalCalculator />
          </TabsContent>
          {/* Burn Rate Calculator */}
          <TabsContent value="burn-rate" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Monthly Expenses</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Monthly Expenses ($)</label>
                        <Input
                          type="number"
                          value={burnRate.monthlyExpenses}
                          onChange={(e) => setBurnRate({ ...burnRate, monthlyExpenses: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Current Runway ($)</label>
                        <Input
                          type="number"
                          value={burnRate.currentRunway}
                          onChange={(e) => setBurnRate({ ...burnRate, currentRunway: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border-blue-700/50">
                    <CardHeader>
                      <CardTitle className="text-blue-300">Burn Rate Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Monthly Burn</p>
                        <p className="text-3xl font-bold text-blue-300">${burnRateCalc.monthlyBurn.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Runway</p>
                        <p className="text-3xl font-bold text-cyan-300">{burnRateCalc.runwayMonths} months</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Runout Date</p>
                        <p className="text-lg font-semibold text-yellow-300">{burnRateCalc.runoutDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Runway Calculator */}
          <TabsContent value="runway" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Runway Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Current Cash ($)</label>
                        <Input
                          type="number"
                          value={runway.currentCash}
                          onChange={(e) => setRunway({ ...runway, currentCash: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Monthly Burn ($)</label>
                        <Input
                          type="number"
                          value={runway.monthlyBurn}
                          onChange={(e) => setRunway({ ...runway, monthlyBurn: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Monthly Revenue ($)</label>
                        <Input
                          type="number"
                          value={runway.monthlyRevenue}
                          onChange={(e) => setRunway({ ...runway, monthlyRevenue: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-700/50">
                    <CardHeader>
                      <CardTitle className="text-green-300">Runway Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Net Monthly Burn</p>
                        <p className="text-3xl font-bold text-green-300">${runwayCalc.netMontlyBurn.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Runway</p>
                        <p className="text-3xl font-bold text-emerald-300">{runwayCalc.runwayMonths} months</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Expected Runout</p>
                        <p className="text-lg font-semibold text-orange-300">{runwayCalc.runoutDate}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Valuation Calculator */}
          <TabsContent value="valuation" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Valuation Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Monthly Revenue ($)</label>
                        <Input
                          type="number"
                          value={valuation.revenue}
                          onChange={(e) => setValuation({ ...valuation, revenue: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Growth Rate (%)</label>
                        <Input
                          type="number"
                          value={valuation.growthRate}
                          onChange={(e) => setValuation({ ...valuation, growthRate: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Profit Margin (%)</label>
                        <Input
                          type="number"
                          value={valuation.margin}
                          onChange={(e) => setValuation({ ...valuation, margin: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Revenue Multiples</label>
                        <Input
                          type="number"
                          value={valuation.multiples}
                          onChange={(e) => setValuation({ ...valuation, multiples: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-700/50">
                    <CardHeader>
                      <CardTitle className="text-purple-300">Valuation Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Annual Revenue</p>
                        <p className="text-2xl font-bold text-purple-300">${parseFloat(valuationCalc.annualRevenue).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Projected Revenue (12m)</p>
                        <p className="text-2xl font-bold text-pink-300">${parseFloat(valuationCalc.projectedRevenue).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Enterprise Value</p>
                        <p className="text-3xl font-bold text-purple-400">${parseFloat(valuationCalc.enterpriseValue).toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Equity/Dilution Calculator */}
          <TabsContent value="equity" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Investment Round</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Total Shares Outstanding</label>
                        <Input
                          type="number"
                          value={equity.totalShares}
                          onChange={(e) => setEquity({ ...equity, totalShares: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Investment Amount ($)</label>
                        <Input
                          type="number"
                          value={equity.investmentAmount}
                          onChange={(e) => setEquity({ ...equity, investmentAmount: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Post-Money Valuation ($)</label>
                        <Input
                          type="number"
                          value={equity.postMoneyValuation}
                          onChange={(e) => setEquity({ ...equity, postMoneyValuation: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-700/50">
                    <CardHeader>
                      <CardTitle className="text-orange-300">Dilution Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">New Shares Issued</p>
                        <p className="text-2xl font-bold text-orange-300">{parseFloat(equityCalc.newShares).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Investor Dilution</p>
                        <p className="text-3xl font-bold text-red-300">{equityCalc.dilution}%</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Price Per Share</p>
                        <p className="text-2xl font-bold text-orange-300">${equityCalc.pricePerShare}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Your Ownership After</p>
                        <p className="text-2xl font-bold text-yellow-300">{equityCalc.ownershipBefore}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* CAC/LTV Calculator */}
          <TabsContent value="metrics" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Unit Economics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Customer Acquisition Cost ($)</label>
                        <Input
                          type="number"
                          value={metrics.customerAcquisitionCost}
                          onChange={(e) => setMetrics({ ...metrics, customerAcquisitionCost: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Avg Customer Revenue ($)</label>
                        <Input
                          type="number"
                          value={metrics.averageRevenue}
                          onChange={(e) => setMetrics({ ...metrics, averageRevenue: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Gross Margin (%)</label>
                        <Input
                          type="number"
                          value={metrics.grossMargin}
                          onChange={(e) => setMetrics({ ...metrics, grossMargin: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Monthly Churn Rate (%)</label>
                        <Input
                          type="number"
                          value={metrics.churnRate}
                          onChange={(e) => setMetrics({ ...metrics, churnRate: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-teal-900/40 to-cyan-900/40 border-teal-700/50">
                    <CardHeader>
                      <CardTitle className="text-teal-300">Metrics Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Customer Lifetime Value</p>
                        <p className="text-3xl font-bold text-teal-300">${metricsCalc.ltv.toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">LTV:CAC Ratio</p>
                        <p className={`text-3xl font-bold ${parseFloat(metricsCalc.ratio) > 3 ? 'text-green-300' : 'text-yellow-300'}`}>
                          {metricsCalc.ratio}:1
                        </p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Payback Period</p>
                        <p className="text-2xl font-bold text-cyan-300">{metricsCalc.paybackMonths} months</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* Break Even Calculator */}
          <TabsContent value="breakeven" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Break Even Inputs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Fixed Costs ($)</label>
                        <Input
                          type="number"
                          value={breakeven.fixedCosts}
                          onChange={(e) => setBreakeven({ ...breakeven, fixedCosts: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Unit Price ($)</label>
                        <Input
                          type="number"
                          value={breakeven.unitPrice}
                          onChange={(e) => setBreakeven({ ...breakeven, unitPrice: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Variable Cost ($)</label>
                        <Input
                          type="number"
                          value={breakeven.variableCost}
                          onChange={(e) => setBreakeven({ ...breakeven, variableCost: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border-indigo-700/50">
                    <CardHeader>
                      <CardTitle className="text-indigo-300">Break Even Point</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Units to Break Even</p>
                        <p className="text-3xl font-bold text-indigo-300">{parseFloat(breakevenCalc.unitsToBreakeven).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Revenue at Break Even</p>
                        <p className="text-3xl font-bold text-blue-300">${parseFloat(breakevenCalc.revenueToBreakeven).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Contribution Margin</p>
                        <p className="text-2xl font-bold text-indigo-400">{breakevenCalc.contributionMargin}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* ROI Calculator */}
          <TabsContent value="roi" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Investment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Initial Investment ($)</label>
                        <Input
                          type="number"
                          value={roi.initialInvestment}
                          onChange={(e) => setRoi({ ...roi, initialInvestment: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Final Value ($)</label>
                        <Input
                          type="number"
                          value={roi.finalValue}
                          onChange={(e) => setRoi({ ...roi, finalValue: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Time Frame (months)</label>
                        <Input
                          type="number"
                          value={roi.timeFrame}
                          onChange={(e) => setRoi({ ...roi, timeFrame: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-700/50">
                    <CardHeader>
                      <CardTitle className="text-green-300">ROI Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Total Gain</p>
                        <p className="text-3xl font-bold text-green-300">${parseFloat(roiCalc.gain).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">ROI (Total)</p>
                        <p className="text-3xl font-bold text-emerald-300">{roiCalc.percentage}%</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Annualized ROI</p>
                        <p className="text-2xl font-bold text-green-400">{roiCalc.annualROI}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>

          {/* MRR/ARR Calculator */}
          <TabsContent value="mrr" className="space-y-6">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={itemVariants}>
                  <Card className="bg-gray-800 border-gray-700 text-white">
                    <CardHeader>
                      <CardTitle>Subscription Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Active Subscriptions</label>
                        <Input
                          type="number"
                          value={mrr.activeSubscriptions}
                          onChange={(e) => setMrr({ ...mrr, activeSubscriptions: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Monthly Subscription Price ($)</label>
                        <Input
                          type="number"
                          value={mrr.monthlySubscriptionPrice}
                          onChange={(e) => setMrr({ ...mrr, monthlySubscriptionPrice: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">One-Time Revenue ($)</label>
                        <Input
                          type="number"
                          value={mrr.oneTimeRevenue}
                          onChange={(e) => setMrr({ ...mrr, oneTimeRevenue: parseFloat(e.target.value) })}
                          className="mt-2 bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="bg-gradient-to-br from-rose-900/40 to-pink-900/40 border-rose-700/50">
                    <CardHeader>
                      <CardTitle className="text-rose-300">Revenue Results</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Monthly Recurring Revenue</p>
                        <p className="text-3xl font-bold text-rose-300">${parseFloat(mrrCalc.mrr).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">Annual Recurring Revenue</p>
                        <p className="text-3xl font-bold text-pink-300">${parseFloat(mrrCalc.arr).toLocaleString()}</p>
                      </div>
                      <div className="p-4 bg-black/30 rounded-lg">
                        <p className="text-sm text-gray-400">ARPU</p>
                        <p className="text-2xl font-bold text-rose-400">${mrrCalc.avgRevenuePerUser}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CalculatorPage;