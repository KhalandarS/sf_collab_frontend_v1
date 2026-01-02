import { usersAPI } from "@/utils/APIs/userApi";
import { useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
export default function ContactForm() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const handleSubmitContact = async (e) => {
    e.preventDefault();
    const response = await usersAPI.submitContactForm(contactForm);
    console.log(response);
    if (response.success) {
      toast.success('Your message has been sent successfully!');
    } else {
      toast.error('There was an error sending your message. Please try again later.');
    }
    setContactForm({ name: '', email: '', message: '' });
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 w-full bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700"
    >
      <h3 className="text-2xl font-bold text-white mb-2">Send us a message</h3>
      <p className="text-gray-400 mb-6">
        Can't find what you're looking for? Send us a detailed message and we'll get back to you within 24 hours.
      </p>

      <form onSubmit={handleSubmitContact} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="Your full name"
              value={contactForm.name}
              onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="Your email address"
              value={contactForm.email}
              onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            How can we help you? *
          </label>
          <textarea
            placeholder="Describe your issue or question in detail..."
            rows={4}
            value={contactForm.message}
            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all resize-none"
          />
        </div>
        <Button
          type="submit"
          className="px-6 py-3 hover:shadow-[0px_0px_8px_white] cursor-pointer bg-white text-black hover:bg-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Submit Message
        </Button>
      </form>
    </motion.div>
  )
}