import { GiBroom } from "react-icons/gi";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiChevronLeft,
  FiCheck,
  FiClock,
  FiHome,
  FiCalendar,
  FiLogOut,
  FiUser,
  FiSettings,
  FiMenu,
  FiX,
  FiPlay,
  FiCheckCircle,
  FiRefreshCw
} from 'react-icons/fi';
import { 
  BsListUl,
  BsCheckCircleFill,
  BsClockFill,
  BsExclamationCircle,
  BsExclamationTriangle,
  BsTruck
} from "react-icons/bs";
import { MdAssignmentTurnedIn } from "react-icons/md";
import useScrollToTop from "../../hooks/useScrollToTop";
import CollectorNotificationCenter from "./components/CollectorNotificationCenter";

// -------------------------
// CONSTANTS
// -------------------------
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// -------------------------
// WARD TASK CARD COMPONENT
// -------------------------
const WardTaskCard = ({ task, onStart, onComplete, isUpdating }) => {
  // Check if task is overdue (time slot end has passed but not completed)
  const isOverdue = (() => {
    if (task.status === 'completed') return false;
    try {
      const endPart = task.timeSlot?.split('-')[1]?.trim();
      if (!endPart) return false;
      const [timePart, ampm] = endPart.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (ampm?.toUpperCase() === 'AM' && hours === 12) hours = 0;
      const now = new Date();
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      return now > endTime;
    } catch { return false; }
  })();

  const getStatusColor = (status) => {
    if (isOverdue) return 'bg-red-100 text-red-800 border-red-200';
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scheduled': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    if (isOverdue) return 'Overdue';
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'scheduled': return 'Scheduled';
      default: return 'Scheduled';
    }
  };

  const getStatusIcon = (status) => {
    if (isOverdue) return <BsExclamationTriangle className="text-red-600" />;
    switch (status) {
      case 'completed': return <BsCheckCircleFill className="text-emerald-600" />;
      case 'in-progress': return <FiPlay className="text-blue-600" />;
      case 'scheduled': return <FiClock className="text-amber-600" />;
      default: return <FiClock className="text-gray-600" />;
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group ${
      isOverdue ? 'border-red-300 ring-2 ring-red-200' : task.status === 'completed' ? 'border-emerald-200 opacity-80' : 'border-gray-200'
    }`}>
      {/* Overdue Banner */}
      {isOverdue && (
        <div className="bg-red-600 text-white px-4 py-2 flex items-center gap-2 text-sm font-semibold animate-pulse">
          <BsExclamationTriangle className="text-base" />
          <span>Overdue — Scheduled time ({task.timeSlot}) has passed!</span>
        </div>
      )}
      {/* Card Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3 min-w-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shrink-0 ${
              isOverdue ? 'bg-gradient-to-br from-red-500 to-red-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'
            }`}>
              {task.ward}
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900">Ward {task.ward}</h3>
              <p className="text-sm text-gray-500">{task.dayName}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold border ${getStatusColor(task.status)}`}>
            {getStatusIcon(task.status)}
            <span>{getStatusText(task.status)}</span>
          </div>
        </div>
        
        {/* Schedule Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <FiClock className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Time Slot</p>
              <p className="font-semibold text-gray-800">{task.timeSlot}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
            <FiCalendar className="text-emerald-600 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Pickup Days</p>
              <p className="font-semibold text-gray-800 text-xs">{task.pickupDays?.join(', ')}</p>
            </div>
          </div>
        </div>

        {task.completedAt && (
          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
            <FiCheckCircle />
            <span>Completed at {new Date(task.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>
      
      {/* Card Actions */}
      <div className="p-4 sm:p-5 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button 
            onClick={() => onStart(task._id)}
            disabled={task.status !== 'scheduled' || isUpdating}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
              task.status === 'scheduled' && !isUpdating
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiPlay className="text-sm" />
            <span>Start Collection</span>
          </button>
          
          <button 
            onClick={() => onComplete(task._id)}
            disabled={(task.status !== 'in-progress' && task.status !== 'scheduled') || isUpdating}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
              (task.status === 'in-progress' || task.status === 'scheduled') && !isUpdating
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-md active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiCheck />
            <span>Mark Complete</span>
          </button>
        </div>
        
        {task.status === 'completed' && (
          <p className="text-sm text-emerald-600 font-medium text-center mt-3">
            ✓ Users of Ward {task.ward} have been notified
          </p>
        )}
      </div>
    </div>
  );
};

// -------------------------
// STATS CARD COMPONENT
// -------------------------
const StatsCard = ({ title, value, icon: Icon, color, subtitle }) => {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="text-xl sm:text-2xl" />
        </div>
      </div>
    </div>
  );
};

// -------------------------
// WEEK SCHEDULE TABLE
// -------------------------
const WeekScheduleTable = ({ schedule }) => {
  const todayDayIndex = new Date().getDay();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <FiCalendar className="text-emerald-600" />
          Weekly Ward Schedule
        </h3>
        <p className="text-sm text-gray-600 mt-1">Your assigned wards and their pickup days</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Ward</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Time Slot</th>
              {DAY_NAMES.map((day, i) => (
                <th key={day} className={`text-center px-2 py-3 font-semibold ${i === todayDayIndex ? 'text-emerald-700 bg-emerald-50' : 'text-gray-700'}`}>
                  <span className="hidden sm:inline">{day.slice(0, 3)}</span>
                  <span className="sm:hidden">{day.charAt(0)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedule.map((item, idx) => (
              <tr key={item.ward} className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                <td className="px-4 py-3 font-semibold text-gray-900 whitespace-nowrap">Ward {item.ward}</td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{item.timeSlot}</td>
                {DAY_NAMES.map((day, i) => {
                  const isPickup = item.pickupDayNumbers?.includes(i);
                  const isToday = i === todayDayIndex;
                  return (
                    <td key={day} className={`text-center px-2 py-3 ${isToday ? 'bg-emerald-50' : ''}`}>
                      {isPickup ? (
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${isToday ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'} text-xs font-bold`}>
                          ✓
                        </span>
                      ) : (
                        <span className="text-gray-300">–</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
const AssignedTasksPage = () => {
  useScrollToTop();
  const navigate = useNavigate();

  // Navbar state
  const [activeNav, setActiveNav] = useState('tasks');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

  // Data state
  const [todayTasks, setTodayTasks] = useState([]);
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('today');
  const [completionToast, setCompletionToast] = useState(null); // { ward, message }

  const getToken = () => localStorage.getItem('collectorToken');

  // Fetch today's tasks from the API
  const fetchTodayTasks = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) { navigate('/login'); return; }

      const res = await fetch('http://localhost:3000/api/ward-tasks/today', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('collectorToken');
        navigate('/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setTodayTasks(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error('Fetch tasks error:', err);
      setError('Failed to fetch tasks. Please check your connection.');
    }
  }, [navigate]);

  // Fetch week schedule from the API
  const fetchWeekSchedule = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await fetch('http://localhost:3000/api/ward-tasks/schedule', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setWeekSchedule(data.data);
      }
    } catch (err) {
      console.error('Fetch schedule error:', err);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchTodayTasks(), fetchWeekSchedule()]);
      setIsLoading(false);
    };
    loadData();
  }, [fetchTodayTasks, fetchWeekSchedule]);

  // Update task status (start or complete)
  const handleUpdateStatus = async (taskId, newStatus) => {
    setIsUpdating(true);
    try {
      const token = getToken();
      if (!token) { navigate('/login'); return; }

      const res = await fetch(`http://localhost:3000/api/ward-tasks/${taskId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setTodayTasks(prev => prev.map(task =>
          task._id === taskId ? { ...task, ...data.data } : task
        ));

        // Show success toast when task is completed
        if (newStatus === 'completed' && data.data?.ward) {
          setCompletionToast({
            ward: data.data.ward,
            message: `Ward ${data.data.ward} collection completed! Users have been notified.`,
          });
          // Auto-dismiss after 5 seconds
          setTimeout(() => setCompletionToast(null), 5000);
        }
      } else {
        alert(data.message || 'Failed to update task');
      }
    } catch (err) {
      console.error('Update status error:', err);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Navbar scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileDropdown(false);
    localStorage.removeItem('collectorToken');
    localStorage.removeItem('collectorData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    navigate('/collector/profile');
  };

  const handleDashboardClick = () => {
    setShowProfileDropdown(false);
    navigate('/collector/dashboard');
  };

  // Helper: check if a task is overdue based on time slot end time
  const isTaskOverdue = (task) => {
    if (task.status === 'completed') return false;
    try {
      const endPart = task.timeSlot?.split('-')[1]?.trim();
      if (!endPart) return false;
      const [timePart, ampm] = endPart.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (ampm?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
      if (ampm?.toUpperCase() === 'AM' && hours === 12) hours = 0;
      const now = new Date();
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
      return now > endTime;
    } catch { return false; }
  };

  // Filter tasks
  const filteredTasks = todayTasks.filter(task => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'overdue') return isTaskOverdue(task);
    return task.status === activeFilter;
  });

  // Computed stats
  const overdueCount = todayTasks.filter(t => isTaskOverdue(t)).length;
  const stats = {
    total: todayTasks.length,
    scheduled: todayTasks.filter(t => t.status === 'scheduled').length,
    inProgress: todayTasks.filter(t => t.status === 'in-progress').length,
    completed: todayTasks.filter(t => t.status === 'completed').length,
    overdue: overdueCount,
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your ward tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col">
      {/* Completion Toast */}
      {completionToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-bounce-in">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 min-w-[300px] max-w-md">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <FiCheckCircle className="text-2xl" />
            </div>
            <div>
              <p className="font-bold text-base">Task Completed! ✅</p>
              <p className="text-emerald-100 text-sm">{completionToast.message}</p>
            </div>
            <button onClick={() => setCompletionToast(null)} className="ml-auto text-white/70 hover:text-white p-1">
              <FiX className="text-lg" />
            </button>
          </div>
        </div>
      )}

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-3000"></div>
      </div>

      {/* Navbar */}
      <nav ref={mobileMenuRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      } ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6 lg:px-10 py-3 sm:py-4">
          {/* Logo */}
          <Link to="/collector" className="transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
                <GiBroom className="text-white text-xl" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  SweePokhara
                </span>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
                Collector
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => { setActiveNav('home'); navigate('/collector/dashboard'); }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${activeNav === 'home' ? "text-emerald-700 bg-emerald-50/80 shadow-sm" : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"}`}>
              <div className="flex items-center space-x-2"><FiHome /><span className="font-semibold">Dashboard</span></div>
            </button>
            <button onClick={() => setActiveNav('tasks')}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${activeNav === 'tasks' ? "text-emerald-700 bg-emerald-50/80 shadow-sm" : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"}`}>
              <div className="flex items-center space-x-2"><FiCalendar /><span className="font-semibold">Schedule</span></div>
            </button>
            <button onClick={() => { setActiveNav('reports'); navigate('/collector/reports'); }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${activeNav === 'reports' ? "text-emerald-700 bg-emerald-50/80 shadow-sm" : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"}`}>
              <div className="flex items-center space-x-2"><BsExclamationTriangle /><span className="font-semibold">Reports</span></div>
            </button>
            
            <CollectorNotificationCenter />
            
            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                <FiUser className="text-xl" />
              </button>
              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-emerald-100 overflow-hidden z-50 animate-fadeIn">
                  <div className="py-2">
                    <button onClick={handleDashboardClick} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all duration-200 text-gray-700 hover:text-emerald-700">
                      <FiHome className="text-lg" /><span className="font-semibold">Dashboard</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={handleProfileClick} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all duration-200 text-gray-700 hover:text-emerald-700">
                      <FiSettings className="text-lg" /><span className="font-semibold">Profile Settings</span>
                    </button>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={handleLogout} className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 transition-all duration-200 text-gray-700 hover:text-red-600">
                      <FiLogOut className="text-lg" /><span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: notification + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <CollectorNotificationCenter />
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg text-gray-700 hover:bg-emerald-50 transition-colors" aria-label="Toggle menu">
              {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 font-semibold">
              <FiHome /> Dashboard
            </button>
            <button onClick={() => { setMobileMenuOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-700 bg-emerald-50/80 font-semibold">
              <FiCalendar /> Schedule
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/reports'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 font-semibold">
              <BsExclamationTriangle /> Reports
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/profile'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 font-semibold">
              <FiUser /> Profile
            </button>
            <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold">
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <button 
            onClick={() => navigate('/collector/dashboard')}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group"
          >
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Ward Collection Schedule
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Today is <span className="font-semibold text-emerald-700">{DAY_NAMES[new Date().getDay()]}</span> — 
                {stats.total > 0 
                  ? ` you have ${stats.total} ward${stats.total > 1 ? 's' : ''} to collect today`
                  : ' no pickups scheduled for today'}
              </p>
            </div>
            
            <button 
              onClick={() => { setIsLoading(true); Promise.all([fetchTodayTasks(), fetchWeekSchedule()]).then(() => setIsLoading(false)); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-50 transition-all duration-200 font-medium self-start"
            >
              <FiRefreshCw className="text-sm" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'today'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <BsTruck />
            <span>Today's Tasks</span>
            {stats.total > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'today' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'}`}>
                {stats.total}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'schedule'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <FiCalendar />
            <span>Week Schedule</span>
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <BsExclamationCircle className="text-red-500 text-xl shrink-0" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => { setError(null); fetchTodayTasks(); }} className="ml-auto text-red-600 hover:text-red-800 font-medium text-sm">
              Retry
            </button>
          </div>
        )}

        {/* Today's Tasks Tab */}
        {activeTab === 'today' && (
          <>
            {/* Overdue Alert Banner */}
            {stats.overdue > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 mb-6 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                  <BsExclamationTriangle className="text-red-600 text-xl" />
                </div>
                <div>
                  <h3 className="text-red-800 font-bold text-base sm:text-lg">⚠️ {stats.overdue} Overdue Task{stats.overdue > 1 ? 's' : ''}</h3>
                  <p className="text-red-600 text-sm">{stats.overdue} ward{stats.overdue > 1 ? 's have' : ' has'} passed the scheduled pickup time without completion. Please take action immediately.</p>
                </div>
                <button onClick={() => setActiveFilter('overdue')} className="ml-auto px-4 py-2 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors shrink-0">
                  View
                </button>
              </div>
            )}

            {/* Stats Overview */}
            <div className={`grid grid-cols-2 ${stats.overdue > 0 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-3 sm:gap-6 mb-6 sm:mb-8`}>
              <StatsCard title="Today's Wards" value={stats.total} icon={BsListUl} color="emerald" subtitle="Assigned for today" />
              <StatsCard title="Scheduled" value={stats.scheduled} icon={BsClockFill} color="amber" subtitle="Awaiting collection" />
              <StatsCard title="In Progress" value={stats.inProgress} icon={FiPlay} color="blue" subtitle="Currently collecting" />
              <StatsCard title="Completed" value={stats.completed} icon={BsCheckCircleFill} color="emerald" subtitle={stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% done` : '0% done'} />
              {stats.overdue > 0 && (
                <StatsCard title="Overdue" value={stats.overdue} icon={BsExclamationTriangle} color="red" subtitle="Time slot passed" />
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { id: 'all', label: 'All', icon: BsListUl },
                { id: 'scheduled', label: 'Scheduled', icon: BsClockFill },
                { id: 'in-progress', label: 'In Progress', icon: FiPlay },
                { id: 'completed', label: 'Completed', icon: BsCheckCircleFill },
                ...(stats.overdue > 0 ? [{ id: 'overdue', label: `Overdue (${stats.overdue})`, icon: BsExclamationTriangle }] : []),
              ].map(filter => (
                <button key={filter.id} onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                    activeFilter === filter.id
                      ? filter.id === 'overdue'
                        ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : filter.id === 'overdue'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                        : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
                  }`}>
                  <filter.icon className="text-sm" />
                  <span className="font-medium">{filter.label}</span>
                </button>
              ))}
            </div>

            {/* Tasks Grid */}
            {filteredTasks.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MdAssignmentTurnedIn className="text-3xl sm:text-4xl text-emerald-600" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  {stats.total === 0 ? 'No Pickups Today' : 'No Tasks Match Filter'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {stats.total === 0 
                    ? "There are no ward pickups scheduled for today. Check the weekly schedule to see upcoming collection days."
                    : `No tasks with "${activeFilter}" status. Try a different filter.`}
                </p>
                {stats.total === 0 ? (
                  <button onClick={() => setActiveTab('schedule')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    View Week Schedule
                  </button>
                ) : (
                  <button onClick={() => setActiveFilter('all')}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
                    View All Tasks
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
                {filteredTasks.map(task => (
                  <WardTaskCard 
                    key={task._id} 
                    task={task}
                    isUpdating={isUpdating}
                    onStart={(id) => handleUpdateStatus(id, 'in-progress')}
                    onComplete={(id) => handleUpdateStatus(id, 'completed')}
                  />
                ))}
              </div>
            )}

            {/* Progress Bar */}
            {stats.total > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Daily Progress</h3>
                  <span className="text-sm font-semibold text-emerald-700">
                    {Math.round((stats.completed / stats.total) * 100)}% Complete
                  </span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                    style={{ width: `${(stats.completed / stats.total) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{stats.completed} of {stats.total} wards completed</span>
                  <span>{stats.scheduled + stats.inProgress} remaining</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Week Schedule Tab */}
        {activeTab === 'schedule' && (
          weekSchedule.length > 0 ? (
            <WeekScheduleTable schedule={weekSchedule} />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCalendar className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Schedule Available</h3>
              <p className="text-gray-600">Unable to load your ward schedule. Please try refreshing.</p>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-emerald-200 py-8 text-center text-emerald-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10 mt-12">
        <span className="font-semibold">&copy; 2024 SweePokhara. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="underline hover:text-emerald-900 transition-colors duration-300 font-medium">Privacy Policy</a>
          <a href="#" className="underline hover:text-emerald-900 transition-colors duration-300 font-medium">Terms of Service</a>
        </div>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animation-delay-3000 { animation-delay: 3s; }
        @keyframes bounce-in {
          0% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
          50% { transform: translateX(-50%) translateY(5px) scale(1.02); }
          100% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
        }
        .animate-bounce-in { animation: bounce-in 0.5s ease-out forwards; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: transparent; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.5); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.8); }
      `}</style>
    </div>
  );
};

export default AssignedTasksPage;
