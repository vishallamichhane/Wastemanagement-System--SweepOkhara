import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsArrowLeft, BsCheckCircle, BsLightbulb, BsRecycle, BsTrash } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { GiBroom, GiRecycle } from "react-icons/gi";
import { TbPlant, TbTrash, TbSeeding } from "react-icons/tb";
import { FaLeaf, FaWater, FaTree } from "react-icons/fa";
import segregationImage from "../../assets/images/segregation.png";
import Header from "./components/Header";
import useScrollToTop from "../../hooks/useScrollToTop";



export default function SmartSegregationPage() {
  useScrollToTop();
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
    <>

      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-10 mb-16 pb-20 sm:pb-0 space-y-8 sm:space-y-10 md:space-y-12 relative z-10">
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
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent mb-4">
              Smart Segregation
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of waste separation to maximize recycling and minimize environmental impact.
            </p>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-green-100/50 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8">
            <div className="lg:w-1/2">
              <img 
                src={segregationImage} 
                alt="Smart Waste Segregation" 
                className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-500"
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
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-6 sm:mb-8 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Benefits of Smart Segregation
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Waste Categories Guide
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
        <section className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-2xl border border-green-100/50 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-6 sm:mb-8 md:mb-12 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Smart Segregation in 4 Steps
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-800 mb-6 sm:mb-8 bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
            Common Mistakes & Solutions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
        <section className="bg-gradient-to-r from-blue-500 to-green-600 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Pro Tips for Effective Segregation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
    </>
  );
}