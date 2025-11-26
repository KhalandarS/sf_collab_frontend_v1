import React, { useState, useEffect } from 'react'
import { Sun, Moon, Globe, Clock } from 'lucide-react'
import SpotlightCard from '../ui/SpotlightCard'
import { IoMdClock } from "react-icons/io";
import { US } from 'country-flag-icons/react/3x2'
import { GB } from 'country-flag-icons/react/3x2'
import { JP } from 'country-flag-icons/react/3x2'
import { AU } from 'country-flag-icons/react/3x2'
import { getUserCountry } from '../../utils/getUserCountry';
import countries from '../../utils/countries';
import ShinyText from '../ui/ShinyText';

const TIME_ZONES = [
  { city: "New York", country: "USA",flag:<US className="w-10 h-10"/>, offset: -4, utc: "UTC-4", gradient: "from-blue-500/30 via-white/30 to-red-500/30" ,color: "rgba(59, 130, 246, 0.15)"},
  { city: "London", country: "UK",flag:<GB className="w-10 h-10"/>, offset: 1, utc: "UTC+1", gradient: "from-blue-500/30 via-red-500/30 to-blue-600/30" ,color: "rgba(16, 185, 129, 0.15)"},
  { city: "Tokyo", country: "Japan",flag:<JP className="w-10 h-10"/>, offset: 9, utc: "UTC+9", gradient: "from-white/30 via-red-500/30 to-white/30" ,color: "rgba(181, 20, 138, 0.15)"},
  { city: "Sydney", country: "Australia",flag:<AU className="w-10 h-10"/>, offset: 10, utc: "UTC+10", gradient: "from-blue-500/30 via-red-500/30  to-blue-500/30" ,color: "rgba(245, 158, 11, 0.15)"},
]

export default function WorldClock() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [country, setCountry] = useState(null)
  const [countryCode, setCountryCode] = useState(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])
  
  useEffect(()=>{
    const detectCountry=async ()=>{
      const countryCode = await getUserCountry();
      const countryObj = countries.find(v => v.value === countryCode);
      
        setCountry(countryObj);
        setCountryCode(countryCode);
        // console.log(countryCode);
        
    }
    detectCountry();
  },[]);
  
  const getTimeForTimezone = (offset) => {
    const utc = currentTime.getTime() + (currentTime.getTimezoneOffset() * 60000)
    return new Date(utc + (3600000 * offset))
  }

  const formatTime = (date) => {
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
    return time
  }

  const getDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 w-full grid grid-cols-1 lg:grid-cols-2">
          <div className='w-full '>
            <div className="flex items-center gap-3 mb-3">
              <IoMdClock className="h-9 w-9 text-white" />
              <ShinyText 
              text="World Clock" 
              disabled={false} 
              speed={3} 
              className='custom-class text-2xl font-bold' 
            />
              {/* <h1 className="relative text-2xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                World Clock
              </h1> */}
            </div>
            <p className="text-slate-400 text-lg ml-5">Monitor time zones across the globe in real-time</p>
          </div>
          <div className=' w-full flex justify-around items-center'>
            <span className='text-xl text-white'>Currently in : <br />
            <ShinyText 
              text={`Last updated: ${currentTime.toLocaleTimeString('en-US')}`}
              disabled={false} 
              speed={3} 
              className='custom-class text-sm' 
            />
            </span><span className='relative flex gap-3 items-center'>
            <svg aria-hidden="true" viewBox="0 0 418 42" class="absolute top-6 left-0 h-[0.78em] w-full fill-blue-300/70" preserveAspectRatio="none"><path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z"></path></svg>
            {country?.label} {country?.flag}
            </span>
          </div>
        </div>

        {/* Clock Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {TIME_ZONES.map(({ city, country, offset, utc, gradient ,color,flag}) => {
            const time = getTimeForTimezone(offset)
            const isDay = time.getHours() >= 6 && time.getHours() < 18
            const hours = time.getHours()
            const formattedTime = formatTime(time)
            const formattedDate = getDate(time)

            return (
              <SpotlightCard 
                key={city} 
                className="group relative  backdrop-blur-xl rounded-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-3xl hover:scale-[1.02]"
                spotlightColor={color}
              >
                {/* Gradient Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${gradient} opacity-75 group-hover:opacity-100 transition-opacity duration-300`} />
                
                {/* Glow Effect */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 bg-linear-to-br ${gradient} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 rounded-full`} />

                <div className="relative p-6 flex flex-col h-full">
                  {/* Location Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className='flex items-center gap-4'>
                      <span>{flag}</span>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{city}</h3>
                        <p className="text-sm text-slate-400 font-medium">{country}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-linear-to-r ${gradient} text-white shadow-lg`}>
                        {utc}
                      </span>
                    </div>
                  </div>

                  {/* Time Display */}
                  <div className="flex-1 flex flex-col justify-center mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <img src='/clock.png' className="w-10 text-slate-500" />
                      <span className="text-5xl font-bold text-white tracking-tight tabular-nums">
                        {formattedTime}
                        <p className="text-sm text-slate-400 font-medium mt-3">{formattedDate}</p>
                      </span>
                    </div>
                  </div>

                  {/* Day/Night Indicator */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-2">
                      {isDay ? (
                        <>
                          <div className="p-2 bg-amber-500/10 rounded-lg ring-1 ring-amber-500/20">
                            <Sun className="h-4 w-4 text-amber-400" />
                          </div>
                          <span className="text-sm font-semibold text-amber-400">Daytime</span>
                        </>
                      ) : (
                        <>
                          <div className="p-2 bg-indigo-500/10 rounded-lg ring-1 ring-indigo-500/20">
                            <Moon className="h-4 w-4 text-indigo-400" />
                          </div>
                          <span className="text-sm font-semibold text-indigo-400">Nighttime</span>
                        </>
                      )}
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="flex items-center gap-1.5">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-0.5 rounded-full transition-all duration-300 ${
                            i === hours
                              ? `bg-linear-to-t ${gradient} shadow-lg`
                              : 'bg-slate-700/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            )
          })}
        </div>       
      </div>
      
    </div>
  )
}