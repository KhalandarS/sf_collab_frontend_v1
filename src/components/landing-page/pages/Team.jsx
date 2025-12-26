import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Linkedin, Twitter, Facebook } from "lucide-react";
import Navbar from "../Navbar";
import Footer from "../Footer";

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    name: "Oskar",
    role: "CEO & Visionary",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=500&q=80",
    desc: "Driving the company's vision and strategy with a passion for innovation.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
  {
    name: "Suhail",
    role: "Lead Full Stack Developer",
    img: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=500&q=80",
    desc: "Architecting robust and scalable solutions that power our platform.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
  {
    name: "Emmanuel",
    role: "Backend & DevOps Engineer",
    img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=500&q=80",
    desc: "Ensuring our infrastructure is reliable, secure, and performs at scale.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
  {
    name: "Jane Doe",
    role: "Lead UI/UX Designer",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&q=80",
    desc: "Crafting intuitive and beautiful user experiences that delight our users.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
  {
    name: "John Smith",
    role: "Frontend Developer",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&q=80",
    desc: "Bringing designs to life with clean, efficient, and interactive code.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
  {
    name: "Emily White",
    role: "Product Manager",
    img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80",
    desc: "Guiding product development from concept to launch with a user-centric approach.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
  {
    name: "Michael Brown",
    role: "Marketing & Growth",
    img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&q=80",
    desc: "Expanding our reach and building a community of passionate innovators.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
  {
    name: "Sarah Green",
    role: "3D & Motion Graphics Artist",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80",
    desc: "Creating stunning visuals and animations that define our brand's identity.",
    socials: {
      linkedin: "#",
      twitter: "#",
      facebook: "#",
    },
  },
];

const Team = () => {
  const main = useRef();

  useEffect(() => {
    const ctx = gsap.context((self) => {
      const cards = self.selector(".team-card");
      const grid = self.selector(".team-grid");

      // Set initial state for a more subtle entrance
      gsap.set(cards, { opacity: 0, y: 50, scale: 0.95 });

      // Create a timeline for the pinned animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: grid,
          start: "top top",
          end: () => "+=" + (cards.length * 200), // Increase scroll distance for a slower, smoother feel
          pin: true,
          scrub: 1.5, // Increase scrub value for more smoothing
          anticipatePin: 1,
        },
      });

      // Animate each card into view sequentially
      cards.forEach((card) => {
        tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }, "-=0.5");
      });
    }, main); // scope the context to the main ref
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
    <div ref={main} className="bg-[#0b0b0b] text-white py-20 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
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
              className="team-card bg-[#111111] rounded-2xl p-6 flex flex-col items-center text-center border border-transparent hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(139,92,246,0.2)] transition-all duration-300"
            >
              <img
                src={person.img}
                alt={person.name}
                className="w-32 h-32 rounded-full object-cover mb-5 border-2 border-purple-400/30"
              />
              <h3 className="text-xl font-semibold text-white">{person.name}</h3>
              <p className="text-indigo-400 font-medium mb-2">{person.role}</p>
              <p className="text-gray-400 text-sm">{person.desc}</p>
              <div className="flex items-center gap-4 mt-4">
                <a href={person.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
                <a href={person.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><Twitter size={20} /></a>
                <a href={person.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors"><Facebook size={20} /></a>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      <Footer />
      </>
  );
};

export default Team;