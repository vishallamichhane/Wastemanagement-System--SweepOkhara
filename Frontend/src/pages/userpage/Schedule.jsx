import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaTruck, FaBell, FaTrashAlt, FaRecycle } from 'react-icons/fa';
import { BsBell, BsArrowRight, BsCheckCircle } from "react-icons/bs";
import { FiLogOut, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import Header from './Header';

const WastePickupSchedule = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isReminderSet, setIsReminderSet] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
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

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    // Previous month days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: 'prev', hasPickup: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const hasPickup = [2, 4, 6, 9, 11, 13, 16, 18, 20, 23, 25, 27, 30].includes(i);
      days.push({ day: i, month: 'current', hasPickup });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleSetReminder = () => {
    setIsReminderSet(true);
    // Navigate to reminder confirmation page after 1 second
    setTimeout(() => {
      navigate('/reminder');
    }, 1000);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prev => prev === 0 ? 11 : prev - 1);
    setCurrentYear(prev => currentMonth === 0 ? prev - 1 : prev);
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => prev === 11 ? 0 : prev + 1);
    setCurrentYear(prev => currentMonth === 11 ? prev + 1 : prev);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Waste pickup icon component
  const WastePickupIcon = ({ size = "text-xs" }) => (
    <div className={`${size} text-emerald-600 transform rotate-12`}>
      🗑️
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col relative overflow-hidden">
      <Header />

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link to="/user" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group">
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Home</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">
            Pickup Schedule
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Never miss a waste collection day. View your schedule and set reminders for upcoming pickups.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Calendar Section - Made Smaller */}
          <div className="xl:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-500 border border-emerald-100">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105 transition-all duration-300"
              >
                <FiChevronLeft className="text-lg" />
              </button>
              
              <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FaCalendarAlt className="text-emerald-600 text-xl" />
                {monthNames[currentMonth]} {currentYear}
              </h3>
              
              <button 
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105 transition-all duration-300"
              >
                <FiChevronRight className="text-lg" />
              </button>
            </div>
            
            {/* Smaller Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {/* Week Days Header - Smaller */}
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div 
                  key={day} 
                  className="text-center text-xs font-bold text-emerald-700 py-2 bg-emerald-50/50 rounded-lg"
                >
                  {day}
                </div>
              ))}
              
              {/* Calendar Days - Smaller */}
              {calendarDays.slice(0, 42).map((date, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(date.day)}
                  className={`
                    h-12 flex flex-col items-center justify-center rounded-lg border transition-all duration-300 transform hover:scale-105
                    ${date.month === 'prev' ? 'text-gray-400 bg-gray-50/50' : 'text-gray-700'}
                    ${selectedDay === date.day && date.month === 'current'
                      ? 'border-emerald-500 bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg scale-105' 
                      : date.hasPickup 
                        ? 'border-emerald-300 bg-emerald-50/80 hover:bg-emerald-100 hover:border-emerald-400' 
                        : 'border-gray-200/50 hover:bg-gray-50/80 hover:border-gray-300'
                    }
                    ${date.month !== 'current' ? 'opacity-50' : ''}
                  `}
                >
                  <span className="text-sm font-semibold">{date.day}</span>
                  {date.hasPickup && (
                    <div className="mt-0.5 transform scale-90">
                      <WastePickupIcon />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Updated Calendar Legend */}
            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FaTrashAlt className="text-emerald-600 text-base" />
                Collection Legend
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 flex items-center justify-center bg-emerald-100 border-2 border-emerald-400 rounded-md transition-transform group-hover:scale-110">
                    <WastePickupIcon size="text-xs" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Pickup Day</span>
                    <p className="text-xs text-gray-500">Waste collection scheduled</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-emerald-600 rounded-md transition-transform group-hover:scale-110 text-white">
                    <span className="text-sm font-bold">{selectedDay}</span>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Selected Day</span>
                    <p className="text-xs text-gray-500">Currently viewing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Pickup Section */}
          <div className="space-y-6">
            {/* Today's Pickup Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-500 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  Today's Pickup
                </h3>
                <span className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  Active
                </span>
              </div>

              {/* Pickup Information */}
              <div className="space-y-4">
                <div className="group p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:border-emerald-400 transition-all duration-300">
                  <h4 className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-2">
                    <FaClock className="text-base" />
                    Time Window
                  </h4>
                  <p className="text-lg font-bold text-gray-800">9:00 AM - 12:00 PM</p>
                </div>

                <div className="group p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-all duration-300">
                  <h4 className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-2">
                    <FaTruck className="text-base" />
                    Assigned Vehicle
                  </h4>
                  <p className="text-base font-bold text-gray-800">Truck #SW-05</p>
                  <p className="text-xs text-blue-600 mt-1">Driver: Raj Kumar</p>
                </div>

                <div className="group p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:border-amber-400 transition-all duration-300">
                  <h4 className="text-xs font-semibold text-amber-700 mb-1 flex items-center gap-2">
                    <FaRecycle className="text-base" />
                    Waste Types
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">General</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Recyclable</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Reminder Button */}
            <button 
              onClick={handleSetReminder}
              className={`
                w-full py-4 px-5 rounded-xl font-bold text-base transition-all duration-500 transform hover:scale-[1.02] shadow-lg
                flex items-center justify-center gap-2 relative overflow-hidden group border
                ${isReminderSet 
                  ? 'bg-emerald-600 text-white border-emerald-700' 
                  : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-xl'
                }
              `}
            >
              <div className="absolute inset-0 bg-emerald-500/10 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <FaBell className={`text-lg ${isReminderSet ? 'text-white animate-ring' : 'text-emerald-600 group-hover:scale-110'} transition-all duration-300`} />
              <span className="font-semibold relative z-10">
                {isReminderSet ? 'Setting Reminder...' : 'Set Pickup Reminder'}
              </span>
              {!isReminderSet && <BsArrowRight className="text-lg text-emerald-600 group-hover:translate-x-1 transition-transform duration-300" />}
            </button>
          </div>
        </div>
      </main>

      {/* Footer - Using UserHome Page Style */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 py-6 text-center text-green-800 text-sm select-none flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center relative z-10 mt-8">
        <span className="font-semibold">© 2024 SweepOkhara. All rights reserved.</span>
        <div className="flex gap-4">
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

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ring {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(15deg); }
          50% { transform: rotate(-15deg); }
          75% { transform: rotate(10deg); }
          100% { transform: rotate(0deg); }
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
        
        .animate-ring { 
          animation: ring 0.5s ease-in-out; 
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default WastePickupSchedule;