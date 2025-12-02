import React, { useState, useEffect } from "react";
import { GiBroom } from "react-icons/gi";
import { BsPhone, BsEnvelope, BsGeoAlt, BsClock, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function ContactPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-gray-800 font-sans flex flex-col relative overflow-hidden">
      <Header />

      {/* Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-16 py-12 relative z-10">
        {/* Enhanced Header */}
        <header className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We're here to help and answer any question you might have. We look forward to hearing from you.
          </p>
        </header>

        {/* Enhanced Contact Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 lg:p-12 grid gap-12 lg:grid-cols-2 border border-green-100">
          {/* Enhanced Form */}
          <form className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
              Send Us a Message
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-left text-gray-700 font-semibold mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 px-4 py-3 text-gray-700 bg-white/50 transition-all duration-300 hover:border-green-300"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-gray-700 font-semibold mb-2" htmlFor="email">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 px-4 py-3 text-gray-700 bg-white/50 transition-all duration-300 hover:border-green-300"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-gray-700 font-semibold mb-2" htmlFor="subject">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Regarding my waste collection"
                  className="w-full rounded-xl border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 px-4 py-3 text-gray-700 bg-white/50 transition-all duration-300 hover:border-green-300"
                  required
                />
              </div>

              <div>
                <label className="block text-left text-gray-700 font-semibold mb-2" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Please type your message here..."
                  rows={6}
                  className="w-full rounded-xl border border-green-200 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 px-4 py-3 text-gray-700 bg-white/50 resize-y transition-all duration-300 hover:border-green-300"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-500 w-full flex items-center justify-center gap-2"
            >
              Send Message
              <BsArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </form>

          {/* Enhanced Contact Info */}
          <aside className="flex flex-col gap-8 text-left animate-fade-in-up animation-delay-200">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-2">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 hover:border-green-300 transition-all duration-300 group hover:scale-105">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <BsPhone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-600 text-sm">Phone</span>
                  <a href="tel:+97761555555" className="block text-gray-900 font-semibold hover:text-green-700 transition-colors">
                    +977-61-555-555
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:border-blue-300 transition-all duration-300 group hover:scale-105">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <BsEnvelope className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-600 text-sm">Email</span>
                  <a href="mailto:contact@sweepokhara.gov.np" className="block text-gray-900 font-semibold hover:text-blue-700 transition-colors">
                    contact@sweepokhara.gov.np
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 hover:border-amber-300 transition-all duration-300 group hover:scale-105">
                <div className="bg-gradient-to-r from-amber-500 to-yellow-500 p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <BsGeoAlt className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-600 text-sm">Address</span>
                  <span className="block text-gray-900 font-semibold">
                    Pokhara Metropolitan City Office
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-300 transition-all duration-300 group hover:scale-105">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl text-white group-hover:scale-110 transition-transform duration-300">
                  <BsClock className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <span className="text-gray-600 text-sm">Our Hours</span>
                  <span className="block text-gray-900 font-semibold whitespace-nowrap">
                    Mon-Fri: 9am-5pm | Sat: 10am-2pm
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Google Map */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Find Us Here</h3>
              <div className="rounded-2xl overflow-hidden shadow-lg aspect-video border border-gray-200 hover:shadow-xl transition-all duration-500">
                <iframe
                  title="Pokhara Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14109.47477917243!2d83.96290782549443!3d28.20992734657389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399596c24d6c0b3f%3A0xbb9de20a53fae9b5!2sPokhara%20Metropolitan%20City!5e0!3m2!1sen!2snp!4v1688939294619!5m2!1sen!2snp"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </aside>
        </section>
      </main>

      {/* Footer - UPDATED with home page style */}
      <footer className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-lg font-bold">
              <GiBroom className="text-emerald-600 text-2xl" />
              <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                Sweepokhara
              </span>
            </div>
            
            <div className="flex gap-8 text-emerald-700 text-sm font-medium">
              <a href="#" className="hover:text-emerald-800 transition-colors duration-300 hover:underline">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-emerald-800 transition-colors duration-300 hover:underline">
                Terms of Service
              </a>
            </div>
            
            <div className="text-emerald-600 text-sm">
              © 2024 Sweepokhara. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Animation Styles */}
      <style jsx>{`
        @keyframes sweep {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .animate-sweep {
          animation: sweep 3s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out both;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}