import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BsCalendarEvent, BsMapFill, BsExclamationTriangle, BsCheckCircle, BsClock, BsTrash, BsTruck } from "react-icons/bs";
import useScrollToTop from '../../hooks/useScrollToTop';
import { useUser } from "@clerk/clerk-react";
import { useDarkMode } from "../../context/DarkModeContext";
import { WARD_SCHEDULES } from '../../data/wardSchedules';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];


export default function UserHomePage() {
  useScrollToTop();
  const { user: clerkUser, isLoaded } = useUser();
  const user = clerkUser ? {
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username,
    email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
  } : null;
  const { isDarkMode } = useDarkMode();

  // Get user's ward and compute real schedule
  const userWard = clerkUser?.publicMetadata?.ward || clerkUser?.unsafeMetadata?.ward || 'Ward 1';
  const wardNum = parseInt(String(userWard).replace(/\D/g, '')) || 1;
  const schedule = WARD_SCHEDULES[`Ward ${wardNum}`];
  const [todayStatus, setTodayStatus] = useState(null); // null | 'scheduled' | 'in-progress' | 'completed' | 'no-pickup'

  // Compute upcoming pickup dates from real schedule
  const isTodayPickup = schedule ? schedule.pickupDays.includes(new Date().getDay()) : false;
  const getUpcomingPickups = () => {
    if (!schedule) return [];
    const now = new Date();
    const today = now.getDay();
    const pickups = [];
    // Start from offset 1 (tomorrow) to avoid showing today in the upcoming list
    // Today's status is shown separately via the status badge
    for (let offset = 0; offset < 14 && pickups.length < 3; offset++) {
      const dayIndex = (today + offset) % 7;
      if (schedule.pickupDays.includes(dayIndex)) {
        const d = new Date(now);
        d.setDate(d.getDate() + offset);
        pickups.push({ date: d, dayName: DAY_NAMES[dayIndex], offset, timeSlot: schedule.timeSlot });
      }
    }
    return pickups;
  };
  const upcomingPickups = getUpcomingPickups();

  // Fetch today's real task status
  useEffect(() => {
    if (!schedule) return;
    const todayDow = new Date().getDay();
    if (!schedule.pickupDays.includes(todayDow)) {
      setTodayStatus('no-pickup');
      return;
    }
    const todayStr = new Date().toISOString().split('T')[0];
    fetch(`http://localhost:3000/api/ward-tasks/status/${wardNum}/${todayStr}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setTodayStatus(data.data.status);
      })
      .catch(() => setTodayStatus('scheduled'));
    const interval = setInterval(() => {
      fetch(`http://localhost:3000/api/ward-tasks/status/${wardNum}/${todayStr}`)
        .then(r => r.json())
        .then(data => { if (data.success && data.data) setTodayStatus(data.data.status); })
        .catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, [wardNum, schedule]);

  return (
    <>
      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-8 md:mt-10 mb-12 sm:mb-16 pb-20 sm:pb-0 space-y-6 sm:space-y-8 md:space-y-10 relative z-10">
        {/* Welcome and Report button row */}
        <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 animate-slide-down">
          <div>
            <h1 className={`text-2xl sm:text-3xl md:text-4xl font-extrabold ${
              isDarkMode 
                ? 'text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-400' 
                : 'text-green-800 bg-gradient-to-r from-green-700 to-emerald-600'
            } bg-clip-text text-transparent`}>
              Welcome, {user?.name?.split(' ')[0] || 'User'}!
            </h1>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 sm:mt-2 text-base sm:text-lg font-medium`}>
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
          <div className={`${
            isDarkMode 
              ? 'bg-gray-800/80 border-gray-700/50' 
              : 'bg-white/80 border-green-100/50'
          } backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border animate-fade-in-delay`}>
            <h2 className={`text-lg sm:text-xl font-bold ${
              isDarkMode ? 'text-emerald-400' : 'text-green-800'
            } mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3`}>
              <BsCalendarEvent className={`text-2xl sm:text-3xl ${
                isDarkMode ? 'text-emerald-500' : 'text-green-600'
              } animate-pulse-slow`} />
              <span>Pickup Schedule</span>
            </h2>

            {/* Today's Status Badge */}
            {isTodayPickup && todayStatus && todayStatus !== 'no-pickup' ? (
              <div className={`mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 ${
                todayStatus === 'completed'
                  ? isDarkMode ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : todayStatus === 'in-progress'
                  ? isDarkMode ? 'bg-blue-900/40 border-blue-700 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-800'
                  : isDarkMode ? 'bg-amber-900/40 border-amber-700 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-800'
              }`}>
                {todayStatus === 'completed' ? (
                  <><BsCheckCircle className="text-lg shrink-0" /><div><p className="font-bold text-xs sm:text-sm">Collected ✓</p><p className="text-xs opacity-75">Today's pickup done</p></div></>
                ) : todayStatus === 'in-progress' ? (
                  <><BsTruck className="text-lg shrink-0 animate-pulse" /><div><p className="font-bold text-xs sm:text-sm">Truck On the Way</p><p className="text-xs opacity-75">Collection in progress</p></div></>
                ) : (
                  <><BsClock className="text-lg shrink-0" /><div><p className="font-bold text-xs sm:text-sm">Scheduled</p><p className="text-xs opacity-75">Awaiting collection</p></div></>
                )}
              </div>
            ) : !isTodayPickup && (
              <div className={`mb-3 sm:mb-4 p-2.5 sm:p-3 rounded-xl border flex items-center gap-2.5 ${
                isDarkMode ? 'bg-gray-700/40 border-gray-600 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}>
                <BsTrash className="text-lg shrink-0" />
                <div>
                  <p className="font-bold text-xs sm:text-sm">No Pickup Today</p>
                  <p className="text-xs opacity-75">Next pickup: {upcomingPickups[0]?.dayName || '—'}</p>
                </div>
              </div>
            )}

            <ul className={`space-y-3 sm:space-y-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {upcomingPickups.map((pickup, idx) => {
                const dateStr = `${MONTH_NAMES[pickup.date.getMonth()]} ${pickup.date.getDate()}, ${pickup.date.getFullYear()}`;
                const isToday = pickup.offset === 0;
                const isTomorrow = pickup.offset === 1;
                const borderColor = isToday ? 'border-green-500' : isTomorrow ? 'border-blue-500' : isDarkMode ? 'border-gray-500' : 'border-gray-300';
                const bgColor = isToday
                  ? isDarkMode ? 'bg-green-900/30 hover:bg-green-900/50' : 'bg-green-50/50 hover:bg-green-50'
                  : isTomorrow
                  ? isDarkMode ? 'bg-blue-900/30 hover:bg-blue-900/50' : 'bg-blue-50/50 hover:bg-blue-50'
                  : isDarkMode ? 'bg-gray-700/30 hover:bg-gray-700/50' : 'bg-gray-50/50 hover:bg-gray-50';
                const labelColor = isToday
                  ? isDarkMode ? 'text-green-400' : 'text-green-700'
                  : isTomorrow
                  ? isDarkMode ? 'text-blue-400' : 'text-blue-700'
                  : isDarkMode ? 'text-gray-300' : 'text-gray-700';

                return (
                  <li key={idx} className={`border-l-4 ${borderColor} pl-3 sm:pl-4 py-2 ${bgColor} rounded-r-lg transition-colors duration-300`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold ${labelColor} text-xs sm:text-sm`}>
                        {isToday ? 'TODAY' : isTomorrow ? 'TOMORROW' : pickup.dayName}
                      </span>
                      <span className={`${isDarkMode ? 'text-gray-500' : 'text-gray-400'} text-xs`}>
                        {dateStr}
                      </span>
                    </div>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-xs sm:text-sm`}>
                      {pickup.dayName} • {pickup.timeSlot}
                    </span>
                  </li>
                );
              })}
            </ul>
            <Link 
              to="/user/schedule"
              className={`${
                isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-green-600 hover:text-green-700'
              } mt-3 sm:mt-5 block text-xs sm:text-sm font-semibold transition-colors duration-300 inline-flex items-center gap-1 group/link`}
            >
              View full calendar
              <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
            </Link>
          </div>
        </section>

        {/* Awareness Info */}
        <section className="animate-slide-up">
          <h2 className={`text-xl sm:text-2xl font-bold ${
            isDarkMode 
              ? 'text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-400' 
              : 'text-green-800 bg-gradient-to-r from-green-700 to-emerald-600'
          } bg-clip-text text-transparent mb-4 sm:mb-6 md:mb-8`}>
            Eco Awareness
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {/* Card 1 */}
            <Link to="/user/awareness1" className="block">
              <article className={`${
                isDarkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-green-100/50'
              } backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border group h-full`}>
                <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img 
                    src="https://i.pinimg.com/736x/de/0b/3a/de0b3a9531a93b36d25c78b3523307a0.jpg" 
                    alt="Reduce Reuse Recycle" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className={`${
                    isDarkMode ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-green-800 group-hover:text-green-700'
                  } font-bold text-base sm:text-lg mb-2 sm:mb-3 transition-colors`}>
                    The 3 R's: Reduce, Reuse, Recycle
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base flex-grow mb-3 sm:mb-4`}>
                    Learn how to minimize waste and its impact on the environment through sustainable practices.
                  </p>
                  <div className={`${
                    isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-green-600 hover:text-green-700'
                  } text-sm sm:text-base font-semibold transition-colors duration-300 inline-flex items-center gap-2 group/link`}>
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Card 2 */}
            <Link to="/user/awareness2" className="block">
              <article className={`${
                isDarkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-green-100/50'
              } backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border group h-full`}>
                <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img
                    src="https://i.pinimg.com/1200x/bf/33/6c/bf336c5cca4848a14997a569d1ce3445.jpg"
                    alt="Composting"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className={`${
                    isDarkMode ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-green-800 group-hover:text-green-700'
                  } font-bold text-base sm:text-lg mb-2 sm:mb-3 transition-colors`}>
                    Composting at Home
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base flex-grow mb-3 sm:mb-4`}>
                    Turn your kitchen scraps into nutrient-rich soil for your garden with easy composting methods.
                  </p>
                  <div className={`${
                    isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-green-600 hover:text-green-700'
                  } text-sm sm:text-base font-semibold transition-colors duration-300 inline-flex items-center gap-2 group/link`}>
                    Read More
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">→</span>
                  </div>
                </div>
              </article>
            </Link>

            {/* Card 3 */}
            <Link to="/user/awareness3" className="block">
              <article className={`${
                isDarkMode 
                  ? 'bg-gray-800/80 border-gray-700/50' 
                  : 'bg-white/80 border-green-100/50'
              } backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border group h-full`}>
                <div className="h-40 sm:h-44 md:h-48 overflow-hidden">
                  <img
                    src="https://i.pinimg.com/1200x/63/7e/33/637e33cb367435cf7f39e57d1b52676d.jpg"
                    alt="Waste Segregation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    draggable={false}
                  />
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-grow">
                  <h3 className={`${
                    isDarkMode ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-green-800 group-hover:text-green-700'
                  } font-bold text-base sm:text-lg mb-2 sm:mb-3 transition-colors`}>
                    Smart Segregation
                  </h3>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base flex-grow mb-3 sm:mb-4`}>
                    Master the art of waste separation to maximize recycling and minimize environmental impact.
                  </p>
                  <div className={`${
                    isDarkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-green-600 hover:text-green-700'
                  } text-sm sm:text-base font-semibold transition-colors duration-300 inline-flex items-center gap-2 group/link`}>
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