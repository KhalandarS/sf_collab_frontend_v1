import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react'
import SpotlightCard from '../ui/SpotlightCard'
import ShinyText from '../ui/ShinyText'


export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const navigateMonth = (direction) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      newDate.setMonth(prevDate.getMonth() + (direction === 'next' ? 1 : -1))
      return newDate
    })
  }

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    
    const days = []
    
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    const firstDayOfWeek = firstDay.getDay()
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        isToday: false,
        date: new Date(year, month - 1, prevMonthLastDay - i)
      })
    }
    
    const today = new Date()
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i)
      days.push({
        day: i,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString(),
        date: date
      })
    }
    
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isToday: false,
        date: new Date(year, month + 1, i)
      })
    }
    
    return days
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const calendarDays = generateCalendarDays()

  return (
    <div className="min-h-screen  ">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 ">
              <CalendarIcon className="h-6 w-6 text-white" />
            </div>
            <ShinyText 
              text="Calendar" 
              disabled={false} 
              speed={3} 
              className='custom-class text-2xl font-bold' 
            />
            {/* <h1 className="text-2xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Calendar
            </h1> */}
          </div>
          <p className="text-slate-400 text-lg ml-14">Plan and organize your schedule</p>
        </div>

        {/* Calendar Card */}
        <SpotlightCard
        spotlightColor="rgba(59, 130, 246, 0.10)"
        className=" backdrop-blur-xl rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl">
          {/* Calendar Header */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-violet-500/30 to-purple-600/30"></div>
          <div className="w-full relative bg-linear-to-br from-violet-500/10 to-purple-600/10 border-b border-slate-700/50 p-6">
            <div className="w-full flex items-center justify-between">
              <button 
                onClick={() => navigateMonth('prev')}
                className="group p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-600/50"
              >
                <ChevronLeft className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
              
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigateMonth('next')}
                className="group p-3 hover:bg-slate-700/50 rounded-xl transition-all duration-300 border border-transparent hover:border-slate-600/50"
              >
                <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Week days header */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {weekDays.map((day) => (
                <div key={day} className="text-center py-3 px-2 rounded-lg bg-slate-800/50">
                  <span className="text-sm font-semibold text-slate-300">{day}</span>
                </div>
              ))}
            </div>

            {/* Calendar days grid */}
            <div className="grid grid-cols-7 gap-2">
              {calendarDays.map((day, index) => {
                const isWeekend = index % 7 === 0 || index % 7 === 6
                
                return (
                  <div
                    key={index}
                    className={`
                      group relative h-14 flex items-center justify-center text-sm font-medium rounded-xl cursor-pointer
                      transition-all duration-300
                      ${day.isCurrentMonth 
                        ? 'text-white hover:bg-slate-700/50 hover:scale-105 hover:shadow-lg' 
                        : 'text-slate-600 hover:text-slate-500'
                      }
                      ${day.isToday 
                        ? 'bg-linear-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 ring-2 ring-violet-400/50 hover:scale-110' 
                        : day.isCurrentMonth
                        ? 'bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/30 hover:border-slate-600/50'
                        : 'bg-slate-900/20'
                      }
                      ${isWeekend && day.isCurrentMonth && !day.isToday ? 'ring-1 ring-slate-700/30' : ''}
                    `}
                  >
                    {/* Day number */}
                    <span className={`
                      relative z-10 transition-transform duration-300
                      ${day.isToday ? 'font-bold' : ''}
                    `}>
                      {day.day}
                    </span>

                    {/* Hover effect */}
                    {day.isCurrentMonth && !day.isToday && (
                      <div className="absolute inset-0 rounded-xl bg-linear-to-br from-violet-500/0 to-purple-600/0 group-hover:from-violet-500/10 group-hover:to-purple-600/10 transition-all duration-300" />
                    )}

                    {/* Today indicator dot */}
                    {day.isToday && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-lg" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer Stats */}
          <div className="border-t border-slate-700/50 p-6 bg-slate-900/30">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-1">Current Month</p>
                <p className="text-lg font-bold text-white">{monthNames[currentDate.getMonth()]}</p>
              </div>
              <div className="text-center border-x border-slate-700/50">
                <p className="text-sm text-slate-400 mb-1">Total Days</p>
                <p className="text-lg font-bold text-white">
                  {new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-slate-400 mb-1">Today</p>
                <p className="text-lg font-bold bg-linear-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {new Date().getDate()}
                </p>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4 p-2">
          <button className="group bg-linear-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 hover:border-violet-500/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg ring-1 ring-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                <CalendarIcon className="h-5 w-5 text-violet-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">Go to Today</p>
                <p className="text-xs text-slate-400">Jump to current date</p>
              </div>
            </div>
          </button>
          
          <button className="group bg-linear-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-xl rounded-xl border border-slate-700/50 p-4 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg ring-1 ring-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
                <Clock className="h-5 w-5 text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-200">View Events</p>
                <p className="text-xs text-slate-400">See all scheduled items</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}