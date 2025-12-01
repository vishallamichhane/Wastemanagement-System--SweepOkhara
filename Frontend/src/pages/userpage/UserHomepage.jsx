import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsCheckCircle, BsClock, BsTrash } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

export default function UserHomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const notifications = [
    {
      id: 1,
      type: "schedule",
      title: "Waste Collection Tomorrow",
      message: "General & Recyclable waste collection scheduled for your area tomorrow. Please keep your bins accessible.",
      time: "2 hours ago",
      icon: <BsCalendarEvent className="text-blue-500" />,
      read: false
    },
    {
      id: 2,
      type: "report",
      title: "Report #2456 Resolved",
      message: "Your reported issue at Lakeside area has been resolved. Thank you for keeping Pokhara clean!",
      time: "1 day ago",
      icon: <BsCheckCircle className="text-green-500" />,
      read: false
    },
    {
      id: 3,
      type: "schedule",
      title: "Organic Waste Collection",
      message: "Organic waste collection scheduled for July 1st. Remember to separate your food scraps.",
      time: "2 days ago",
      icon: <BsClock className="text-amber-500" />,
      read: true
    },
    {
      id: 4,
      type: "report",
      title: "Report #2451 In Progress",
      message: "Your reported overflowing bin at Fewa Lake is being addressed. Expected resolution: 24 hours.",
      time: "3 days ago",
      icon: <BsTrash className="text-orange-500" />,
      read: true
    },
    {
      id: 5,
      type: "schedule",
      title: "Monthly Deep Cleaning",
      message: "Monthly deep cleaning program scheduled for your ward next week. Please cooperate.",
      time: "1 week ago",
      icon: <GiBroom className="text-purple-500" />,
      read: true
    }
  ];

  const unreadCount = notifications.filter(notification => !notification.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 text-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-200 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-emerald-200 rounded-full opacity-15 mix-blend-multiply filter blur-xl animate-float-slow animation-delay-2000"></div>
      </div>

      {/* Header with fixed navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-10 py-4 select-none">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <GiBroom className="text-emerald-600 text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              SweepOkhara
            </span>
          </div>

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
            
            {/* Notification Bell with Popup */}
            <div className="relative" ref={notificationRef}>
              <button
                aria-label="Notifications"
                onClick={handleNotificationClick}
                className="relative group transform transition-all duration-300 hover:text-emerald-700 hover:scale-110 focus:outline-none p-2 rounded-xl hover:bg-emerald-50/80"
              >
                <BsBell className="text-xl" />
                {/* Notification badge */}
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600 animate-ping opacity-75"></span>
                    <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  </>
                )}
              </button>

              {/* Notification Popup */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-100/50 z-50 animate-slide-down">
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {unreadCount} unread
                      </span>
                    </div>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50/80 transition-colors duration-200 cursor-pointer ${
                          !notification.read ? 'bg-blue-50/50' : ''
                        }`}
                        onClick={() => setShowNotifications(false)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {notification.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className={`font-semibold text-sm ${
                                !notification.read ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                              )}
                            </div>
                            <p className="text-gray-600 text-xs mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {notification.time}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                notification.type === 'schedule' 
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {notification.type === 'schedule' ? 'Schedule' : 'Report'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-3 border-t border-gray-200">
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2 hover:bg-emerald-50/50 rounded-xl transition-colors duration-200"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>

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