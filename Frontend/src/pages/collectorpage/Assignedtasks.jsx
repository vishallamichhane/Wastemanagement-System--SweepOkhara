import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowRight,
  FiMapPin,
  FiChevronLeft,
  FiCheck,
  FiClock,
  FiHome,
  FiCalendar,
  FiLogOut,
  FiUser,
  FiSettings
} from 'react-icons/fi';
import { 
  BsListUl,
  BsCheckCircleFill,
  BsClockFill,
  BsExclamationCircle,
  BsPinMap,
  BsArrowRightCircle,
  BsTruck,
  BsFillTrashFill,
  BsCheckCircleFill as BsCheckCircle,
  BsExclamationTriangle
} from "react-icons/bs";
import { GiBroom, GiPathDistance } from "react-icons/gi";
import { MdAssignmentTurnedIn, MdOutlineDeleteSweep } from "react-icons/md";
import useScrollToTop from "../../hooks/useScrollToTop";
import CollectorNotificationCenter from "./components/CollectorNotificationCenter";

// -------------------------
// STATIC DATA - Dummy data that can be replaced with backend
// -------------------------
const assignedTasksData = {
  collector: {
    id: "COL-007",
    name: "Rajesh Kumar",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector007",
    vehicle: "TRK-05",
    route: "Route A - Lakeside Area"
  },
  
  tasks: [
    {
      id: "TASK-001",
      binId: "TB1025",
      location: "Lakeside, Pokhara",
      coordinates: [28.2090, 83.9596],
      fillLevel: 55,
      status: "in-progress",
      priority: "medium",
      wasteType: "General Waste",
      distance: "1.2 km",
      estimatedTime: "20 mins",
      address: "Lakeside Main Road, Pokhara",
      notes: "Regular collection, accessible location"
    },
    {
      id: "TASK-002",
      binId: "TB1026",
      location: "Baseline, Pokhara",
      coordinates: [28.2144, 83.9851],
      fillLevel: 20,
      status: "pending",
      priority: "low",
      wasteType: "Recyclable Waste",
      distance: "2.1 km",
      estimatedTime: "25 mins",
      address: "Baseline Road, Pokhara",
      notes: "Plastic and paper recycling"
    },
    {
      id: "TASK-003",
      binId: "TB1027",
      location: "City Center, Pokhara",
      coordinates: [28.2096, 83.9896],
      fillLevel: 65,
      status: "pending",
      priority: "high",
      wasteType: "Organic Waste",
      distance: "2.5 km",
      estimatedTime: "30 mins",
      address: "City Center Market, Near Bus Park",
      notes: "Organic waste - separate collection required"
    },
    {
      id: "TASK-004",
      binId: "TB1028",
      location: "Lakeside East, Pokhara",
      coordinates: [28.2115, 83.9650],
      fillLevel: 10,
      status: "pending",
      priority: "low",
      wasteType: "General Waste",
      distance: "1.8 km",
      estimatedTime: "22 mins",
      address: "Lakeside East Residential Area, Pokhara",
      notes: "Regular collection, easy access"
    },
    {
      id: "TASK-005",
      binId: "TB1029",
      location: "Pokhara Engineering College",
      coordinates: [28.21118953908775, 83.9771218979668],
      fillLevel: 0,
      status: "pending",
      priority: "low",
      wasteType: "Smart Bin (Demo)",
      distance: "1.5 km",
      estimatedTime: "18 mins",
      address: "Pokhara Engineering College, Pokhara",
      notes: "Demo smart bin with ultrasonic sensor"
    }
  ],
  
  stats: {
    total: 5,
    pending: 4,
    inProgress: 1,
    completed: 0,
    highPriority: 1,
    totalDistance: "9.1 km",
    estimatedTotalTime: "2 hours"
  }
};

// -------------------------
// TASK CARD COMPONENT
// -------------------------
const TaskCard = ({ task, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'pending': return 'Pending';
      default: return 'Pending';
    }
  };

  const getFillLevelColor = (level) => {
    if (level >= 80) return 'bg-red-500';
    if (level >= 50) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden group">
      {/* Task Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Bin #{task.binId}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <FiMapPin className="text-emerald-600 text-sm" />
                <span className="text-sm text-gray-600">{task.location}</span>
              </div>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(task.status)}`}>
            {getStatusText(task.status)}
          </div>
        </div>
        
        {/* Fill Level Indicator */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Fill Level</span>
            <span className="font-semibold">{task.fillLevel}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getFillLevelColor(task.fillLevel)} rounded-full transition-all duration-500`}
              style={{ width: `${task.fillLevel}%` }}
            ></div>
          </div>
        </div>
        
        {/* Task Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <MdOutlineDeleteSweep className="text-gray-500" />
            <span className="text-gray-700">{task.wasteType}</span>
          </div>
          <div className="flex items-center space-x-2">
            <GiPathDistance className="text-gray-500" />
            <span className="text-gray-700">{task.distance}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FiClock className="text-gray-500" />
            <span className="text-gray-700">{task.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <BsExclamationCircle className="text-gray-500" />
            <span className="text-gray-700 capitalize">{task.priority} Priority</span>
          </div>
        </div>
      </div>
      
      {/* Task Actions */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button 
            onClick={() => onStatusChange(task.id, 'in-progress')}
            disabled={task.status !== 'pending'}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
              task.status === 'pending' 
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <BsArrowRightCircle />
            <span>Start Collection</span>
          </button>
          
          <button 
            onClick={() => onStatusChange(task.id, 'completed')}
            disabled={task.status !== 'in-progress'}
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
              task.status === 'in-progress' 
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiCheck />
            <span>Mark Complete</span>
          </button>
        </div>
        
        {/* Additional Info */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-medium">Address:</span> {task.address}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Notes:</span> {task.notes}
          </p>
        </div>
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
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-14 h-14 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

// -------------------------
// FILTER COMPONENT
// -------------------------
const FilterSection = ({ activeFilter, setActiveFilter }) => {
  const filters = [
    { id: 'all', label: 'All Tasks', icon: BsListUl },
    { id: 'pending', label: 'Pending', icon: BsClockFill },
    { id: 'in-progress', label: 'In Progress', icon: BsArrowRightCircle },
    { id: 'completed', label: 'Completed', icon: BsCheckCircleFill },
    { id: 'high', label: 'High Priority', icon: BsExclamationCircle }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map(filter => {
        const Icon = filter.icon;
        return (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-300 ${
              activeFilter === filter.id
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md border border-gray-200'
            }`}
          >
            <Icon />
            <span className="font-medium">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
const AssignedTasksPage = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(assignedTasksData.tasks);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeNav, setActiveNav] = useState('tasks');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      // Hide navbar when scrolling down, show when scrolling up
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileDropdown(false);
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

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleNavigateToMap = () => {
    navigate('/collector/map');
  };

  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return task.status === 'pending';
    if (activeFilter === 'in-progress') return task.status === 'in-progress';
    if (activeFilter === 'completed') return task.status === 'completed';
    if (activeFilter === 'high') return task.priority === 'high';
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    highPriority: tasks.filter(t => t.priority === 'high').length,
    totalDistance: "11.6 km",
    estimatedTotalTime: "2.5 hours"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col">
      {/* Background Elements - Same as Collector Dashboard */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-3000"></div>
      </div>

      {/* EXACT SAME NAVBAR AS COLLECTOR DASHBOARD */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      } ${isNavVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
          {/* Left: Logo (from Header) */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
              <GiBroom className="text-white text-xl" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                SweePokhara
              </span>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
              Collector
            </span>
          </div>

          {/* Right: Navigation - Same as Collector Dashboard */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => {
                setActiveNav('home');
                navigate('/collector/dashboard');
              }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                activeNav === 'home' 
                  ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiHome />
                <span className="font-semibold">Dashboard</span>
              </div>
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 ${
                activeNav === 'home' ? "w-4/5 left-1/10" : ""
              }`}></span>
            </button>
            
            <button
              onClick={() => setActiveNav('tasks')}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                activeNav === 'tasks' 
                  ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiCalendar />
                <span className="font-semibold">Schedule</span>
              </div>
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 ${
                activeNav === 'tasks' ? "w-4/5 left-1/10" : ""
              }`}></span>
            </button>

            <button
              onClick={() => {
                setActiveNav('reports');
                navigate('/collector/reports');
              }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                activeNav === 'reports' 
                  ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BsExclamationTriangle />
                <span className="font-semibold">Reports</span>
              </div>
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 ${
                activeNav === 'reports' ? "w-4/5 left-1/10" : ""
              }`}></span>
            </button>
            
            {/* Notification Center */}
            <CollectorNotificationCenter />
            
            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
              >
                <FiUser className="text-xl" />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-emerald-100 overflow-hidden z-50 animate-fadeIn">
                  <div className="py-2">
                    <button
                      onClick={handleDashboardClick}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all duration-200 text-gray-700 hover:text-emerald-700"
                    >
                      <FiHome className="text-lg" />
                      <span className="font-semibold">Dashboard</span>
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all duration-200 text-gray-700 hover:text-emerald-700"
                    >
                      <FiSettings className="text-lg" />
                      <span className="font-semibold">Profile Settings</span>
                    </button>
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 transition-all duration-200 text-gray-700 hover:text-red-600"
                    >
                      <FiLogOut className="text-lg" />
                      <span className="font-semibold">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav - Same as Collector Dashboard */}
      <div className="h-24"></div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/collector/dashboard')}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group"
          >
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Assigned Collection Tasks
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track your waste collection assignments in real-time
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-4 py-2">
                <p className="text-sm text-emerald-700 font-medium">Route: {assignedTasksData.collector.route}</p>
              </div>
              <button 
                onClick={handleNavigateToMap}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2 hover:scale-105 group"
              >
                <BsPinMap />
                <span>View on Map</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total Tasks" 
            value={stats.total} 
            icon={BsListUl}
            color="emerald"
            subtitle={`${stats.completed}/${stats.total} completed`}
          />
          <StatsCard 
            title="Pending Tasks" 
            value={stats.pending} 
            icon={BsClockFill}
            color="amber"
            subtitle="Awaiting collection"
          />
          <StatsCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={BsArrowRightCircle}
            color="blue"
            subtitle="Currently collecting"
          />
          <StatsCard 
            title="High Priority" 
            value={stats.highPriority} 
            icon={BsExclamationCircle}
            color="red"
            subtitle="Urgent attention needed"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-100 mb-1">Total Distance</p>
                <p className="text-3xl font-bold">{stats.totalDistance}</p>
              </div>
              <GiPathDistance className="text-4xl text-emerald-200" />
            </div>
            <p className="text-sm text-emerald-100 mt-3">Covers all assigned locations</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100 mb-1">Estimated Time</p>
                <p className="text-3xl font-bold">{stats.estimatedTotalTime}</p>
              </div>
              <FiClock className="text-4xl text-blue-200" />
            </div>
            <p className="text-sm text-blue-100 mt-3">Total collection duration</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <FilterSection activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {activeFilter === 'all' ? 'All' : activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Tasks
              <span className="text-gray-500 text-lg ml-2">({filteredTasks.length})</span>
            </h2>
            <div className="text-sm text-gray-600">
              Sorted by: <span className="font-semibold text-emerald-700">Priority & Distance</span>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdAssignmentTurnedIn className="text-4xl text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Tasks Found</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {activeFilter === 'completed' 
                ? "You haven't completed any tasks yet. Start collecting to mark tasks as complete."
                : "All tasks have been processed for this filter. Great work!"}
            </p>
            <button 
              onClick={() => setActiveFilter('all')}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              View All Tasks
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
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
            <span>0 tasks</span>
            <span>Daily Goal: {stats.total} tasks</span>
          </div>
        </div>

       
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-emerald-200 py-8 text-center text-emerald-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10 mt-12">
        <span className="font-semibold">© 2024 SweePokhara. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="underline hover:text-emerald-900 transition-colors duration-300 font-medium">
            Privacy Policy
          </a>
          <a href="#" className="underline hover:text-emerald-900 transition-colors duration-300 font-medium">
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

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
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
    </div>
  );
};

export default AssignedTasksPage;