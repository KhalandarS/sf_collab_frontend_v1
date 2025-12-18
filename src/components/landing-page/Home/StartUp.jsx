import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import {Link} from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const StartUp = () => {
  const imageRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        y: 120,
        scale: 1.25,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.fromTo(
        ".startup-content",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 75%" },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="w-full flex items-center h-screen relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            ref={imageRef}
            className="w-full h-full object-cover brightness-[0.4]"
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1600"
            alt="Background"
            style={{
              willChange: "transform",
              transform: "translateY(0) scale(1.25)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <motion.div className="startup-content relative z-10 lg:w-[60%] w-full flex flex-col space-y-5 px-6 text-white">
          <h1 className="lg:text-6xl text-3xl font-bold drop-shadow-md">
            Join The Operating System For Startups
          </h1>
          <p className="lg:text-xl text-base tracking-tight leading-relaxed max-w-2xl drop-shadow-sm">
            Build, collaborate, and operate in one calm, continuous system. Real-time by default. AI when it helps.
          </p>
          <Link
            className="lg:py-4 py-3 bg-white text-zinc-900 font-medium lg:text-lg text-sm hover:bg-zinc-200 transition-all duration-200 rounded-xl lg:w-[220px] w-[160px] flex items-center justify-center shadow-md"
            to="https://bright-bunny-ceef3b.netlify.app/login"
            target='_blank'
          >
            <span>Request Access</span>
          </Link>
        </motion.div>
        <div className="absolute bottom-10 right-10 text-white/70 font-extrabold">
          <span className="lg:text-9xl text-4xl uppercase tracking-tight drop-shadow-md">
            Sfcollab
          </span>
        </div>
      </section>
    </>
  );
};

export default StartUp;
