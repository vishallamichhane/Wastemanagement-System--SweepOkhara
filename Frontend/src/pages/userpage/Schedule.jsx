import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaTruck, FaTrashAlt, FaRecycle, FaMapMarkerAlt } from 'react-icons/fa';
import { BsCheckCircle } from "react-icons/bs";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Header from './components/Header';
import useScrollToTop from '../../hooks/useScrollToTop';
import { useUser } from '@clerk/clerk-react';
import { getWardSchedule, getPickupDaysForMonth, isTodayPickupDay, getDayName } from '../../data/wardSchedules';

const WastePickupSchedule = () => {
  useScrollToTop();
  const { user, isLoaded } = useUser();
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [userWard, setUserWard] = useState('Ward 1');
  const [collector, setCollector] = useState(null);
  const [collectorLoading, setCollectorLoading] = useState(true);
  const [todayTaskStatus, setTodayTaskStatus] = useState(null); // 'scheduled' | 'in-progress' | 'completed' | null

  // Get user's ward from Clerk user metadata
  useEffect(() => {
    if (isLoaded && user) {
      const ward = user.publicMetadata?.ward || user.unsafeMetadata?.ward || 'Ward 1';
      setUserWard(ward);
    }
  }, [isLoaded, user]);

  // Fetch collector assigned to user's ward
  useEffect(() => {
    const fetchCollector = async () => {
      try {
        setCollectorLoading(true);
        // Extract ward number from "Ward X" or "X" format
        const wardNumber = parseInt(String(userWard).replace(/\D/g, ''));
        if (isNaN(wardNumber)) {
          setCollector(null);
          return;
        }

        const response = await fetch(`http://localhost:3000/api/collectors/ward/${wardNumber}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setCollector(data.data);
          console.log('✅ Collector found for ward', wardNumber, ':', data.data);
        } else {
          // No collector assigned to this ward
          setCollector(null);
          console.log('⚠️ No collector assigned to ward', wardNumber);
        }
      } catch (error) {
        console.error('Failed to fetch collector:', error);
        setCollector(null);
      } finally {
        setCollectorLoading(false);
      }
    };
    
    if (userWard) {
      fetchCollector();
    }
  }, [userWard]);

  // Fetch today's ward task status (completed/in-progress/scheduled)
  useEffect(() => {
    const fetchTaskStatus = async () => {
      try {
        const wardNumber = parseInt(String(userWard).replace(/\D/g, ''));
        if (isNaN(wardNumber)) return;

        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const response = await fetch(`http://localhost:3000/api/ward-tasks/status/${wardNumber}/${today}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          setTodayTaskStatus(data.data.status);
        } else {
          setTodayTaskStatus(null);
        }
      } catch (error) {
        console.error('Failed to fetch task status:', error);
        setTodayTaskStatus(null);
      }
    };

    if (userWard && isTodayPickupDay(userWard)) {
      fetchTaskStatus();
      // Poll every 60 seconds for live updates
      const interval = setInterval(fetchTaskStatus, 60000);
      return () => clearInterval(interval);
    }
  }, [userWard]);

  // Get ward schedule
  const wardSchedule = getWardSchedule(userWard);

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
    
    // Get pickup days for this ward in the current month
    const pickupDaysInMonth = getPickupDaysForMonth(userWard, currentYear, currentMonth);
    
    // Previous month days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthDays - i, month: 'prev', hasPickup: false });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const hasPickup = pickupDaysInMonth.includes(i);
      days.push({ day: i, month: 'current', hasPickup });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

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
    <>
      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full pb-20 sm:pb-8">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 animate-fade-in-up">
          <Link to="/user" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-3 sm:mb-4 group">
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold text-sm sm:text-base">Back to Home</span>
          </Link>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Pickup Schedule
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Never miss a waste collection day. View your schedule for upcoming pickups.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar Section - Made Smaller */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 transform hover:scale-[1.01] transition-all duration-500 border border-emerald-100">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105 transition-all duration-300"
              >
                <FiChevronLeft className="text-base" />
              </button>
              
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FaCalendarAlt className="text-emerald-600 text-base" />
                {monthNames[currentMonth]} {currentYear}
              </h3>
              
              <button 
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:scale-105 transition-all duration-300"
              >
                <FiChevronRight className="text-base" />
              </button>
            </div>
            
            {/* Smaller Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 mb-4">
              {/* Week Days Header - Smaller */}
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <div 
                  key={day} 
                  className="text-center text-[10px] font-bold text-emerald-700 py-1 bg-emerald-50/50 rounded-md"
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
                    h-8 flex flex-col items-center justify-center rounded-md border transition-all duration-300 transform hover:scale-105
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
                  <span className="text-xs font-semibold">{date.day}</span>
                  {date.hasPickup && (
                    <div className="mt-0 transform scale-75">
                      <WastePickupIcon />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Updated Calendar Legend */}
            <div className="mt-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
              <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FaTrashAlt className="text-emerald-600 text-sm" />
                Collection Legend
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 group">
                  <div className="w-6 h-6 flex items-center justify-center bg-emerald-100 border-2 border-emerald-400 rounded-md transition-transform group-hover:scale-110">
                    <WastePickupIcon size="text-[10px]" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Pickup Day</span>
                    <p className="text-[10px] text-gray-500">Waste collection scheduled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 border-2 border-emerald-600 rounded-md transition-transform group-hover:scale-110 text-white">
                    <span className="text-xs font-bold">{selectedDay}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">Selected Day</span>
                    <p className="text-[10px] text-gray-500">Currently viewing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Pickup Section */}
          <div className="space-y-6">
            {/* Ward Info Card */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <FaMapMarkerAlt className="text-lg" />
                <h3 className="text-lg font-bold">Your Ward</h3>
              </div>
              <p className="text-2xl font-extrabold">{wardSchedule.name}</p>
              <p className="text-sm opacity-90 mt-1">
                Collection: {wardSchedule.pickupDays.map(d => getDayName(d).substring(0, 3)).join(', ')}
              </p>
            </div>

            {/* Today's Pickup Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-all duration-500 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isTodayPickupDay(userWard) ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  Today's Pickup
                </h3>
                <span className={`text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg ${isTodayPickupDay(userWard) ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gray-400'}`}>
                  {isTodayPickupDay(userWard) ? 'Active' : 'No Pickup'}
                </span>
              </div>

              {/* Ward Task Completion Status */}
              {isTodayPickupDay(userWard) && todayTaskStatus && (
                <div className={`mb-4 p-3 rounded-xl border flex items-center gap-3 ${
                  todayTaskStatus === 'completed'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : todayTaskStatus === 'in-progress'
                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                    : 'bg-amber-50 border-amber-300 text-amber-800'
                }`}>
                  {todayTaskStatus === 'completed' ? (
                    <>
                      <BsCheckCircle className="text-emerald-600 text-xl shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Collection Completed ✓</p>
                        <p className="text-xs opacity-80">Your ward's waste has been collected today</p>
                      </div>
                    </>
                  ) : todayTaskStatus === 'in-progress' ? (
                    <>
                      <FaTruck className="text-blue-600 text-xl shrink-0 animate-bounce" />
                      <div>
                        <p className="font-bold text-sm">Collection In Progress</p>
                        <p className="text-xs opacity-80">The collector is currently in your ward area</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <FaClock className="text-amber-600 text-xl shrink-0" />
                      <div>
                        <p className="font-bold text-sm">Awaiting Collection</p>
                        <p className="text-xs opacity-80">Scheduled for today — please keep waste ready</p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Pickup Information */}
              <div className="space-y-4">
                <div className="group p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 hover:border-emerald-400 transition-all duration-300">
                  <h4 className="text-xs font-semibold text-emerald-700 mb-1 flex items-center gap-2">
                    <FaClock className="text-base" />
                    Time Window
                  </h4>
                  <p className="text-lg font-bold text-gray-800">{wardSchedule.timeSlot}</p>
                </div>

                <div className="group p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:border-blue-400 transition-all duration-300">
                  <h4 className="text-xs font-semibold text-blue-700 mb-1 flex items-center gap-2">
                    <FaTruck className="text-base" />
                    Assigned Vehicle
                  </h4>
                  {collectorLoading ? (
                    <p className="text-base text-gray-500">Loading...</p>
                  ) : collector ? (
                    <>
                      <p className="text-base font-bold text-gray-800">Truck #{collector.vehicleId}</p>
                      <p className="text-xs text-blue-600 mt-1">Collector: {collector.name}</p>
                      <p className="text-xs text-blue-500">ID: {collector.collectorId}</p>
                    </>
                  ) : (
                    <p className="text-base text-gray-500">No collector assigned</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
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
};

export default WastePickupSchedule;
