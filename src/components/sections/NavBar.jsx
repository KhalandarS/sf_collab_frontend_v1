import React, { useState, useRef, useEffect } from "react";
import { DrawLineText } from "../../../components/gsap/draw-line-text";
import { MapPinIcon, StarIcon } from "lucide-react";
import { ProfilePeek } from "../../../components/gsap/profile-peek";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import GlareHover from "../ui/GlareHover";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth/authThunks";
import { useDispatch } from "react-redux";

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

const NavBar = ({ isHidden = false }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {

      await dispatch(logoutUser());
  
      navigate("/login", { replace: true });
  
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

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

  // Mock notifications
  const notifications = [
    { id: 1, text: "New message from team", time: "5 min ago", unread: true },
    { id: 2, text: "Task assigned to you", time: "1 hour ago", unread: true },
    { id: 3, text: "Project deadline approaching", time: "2 hours ago", unread: false },
  ];

  return (
    <nav
      className={`  flex px-6 items-center w-full h-16 justify-between relative transition-transform duration-300 will-change-transform ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } lg:translate-y-0`}
      style={{zIndex:1000}}
    >
    
        {/* Dark Horizon Glow */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(125% 125% at 50% 90%, #000000 40%, #0d1a36 100%)",
          }}
        />


      {/* Logo */}
      <div className="logo  z-50">
        <button className="group flex items-center  gap-3">
          <DrawLineText
            className="font-medium"
            fontSize={30}
            strokeWidth={1}
            text="SFCOLLAB"
            color="white"
          />
        </button>
      </div>

      {/* Main content */}
      <div className="flex items-center h-full gap-3 z-50">
        {/* Settings (mobile only) */}
        <div className="sm:hidden">
          <button className="p-2.5 rounded-xl bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-300 border border-slate-700/50">
            <SettingsIcon />
          </button>
        </div>

        {/* Notification dropdown */}
        <div className="relative max-sm:hidden" ref={notificationRef}>
          
          
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
                <div style={{borderRadius:' 15px'}} className="  w-80 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Header */}
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                    <span className="px-2.5 py-1 bg-linear-to-br from-rose-500/10 to-red-600/10 text-rose-400 text-xs font-semibold rounded-full ring-1 ring-rose-500/20">
                      3 New
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
                  <button className="cursor-pointer w-full py-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
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
                3
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
                <div className=" mt-3 w-56  overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Profile header */}
                <div className="p-4 border-b border-slate-700/50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-slate-700/50">
                      <UserIcon />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">John Doe</p>
                      <p className="text-xs text-slate-400">john@example.com</p>
                    </div>
                  </div>
                </div>
  
                {/* Menu items */}
                <div className="p-2">
                  <Link to="/user-profile" className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all duration-200">
                    <UserIcon />
                    <span className="text-sm font-medium">Profile</span>
                  </Link>
                  <button className="cursor-pointer flex items-center gap-3 w-full px-3 py-2.5 text-left text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl transition-all duration-200">
                    <SettingsIcon />
                    <span className="text-sm font-medium">Settings</span>
                  </button>
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
                <img className="rounded-full h-full w-full" src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dXNlcnN8ZW58MHx8MHx8fDA%3D" 
                alt="user" />
              </div>
            </button>
          </Tippy>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;