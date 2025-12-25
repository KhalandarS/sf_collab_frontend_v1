import React, { useEffect } from "react";
import Hero from "../Home/Hero";
import AboutSection from "../Home/AboutSection";
import Roadmap from "../Home/Roadmap";
import Explore from "../Home/Explore";
import Products from "../Home/Products";
import StartUp from "../Home/StartUp";
import Contact from "./Contact";
import Team from "./Team";
import Navbar from "../Navbar";
import Footer from "../Footer";

import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
      wheelMultiplier: 1,
      smoothTouch: false,
    });

    // Lenis RAF
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.killAll();
    };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Page Sections */}
      <main className="flex flex-col space-y-24 overflow-x-hidden">
        <Hero />
        <AboutSection />
        <Explore />
        <Products />
        <Roadmap />
        <Team />
        <StartUp />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
