import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import NavBar from "../Navbar";
import Footer from "../Footer";
import JoinSection from "../../../components/JoinSection";
import { 
  getResponsiveScrollTrigger, 
  getResponsiveDuration,
  setupScrollTriggerRefresh,
  isMobile 
} from '../utils/scrollTriggerConfig';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const main = useRef();

  useEffect(() => {
    const mobile = isMobile();
    
    const ctx = gsap.context(() => {
      // Select all sections with a common class for the fade-in animation
      const sections = gsap.utils.toArray(".animated-section");

      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { opacity: 0, y: mobile ? 30 : 60 },
          {
            opacity: 1,
            y: 0,
            duration: getResponsiveDuration(1.2),
            ease: "power3.out",
            scrollTrigger: getResponsiveScrollTrigger({
              trigger: sec,
              start: mobile ? "top 90%" : "top 85%",
              end: mobile ? "bottom 60%" : "bottom 45%",
            }),
          }
        );
      });

      // Parallax background motion - desktop only
      if (!mobile) {
        gsap.to(".parallax-bg", {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: main.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Floating blob animations
      gsap.to(".blob", {
        y: "+=25",
        repeat: -1,
        yoyo: true,
        duration: 5,
        ease: "sine.inOut",
      });
    }, main);

    // Setup refresh on resize/orientation change
    const cleanup = setupScrollTriggerRefresh();

    return () => {
      ctx.revert();
      cleanup();
    };
  }, []);

  return (
    <>
      <NavBar />
    <div ref={main} className="bg-[#0b0b0b] text-white relative overflow-hidden">
      {/* Floating Blobs Background */}
      <div className="parallax-bg absolute inset-0 -z-10">
        <div className="blob absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-600/30 to-purple-700/30 rounded-full blur-3xl"></div>
        <div className="blob absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-r from-pink-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
        <div className="blob absolute top-1/2 right-1/4 w-56 h-56 bg-gradient-to-r from-yellow-600/20 to-red-500/20 rounded-full blur-3xl"></div>
      </div>

      {/*Hero Section */}
      <section
        className="animated-section flex flex-col justify-center items-center text-center py-32 px-6 lg:px-20 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          The Startup Operating System
        </h1>
        <p className="text-gray-300 max-w-2xl leading-relaxed text-lg">
          SFCollab unifies execution, real-time collaboration, operations, and AI-assisted workflows into one calm, continuous platform built for founders.
        </p>
      </section>

      {/*Mission & Vision */}
      <section
        className="animated-section flex flex-col lg:flex-row items-center gap-12 py-20 px-6 lg:px-20 relative z-10"
      >
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
            alt="Innovation"
            className="rounded-2xl shadow-2xl w-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Mission & Operating Principles
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Execution over ideation. Replace scattered tools with a single source of truth where tasks, docs, chat, and decisions live together.
          </p>
          <p className="text-gray-300 leading-relaxed">
            Built founder-first. Real-time by default. AI that summarizes, prioritizes, and unblocks without noise.
          </p>
        </div>
      </section>

      {/*Timeline Section */}
      <section
        className="animated-section py-24 px-6 lg:px-20 bg-[#111111]/60 backdrop-blur-md relative z-10"
      >
        <h2 className="text-center text-3xl lg:text-4xl font-semibold mb-16 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Building The Operating System
        </h2>

        <div className="relative border-l border-gray-700 max-w-3xl mx-auto">
          {[
            {
              year: "2023",
              title: "Unified Execution",
              text: "First core: tasks, docs, and presence in one system. Real-time foundation < 50ms.",
            },
            {
              year: "2024",
              title: "Operational Layer",
              text: "Permissions, governance, and continuity across teams without friction.",
            },
            {
              year: "2025",
              title: "AI-Assisted Workflows",
              text: "Summaries, prioritization, and unblockers integrated into the flow of work.",
            },
            {
              year: "Next",
              title: "Momentum at Scale",
              text: "A calm, deliberate system for teams with velocity. Integrations without context loss.",
            },
          ].map((item, i) => (
            <div key={i} className="mb-12 pl-8 relative">
              <span className="absolute left-0 top-2 w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full shadow-lg"></span>
              <h3 className="text-xl font-semibold">{item.year}</h3>
              <h4 className="text-lg text-gray-200 mt-1">{item.title}</h4>
              <p className="text-gray-400 mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/*Team Section */}
      {/* <section
        className="animated-section py-24 px-6 lg:px-20 text-center bg-[#0b0b0b]/80 relative z-10"
      >
        <h2 className="text-3xl lg:text-4xl font-semibold mb-12 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              name: "Oskar",
              role: "CEO",
              img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80",
            },
            {
              name: "Suhail",
              role: "Full Stack Developer",
              img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80",
            },
            {
              name: "Emmanuel",
              role: "Backend Developer",
              img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&q=80",
            },
          ].map((person, i) => (
            <div
              key={i}
              className="bg-[#111111] rounded-2xl p-6 flex flex-col items-center hover:scale-105 hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-500"
            >
              <img
                src={person.img}
                alt={person.name}
                className="w-32 h-32 rounded-full object-cover mb-4 border-2 border-purple-400/50"
              />
              <h3 className="text-xl font-semibold">{person.name}</h3>
              <p className="text-gray-400">{person.role}</p>
            </div>
          ))}
        </div>
      </section> */}

        {/*Call to Action */}
        <JoinSection text="Use Sf Collab to execute faster, collaborate better, and scale smarter — without switching tools."
        title='Operate Your Startup In One Place' ref={null} />
      
      </div>
      <Footer />
      </>
  );
};

export default About;
