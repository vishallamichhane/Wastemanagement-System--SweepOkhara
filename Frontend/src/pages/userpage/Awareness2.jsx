import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsArrowLeft, BsShieldCheck, BsLightbulb, BsClock, BsThermometer } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import { TbPlant, TbLeaf, TbTrash, TbSeeding } from "react-icons/tb";
import { FaRegCompass } from "react-icons/fa";
import Header from "./Header";

export default function CompostingPage() {
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

  const compostingMethods = [
    {
      icon: <TbLeaf className="text-4xl" />,
      title: "Basic Compost Bin",
      description: "Simple and effective method for beginners",
      steps: [
        "Choose a shaded, well-drained location",
        "Layer greens (nitrogen) and browns (carbon)",
        "Turn the pile every 2-4 weeks",
        "Keep moist like a wrung-out sponge"
      ],
      duration: "2-6 months",
      difficulty: "Easy",
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      icon: <TbSeeding className="text-4xl" />,
      title: "Tumbler Composter",
      description: "Fast and convenient rotating system",
      steps: [
        "Add balanced mix of greens and browns",
        "Turn the tumbler every 2-3 days",
        "Monitor temperature and moisture",
        "Harvest when dark and crumbly"
      ],
      duration: "4-8 weeks",
      difficulty: "Medium",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    {
      icon: <BsThermometer className="text-4xl" />,
      title: "Vermicomposting",
      description: "Using worms to create rich compost",
      steps: [
        "Set up worm bin with bedding",
        "Add red wiggler worms",
        "Feed small amounts of kitchen scraps",
        "Harvest worm castings"
      ],
      duration: "3-4 months",
      difficulty: "Medium",
      color: "from-brown-500 to-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    }
  ];

  const materials = {
    greens: [
      "Fruit and vegetable scraps",
      "Coffee grounds and filters",
      "Tea bags",
      "Grass clippings",
      "Plant trimmings"
    ],
    browns: [
      "Dry leaves",
      "Straw or hay",
      "Cardboard (shredded)",
      "Newspaper (shredded)",
      "Wood chips"
    ],
    avoid: [
      "Meat and dairy products",
      "Fats and oils",
      "Diseased plants",
      "Pet wastes",
      "Coal or charcoal ash"
    ]
  };

  const benefits = [
    {
      icon: "🌱",
      title: "Rich Soil Amendment",
      description: "Improves soil structure and fertility naturally"
    },
    {
      icon: "💧",
      title: "Water Retention",
      description: "Helps soil retain moisture, reducing watering needs"
    },
    {
      icon: "🔄",
      title: "Waste Reduction",
      description: "Diverts 30% of household waste from landfills"
    },
    {
      icon: "💰",
      title: "Saves Money",
      description: "Reduces need for chemical fertilizers and soil amendments"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50 via-green-50 to-emerald-100 text-gray-900 relative overflow-hidden">
      <Header />

      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 space-y-12 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all duration-300 group"
          >
            <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-amber-700 to-green-600 bg-clip-text text-transparent mb-4">
              Composting at Home
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your kitchen scraps into nutrient-rich soil for your garden with easy composting methods.
            </p>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100/50 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <img 
                src="https://i.pinimg.com/1200x/eb/e2/81/ebe281accc33f2df48d9a37948fcdb10.jpg" 
                alt="Home Composting" 
                className="w-full h-80 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <TbPlant className="text-3xl text-green-500" />
                <h2 className="text-2xl font-bold text-green-800">Why Compost at Home?</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Composting is nature's way of recycling organic materials into a rich soil amendment. 
                By composting at home, you can reduce landfill waste, create free fertilizer for your plants, 
                and contribute to a healthier environment right from your backyard or balcony.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-center">
                  <div className="text-2xl mb-2">♻️</div>
                  <p className="text-amber-800 font-semibold text-sm">Reduce Waste</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                  <div className="text-2xl mb-2">🌿</div>
                  <p className="text-green-800 font-semibold text-sm">Enrich Soil</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="animate-slide-up">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8 bg-gradient-to-r from-amber-700 to-green-600 bg-clip-text text-transparent">
            Benefits of Home Composting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100/50 transform hover:-translate-y-1 group cursor-pointer"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Composting Methods */}
        <section className="animate-slide-up">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12 bg-gradient-to-r from-amber-700 to-green-600 bg-clip-text text-transparent">
            Composting Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {compostingMethods.map((method, index) => (
              <div 
                key={method.title}
                className={`${method.bgColor} backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border ${method.borderColor} group cursor-pointer transform hover:-translate-y-2 animate-fade-in-delay`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${method.color} flex items-center justify-center text-white mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  {method.icon}
                </div>
                
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2">
                  {method.title}
                </h3>
                
                <p className="text-gray-600 text-center mb-4 text-sm">
                  {method.description}
                </p>
                
                <div className="flex justify-between items-center mb-4 text-xs">
                  <span className="flex items-center gap-1 text-gray-600">
                    <BsClock className="text-amber-600" />
                    {method.duration}
                  </span>
                  <span className={`px-2 py-1 rounded-full ${
                    method.difficulty === "Easy" ? "bg-green-100 text-green-800" :
                    method.difficulty === "Medium" ? "bg-amber-100 text-amber-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {method.difficulty}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
                    <FaRegCompass className="text-amber-600" />
                    Steps:
                  </h4>
                  <ul className="space-y-2">
                    {method.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-3 text-xs text-gray-600">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${method.color} mt-1.5 flex-shrink-0`}></div>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Materials Guide */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100/50 animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8 bg-gradient-to-r from-amber-700 to-green-600 bg-clip-text text-transparent">
            What to Compost
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Greens */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-8 bg-green-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-green-800">Greens 🌿</h3>
              </div>
              <p className="text-green-700 text-sm mb-4">Nitrogen-rich materials</p>
              <ul className="space-y-2">
                {materials.greens.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Browns */}
            <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-8 bg-amber-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-amber-800">Browns 🍂</h3>
              </div>
              <p className="text-amber-700 text-sm mb-4">Carbon-rich materials</p>
              <ul className="space-y-2">
                {materials.browns.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-amber-800">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Avoid */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-8 bg-red-500 rounded-full"></div>
                <h3 className="text-xl font-bold text-red-800">Avoid 🚫</h3>
              </div>
              <p className="text-red-700 text-sm mb-4">Do not compost these</p>
              <ul className="space-y-2">
                {materials.avoid.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-red-800">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="animate-slide-up">
          <div className="bg-gradient-to-r from-amber-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-8">Pro Tips for Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <BsShieldCheck className="text-amber-200" />
                  Perfect Balance
                </h3>
                <p className="text-amber-50">
                  Maintain a 2:1 ratio of browns to greens for optimal composting. 
                  Too many greens can cause odor, while too many browns slow decomposition.
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  <BsThermometer className="text-amber-200" />
                  Temperature Matters
                </h3>
                <p className="text-amber-50">
                  A healthy compost pile should feel warm to the touch. 
                  This indicates microbial activity and proper decomposition.
                </p>
              </div>
            </div>
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