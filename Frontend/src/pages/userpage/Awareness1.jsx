import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsArrowLeft, BsRecycle, BsShieldCheck, BsLightbulb } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import { TbPlant } from "react-icons/tb";
import Header from "./Header";

export default function ThreeRsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

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

  const principles = [
    {
      icon: <BsShieldCheck className="text-4xl" />,
      title: "Reduce",
      description: "The most effective way to manage waste is to not create it in the first place.",
      tips: [
        "Choose durable goods that last longer",
        "Use reusable items like coffee cups and shopping bags",
        "Opt for minimal or recyclable packaging",
        "Conserve energy and resources"
      ],
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      icon: <TbPlant className="text-4xl" />,
      title: "Reuse",
      description: "Extend the life of items by finding new purposes for them.",
      tips: [
        "Repair items instead of replacing them",
        "Donate clothes and furniture to charity",
        "Use containers for storage or crafts",
        "Get creative with upcycling projects"
      ],
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: <BsRecycle className="text-4xl" />,
      title: "Recycle",
      description: "Convert waste into new materials and objects.",
      tips: [
        "Paper & Cardboard: newspapers, magazines, boxes",
        "Plastic items: bottles, containers with recycling symbols",
        "Glass bottles and jars of all colors",
        "Metal cans and aluminum foil"
      ],
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 text-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <Header />      

      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 space-y-10 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all duration-300 group"
          >
            <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent mb-4">
              The 3 R's: Reduce, Reuse, Recycle
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to minimize waste and its impact on the environment through these simple yet powerful steps.
            </p>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100/50 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <img 
                src="https://i.pinimg.com/1200x/80/c3/74/80c3749038c5f4ac70ca2888554bb039.jpg" 
                alt="3 R's Concept" 
                className="w-full h-80 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <BsLightbulb className="text-3xl text-yellow-500" />
                <h2 className="text-2xl font-bold text-green-800">Why It Matters</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                The 3 R's represent a fundamental concept in environmental conservation and waste management. 
                By balancing these principles, we can conserve natural resources, save energy, reduce pollution, 
                and create a sustainable future for our community.
              </p>
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200">
                <p className="text-emerald-800 font-semibold text-center">
                  Every small action counts! Together, we can make Sweepokhara cleaner and greener.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principles Grid */}
        <section className="animate-slide-up">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            The Three Principles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {principles.map((principle, index) => (
              <div 
                key={principle.title}
                className={`${principle.bgColor} backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border ${principle.borderColor} group cursor-pointer transform hover:-translate-y-2 animate-fade-in-delay`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${principle.color} flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {principle.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-center text-gray-800 mb-4">
                  {principle.title}
                </h3>
                
                <p className="text-gray-600 text-center mb-6 leading-relaxed">
                  {principle.description}
                </p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${principle.color}`}></div>
                    Practical Tips:
                  </h4>
                  <ul className="space-y-2">
                    {principle.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3 text-sm text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${principle.color} mt-2 flex-shrink-0`}></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 py-8 text-center text-green-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10">
        <span className="font-semibold">© 2024 Sweepokhara. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Privacy Policy
          </a>
          <a href="#" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Terms of Service
          </a>
        </div>
      </footer>

      {/* Enhanced animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        
        @keyframes float-medium {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }
        
        @keyframes slide-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.9;
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.3s both;
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.5s both;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}