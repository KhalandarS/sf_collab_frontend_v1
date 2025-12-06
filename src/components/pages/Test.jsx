import React, { useEffect, useState, useRef } from "react";
import LaserFlow from '../ui/LaserFlow';
import { FaUserPlus } from "react-icons/fa6";
import { IoLogIn } from "react-icons/io5";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {Button} from "../ui/button";
import StarBorder from '../ui/StarBorder'
import { TrendingUpIcon, UsersIcon, DollarSignIcon, ActivityIcon, LogIn } from "lucide-react"
import {   TrendingUp, Activity } from 'lucide-react';
import Silk from "../ui/Silk";
import { FaLaptopCode } from "react-icons/fa";
import ProfileCard from '../ui/ProfileCard'
import { Badge } from '../ui/badge';
import GradientText from '../ui/GradientText';
import { ShineButton } from '../lightswind/shine-button';
  
import { 
  ArrowLeft, MapPin, Users, Calendar,  Globe, 
  Code, Briefcase, Heart, Share2, ExternalLink, Mail,
  Github, Linkedin, X, Check, ChevronRight, Home,
  Download, Trash2, Plus, UserPlus, Building2, BarChart3,
  FileText, Eye, DollarSign, Rocket, Target, Clock,
  CheckCircle, PlayCircle, PauseCircle, AlertCircle,
  FileSpreadsheet, MessageSquare, Settings, Search,CheckCircle2Icon,XIcon
} from 'lucide-react';
import { GrAdd } from "react-icons/gr";

function CardStats() {
  return (
    <div className="w-full  h-full p-6 flex justify-center">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl">
        {/* Revenue Card */}
        <div className="relative overflow-hidden rounded-xl">
          <LaserFlow
            horizontalBeamOffset={0.0}
            verticalBeamOffset={0.0}
            verticalSizing={2}
            horizontalSizing={1.5}
            wispDensity={1}
            wispIntensity={7}
            wispSpeed={15}
            falloffStart={1}
            flowSpeed={0.35}
            flowStrength={0.25}
            fogIntensity={0.45}
            fogFallSpeed={0.6}
            fogScale={0.3}
            decay={1.1}
            color="rgb(207,158,255)"
          />
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '86%',
            boxShadow:'0 0 15px white',
            backgroundColor: '#060010',
            borderRadius: '20px',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 6
          }}>
            <Card className="w-full h-full bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$45,231.89</div>
                <p className="text-xs text-gray-300">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subscriptions Card */}
        <div className="relative overflow-hidden rounded-xl">
          <LaserFlow
            horizontalBeamOffset={0.0}
            verticalBeamOffset={0.0}
            verticalSizing={2}
            horizontalSizing={1.5}
            wispDensity={1}
            wispIntensity={7}
            wispSpeed={15}
            falloffStart={1}
            flowSpeed={0.35}
            flowStrength={0.25}
            fogIntensity={0.45}
            fogFallSpeed={0.6}
            fogScale={0.3}
            decay={1.1}
            color="rgb(158,207,255)"
          />
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '86%',
            boxShadow:'0 0 15px white',
            backgroundColor: '#060010',
            borderRadius: '20px',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 6
          }}>
            <Card className="w-full h-full bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">+2350</div>
                <p className="text-xs text-gray-300">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sales Card */}
        <div className="relative overflow-hidden rounded-xl">
          <LaserFlow
            horizontalBeamOffset={0.0}
            verticalBeamOffset={0.0}
            verticalSizing={2}
            horizontalSizing={1.5}
            wispDensity={1}
            wispIntensity={7}
            wispSpeed={15}
            falloffStart={1}
            flowSpeed={0.35}
            flowStrength={0.25}
            fogIntensity={0.45}
            fogFallSpeed={0.6}
            fogScale={0.3}
            decay={1.1}
            color="rgb(255,207,158)"
          />
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '86%',
            boxShadow:'0 0 15px white',
            backgroundColor: '#060010',
            borderRadius: '20px',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 6
          }}>
            <Card className="w-full h-full bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">+12,234</div>
                <p className="text-xs text-gray-300">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Now Card */}
<div className="relative flex items-center justify-center py-4">
  <div
    className="
      relative w-[86%] rounded-2xl border-2 border-white 
      bg-[#060010] text-white flex flex-col
      shadow-[0_0_20px_white] overflow-hidden
    "
    style={{ zIndex: 6 }}
  >
    {/* Left Laser */}
    <div className="absolute inset-y-0 -left-[36.5%] rotate-90">
      <LaserFlow
        horizontalBeamOffset={0.06}
        verticalBeamOffset={-0.5}
        verticalSizing={0.5}
        horizontalSizing={1.5}
        wispDensity={6}
        wispIntensity={10}
        wispSpeed={15}
        falloffStart={1}
        flowSpeed={0.35}
        flowStrength={0.1}
        fogIntensity={1}
        fogFallSpeed={0.6}
        fogScale={0.3}
        decay={5}
        color="rgb(158,255,207)"
      />
    </div>

    {/* Main Card */}
    <Card className="w-full h-full bg-transparent border-none shadow-none relative">
      <CardHeader className="flex flex-row items-center justify-between pb-1">
        <CardTitle className="text-sm font-medium text-white">
          Active Now
        </CardTitle>
        <Activity className="h-4 w-4 text-gray-300" />
      </CardHeader>

      <CardContent className="flex flex-col items-center">
        <div className="text-3xl font-bold text-white">+573</div>
        <p className="text-xs text-gray-300 mt-1">
          +201 since last hour
        </p>
      </CardContent>
    </Card>

    {/* Right Laser */}
    <div className="absolute inset-y-0 -right-[36.5%] -rotate-90">
      <LaserFlow
        horizontalBeamOffset={-0.06}
        verticalBeamOffset={-0.5}
        verticalSizing={0.5}
        horizontalSizing={1.5}
        wispDensity={6}
        wispIntensity={10}
        wispSpeed={15}
        falloffStart={1}
        flowSpeed={0.35}
        flowStrength={0.1}
        fogIntensity={1}
        fogFallSpeed={0.6}
        fogScale={0.3}
        decay={5}
        color="rgb(158,255,207)"
      />
    </div>
  </div>
</div>

      </div>
    </div>
  );
}


// Image Example Interactive Reveal Effect
function Hero() {
  return (
    <div className="flex w-full"
      style={{
        minHeight: "100vh",
        position: "relative",
        
        // overflow: "hidden",
        // backgroundColor: "#000000",
      }}
    >
      <div className="h-full">
        {/* LaserFlow BACKGROUND */}
        <div
          style={{
            position: "absolute",
            // bottom:0,
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          <LaserFlow
          style={{position:'absolute',bottom:"-145px"}}
            horizontalBeamOffset={0.0}
            verticalBeamOffset={0.0}
            verticalSizing={0.3}
            horizontalSizing={1.5}
            wispDensity={1}
            wispIntensity={7}
            wispSpeed={15}
            falloffStart={1}
            flowSpeed={0.35}
            flowStrength={0.25}
            fogIntensity={0.45}
            fogFallSpeed={0.6}
            fogScale={0.3}
            decay={1.1}
            color="rgb(207,158,255)"
          />
        </div>
  
        {/* BOX ABOVE */}
        {/* BOX ABOVE */}
          <div
            style={{
              position: "absolute",
              bottom: "50%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "86%",
              height: '50svh',
              // marginLeft:'-30px',
              backgroundColor: "#060010",
              borderRadius: "20px",
              border: "2px solid white",
              display: "flex",
              boxShadow: '0 0 15px white',
              alignItems: "center",
              justifyContent: "start",
              color: "white",
              fontSize: "2rem",
              zIndex: 6,
            }}
          >
            <div className="w-2/3 relative flex justify-center">
              <img src="/jurica.jpg" alt="Profile Background" className="w-52 h-52 object-cover rounded-full shadow-lg  shadow-white" />
            </div>
            <div className="relative  w-full shadow-2xl mx-auto px-4 sm:px-6 lg:px-8  ">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between  relative z-10">
                {/* User Info */}
                <div className="flex flex-col lg:flex-row lg:items-end gap-6">
                  {/* User Basic Info */}
                  <div className="text-white space-y-3">
                    <h1 className="text-3xl font-bold bg-gray-500/5 backdrop-blur-sm w-fit p-2 rounded-full flex items-center">
                      John Doe
                    </h1>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                        <Building2 className="w-3 h-3 mr-1" />
                        Software Engineer
                      </Badge>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        <MapPin className="w-3 h-3 mr-1" />
                        San Francisco, CA
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                        <Rocket className="w-3 h-3 mr-1" />
                        Level 15
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm max-w-xl">
                      Passionate full-stack developer with 5+ years of experience building scalable web applications and leading engineering teams.
                    </p>
                  </div>
                </div>
              
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 mt-6 lg:mt-0">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 cursor-pointer hover:text-white"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    2450 XP
                  </Button>
                </div>
              </div>
            </div>
          </div>
      </div>
      
      <div className="mt-76  relative grid gap-4 md:grid-cols-2 lg:grid-cols-4 w-full ">
        {/* Revenue Card */}
        <div className="relative overflow-hidden rounded-xl">
          
          <div style={{
            position: 'absolute',
            top:'50%',
            left:'50%',
            transform: 'translateX(-50%)',
            width: '86%',
            boxShadow:'0 0 15px white',
            backgroundColor: '#060010',
            borderRadius: '20px',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 6
          }}>
            <Card className="w-full h-full bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">$45,231.89</div>
                <p className="text-xs text-gray-300">
                  +20.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Subscriptions Card */}
        <div className="relative overflow-hidden rounded-xl">
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '86%',
            boxShadow:'0 0 15px white',
            backgroundColor: '#060010',
            borderRadius: '20px',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 6
          }}>
            <Card className="w-full h-full bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Subscriptions</CardTitle>
                <Users className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">+2350</div>
                <p className="text-xs text-gray-300">
                  +180.1% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sales Card */}
        <div className="relative overflow-hidden rounded-xl">
          
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '86%',
            boxShadow:'0 0 15px white',
            backgroundColor: '#060010',
            borderRadius: '20px',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 6
          }}>
            <Card className="w-full h-full bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Sales</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">+12,234</div>
                <p className="text-xs text-gray-300">
                  +19% from last month
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Active Now Card */}
        <div className="relative overflow-hidden rounded-xl">
          <div className='animate-pulse' style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '86%',
            boxShadow:'0 0 15px white',
            backgroundColor: '#060010',
            borderRadius: '20px',
            border: '2px solid white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            zIndex: 6
          }}>
            <Card className="w-full h-full bg-transparent border-none shadow-none">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Active Now</CardTitle>
                <Activity className="h-4 w-4 text-gray-300" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">+573</div>
                <p className="text-xs text-gray-300">
                  +201 since last hour
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


// Basic Usage
function Ca(){
  return(
    <ProfileCard
    /* ────────────────────────────────────────
     * Core images
     * ──────────────────────────────────────── */
    avatarUrl="/jurica.jpg"
    miniAvatarUrl="/mini_jurica.png"
    iconUrl="/pattern.svg"
    grainUrl="/grain.png"

    /* ────────────────────────────────────────
     * Visual styling
     * ──────────────────────────────────────── */
    innerGradient="linear-gradient(135deg, #12121f, #FFFFFF)" 
    className="-ml-2 shadow-lg shadow-white rounded-2xl "

    /* ────────────────────────────────────────
     * Glow Effect
     * ──────────────────────────────────────── */
    behindGlowEnabled={true}
    behindGlowColor="rgba(252, 252, 255, 0.46)"
    behindGlowSize="55%"

    /* ────────────────────────────────────────
     * Tilt Effect
     * ──────────────────────────────────────── */
    enableTilt={true}
    enableMobileTilt={true}
    mobileTiltSensitivity={5}

    /* ────────────────────────────────────────
     * User info section
     * ──────────────────────────────────────── */
    name="Javi A. Torres"
    title="Software Engineer"
    handle="javicodes"
    status="Online"
    showUserInfo={true}

    /* ────────────────────────────────────────
     * Buttons / Callbacks
     * ──────────────────────────────────────── */
    contactText="Contact Me"
    onContactClick={() => window.alert("Contact clicked")}
  />
  )
}

export default function Test() {

  return (
  <div className="p-5 min-h-screen h-full  text-white ">
          <Hero/>
          <CardStats  />
          <br />
          <br />
          <button style={{
          margin:'50px',
  padding:' 7px 30px',
  border: 'none',
  borderRadius: '5px',
  backgroundColor:' #007bff',
  color: 'white',
  fontSize: '16px',
  cursor: 'pointer',
  boxShadow:' inset 0px 0px 10px rgba(0, 0, 0, 0.5)'
}}>Click Me</button>
    <br />
  
  <div className="flex gap-4 p-10">
    
    <ShineButton 
      className="rounded-md flex gap-2 w-[110px] items-center justify-center text-white "
      label="Login" 
      icon={<IoLogIn size={18} className="hover:animate-pulse "/>}
      size="sm" 
      bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)" 
      onClick={() => alert('Thanks for your support!')} 
    />
    
    <ShineButton 
      className="rounded-md flex gap-2 w-[110px] items-center justify-center text-white "
      label="Sign Up" 
      icon={<FaUserPlus size={17} className="hover:animate-pulse "/>}
      size="sm" 
      bgColor="linear-gradient(325deg, hsl(217 100% 56%) 0%, hsl(194 100% 69%) 55%, hsl(217 100% 56%) 90%)" 
      onClick={() => alert('Thanks for your support!')} 
    />
  </div>
  
  <br />
  <br />
  <hr />
  <GradientText/>
{/* <StarBorder
  as="button"
  className="custom-class"
  color="white"
  speed="5s"
  // thickness="10px"
>
  <Button style={{boxShadow:' inset 20px 20px 10px rgba(0, 0, 0, 1)'}} className="cursor-pointer relative text-white ">
    <span className="z-50">
      Upload document
    </span>
    <div  className="absolute z-10 top-0 w-full h-full">
      <Silk
        speed={10}
        scale={1}
        color="#BAB9B6"
        noiseIntensity={5}
        rotation={0}
      />
    </div>
  </Button>
  
</StarBorder> */}

  </div>
  );
}
