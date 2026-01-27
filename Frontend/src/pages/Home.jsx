import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiBroom } from "react-icons/gi";
import { BsTruck, BsExclamationTriangle, BsLightbulb, BsArrowRight, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Header from "../components/Header";
import useScrollToTop from "../hooks/useScrollToTop";

const testimonials = [
  {
    quote: "SweePokhara has transformed our neighborhood. It's so easy to report issues, and the community has never been cleaner.",
    name: "Ashwin Rajbomsi",
    role: "Community Leader",
    image: "https://i.pinimg.com/1200x/30/e5/18/30e5185980e8eca9a44f8647f7780d0c.jpg",
  },
  {
    quote: "The app makes waste reporting and scheduling super accessible. A true community enhancer!",
    name: "Awan Poudel",
    role: "Local Resident",
    image: "https://i.pinimg.com/1200x/30/e5/18/30e5185980e8eca9a44f8647f7780d0c.jpg",
  },
  {
    quote: "Thanks to SweePokhara, our parks and streets have become cleaner and healthier spaces for everyone.",
    name: "Bibek Lamichhane",
    role: "Environmental Activist",
    image: "https://i.pinimg.com/1200x/30/e5/18/30e5185980e8eca9a44f8647f7780d0c.jpg",
  },
];

const slidingImages = [
  "https://i.pinimg.com/1200x/35/da/f1/35daf12107d4d422153b116d82bcf579.jpg",
  "https://i.pinimg.com/736x/ac/ad/9d/acad9dd78c16dff2757df93c563e60a9.jpg",
  "https://i.pinimg.com/1200x/fc/0f/c7/fc0fc7a17a49cbe5b5a4341ae32e1ce6.jpg",
  "https://i.pinimg.com/1200x/8b/07/76/8b077655d102117e9f7fd070039ef88e.jpg",
];

export default function Home() {
  useScrollToTop();
  const navigate = useNavigate();
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
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full opacity-20 mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-teal-200 rounded-full opacity-20 mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-cyan-200 rounded-full opacity-15 mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-emerald-300 rounded-full opacity-10 mix-blend-multiply filter blur-3xl animate-blob-reverse"></div>
      </div>
      <Header />

      {/* Enhanced Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-10 mt-4 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 relative z-10">
        {/* Left Content */}
        <div className="max-w-2xl space-y-8 animate-fade-in-up">
          <div className="space-y-6">
           
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight animate-slide-in-left">
              Creating a Cleaner{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent animate-gradient">City</span>,{" "}
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent animate-gradient animation-delay-500">Together</span>.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed animate-fade-in animation-delay-300">
              SweePokhara is your smart solution for efficient waste management and community involvement. Join us to make a difference.
            </p>
          </div>
          <button 
            onClick={() => navigate('/register')}
            className="group bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-4 rounded-2xl font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 flex items-center gap-3 animate-fade-in animation-delay-600 hover:from-emerald-700 hover:to-teal-700 relative overflow-hidden cursor-pointer">
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            <span className="relative z-10">Get Started</span>
            <BsArrowRight className="group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
          </button>
        </div>

        {/* Enhanced Image Slider with Attractive Arrows */}
        <div className="relative w-full max-w-2xl animate-fade-in-right">
          <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-white/30 bg-gradient-to-br from-white/80 to-emerald-50/50 backdrop-blur-sm transition-all duration-500">
            <div className="relative aspect-[13/9] overflow-hidden">
              {slidingImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`Clean City ${idx + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
                    idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
                  }`}
                  draggable={false}
                />
              ))}
              
              {/* Slide Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full">
                {slidingImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentSlide 
                        ? 'bg-white w-6 h-2 shadow-lg' 
                        : 'bg-white/60 hover:bg-white/80 w-2 h-2'
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
            icon: <BsExclamationTriangle className="text-6xl text-emerald-600 animate-alert" />,
            title: "Citizen Reporting",
            desc: "Easily report waste issues in your area with just a few clicks.",
          }, {
            icon: <BsLightbulb className="text-6xl text-emerald-600 animate-bulb" />,
            title: "Environmental Awareness",
            desc: "Access resources and information to help our community stay clean.",
          }].map(({ icon, title, desc }, index) => (
            <div
              key={title}
              className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-emerald-100"
            >
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6">
                <div className="relative z-10">
                  {icon}
                </div>
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
              <div key={title} className="text-center">
                <div className="relative mb-6">
                  <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-gray-100">
                    <img
                      src={img}
                      alt={title}
                      className="w-full h-48 object-cover"
                      draggable={false}
                    />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border-2 border-emerald-100 hover:border-emerald-200 transition-all duration-500 hover:shadow-3xl">
          <div className="text-center">
            <blockquote className="text-2xl text-gray-700 italic leading-relaxed mb-8 max-w-2xl mx-auto transition-all duration-500 animate-fade-in">
              "{testimonials[currentTestimonial].quote}"
            </blockquote>
            <div className="flex items-center justify-center gap-6 animate-fade-in animation-delay-300">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-20"></div>
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 rounded-full object-cover shadow-lg transition-transform duration-500 hover:scale-110 relative z-10 border-2 border-white"
                  draggable={false}
                />
              </div>
              <div className="text-left">
                <p className="text-xl font-bold text-gray-900 bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
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
                  className={`rounded-full transition-all duration-500 cursor-pointer hover:scale-110 ${
                    idx === currentTestimonial
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 w-8 h-3 shadow-lg"
                      : "bg-emerald-300 hover:bg-emerald-400 w-3 h-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA */}
      <section className="max-w-6xl mx-auto px-6 lg:px-10 mt-28 mb-24 relative z-10 animate-fade-in-up">
        <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 animate-shimmer"></div>
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full animate-blob"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-white/10 rounded-full animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full animate-blob-reverse"></div>
          
          <div className="relative z-10">
            <h3 className="text-4xl font-bold mb-6 leading-tight animate-fade-in">
              Join the Movement for a Cleaner Tomorrow
            </h3>
            <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto animate-fade-in animation-delay-300">
              Register today and become an active part of the solution. Let's make our city a better place, one report at a time.
            </p>
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-emerald-700 font-bold px-12 py-4 rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 animate-fade-in animation-delay-600 hover:bg-emerald-50 relative overflow-hidden group cursor-pointer">
              <span className="absolute inset-0 bg-gradient-to-r from-emerald-100/50 to-teal-100/50 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              <span className="relative z-10">Register Now</span>
            </button>
          </div>
        </div>
      </section>


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

        @keyframes alertBlink {
          0%, 55% { opacity: 1; transform: scale(1); }
          60% { opacity: 0.4; transform: scale(0.98); }
          70% { opacity: 1; transform: scale(1.02); }
          80% { opacity: 0.4; transform: scale(0.98); }
          90% { opacity: 1; transform: scale(1.03); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes bulbGlow {
          0%, 100% { 
            filter: drop-shadow(0 0 0px rgba(16, 185, 129, 0.25));
            transform: translateY(0) scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 14px rgba(16, 185, 129, 0.6));
            transform: translateY(-2px) scale(1.05);
          }
        }

        .animate-alert {
          animation: alertBlink 2s ease-in-out infinite;
          transform-origin: center;
        }

        .animate-bulb {
          animation: bulbGlow 2.6s ease-in-out infinite;
          transform-origin: center;
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