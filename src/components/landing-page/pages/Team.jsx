import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Linkedin, Instagram } from "lucide-react";
import { 
  getResponsiveScrollTrigger, 
  getResponsiveDuration,
  setupScrollTriggerRefresh,
  isMobile 
} from '../utils/scrollTriggerConfig';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: "Oskar",
    role: "CEO & Visionary",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80",
    desc: "Driving the company's vision and strategy with a passion for innovation.",
  },
  {
    name: "Suhail",
    role: "Lead Full Stack Developer",
    img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80",
    desc: "Architecting robust and scalable solutions that power our platform.",
  },
  {
    name: "Emmanuel",
    role: "Backend & DevOps Engineer",
    img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&q=80",
    desc: "Ensuring our infrastructure is reliable, secure, and performs at scale.",
  },
  {
    name: "Jane Doe",
    role: "Lead UI/UX Designer",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
    desc: "Crafting intuitive and beautiful user experiences that delight our users.",
  },
  {
    name: "John Smith",
    role: "Frontend Developer",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
    desc: "Bringing designs to life with clean, efficient, and interactive code.",
  },
  {
    name: "Emily White",
    role: "Product Manager",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
    desc: "Guiding product development from concept to launch with a user-centric approach.",
  },
  {
    name: "Michael Brown",
    role: "Marketing & Growth",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
    desc: "Expanding our reach and building a community of passionate innovators.",
  },
  {
    name: "Sarah Green",
    role: "3D & Motion Graphics Artist",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80",
    desc: "Creating stunning visuals and animations that define our brand's identity.",
  },
];

const Team = () => {
  const main = useRef();

  useEffect(() => {
    const mobile = isMobile();
    
    const ctx = gsap.context((self) => {
      const cards = self.selector(".team-card");
      const grid = self.selector(".team-grid");
      const header = self.selector(".team-header");

      // Animate header first
      gsap.from(header, {
        opacity: 0,
        y: mobile ? 20 : 30,
        duration: getResponsiveDuration(0.8),
        ease: "power2.out",
        scrollTrigger: getResponsiveScrollTrigger({
          trigger: header,
          start: mobile ? "top 90%" : "top 80%",
        })
      });

      // Set initial state for team cards
      gsap.set(cards, { opacity: 0, y: mobile ? 30 : 50, scale: 0.95 });

      // Mobile: simple stagger animation without pin
      if (mobile) {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: getResponsiveScrollTrigger({
            trigger: grid,
            start: "top 80%",
          })
        });
      } else {
        // Desktop: pinned animation timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: "top top",
            end: () => "+=" + (cards.length * 120),
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
          },
        });

        tl.to({}, { duration: 0.2 });
        cards.forEach((card) => {
          tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power2.out" }, "-=0.3");
        });
      }
    }, main);

    // Setup refresh on resize/orientation change
    const cleanup = setupScrollTriggerRefresh();

    return () => {
      ctx.revert();
      cleanup();
    };
  }, []);

  return (
    <div ref={main} className="bg-[#0b0b0b] text-white py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="team-header text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-gray-900 to-white bg-clip-text text-transparent">
            Meet Our Team
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
            The creative minds and technical wizards behind SFCollab, dedicated to building the future of digital innovation.
          </p>
        </div>

        {/* Team Grid */}
        <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 min-h-screen items-center">
          {teamMembers.map((person, i) => (
            <div
              key={i}
              className="team-card bg-[#111111] rounded-2xl p-6 flex flex-col items-center text-center border border-transparent hover:border-gray-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all duration-300"
            >
              <img
                src={person.img}
                alt={person.name}
                className="w-32 h-32 rounded-full object-cover mb-5 border-2 border-purple-400/30"
              />
              <h3 className="text-xl font-semibold text-white">{person.name}</h3>
              <p className="text-gray-400 font-medium mb-2">{person.role}</p>
              <p className="text-gray-400 text-sm">{person.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;
