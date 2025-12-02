import React, { useState, useEffect } from "react";
import { GiBroom } from "react-icons/gi";
import { BsTruck, BsExclamationTriangle, BsLightbulb, BsArrowRight, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Header from "../components/Header";

const testimonials = [
  {
    quote: "SweePokhara has transformed our neighborhood. It's so easy to report issues, and the community has never been cleaner.",
    name: "Jane Doe",
    role: "Community Leader",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "The app makes waste reporting and scheduling super accessible. A true community enhancer!",
    name: "John Smith",
    role: "Local Resident",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },
  {
    quote: "Thanks to SweePokhara, our parks and streets have become cleaner and healthier spaces for everyone.",
    name: "Emily Clark",
    role: "Environmental Activist",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const slidingImages = [
  "https://i.pinimg.com/1200x/35/da/f1/35daf12107d4d422153b116d82bcf579.jpg",
  "https://i.pinimg.com/736x/ac/ad/9d/acad9dd78c16dff2757df93c563e60a9.jpg",
  "https://i.pinimg.com/1200x/fc/0f/c7/fc0fc7a17a49cbe5b5a4341ae32e1ce6.jpg",
  "https://i.pinimg.com/1200x/8b/07/76/8b077655d102117e9f7fd070039ef88e.jpg",
];

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidingImages.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, []);



  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slidingImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slidingImages.length) % slidingImages.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 text-gray-800 font-sans flex flex-col relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <Header />

      {/* Enhanced Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-10">
        {/* Left Content */}
        <div className="max-w-2xl space-y-8 animate-fade-in-up">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold border border-emerald-200">
              🚀 Join the Clean City Movement
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Creating a Cleaner{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">City</span>,{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">Together</span>.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              SweePokhara is your smart solution for efficient waste management and community involvement. Join us to make a difference.
            </p>
          </div>
          <button className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 flex items-center gap-3">
            Get Started
            <BsArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>

        {/* Enhanced Image Slider with Attractive Arrows */}
        <div className="relative max-w-lg">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-gradient-to-br from-white/80 to-emerald-50/50 backdrop-blur-sm">
            <div className="relative aspect-[4/3] overflow-hidden">
              {slidingImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Clean City ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                    idx === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                  draggable={false}
                />
              ))}
              
              {/* Enhanced Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group border border-white/20"
              >
                <BsChevronLeft className="group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 group border border-white/20"
              >
                <BsChevronRight className="group-hover:scale-110 transition-transform duration-200" />
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {slidingImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      idx === currentSlide 
                        ? 'bg-white w-6 shadow-lg' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Core Functions */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-28 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-4">
            Our Core Functions
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Advanced solutions for a greener tomorrow.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[{
            icon: <BsTruck className="text-6xl text-emerald-600" />,
            title: "Smart Waste Collection",
            desc: "Optimized routes and schedules for timely and efficient waste pickup.",
          }, {
            icon: <BsExclamationTriangle className="text-6xl text-emerald-600" />,
            title: "Citizen Reporting",
            desc: "Easily report waste issues in your area with just a few clicks.",
          }, {
            icon: <BsLightbulb className="text-6xl text-emerald-600" />,
            title: "Environmental Awareness",
            desc: "Access resources and information to help our community stay clean.",
          }].map(({ icon, title, desc }, index) => (
            <div
              key={title}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border border-emerald-100 hover:border-emerald-200 hover:scale-105 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6 group-hover:scale-110 transition-transform duration-500">
                {icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
              <p className="text-gray-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enhanced Simple Steps - Removed Image Hover Effects */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-28 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-emerald-100">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-4">
              Simple Steps to a Cleaner City
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our streamlined process makes it easy for everyone to contribute. Follow these three steps to make an immediate impact.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[ 
              {
                img: "https://i.pinimg.com/1200x/db/59/56/db5956be6502242352f9297a5cee99b6.jpg",
                title: "Spot & Report",
                desc: "Use our app to quickly report overflowing bins or illegal dumping.",
              },
              {
                img: "https://i.pinimg.com/736x/e9/d5/be/e9d5be3b504620052502de355a6c2329.jpg",
                title: "Schedule Pickup",
                desc: "Our system alerts the nearest collection team and schedules a pickup.",
              },
              {
                img: "https://i.pinimg.com/1200x/0f/af/fb/0faffbb36424b8cafbc9a8cff0a32148.jpg",
                title: "Track & Confirm",
                desc: "Get real-time updates and confirmation once the issue is resolved.",
              },
            ].map(({ img, title, desc }, index) => (
              <div key={title} className="text-center group cursor-pointer">
                <div className="relative mb-6">
                  <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg z-10">
                    {index + 1}
                  </div>
                  <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-500">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-48 object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">
                  {title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="max-w-4xl mx-auto px-6 lg:px-10 mt-28 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-4">
            Loved by Our Community
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join thousands of residents making Pokhara cleaner every day
          </p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-emerald-100">
          <div className="text-center">
            <blockquote className="text-2xl text-gray-700 italic leading-relaxed mb-8 max-w-2xl mx-auto transition-opacity duration-500">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-6">
              <img
                src={testimonials[currentTestimonial].image}
                alt={testimonials[currentTestimonial].name}
                className="w-16 h-16 rounded-full object-cover shadow-lg transition-transform duration-500 hover:scale-110"
                draggable={false}
              />
              <div className="text-left">
                <p className="text-xl font-bold text-gray-900">
                  {testimonials[currentTestimonial].name}
                </p>
                <p className="text-gray-600">
                  {testimonials[currentTestimonial].role}
                </p>
              </div>
            </div>
            <div className="flex justify-center gap-3 mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer ${
                    idx === currentTestimonial
                      ? "bg-emerald-600 scale-125"
                      : "bg-emerald-300 hover:bg-emerald-400"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-28 mb-24 relative z-10">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 animate-glow"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full animate-pulse-slow animation-delay-2000"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-6 leading-tight">
              Join the Movement for a Cleaner Tomorrow
            </h3>
            <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto">
              Register today and become an active part of the solution. Let's make our city a better place, one report at a time.
            </p>
            <button className="bg-white text-emerald-700 font-bold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500">
              Register Now
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-200 py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 text-lg font-bold">
              <GiBroom className="text-emerald-600 text-2xl" />
              <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                SweePokhara
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
              © 2024 SweePokhara. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      {/* Enhanced Animation Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes glow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
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
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
}