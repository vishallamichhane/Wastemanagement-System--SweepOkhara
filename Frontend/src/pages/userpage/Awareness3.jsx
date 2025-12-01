import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsArrowLeft, BsCheckCircle, BsLightbulb, BsRecycle, BsTrash } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { GiBroom, GiRecycle } from "react-icons/gi";
import { TbPlant, TbTrash, TbSeeding } from "react-icons/tb";
import { FaLeaf, FaWater, FaTree } from "react-icons/fa";
import segregationImage from "../../assets/images/segregation.png";



export default function SmartSegregationPage() {
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

  const wasteCategories = [
    {
      icon: <BsRecycle className="text-4xl" />,
      title: "Recyclable Waste",
      color: "bg-blue-100",
      borderColor: "border-blue-300",
      textColor: "text-blue-800",
      items: [
        "Paper & Cardboard",
        "Plastic bottles & containers",
        "Glass bottles & jars",
        "Metal cans & foil",
        "Tetrapak containers"
      ],
      tips: [
        "Rinse containers before disposal",
        "Flatten cardboard boxes",
        "Remove caps from bottles",
        "Keep dry and clean"
      ],
      iconColor: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaLeaf className="text-4xl" />,
      title: "Organic Waste",
      color: "bg-green-100",
      borderColor: "border-green-300",
      textColor: "text-green-800",
      items: [
        "Food scraps",
        "Vegetable peels",
        "Coffee grounds",
        "Eggshells",
        "Yard waste"
      ],
      tips: [
        "Use compostable bags",
        "Keep container covered",
        "Empty daily in summer",
        "No plastic mixed in"
      ],
      iconColor: "from-green-500 to-emerald-500"
    },
    {
      icon: <BsTrash className="text-4xl" />,
      title: "General Waste",
      color: "bg-gray-100",
      borderColor: "border-gray-300",
      textColor: "text-gray-800",
      items: [
        "Plastic wrappers",
        "Diapers & sanitary items",
        "Broken glass",
        "Cigarette butts",
        "Mixed materials"
      ],
      tips: [
        "Minimize this category",
        "Use biodegradable bags",
        "Keep separate from recyclables",
        "Compact to save space"
      ],
      iconColor: "from-gray-500 to-gray-700"
    },
    {
      icon: <FaTree className="text-4xl" />,
      title: "Hazardous Waste",
      color: "bg-red-100",
      borderColor: "border-red-300",
      textColor: "text-red-800",
      items: [
        "Batteries",
        "Electronics",
        "Medicines",
        "Chemicals",
        "Fluorescent bulbs"
      ],
      tips: [
        "Handle with care",
        "Never mix with regular waste",
        "Use designated drop-off points",
        "Check local disposal guidelines"
      ],
      iconColor: "from-red-500 to-orange-500"
    }
  ];

  const segregationSteps = [
    {
      step: 1,
      title: "Sort at Source",
      description: "Separate waste immediately where it's generated",
      icon: "🏠",
      details: "Use separate bins in kitchen, office, and other areas"
    },
    {
      step: 2,
      title: "Know Your Categories",
      description: "Understand what goes where",
      icon: "📚",
      details: "Learn the different waste categories and their items"
    },
    {
      step: 3,
      title: "Clean & Prepare",
      description: "Prepare recyclables properly",
      icon: "💧",
      details: "Rinse containers and remove labels when possible"
    },
    {
      step: 4,
      title: "Dispose Correctly",
      description: "Use designated bins and collection systems",
      icon: "🚮",
      details: "Follow local waste collection schedules and rules"
    }
  ];

  const benefits = [
    {
      icon: "🌍",
      title: "Environmental Protection",
      description: "Reduces landfill waste and pollution"
    },
    {
      icon: "💰",
      title: "Economic Benefits",
      description: "Creates jobs and saves resources"
    },
    {
      icon: "🔄",
      title: "Resource Recovery",
      description: "Maximizes recycling and composting"
    },
    {
      icon: "🏙️",
      title: "Cleaner City",
      description: "Creates a healthier living environment"
    }
  ];

  const commonMistakes = [
    {
      mistake: "Pizza boxes with grease",
      solution: "Greasy parts go to general waste, clean parts to recyclable",
      icon: "🍕"
    },
    {
      mistake: "Broken glass & mirrors",
      solution: "Wrap safely and put in general waste, not recyclable",
      icon: "🪞"
    },
    {
      mistake: "Plastic bags in recycling",
      solution: "Plastic bags go to general waste or special collection",
      icon: "🛍️"
    },
    {
      mistake: "Food-contaminated paper",
      solution: "Heavily soiled paper goes to organic or general waste",
      icon: "🍽️"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-green-50 to-purple-100 text-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-200 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-green-200 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-purple-200 rounded-full opacity-15 mix-blend-multiply filter blur-xl animate-float-slow animation-delay-2000"></div>
      </div>

      {/* Header with fixed navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-10 py-4 select-none">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <GiBroom className="text-emerald-600 text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              SweepOkhara
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {["Home", "Schedule", "My Reports"].map((item) => (
              <a
                key={item}
                href={"#" + item.toLowerCase().replace(/\s/g, "")}
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                  item === "Home" 
                    ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
                }`}
              >
                {item}
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 ${
                  item === "Home" ? "w-4/5" : ""
                }`}></span>
              </a>
            ))}
            
            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative group transform transition-all duration-300 hover:text-emerald-700 hover:scale-110 focus:outline-none p-2 rounded-xl hover:bg-emerald-50/80"
            >
              <BsBell className="text-xl" />
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600 animate-ping opacity-75"></span>
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600"></span>
            </button>

            {/* User Icon */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center font-semibold select-none shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer group relative">
              U
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>

            {/* Logout Button */}
            <button
              aria-label="Logout"
              className="text-emerald-700 border border-emerald-200 rounded-xl px-4 py-2.5 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 hover:text-white hover:border-transparent transition-all duration-300 flex items-center space-x-2 text-sm shadow-lg hover:shadow-2xl transform hover:scale-105 focus:outline-none"
              type="button"
              onClick={() => alert("Logout clicked")}
            >
              <FiLogOut className="text-base" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-20"></div>

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
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent mb-4">
              Smart Segregation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of waste separation to maximize recycling and minimize environmental impact.
            </p>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100/50 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <img 
                src={segregationImage} 
                alt="Smart Waste Segregation" 
                className="w-full h-80 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <GiRecycle className="text-3xl text-green-500" />
                <h2 className="text-2xl font-bold text-green-800">Why Smart Segregation Matters</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Proper waste segregation is the first and most crucial step in effective waste management. 
                When we separate waste correctly at the source, we enable efficient recycling, reduce landfill burden, 
                and create valuable resources from what would otherwise be trash.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-center">
                  <div className="text-2xl mb-2">📈</div>
                  <p className="text-blue-800 font-semibold text-sm">80% More Recycling</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-center">
                  <div className="text-2xl mb-2">🌿</div>
                  <p className="text-green-800 font-semibold text-sm">Cleaner Environment</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="animate-slide-up">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Benefits of Smart Segregation
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

        {/* Waste Categories */}
        <section className="animate-slide-up">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Waste Categories Guide
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {wasteCategories.map((category, index) => (
              <div 
                key={category.title}
                className={`${category.color} backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border ${category.borderColor} group cursor-pointer transform hover:-translate-y-2 animate-fade-in-delay`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.iconColor} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                  <h3 className={`text-xl font-bold ${category.textColor}`}>
                    {category.title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <BsCheckCircle className="text-green-500" />
                      Includes:
                    </h4>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-current rounded-full opacity-60"></div>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <BsLightbulb className="text-yellow-500" />
                      Tips:
                    </h4>
                    <ul className="space-y-2">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start gap-3 text-sm text-gray-600">
                          <div className="w-2 h-2 bg-current rounded-full opacity-60 mt-1.5"></div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Guide */}
        <section className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-green-100/50 animate-fade-in">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-12 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Smart Segregation in 4 Steps
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {segregationSteps.map((step, index) => (
              <div key={step.step} className="text-center group">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {step.description}
                </p>
                <p className="text-gray-500 text-xs">
                  {step.details}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Common Mistakes & Solutions */}
        <section className="animate-slide-up">
          <h2 className="text-3xl font-bold text-center text-green-800 mb-8 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Common Mistakes & Solutions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {commonMistakes.map((item, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100/50 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <h3 className="font-semibold text-gray-800 text-sm">
                        {item.mistake}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-gray-600 text-sm">
                        {item.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Pro Tips */}
        <section className="bg-gradient-to-r from-blue-500 to-green-600 rounded-3xl p-8 text-white shadow-2xl">
          <h2 className="text-3xl font-bold text-center mb-8">Pro Tips for Effective Segregation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <BsLightbulb className="text-yellow-300" />
                Color Code Your Bins
              </h3>
              <p className="text-blue-50">
                Use different colored bins for each waste category: Blue for recyclables, 
                Green for organic, Black for general, and Red for hazardous waste.
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                <BsCheckCircle className="text-green-300" />
                Educate Your Family
              </h3>
              <p className="text-blue-50">
                Make sure everyone in your household understands the segregation rules. 
                Create simple guides and place them near waste collection areas.
              </p>
            </div>
          </div>
        </section>

        
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 py-8 text-center text-green-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10">
        <span className="font-semibold">© 2024 SweepOkhara. All rights reserved.</span>
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