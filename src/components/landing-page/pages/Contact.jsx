import React, { useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Linkedin, Github ,Instagram} from "lucide-react";
import gsap from "gsap";
import Navbar from "../Navbar";
import Footer from "../Footer";

const Contact = () => {
  const main = useRef();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-animate",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
        }
      );
    }, main);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <Navbar />
    <div ref={main} className="bg-[#0b0b0b] text-white py-20 px-6 lg:px-20 min-h-screen">
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 contact-animate">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4 bg-gradient-to-r from-gray-400 to-black bg-clip-text text-transparent">
            Get In Touch
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed text-lg">
            Have a project in mind or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="contact-animate">
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Details</h2>
              <div className="space-y-4 text-gray-300">
                {/* <p className="flex items-center gap-4">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>123 Innovation Drive, San Francisco, CA 94105</span>
                </p> */}
                <p className="flex items-center gap-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href="mailto:hello@sfcollab.com" className="hover:text-white transition">sfcollab333@gmail.com</a>
                </p>
                {/* <p className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <a href="tel:+1234567890" className="hover:text-white transition">(123) 456-7890</a>
                </p> */}
              </div>
            </div>

            <div className="contact-animate">
              <h2 className="text-2xl font-semibold text-white mb-4">Follow Us</h2>
              <div className="flex items-center gap-6">
                <a href="https://www.linkedin.com/company/sfcollab/about/" className="text-gray-400 hover:text-white transition"><Linkedin className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-white transition"><Instagram className="w-6 h-6" /></a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#111111] p-8 rounded-2xl shadow-lg border border-gray-800 contact-animate">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input type="text" id="name" name="name" className="w-full bg-[#1d1d1d] border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input type="email" id="email" name="email" className="w-full bg-[#1d1d1d] border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input type="text" id="subject" name="subject" className="w-full bg-[#1d1d1d] border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea id="message" name="message" rows="5" className="w-full bg-[#1d1d1d] border border-gray-700 rounded-md py-2 px-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-gray-600 to-black text-white font-semibold py-3 px-6 rounded-md hover:opacity-90 transition-opacity duration-300"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
      <Footer />
      
      </>
  );
};

export default Contact;
