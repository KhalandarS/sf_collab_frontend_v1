import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 1,
    year: "System",
    title: "Execution Engine",
    desc: "Tasks, docs, and decisions in one place. Real-time updates across teams.",
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80",
  },
  {
    id: 2,
    year: "System",
    title: "Collaboration Infrastructure",
    desc: "Live presence, async workflows, timezone-aware. Built for distributed teams.",
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
  },
  {
    id: 3,
    year: "System",
    title: "Operational Layer",
    desc: "Permissions, governance, and continuity across projects without friction.",
    img: "https://images.unsplash.com/photo-1607083206869-4c89d0a2e6d5?w=800&q=80",
  },
  {
    id: 4,
    year: "System",
    title: "Founder Dashboard",
    desc: "Momentum metrics, priorities, and decisions — surfaced when they matter.",
    img: "https://images.unsplash.com/photo-1520975918318-3e9a5c7f3dcb?w=800&q=80",
  },
  {
    id: 5,
    year: "System",
    title: "AI Workflows",
    desc: "Summaries, prioritization, and unblockers woven into real work, not popups.",
    img: "https://images.unsplash.com/photo-1603791452906-b6ab65d8999e?w=800&q=80",
  },
  {
    id: 6,
    year: "System",
    title: "Integrations",
    desc: "Connect critical tools without breaking continuity or adding noise.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  },
];

const Products = () => {
  const main = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".products-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={main} className="bg-[#0b0b0b] py-20 px-6 lg:px-20">
      <div className="text-center space-y-2 mb-16">
        <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-wide bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Core Systems
        </h2>
        <p className="text-gray-400 text-sm lg:text-base max-w-2xl mx-auto">
          The operating system that replaces fragmented tools with a single, continuous platform.
        </p>
      </div>

      <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {projects.map((project) => (
          <div key={project.id} className="product-card group rounded-xl overflow-hidden bg-[#111] shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2">
            <img src={project.img} alt={project.title} className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white">{project.title}</h3>
              <p className="text-gray-400 mt-2 text-sm">{project.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
