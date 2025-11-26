import React from 'react'
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import ShinyText from '../ui/ShinyText';
import SpotlightCard from '../ui/SpotlightCard';


const PROGRESS_ITEMS = [
  {
    id: 1,
    title: "Total Tasks Completed",
    current: 92,
    total: 100,
    color: "from-emerald-500 to-green-600",
    bgColor: "bg-emerald-500/10",
    ringColor: "ring-emerald-500/20",
    textColor: "text-emerald-400",
    icon: <CheckCircle2 className="h-5 w-5" />
  },
  {
    id: 2,
    title: "Tasks On-time",
    current: 83,
    total: 100,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
    ringColor: "ring-amber-500/20",
    textColor: "text-amber-400",
    icon: <Clock className="h-5 w-5" />
  },
  {
    id: 3,
    title: "Tasks Late",
    current: 18,
    total: 100,
    color: "from-rose-500 to-red-600",
    bgColor: "bg-rose-500/10",
    ringColor: "ring-rose-500/20",
    textColor: "text-rose-400",
    icon: <AlertCircle className="h-5 w-5" />
  }
]

export default function TaskProgress() {
  const totalTasks = PROGRESS_ITEMS.reduce((sum, item) => sum + item.current, 0)
  const overallPercentage = Math.round((PROGRESS_ITEMS[0].current / PROGRESS_ITEMS[0].total) * 100)

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 ">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <ShinyText 
              text="Task Progress" 
              disabled={false} 
              speed={3} 
              className='custom-class text-2xl font-bold' 
            />
            {/* <h1 className="text-2xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Task Progress
            </h1> */}
          </div>
          <p className="text-slate-400 text-lg ml-14">Track your task completion and performance</p>
        </div>

        {/* Overview Stats Card */}
        <SpotlightCard
        spotlightColor='rgba(20, 181, 138, 0.20)'
        className="mb-6 bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-emerald-500/30 to-green-600/30"></div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 font-medium mb-2">Overall Progress</p>
                <p className="text-4xl font-bold text-white">{overallPercentage}%</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400 font-medium mb-2">Total Actions</p>
                <p className="text-2xl font-bold bg-linear-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  {totalTasks}
                </p>
              </div>
            </div>
        </SpotlightCard>

        {/* Progress Items Card */}
        <div className="bg-linear-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden shadow-2xl">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-6">Task Breakdown</h3>
            
            <div className="space-y-6">
              {PROGRESS_ITEMS.map((item) => {
                const percentage = Math.round((item.current / item.total) * 100)
                
                return (
                  <div key={item.id} className="group">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ring-1 ${item.bgColor} ${item.ringColor}`}>
                          <div className={item.textColor}>
                            {item.icon}
                          </div>
                        </div>
                        <span className="font-medium text-slate-200">{item.title}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white tabular-nums">{item.current}</span>
                        <span className="text-sm text-slate-400">of {item.total}</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden ring-1 ring-slate-700/50">
                        <div 
                          className={`h-full bg-linear-to-r ${item.color} rounded-full transition-all duration-1000 ease-out relative overflow-hidden`}
                          style={{ width: `${percentage}%` }}
                        >
                          {/* Animated shine effect */}
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                      
                      {/* Percentage Badge */}
                      <div className={`absolute right-2 -top-7 px-2 py-0.5 rounded-md text-xs font-bold ${item.bgColor} ${item.textColor} ring-1 ${item.ringColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                        {percentage}%
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer Summary */}
          <div className="border-t border-slate-700/50 p-6 bg-slate-900/30">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-slate-400 mb-1">Completed</p>
                <p className="text-lg font-bold text-emerald-400">{PROGRESS_ITEMS[0].current}</p>
              </div>
              <div className="border-x border-slate-700/50">
                <p className="text-xs text-slate-400 mb-1">On-time</p>
                <p className="text-lg font-bold text-amber-400">{PROGRESS_ITEMS[1].current}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Late</p>
                <p className="text-lg font-bold text-rose-400">{PROGRESS_ITEMS[2].current}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-linear-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg ring-1 ring-emerald-500/20">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Success Rate</p>
                <p className="text-xl font-bold text-white">{overallPercentage}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-linear-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg ring-1 ring-amber-500/20">
                <TrendingUp className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Efficiency</p>
                <p className="text-xl font-bold text-white">
                  {Math.round((PROGRESS_ITEMS[1].current / PROGRESS_ITEMS[0].current) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  )
}