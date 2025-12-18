import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Startup = () => {
  const heroRef = useRef(null);
  const stepsRef = useRef(null);
  const toolsRef = useRef(null);
  const joinRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const sections = [heroRef.current, stepsRef.current, toolsRef.current, joinRef.current];

    sections.forEach((section) => {
      if (!section) return;
      gsap.fromTo(
        section,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            end: "bottom 45%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Floating background blobs
    gsap.to(".blob", {
      y: "+=25",
      repeat: -1,
      yoyo: true,
      duration: 5,
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="bg-[#0b0b0b] text-white relative overflow-hidden">
      {/* Floating blobs */}
      <div ref={bgRef} className="absolute inset-0 -z-10">
        <div className="blob absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-indigo-600/30 to-purple-700/30 rounded-full blur-3xl"></div>
        <div className="blob absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-r from-pink-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="text-center py-32 px-6 lg:px-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Operate Your Startup In One System
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
          Sf Collab replaces multiple tools with a unified OS for execution, real-time collaboration, operations, and AI-assisted workflows.
        </p>
      </section>

      {/* How It Helps */}
      <section ref={stepsRef} className="py-24 px-6 lg:px-20 bg-[#111111]/60 backdrop-blur-md">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-12 text-center bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Founder-First Outcomes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: "Execution Engine",
              desc: "Move work forward with tasks, docs, and decisions in one place.",
            },
            {
              title: "Collaboration Infrastructure",
              desc: "Live presence, async workflows, timezone-aware for distributed teams.",
            },
            {
              title: "AI-Assisted Workflows",
              desc: "Summaries, prioritization, and unblockers when they help — never noise.",
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#1a1a1a] p-8 rounded-2xl hover:scale-105 transition-transform duration-500 shadow-xl">
              <h3 className="text-2xl font-semibold mb-4 text-indigo-400">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Section */}
      <section ref={toolsRef} className="py-24 px-6 lg:px-20 text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-10 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Core Systems
        </h2>
        <p className="max-w-3xl mx-auto text-gray-300 mb-12">
          One OS that replaces planning tools, task boards, docs, and communication. Fewer tabs. Zero context switching.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {["Execution Engine", "Collaboration Infrastructure", "Operational Layer", "AI Workflows"].map((tool, i) => (
            <div key={i} className="bg-[#111111] py-10 px-6 rounded-2xl hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-500">
              <h3 className="text-lg font-semibold text-indigo-300">{tool}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Join Section */}
      <section ref={joinRef} className="py-24 px-6 lg:px-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold mb-6">Request Access</h2>
        <p className="text-gray-200 mb-10">
          Build calmly and deliberately. Operate with momentum. Replace your stack with one system.
        </p>
        <a
          href="https://bright-bunny-ceef3b.netlify.app/login"
          className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Request Access →
        </a>
      </section>
    </div>
  );
};

export default Startup;
