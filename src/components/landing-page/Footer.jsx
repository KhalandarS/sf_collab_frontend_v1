import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);

  useEffect(() => {
    const el = footerRef.current;
    gsap.fromTo(
      el,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
        },
      }
    );
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#0b0b0b] text-gray-300 py-16 px-6 lg:px-20 border-t border-white/10"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/*Brand*/}
        <div>
          <h2 className="text-2xl font-semibold text-white mb-4">SFCollab</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            A startup operating system that unifies execution, collaboration, operations, and AI-assisted workflows into one continuous platform.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            {[
              { name: "Home", href: "/" },
              { name: "Platform", href: "/about" },
              { name: "Startups", href: "/startuppage" },
              { name: "Explore", href: "/explore" },
              { name: "Team", href: "/team" },
              { name: "Contact", href: "/contact" },
            ].map((link, i) => (
              <li key={i}>
                <Link
                  to={link.href}
                  className="hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/waitlist" className="hover:text-white">
                Join Waitlist
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms-and-conditions" className="hover:text-white">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/data-collection-and-tracking" className="hover:text-white">
                Data Collection Policy
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Help & Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Connect</h3>
          <div className="flex items-center gap-4 mb-4">
            {[Instagram, Linkedin, Tiktok].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-400">hello@sfcollab.com</p>
        </div>
      </div>
      <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} SFCollab. Built for founders.
      </div>
    </footer>
  );
};

export default Footer;
