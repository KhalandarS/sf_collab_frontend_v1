"use client";

import React, { useMemo, useState, useEffect } from "react";
import WorldClock from "../sections/WorldClock";
import Calendar from "../sections/Calendar";
import Tasks from "../sections/Tasks";
import DashboardHeader from "../headers/DashboardHeader";
import DashboardSection from "../sections/DashboardSection";
import TaskProgress from "../sections/TaskProgress";
import Silk from '../ui/Silk';
import { Search } from 'lucide-react'; 
import SpotlightCard from "../ui/SpotlightCard";
import GlareHover from "../ui/GlareHover";
import { GrOverview } from "react-icons/gr";
import ShinyText from "../ui/ShinyText";
import { useDispatch ,useSelector} from "react-redux";
import { NotificationList } from "../ui/notification-list";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '../ui/shadcn-io/kanban';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { faker } from '@faker-js/faker';


import { GravityStarsBackground } from '../../components/animate-ui/components/backgrounds/gravity-stars';

//!


//!
const Dashboard = () => {
  const [query, setQuery] = useState("");
  const [userData,setUserData]=useState(null);
  // State for search functionality
  const [searchValue, setSearchValue] = useState('');
  

  const dispatch=useDispatch();
  const {user,access_token,refreshToken,loading,error} = useSelector((state) => state.auth);
  
  
  // Search handler function
  const handleSearch = (event) => {
    setSearchValue(event.target.value);
    // Add your search logic here
    console.log('Searching for:', event.target.value);
  };
  
  useEffect(() => {
    // Only run this when the user changes
    if (user) {
      setUserData(user);
    }
  }, [user]);
  
  return (
    <div className="relative min-h-screen  text-white w-full overflow-x-hidden">
      
      <DashboardHeader searchQuery={query} onSearchChange={setQuery} />
      

      {/* Main Content */}
      <div className="relative w-full mx-auto py-4 mb-4 overflow-x-hidden">
        
{/* 
    <GravityStarsBackground
    starsCount={200}
    
  starsOpacity={0.3}

  className="absolute inset-0 h-full w-full flex items-center justify-center rounded-xl"
/> */}

        {/* Welcome Banner */}
        <div className="w-full mb-6">
          
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-white/20 backdrop-blur-sm p-6">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Get Early Access</h2>
                <p className="text-white/70">Join our waitlist for anticipated access to premium features. Be among the first to unlock exclusive benefits.</p>
              </div>
              
              <div className="flex flex-wrap gap-4 flex-shrink-0">
                <a href="https://sfcollab.com/waitlist" className="w-full sm:w-auto group relative px-6 py-3 bg-blue-500/80 hover:bg-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border border-blue-400/50 hover:border-blue-300">
                  <span className="relative flex items-center gap-2">
                    Join Waitlist
                    <span className="text-xs bg-blue-400/40 px-2 py-1 rounded-full ml-2">Anticipated</span>
                  </span>
                </a>
                
                <a href="/refer" className="w-full sm:w-auto group relative px-6 py-3 bg-purple-500/80 hover:bg-purple-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 border border-purple-400/50 hover:border-purple-300">
                  <span className="relative flex items-center gap-2">
                    Refer & Earn
                    <span className="text-xs bg-purple-400/40 px-2 py-1 rounded-full ml-2">Premium</span>
                  </span>
                </a>
              </div>
            </div>
          </div>


        </div>
        <div className="w-full p-6 mb-6">
          <div className="relative overflow-hidden rounded-2xl transition-all">
            {/* Background with Gradient and Glassmorphism */}
            {/* <div className="absolute inset-0 bg-linear-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-white/20 shadow-2xl"></div> */}
            {/* <div className="absolute top-0 w-full h-full">
              <Silk
                speed={5}
                scale={1}
                color="#15083B"
                noiseIntensity={1.5}
                rotation={0}
              />
            </div> */}
            {/* Subtle Pattern Overlay */}
            {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:20px_20px]"></div> */}
            {/* <SpotlightCard className="custom-spotlight-card" spotlightColor={card?.color}></SpotlightCard> */}
            <div className="w-full">
                <div className="relative z-10 p-4">
                <GlareHover
                width="100%"
                height="100%"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  // img={}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={true}
                >
                  <div className="w-full group relative flex flex-col lg:flex-row items-start lg:items-center justify-around gap-2 p-4">
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500/30 to-purple-600/30 opacity-75 group-hover:opacity-100 transition-opacity duration-300`} />
                    <img src="/design.png" className="absolute group-hover:opacity-50 transition-all duration-1000 -z-50 opacity-15" />
                    {/* Welcome Text */}
                    <div className="flex-1 relative">
                      <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                        Welcome back, &nbsp;
                        <span className='relative whitespace-nowrap'>
                          <svg 
                          aria-hidden="true" 
                          viewBox="0 0 281 40" 
                          preserveAspectRatio="none" 
                          className="absolute top-2/3 left-0 h-[0.6em] w-full fill-blue-500/70"><path fillRule="evenodd" clipRule="evenodd" d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"></path></svg>
                          <span className="relative bg-linear-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">{userData?userData?.firstName:"Alex"}!</span>
                        </span>
                      </h1>
                      <p className="text-lg text-white/80 max-w-2xl">
                        Here's what's happening with your startups today. You have <span className="font-semibold text-white">{userData?userData?.notificationsCount:"3"} new notification{userData&&userData?.notificationsCount>1?"'s":""}</span> and <span className="font-semibold text-white">{userData?userData?.pendingTasksCount:"12"} pending task{userData&&userData?.pendingTasksCount>1?"'s":""}</span> to review.
                      </p>
                      
                      {/* Stats Row */}
                      <div className="flex flex-wrap gap-6 mt-6">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-white/70 text-sm" >{userData?userData?.activeStartupsCount:"5"} <span style={{fontFamily: "Trade Winds, system-ui", fontWeight:'lighter',textSpacingTrim:'space-first'}}>Active Startups</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                          <span className="text-white/70 text-sm" >{userData?`$${userData?.totalRevenue}K`:"$24.8K"} <span style={{fontFamily: "Trade Winds, system-ui", fontWeight:'lighter',textSpacingTrim:'space-first'}}>Revenue</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                          <span className="text-white/70 text-sm" >{userData?`${userData?.satisfactionPercentage}%`:"98%"} <span style={{fontFamily: "Trade Winds, system-ui", fontWeight:'lighter',textSpacingTrim:'space-first'}}>Satisfaction</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                          <span className="text-white/70 text-sm" >{userData?`${userData?.lastActivityDate} `:"__"} <span style={{fontFamily: "Trade Winds, system-ui", fontWeight:'lighter',textSpacingTrim:'space-first'}}>Last activity</span></span>
                        </div>
                      </div>
                      
                    </div>
      
                    {/* Quick Actions */}
                    <div className="flex  gap-3">
                      <div className="w-40 flex items-center justify-around h-10 bg-blue-400/30 border border-blue-400 p-3 rounded-full"><img src="/flame.png" alt="flame" style={{width:'30px'}}/><small style={{fontFamily: "Trade Winds, system-ui"}}>{userData?userData?.streakDays:"7"}&nbsp;&nbsp; <strong >days Streak</strong> </small> </div>
                      <div className="w-40 flex items-center justify-around h-10 bg-purple-400/30 border border-purple-400 p-3 rounded-full"><img src="/trophy.png" alt="trophy" style={{width:'30px'}}/> <small style={{fontFamily: "Trade Winds, system-ui"}}>{userData?userData?.xpPoints:"1000"}&nbsp;&nbsp; <strong >XP</strong> </small></div>
                    </div>
                    
                    {/* <img src="/startup.png" className="w-70 absolute right-50 -z-30 opacity-15 top-0" alt="" /> */}
                    
                  </div>
                </GlareHover>
                </div>
            </div>
  
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full -translate-x-12 translate-y-12"></div>
          </div>
        </div>
  
        {/* Original Dashboard Header */}
        <div className='w-full  p-4'>
          <div className='flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 sm:gap-0 h-full'>
            <div className="flex items-center gap-3 mb-3">
              <GrOverview className="h-8 w-8"/>
              
                <h1 className="relative text-2xl font-semibold text-white"><ShinyText 
              text="Dashboard Overview" 
              
              disabled={false} 
              speed={3} 
              className='custom-class' 
            /></h1>
            </div>
  
          </div>
        </div>
        
        <div className="w-full overflow-x-hidden mb-4">
          <DashboardSection searchQuery={query} />
        </div>
        {/* <div className="w-full overflow-x-hidden mb-4">
          <NotificationList />
        </div> */}
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          <WorldClock />
        </div>
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          <Calendar />
        </div>
        <div className="w-full h-full overflow-y-auto overflow-x-hidden">
          {/* <Tasks /> */}
          <TaskProgress />
        </div>
        <div className="w-full overflow-x-hidden">
          <Tasks searchQuery={query} />
        </div>
        
      </div>


    </div>
  );
};

export default Dashboard;
