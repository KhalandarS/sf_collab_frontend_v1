import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const Products = () => {
  const imgRefs = useRef([]);
  const sectionRef = useRef(null);

  const handleHover = (index, scale) => {
    const img = imgRefs.current[index];
    if (img) {
      img.style.transform = `scale(${scale})`;
    }
  };

  const projects = [
    {
      id: 1,
      year: "System",
      title: "Execution Engine",
      desc: "Tasks, docs, and decisions in one place. Real-time updates across teams.",
      img: "/landing_page/1.2.png",
    },
    {
      id: 2,
      year: "System",
      title: "Collaboration Infrastructure",
      desc: "Live presence, async workflows, timezone-aware. Built for distributed teams.",
      img: "/landing_page/2.5 (2).png",
    },
    {
      id: 3,
      year: "System",
      title: "Operational Layer",
      desc: "Permissions, governance, and continuity across projects without friction.",
      img: "/landing_page/3.1 (2).png",
    },
    {
      id: 4,
      tag: "Landing Page",
      year: "System",
      title: "Founder Dashboard",
      desc: "Momentum metrics, priorities, and decisions — surfaced when they matter.",
      img: "/landing_page/4.4.png",
    },
    {
      id: 5,
      year: "System",
      title: "AI Workflows",
      desc: "Summaries, prioritization, and unblockers woven into real work, not popups.",
      img: "/landing_page/5.5 (2).png",
    },
    {
      id: 6,
      year: "System",
      title: "Integrations",
      desc: "Connect critical tools without breaking continuity or adding noise.",
      img: "/landing_page/6.4.png",
    },
  ];

  useEffect(() => {
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".products-title",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
      gsap.fromTo(
        ".product-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".products-grid", start: "top 85%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full h-auto p-4 lg:p-8 space-y-10">
      <div className="text-center space-y-2">
        <h2 className="products-title text-2xl lg:text-4xl font-semibold text-white tracking-wide">
          Core Systems
        </h2>
        <p className="text-gray-400 text-sm lg:text-base">
          The operating system that replaces fragmented tools with a single, continuous platform.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            className="product-card relative group rounded-xl overflow-hidden bg-[#111] shadow-lg transition-all duration-300 hover:shadow-2xl"
            whileHover={{ y: -6 }}
          >
            <img
              ref={(el) => (imgRefs.current[index] = el)}
              src={project.img}
              alt={project.title}
              className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 ease-in-out"
              onMouseEnter={() => handleHover(index, 1.08)}
              onMouseLeave={() => handleHover(index, 1)}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="text-sm text-gray-300">{project.year}</span>
              <h3 className="text-lg lg:text-xl font-medium">
                {project.title}
              </h3>
              <p className="text-xs lg:text-sm text-gray-400">
                {project.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Products;
