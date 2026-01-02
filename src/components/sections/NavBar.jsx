import React, { useState, useRef, useEffect } from "react";
import { DrawLineText } from "../gsap/draw-line-text";
import { HelpCircle, MapPinIcon, StarIcon } from "lucide-react";
import { ProfilePeek } from "../gsap/profile-peek";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import GlareHover from "../ui/GlareHover";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth/authThunks";
import { useDispatch ,useSelector} from "react-redux";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import LoadingSpinner from "../LoadingSpinner";


import AOS from 'aos';
import 'aos/dist/aos.css'; 

import { FaUserPlus } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";
import { TiThMenu } from "react-icons/ti";

import { ShineButton } from '../lightswind/shine-button';

// Simple icon components
const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';


const NavBar = ({isOpen,setIsOpen, isHidden = false , isAdmin}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const [notifications, setNotifications] = useState([]);
  const [loaderState, setLoaderState] = useState(false)
  
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {user,access_token,refreshToken,loading,error} = useSelector((state) => state.auth);
  
  const handleLogout = async () => {
    setLoaderState(true);
  
    try {

      await dispatch(logoutUser());
      
      setTimeout(() => {
        navigate("/login", { replace: true });
        setLoaderState(false);
      },3000);
      
  
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,       
      easing: "ease-out",  
      once: false,         
      mirror: false        
    });
    
    // alert(JSON.stringify(user))
  }, []);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (event) => {
      if (
        (activeDropdown === "notification" &&
          notificationRef.current &&
          !notificationRef.current.contains(event.target)) ||
        (activeDropdown === "profile" &&
          profileRef.current &&
          !profileRef.current.contains(event.target))
      ) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown]);

  const handleDropdownClick = (dropdownName) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  const fetchNotifications = async () => {
    const token = access_token;
    if (!token) return;

    try {
      const response = await fetch(`${BASE_URL}/notifications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Debug log to see the actual response structure
      // console.log('Notifications API Response:', result);
      
      // The API returns { data: { notifications: [...] } }
      const notificationsData = result.data?.notifications || [];
      setNotifications(notificationsData.filter(notif =>notif.isRead !== true)?.map((notif)=>({ id: notif?.id, title: notif?.title , text: notif?.message, time: notif?.createdAt, unread: notif?.isRead, type:notif?.notification_type })) || []);
      
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      // Fallback to user relationships if API fails
      if (user?.relationships?.notifications) {
        setNotifications(user?.relationships?.notifications?.filter(notif => notif.isRead !== true)?.map((notif)=>({ id: notif?.id,title: notif?.title , text: notif?.message, time: notif?.createdAt, unread: notif?.isRead , type:notif?.notification_type})) || []);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [access_token, user]);


  return (
    <nav
      className={`  flex px-6 items-center w-full h-16 justify-between relative transition-transform duration-300 will-change-transform ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } lg:translate-y-0`}
      style={{zIndex:9999999}}
    >
      
      {loaderState && (
        <LoadingSpinner
          title="Authenticating with Google..."
          message="This will only take a moment. Please follow the Google sign-in window."
        />
      )}
      
      
        {/* Dark Horizon Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
          }}
        />


      {/* Logo */}
      <div className="logo h-full z-50 scale-140">
        <Link to={user?.id ? `/dashboard` : '/' } className="group h-full cursor-pointer flex items-center"> 

          <img data-aos="fade-right" data-aos-duration="600" src="/logo_white.svg" className="w-full h-full" alt="sf collab" />
        </Link>
      </div>

      {/* Main content */}
      <div className="flex items-center h-full gap-3 z-50">
        
      
      {
        user?(
        <>
          {/* Notification dropdown */}
          <div className="relative " ref={notificationRef}>
            
            
            <Tippy
              content={
                <GlareHover
                width="100%"
                height="100%"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={true}
                  style={{background:"rgba(58, 58, 58, 0.600)",backdropFilter:" blur(10px)"}}
                >
                  <div style={{borderRadius:' 15px'}} className="  w-80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white">Notifications</h3>
                      <span className="px-2.5 py-1 bg-linear-to-br from-rose-500/10 to-red-600/10 text-rose-400 text-xs font-semibold rounded-full ring-1 ring-rose-500/20">
                        {notifications?.length} New
                      </span>
                    </div>
                  </div>
        
                  {/* Notifications list */}
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-800/50 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-1.5 rounded-lg ${notif.unread ? 'bg-blue-500/10 ring-1 ring-blue-500/20' : 'bg-slate-700/50'}`}>
                            <BellIcon />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-md  text-white font-medium`}>
                              {notif.title}
                            </p>
                            <p className={`text-sm ${notif.unread ? 'text-white font-medium' : 'text-slate-400'}`}>
                              {notif.text}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                          </div>
                          {notif.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
        
                  {/* Footer */}
                  <div className="p-3 border-t border-slate-700/50 bg-slate-900/50">
                    <button onClick={()=>navigate('/notifications')} className="cursor-pointer w-full py-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
                      View all notifications
                    </button>
                  </div>
                  </div>
              </GlareHover>
              }
              // interactive={true}
              trigger="click"
              animation="scale"
              theme="custom-dark"
              delay={[100, 50]}
              placement="bottom"
              className="p-0 bg-muted"
              appendTo={document.body}
              interactive={true}
            >
              <button
                onClick={() => handleDropdownClick("notification")}
                className="relative p-2.5 rounded-full bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 group"
              >
                <BellIcon />
                {/* Notification badge */}
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-linear-to-br from-rose-500 to-red-600 text-white rounded-full shadow-lg px-1 animate-pulse">
                  {notifications?.length>0?notifications.length:"0"}
                </span>
              </button>
            </Tippy>
          </div>
  
          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <Tippy
              content={
                <GlareHover
                width="100%"
                height="100%"
                  glareColor="#ffffff"
                  glareOpacity={0.3}
                  glareAngle={-30}
                  glareSize={300}
                  transitionDuration={800}
                  playOnce={true}
                  style={{background:"rgba(58, 58, 58, 0.283)",backdropFilter:" blur(10px)"}}
                >
                  <div className=" mt-3 w-full  overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Profile header */}
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-slate-700/50">
                        <img
                          className="rounded-full h-full w-full"
                          src={
                            user?.profile?.picture
                              ? user.profile.picture.startsWith("http") || user.profile.picture.startsWith("https")
                                ? user.profile.picture
                                : user.profile.picture.startsWith("/uploads")
                                  ? `${BASE_URL}/users/avatars/${user.profile.picture?.replace(/^\/?uploads\//, "")}`
                                  : `${BASE_URL}/${user.profile.picture}`
                              : "/default-user.jpeg"
                          }
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white ">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>
    
                  {/* Menu items */}
                  <div className="p-2">
                    <Link to="/user-profile" className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all duration-200">
                      <UserIcon />
                      <span className="text-sm font-medium">Profile</span>
                    </Link>
                    <Link to="/help" className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all duration-200">
                      <HelpCircle />
                      <span className="text-sm font-medium">Help</span>
                          </Link>
                          <Link to="/user-profile?page=settings" className="mt-1 block">
                    <button className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all duration-200">
                      <SettingsIcon />
                      <span className="text-sm font-medium">Settings</span>
                            </button>
                          </Link>
                  </div>
    
                  {/* Logout */}
                  <div className="p-2 border-t border-slate-700/50">
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-left text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all duration-200"
                    >
                      <LogoutIcon />
                      <span className="text-sm font-medium">Logout</span>
                    </button>
                  </div>
                  </div>
                </GlareHover>
              }
              // interactive={true}
              trigger="click"
              animation="scale"
              theme="custom-dark"
              delay={[100, 50]}
              placement="bottom"
              appendTo={document.body}
              interactive={true}
            >
              <button
                onClick={() => handleDropdownClick("profile")}
                className="flex items-center gap-2.5 w-11 h-11  rounded-full bg-slate-800/50 hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50 group"
              >
                <div className="w-full h-full  transition-all">
                  <img
                    className="rounded-full h-full w-full"
                    src={
                      user?.profile?.picture
                        ? user.profile.picture.startsWith("http") || user.profile.picture.startsWith("https")
                          ? user.profile.picture
                          : user.profile.picture.startsWith("/uploads")
                            ? `${BASE_URL}/users/avatars/${user.profile.picture?.replace(/^\/?uploads\//, "")}`
                            : `${BASE_URL}/${user.profile.picture}`
                        : "/default-user.jpeg"
                    }
                  />
                </div>
              </button>
            </Tippy>
          </div>
          
          {/* Settings (mobile only) */}
        <div 
          className="lg:hidden"
        >
          <ShineButton 
            className="cursor-pointer rounded-md flex items-center justify-center text-white "
            as="button"
            onClick={() => setIsOpen(!isOpen)}
            icon={<TiThMenu size={15} className="hover:animate-pulse "/>}
            size="sm" 
            bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)" 
          />
        </div>
        </>
        ):(
          <div  className="relative hidden lg:flex gap-4">
            <div data-aos='fade-left' data-aos-delay="100">
              <ShineButton 
                className="rounded-md flex gap-2 w-[110px] items-center justify-center text-white "
                label="Login" 
                icon={<IoLogIn size={18} className="hover:animate-pulse "/>}
                size="sm" 
                bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)" 
                onClick={() => navigate('/login')} 
                
              />
            </div>
            
            <div data-aos='fade-left' data-aos-delay="300">
            <ShineButton 
              className="rounded-md flex gap-2 w-[110px] items-center justify-center text-white "
              label="Sign Up" 
              icon={<FaUserPlus size={17} className="hover:animate-pulse "/>}
              size="sm" 
              bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)" 
              onClick={() => navigate('/signup')} 
            />
            </div>
          </div>
        )
      }
      </div>
    </nav>
  );
};

export default NavBar;