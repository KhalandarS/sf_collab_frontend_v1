import React, { useMemo } from 'react'
import { Users, Target, TrendingUp, Globe, Clock, Zap, BarChart3 } from 'lucide-react'
import { GiAchievement } from "react-icons/gi"
import SpotlightCard from '../ui/SpotlightCard'


const DashboardSection = ({ searchQuery = '' }) => {
  const dashboardCards = [
    {
      id: 1,
      title: 'Team Performance',
      value: '92%',
      change: '+5%',
      icon: <Users className="h-6 w-6 text-blue-400" />,
      metrics: [
        { label: 'Active Members', value: '12' },
        { label: 'Tasks Completed', value: '45' },
        { label: 'Productivity', value: 'High' }
      ],
      color: "rgba(59, 130, 246, 0.15)",
      gradient: "from-blue-500/30 to-blue-600/30",
      accentColor: "blue"
    },
    {
      id: 2,
      title: 'Project Goals',
      value: '78%',
      change: '+12%',
      icon: <Target className="h-6 w-6 text-emerald-400" />,
      metrics: [
        { label: 'Milestones', value: '8/10' },
        { label: 'On Track', value: 'Yes' },
        { label: 'Next Goal', value: 'MVP Launch' }
      ],
      color: "rgba(16, 185, 129, 0.15)",
      gradient: "from-emerald-500/30 to-emerald-600/30",
      accentColor: "emerald"
    },
    {
      id: 3,
      title: 'Growth Metrics',
      value: '156%',
      change: '+23%',
      icon: <TrendingUp className="h-6 w-6 text-amber-400" />,
      metrics: [
        { label: 'User Growth', value: '+45%' },
        { label: 'Revenue', value: '$45K' },
        { label: 'Market Share', value: '12%' }
      ],
      color: "rgba(245, 158, 11, 0.15)",
      gradient: "from-amber-500/30 to-amber-600/30",
      accentColor: "amber"
    },
    {
      id: 4,
      title: 'Achievements',
      value: '15',
      change: 'New',
      icon: <GiAchievement className="h-7 w-7 text-purple-400" />,
      metrics: [
        { label: 'This Month', value: '3' },
        { label: 'Total', value: '15' },
        { label: 'Next Target', value: '20' }
      ],
      color: "rgba(168, 85, 247, 0.15)",
      gradient: "from-purple-500/30 to-purple-600/30",
      accentColor: "purple"
    }
  ]

  const filteredCards = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return dashboardCards
    return dashboardCards.filter(card => {
      const inTitle = card.title.toLowerCase().includes(q)
      const inValue = String(card.value).toLowerCase().includes(q)
      const inChange = String(card.change).toLowerCase().includes(q)
      const inMetrics = card.metrics?.some(m => (
        String(m.label).toLowerCase().includes(q) ||
        String(m.value).toLowerCase().includes(q)
      ))
      return inTitle || inValue || inChange || inMetrics
    })
  }, [searchQuery, dashboardCards])

  const getAccentClasses = (color) => {
    const colors = {
      blue: {
        badge: 'bg-blue-500/10 text-blue-400 ring-blue-500/20',
        iconBg: 'bg-blue-500/10 ring-blue-500/20',
        border: 'border-blue-500/20 hover:border-blue-500/40'
      },
      emerald: {
        badge: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
        iconBg: 'bg-emerald-500/10 ring-emerald-500/20',
        border: 'border-emerald-500/20 hover:border-emerald-500/40'
      },
      amber: {
        badge: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
        iconBg: 'bg-amber-500/10 ring-amber-500/20',
        border: 'border-amber-500/20 hover:border-amber-500/40'
      },
      purple: {
        badge: 'bg-purple-500/10 text-purple-400 ring-purple-500/20',
        iconBg: 'bg-purple-500/10 ring-purple-500/20',
        border: 'border-purple-500/20 hover:border-purple-500/40'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className=" p-8">
      <div className="w-full mx-auto">


        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCards.map((card) => {
            const accentClasses = getAccentClasses(card.accentColor)
            
            return (
              <SpotlightCard 
                key={card.id}
                className={`w-full backdrop-blur-xl rounded-2xl border ${accentClasses.border} transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-[1.02] custom-spotlight-card`}
                spotlightColor={card.color}
              >
                {/* <div className={`w-full backdrop-blur-xl rounded-2xl border ${accentClasses.border} transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-[1.02]`}> */}
                  {/* Top Accent Line */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${card.gradient} opacity-75 group-hover:opacity-100 transition-opacity duration-300`} />
                  
                  {/* Card Content */}
                  <div className="relative">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ring-1 ${accentClasses.iconBg}`}>
                          {card.icon}
                        </div>
                        <h3 className="text-base font-semibold text-slate-100">
                          {card.title}
                        </h3>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${accentClasses.badge}`}>
                        {card.change}
                      </span>
                    </div>

                    {/* Main Value */}
                    <div className="mb-6">
                      <p className="text-4xl font-bold text-white tracking-tight">
                        {card.value}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="space-y-3 pt-4 border-t border-slate-700/50">
                      {card.metrics.map((metric, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between text-sm group/metric"
                        >
                          <span className="text-slate-400 font-medium group-hover/metric:text-slate-300 transition-colors">
                            {metric.label}
                          </span>
                          <span className="font-semibold text-slate-200 tabular-nums">
                            {metric.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                {/* </div> */}
              </SpotlightCard>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredCards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-slate-800/50 rounded-full mb-4">
              <BarChart3 className="h-8 w-8 text-slate-500" />
            </div>
            <p className="text-slate-400 text-lg font-medium mb-2">No metrics found</p>
            <p className="text-slate-500 text-sm">Try adjusting your search query</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default DashboardSection