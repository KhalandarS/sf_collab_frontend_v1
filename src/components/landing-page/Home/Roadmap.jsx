import { Rocket, Target, Brain } from "lucide-react";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    icon: Rocket,
    phase: "PHASE 0",
    title: "MVP – Essential Core",
    gradient: "from-gray-900 to-black-500",
    dot: "bg-white",
    items: [
      "3d Landing",
      "Auto Time Connecting",
      "Business Plan",
      "Social Media Basic",
      "Equity access for founders",
      "Security basics",
      "Flexible access options",
    ],
    description:
      "Launch-ready, lean, and powerful. Focus on usability and essential features for early users.",
  },
  {
    icon: Target,
    phase: "PHASE 1",
    title: "Core Functionalities & Monetization",
    gradient: "from-gray-900 to-black-500",
    dot: "bg-white",
    items: [
      "Google Meet and Drive Replacement",
      "Advanced",
      "Sfmanager",
      "AI Assistent",
      "AI task assignment",
      "Custom triggers",
      "Knowledge base / wiki",
    ],
    description:
      "Focus on engagement, retention, and revenue generation to create a sustainable platform.",
  },
  {
    icon: Brain,
    phase: "PHASE 2",
    title: "Advanced AI Features & Global Expansion",
    gradient: "from-gray-900 to-black-500",
    dot: "bg-white",
    items: [
      "AI chat summaries",
      "Gamification pro mode",
      "AI skill challenges",
      "Virtual whiteboard",
      "Advanced team insights",
      "Auto productivity monitoring",
      "AI-powered recommendations",
      "Randomized startup join",
    ],
    description:
      "AI-powered intelligence, automation, and a dynamic ecosystem for global reach.",
  },
];

export default function Roadmap() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".roadmap-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } }
      );
      gsap.fromTo(
        ".phase-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".phases-grid", start: "top 85%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="h-auto p-6">
      <div className="w-full mx-auto">
        <div className="mb-12 h-[350px] flex flex-col items-center justify-center w-full text-center">
          <h2 className="roadmap-title text-4xl md:text-5xl font-bold text-white mb-4">
            Momentum Roadmap
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            A deliberate path from core execution to intelligent automation. Built to scale without noise.
          </p>
        </div>
        <div className="phases-grid grid grid-cols-1 lg:h-[600px] h-auto w-full lg:grid-cols-3 gap-6">
          {phases.map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.phase}
                className="phase-card bg-transparent border border-gray-600 rounded-xl overflow-hidden shadow-[rgba(88,28,135,0.35)] shadow-2xl hover:shadow-[rgba(88,28,135,0.5)] transition-shadow duration-300"
                whileHover={{ y: -4 }}
              >
                <div className={`bg-gradient-to-r ${phase.gradient} text-white p-6`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-8 h-8" />
                    <div>
                      <p className="text-sm font-medium opacity-90">{phase.phase}</p>
                      <h2 className="text-xl font-bold">{phase.title}</h2>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-white font-semibold mb-6 leading-relaxed">{phase.description}</p>
                  <ul className="space-y-3">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className={`w-2 h-2 ${phase.dot} rounded-full mt-2 flex-shrink-0`}></div>
                        <span className="text-slate-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
