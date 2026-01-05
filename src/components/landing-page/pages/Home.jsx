
import React, { useEffect, useRef } from 'react'
import Hero from '../Home/Hero'
import About from '../Home/About'
import Roadmap from '../Home/Roadmap'
import AboutSection from '../Home/AboutSection'
import Explore from '../Home/Explore'
import Products from '../Home/Products'
import StartUp from '../Home/StartUp'
import Contact from './Contact'
import Team from './team/TeamComponent'
import NavBar from '../Navbar'
import Footer from '../Footer'
import 'lenis/dist/lenis.css'

const Home = () => {
  useEffect(() => {
    let lenis;
    let rafId;
    
    // Dynamically import Lenis and initialize on the client side
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis();
      
      // Optional: Log scroll events for debugging
      lenis.on('scroll', (e) => {
        console.log(e);
      });
      
      const raf = (time) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      
      rafId = requestAnimationFrame(raf);
    });
    
    // Cleanup function to destroy Lenis and cancel animation frame
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (lenis) lenis.destroy();
    }
  }, [])

  return (
    <div className="overflow-y-hidden md:w-full w-screen">
        <NavBar/>

      <section className='flex w-full flex-col overflow-x-hidden scrollbar-hide scroll-smooth'>
        <Hero/>
        <AboutSection/>
        <Explore/>
        <Products/>
        <Roadmap/>
        {/* <Team/> */}
        <StartUp/>
        <Contact/>
      </section>

        <Footer/>
    </div>
  )
}

export default Home
