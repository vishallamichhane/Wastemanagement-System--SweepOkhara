import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BsCalendarEvent, BsMapFill, BsExclamationTriangle, BsCheckCircle, BsClock, BsTrash } from "react-icons/bs";


export default function UserHomePage() {

  return (
    <>
      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-8 md:mt-10 mb-12 sm:mb-16 pb-20 sm:pb-0 space-y-6 sm:space-y-8 md:space-y-10 relative z-10">
        {/* Welcome and Report button row */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 animate-slide-down">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Welcome, User!
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-base sm:text-lg font-medium">
              Your dashboard for a cleaner Pokhara.
            </p>
          </div>

          <Link to="/user/report" className="w-full sm:w-auto">
            <button
            type="button"
            className="w-full sm:w-auto bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3 text-white text-sm sm:text-base font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 inline-flex items-center justify-center gap-2 sm:gap-3 animate-pulse-slow"
            >
           <BsExclamationTriangle className="text-lg sm:text-xl" />
           <span>Report Issue</span>
          </button>
        </Link>

        </section>

        {/* Overview + Waste Pickup Schedules */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Overview */}
          <div
            className="lg:col-span-2 rounded-xl sm:rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-fade-in min-h-[280px] sm:min-h-[320px]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('https://i.pinimg.com/1200x/c2/a7/59/c2a759c8b55b775d3e107f62b597698b.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "overlay"
            }}
          >
            {/* Animated overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Actual content */}
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4 drop-shadow-lg">
                City Overview
              </h2>
              <p className="text-white/90 text-sm sm:text-base md:text-lg font-medium drop-shadow-md max-w-xl">
                Real-time bin fill levels and waste collection vehicle locations across Pokhara.
              </p>
            </div>

            <Link 
              to="/user/map"
              className="relative z-10 mt-4 sm:mt-6 inline-flex items-center justify-center gap-2 sm:gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white text-sm sm:text-base font-bold rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 group/btn w-full sm:w-auto"
            >
              <BsMapFill className="text-lg sm:text-xl group-hover/btn:scale-110 transition-transform" />
              <span>Explore Map View</span>
            </Link>
          </div>

          {/* Waste Pickup Schedules */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100/50 animate-fade-in-delay">
            <h2 className="text-lg sm:text-xl font-bold text-green-800 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <BsCalendarEvent className="text-2xl sm:text-3xl text-green-600 animate-pulse-slow" />
              <span>Pickup Schedule</span>
            </h2>
            <ul className="space-y-3 sm:space-y-4 text-gray-700">
              <li className="border-l-4 border-blue-500 pl-3 sm:pl-4 py-2 bg-blue-50/50 rounded-r-lg hover:bg-blue-50 transition-colors duration-300">
                <span className="font-bold text-blue-700 block text-xs sm:text-sm">TOMORROW</span>
                <span className="text-gray-600 text-xs sm:text-sm">General & Recyclable Waste</span>
              </li>
              <li className="border-l-4 border-green-500 pl-3 sm:pl-4 py-2 bg-green-50/50 rounded-r-lg hover:bg-green-50 transition-colors duration-300">
                <span className="font-bold text-green-700 block text-xs sm:text-sm">JULY 1ST, 2024</span>
                <span className="text-gray-600 text-xs sm:text-sm">Organic Waste Collection</span>
              </li>
              <li className="border-l-4 border-gray-400 pl-3 sm:pl-4 py-2 bg-gray-50/50 rounded-r-lg hover:bg-gray-50 transition-colors duration-300">
                <span className="font-bold text-gray-700 block text-xs sm:text-sm">JULY 8TH, 2024</span>
                <span className="text-gray-600 text-xs sm:text-sm">General & Recyclable Waste</span>
              </li>
            </ul>
            <Link 
              to="/user/schedule"
              className="text-green-600 mt-3 sm:mt-5 block text-xs sm:text-sm font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-1 group/link"
            >
              View full calendar
              <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </section>

        {/* Awareness Info */}
        <section className="animate-slide-up">
          <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Eco Awareness
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Card 1 */}
            <Link to="/user/awareness1" className="block">
              <article className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-green-100/50 group h-full">
                <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img 
                    src="https://i.pinimg.com/736x/de/0b/3a/de0b3a9531a93b36d25c78b3523307a0.jpg" 
                    alt="Reduce Reuse Recycle" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-green-800 font-bold text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-green-700 transition-colors">
                    The 3 R's: Reduce, Reuse, Recycle
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base flex-grow mb-3 sm:mb-4">
                    Learn how to minimize waste and its impact on the environment through sustainable practices.
                  </p>
                  <div className="text-green-600 text-sm sm:text-base font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-2 group/link">
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Card 2 */}
            <Link to="/user/awareness2" className="block">
              <article className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-green-100/50 group h-full">
                <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img
                    src="https://i.pinimg.com/1200x/bf/33/6c/bf336c5cca4848a14997a569d1ce3445.jpg"
                    alt="Composting"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-green-800 font-bold text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-green-700 transition-colors">
                    Composting at Home
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base flex-grow mb-3 sm:mb-4">
                    Turn your kitchen scraps into nutrient-rich soil for your garden with easy composting methods.
                  </p>
                  <div className="text-green-600 text-sm sm:text-base font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-2 group/link">
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Card 3 */}
            <Link to="/user/awareness3" className="block">
              <article className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-green-100/50 group h-full">
                <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img
                    src="https://i.pinimg.com/1200x/63/7e/33/637e33cb367435cf7f39e57d1b52676d.jpg"
                    alt="Waste Segregation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className="text-green-800 font-bold text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-green-700 transition-colors">
                    Smart Segregation
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base flex-grow mb-3 sm:mb-4">
                    Master the art of waste separation to maximize recycling and minimize environmental impact.
                  </p>
                  <div className="text-green-600 text-sm sm:text-base font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-2 group/link">
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      </main>

      {/* Enhanced animations */}
      <style jsx>{`
        /* Floating background elements */
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
        
        /* Slide animations */
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
        
        /* Fade in animations */
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        /* Pulse animation */
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
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
    </>
  );
}