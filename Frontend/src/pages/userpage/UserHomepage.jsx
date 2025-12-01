import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BsCalendarEvent, BsMapFill, BsExclamationTriangle, BsCheckCircle, BsClock, BsTrash } from "react-icons/bs";
import Header from "./Header";

export default function UserHomePage() {

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 text-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <Header />

      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 space-y-10 relative z-10">
        {/* Welcome and Report button row */}
        <section className="flex justify-between items-center animate-slide-down">
          <div>
            <h1 className="text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Welcome, User!
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Your dashboard for a cleaner Pokhara.
            </p>
          </div>
          <button
            type="button"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:ring-4 focus:ring-red-400 focus:ring-opacity-50 rounded-xl px-6 py-3 text-white font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 inline-flex items-center gap-3 animate-pulse-slow"
          >
            <BsExclamationTriangle className="text-xl" />
            Report Issue
          </button>
        </section>

        {/* Overview + Waste Pickup Schedules */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Overview */}
          <div
            className="md:col-span-2 rounded-2xl p-8 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 relative overflow-hidden group animate-fade-in"
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
              <h2 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
                City Overview
              </h2>
              <p className="text-white/90 text-lg font-medium drop-shadow-md max-w-xl">
                Real-time bin fill levels and waste collection vehicle locations across Pokhara.
              </p>
            </div>

            <Link 
              to="/mapstatus"
              className="relative z-10 mt-6 inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white font-bold rounded-xl px-6 py-4 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl active:scale-95 group/btn"
            >
              <BsMapFill className="text-xl group-hover/btn:scale-110 transition-transform" />
              <span>Explore Map View</span>
            </Link>
          </div>

          {/* Waste Pickup Schedules */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-green-100/50 animate-fade-in-delay">
            <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-3">
              <BsCalendarEvent className="text-3xl text-green-600 animate-pulse-slow" />
              Pickup Schedule
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r-lg hover:bg-blue-50 transition-colors duration-300">
                <span className="font-bold text-blue-700 block text-sm">TOMORROW</span>
                <span className="text-gray-600 text-sm">General & Recyclable Waste</span>
              </li>
              <li className="border-l-4 border-green-500 pl-4 py-2 bg-green-50/50 rounded-r-lg hover:bg-green-50 transition-colors duration-300">
                <span className="font-bold text-green-700 block text-sm">JULY 1ST, 2024</span>
                <span className="text-gray-600 text-sm">Organic Waste Collection</span>
              </li>
              <li className="border-l-4 border-gray-400 pl-4 py-2 bg-gray-50/50 rounded-r-lg hover:bg-gray-50 transition-colors duration-300">
                <span className="font-bold text-gray-700 block text-sm">JULY 8TH, 2024</span>
                <span className="text-gray-600 text-sm">General & Recyclable Waste</span>
              </li>
            </ul>
            <Link 
              to="/schedule"
              className="text-green-600 mt-5 block text-sm font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-1 group/link"
            >
              View full calendar
              <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </section>

        {/* Awareness Info */}
        <section className="animate-slide-up">
          <h2 className="text-2xl font-bold text-green-800 mb-8 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
            Eco Awareness
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1 */}
            <Link to="/three-rs" className="block">
              <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-green-100/50 group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src="https://i.pinimg.com/736x/de/0b/3a/de0b3a9531a93b36d25c78b3523307a0.jpg" 
                    alt="Reduce Reuse Recycle" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-green-800 font-bold text-lg mb-3 group-hover:text-green-700 transition-colors">
                    The 3 R's: Reduce, Reuse, Recycle
                  </h3>
                  <p className="text-gray-600 flex-grow mb-4">
                    Learn how to minimize waste and its impact on the environment through sustainable practices.
                  </p>
                  <div className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-2 group/link">
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Card 2 */}
            <Link to="/composting" className="block">
              <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-green-100/50 group">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://i.pinimg.com/1200x/bf/33/6c/bf336c5cca4848a14997a569d1ce3445.jpg"
                    alt="Composting"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-green-800 font-bold text-lg mb-3 group-hover:text-green-700 transition-colors">
                    Composting at Home
                  </h3>
                  <p className="text-gray-600 flex-grow mb-4">
                    Turn your kitchen scraps into nutrient-rich soil for your garden with easy composting methods.
                  </p>
                  <div className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-2 group/link">
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Card 3 */}
            <Link to="/smart-segregation" className="block">
              <article className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border border-green-100/50 group">
                <div className="h-48 overflow-hidden">
                  <img
                    src="https://i.pinimg.com/1200x/63/7e/33/637e33cb367435cf7f39e57d1b52676d.jpg"
                    alt="Waste Segregation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-green-800 font-bold text-lg mb-3 group-hover:text-green-700 transition-colors">
                    Smart Segregation
                  </h3>
                  <p className="text-gray-600 flex-grow mb-4">
                    Master the art of waste separation to maximize recycling and minimize environmental impact.
                  </p>
                  <div className="text-green-600 font-semibold hover:text-green-700 transition-colors duration-300 inline-flex items-center gap-2 group/link">
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>
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
    </div>
  );
}