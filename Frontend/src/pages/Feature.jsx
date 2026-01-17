import React, { useState, useEffect } from "react";
import { GiBroom } from "react-icons/gi";
import { BsRecycle, BsGeoAlt, BsLightbulb, BsCheckCircleFill, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import useScrollToTop from "../hooks/useScrollToTop";

export default function FeaturePage() {
  useScrollToTop();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 text-gray-800 font-sans flex flex-col relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <Header />

      {/* Enhanced Features Intro */}
      <section id="features" className="relative z-10">
        <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 py-24 px-6 lg:px-16 text-center animate-fade-in-up">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-6xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
              Our Core Features
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover how SweepOkhara leverages technology to create a cleaner, smarter, and more engaged community.
            </p>
          </div>
        </div>
      </section>

      {/* Enhanced Feature 1 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 my-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text left */}
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full px-4 py-2 mb-6 font-semibold text-sm border border-green-200">
            <BsRecycle className="text-lg" />
            Smart Waste Collection
          </span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-6">
            Efficiency Meets Cleanliness
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Our intelligent system revolutionizes waste collection. By using real-time data, we optimize pickup routes, reduce fuel consumption, and ensure bins are never overfilled. This proactive approach not only keeps our city cleaner but also minimizes disruption and environmental impact.
          </p>
          <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-green-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Optimized Routes:</strong> Dynamic scheduling reduces travel time and operational costs.
              </p>
            </li>
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-green-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Real-time Alerts:</strong> Collectors are notified when bins reach capacity, preventing overflows.
              </p>
            </li>
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-green-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Data-driven Insights:</strong> We analyze waste generation patterns to improve service allocation.
              </p>
            </li>
          </ul>
        </div>

        {/* Image right */}
        <div className="relative animate-fade-in-up animation-delay-200">
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-300 rounded-full opacity-50 mix-blend-multiply blur-2xl"></div>
          <div className="rounded-2xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
            <img
              src="https://i.pinimg.com/1200x/ad/8b/9c/ad8b9cb797eba6b76d71b10a27e969e6.jpg"
              alt="White truck on a map route"
              className="object-cover w-full h-96 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* Enhanced Feature 2 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 my-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Image left */}
        <div className="relative lg:order-1 animate-fade-in-up">
          <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-300 rounded-full opacity-50 mix-blend-multiply blur-2xl"></div>
          <div className="rounded-2xl overflow-hidden shadow-2xl group hover:shadow-3xl transition-all duration-500">
            <img
              src="https://i.pinimg.com/736x/f3/67/c5/f367c50cc5483f4408da414577849815.jpg"
              alt="Hand holding mobile phone with SweepOkhara app"
              className="object-cover w-full h-96 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>

        {/* Text right */}
        <div className="lg:order-2 animate-fade-in-up animation-delay-200">
          <span className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full px-4 py-2 mb-6 font-semibold text-sm border border-blue-200">
            <BsGeoAlt className="text-lg" />
            Citizen Reporting
          </span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            Your Eyes on the Streets
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Empowering citizens is at the heart of SweepOkhara. Our user-friendly mobile app allows you to instantly report waste-related issues like illegal dumping or overflowing public bins. Simply snap a photo, add a location, and submit. We'll handle the rest, keeping you updated every step of the way.
          </p>
          <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-blue-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Instant Reporting:</strong> A simple, intuitive interface for quick submissions.
              </p>
            </li>
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-blue-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Geo-tagging:</strong> Accurate location data ensures our teams get to the right spot fast.
              </p>
            </li>
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-blue-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Track Progress:</strong> Receive real-time notifications from submission to resolution.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Enhanced Feature 3 */}
      <section className="max-w-7xl mx-auto px-6 lg:px-16 my-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Text left */}
        <div className="animate-fade-in-up">
          <span className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 rounded-full px-4 py-2 mb-6 font-semibold text-sm border border-amber-200">
            <BsLightbulb className="text-lg" />
            Environmental Awareness
          </span>
          <h2 className="text-4xl font-extrabold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-6">
            Knowledge for a Greener Future
          </h2>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            A cleaner city starts with an informed community. SweepOkhara provides a dedicated resource hub with articles, guides, and news about recycling, waste reduction, and sustainable living. Learn about local initiatives and discover how your actions can contribute to a healthier environment for all.
          </p>
          <ul className="space-y-4 text-gray-600 text-base leading-relaxed">
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-amber-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Educational Content:</strong> Access a library of resources on best waste management practices.
              </p>
            </li>
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-amber-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Community Events:</strong> Stay updated on cleanup drives, workshops, and recycling programs.
              </p>
            </li>
            <li className="flex gap-4 items-start group">
              <BsCheckCircleFill className="mt-1 text-amber-500 text-xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
              <p>
                <strong className="font-semibold text-gray-900">Actionable Tips:</strong> Get practical advice on how to reduce waste at home and in your community.
              </p>
            </li>
          </ul>
        </div>

        {/* Image right */}
        <div className="relative animate-fade-in-up animation-delay-200">
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-300 rounded-full opacity-50 mix-blend-multiply blur-2xl"></div>
          <div className="rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 group hover:shadow-3xl transition-all duration-500">
            <img
              src="https://i.pinimg.com/1200x/88/80/04/888004f7b2078411d2e39df138ca79c3.jpg"
              alt="Illustration of people environmental awareness"
              className="object-contain w-full h-96 p-8 group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        </div>
      </section>

      {/* Enhanced CTA */}
      <section className="max-w-6xl mx-auto px-6 lg:px-16 my-24 relative z-10">
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl p-12 lg:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400 animate-glow"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full animate-pulse-slow animation-delay-2000"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-6 leading-tight">
              Join the Movement for a Cleaner Tomorrow
            </h3>
            <p className="text-green-100 text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Register today and become an active part of the solution. Let's make our city a better place, one report at a time.
            </p>
            <button className="group bg-white text-green-700 font-bold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 flex items-center gap-3 mx-auto">
              Register Now
              <BsArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>


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
        
        @keyframes glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
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
        
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulseSlow 4s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.8);
        }
      `}</style>
    </div>
  );
}