import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BsBell, 
  BsTruck, 
  BsFillTrashFill, 
  BsMap, 
  BsClock,
  BsCalendar,
  BsCheckCircle,
  BsPeople,
  BsSpeedometer2,
  BsGear,
  BsListTask,
  BsBarChart,
  BsCashCoin,
  BsStar,
  BsShieldCheck
} from "react-icons/bs";
import { 
  FiLogOut, 
  FiChevronRight, 
  FiSearch, 
  FiFilter,
  FiMenu,
  FiX,
  FiHome
} from "react-icons/fi";
import { GiBroom, GiPathDistance } from "react-icons/gi";
import { MdLocationPin, MdAssignmentTurnedIn } from "react-icons/md";
import { TbTrashX } from "react-icons/tb";
import { FaRegCalendarCheck } from "react-icons/fa";

// Dummy data - Can be replaced with backend API calls
const dummyCollectorData = {
  id: "COL-007",
  name: "Rajesh Kumar",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector007",
  rating: 4.8,
  totalCollections: 1247,
  todayCollections: 23,
  monthlyEarnings: "₹45,820",
  efficiency: "92%",
  streak: 14,
  vehicle: {
    id: "TRK-05",
    type: "Waste Collection Truck",
    capacity: "2.5 Tons",
    fuelLevel: 78,
    status: "active"
  }
};

const todaysSchedule = [
  { 
    id: 1, 
    time: "09:00 AM", 
    location: "Mahendra Pul, Pokhara", 
    bins: 15, 
    status: "completed",
    wasteType: "General",
    priority: "medium"
  },
  { 
    id: 2, 
    time: "10:30 AM", 
    location: "Lakeside Area", 
    bins: 22, 
    status: "in-progress",
    wasteType: "Mixed",
    priority: "high"
  },
  { 
    id: 3, 
    time: "12:00 PM", 
    location: "City Center", 
    bins: 18, 
    status: "pending",
    wasteType: "Recyclable",
    priority: "medium"
  },
  { 
    id: 4, 
    time: "02:00 PM", 
    location: "Baseline Road", 
    bins: 12, 
    status: "pending",
    wasteType: "General",
    priority: "low"
  },
];

const performanceStats = [
  { label: "Daily Target", value: "28/30 bins", icon: BsCheckCircle, color: "emerald" },
  { label: "Route Efficiency", value: "96%", icon: GiPathDistance, color: "blue" },
  { label: "Customer Rating", value: "4.8/5", icon: BsStar, color: "amber" },
  { label: "Fuel Efficiency", value: "8.2 km/L", icon: BsSpeedometer2, color: "purple" },
];

const recentCollections = [
  { id: "TB1024", location: "Lakeside East", time: "09:15 AM", type: "General", weight: "45kg" },
  { id: "TB1025", location: "Mahendra Pul", time: "09:45 AM", type: "Recyclable", weight: "32kg" },
  { id: "TB1026", location: "City Center", time: "10:20 AM", type: "Organic", weight: "28kg" },
  { id: "TB1027", location: "Tourist Area", time: "10:50 AM", type: "General", weight: "51kg" },
];

const upcomingTasks = [
  { task: "Vehicle Maintenance Check", due: "Tomorrow", priority: "high" },
  { task: "Monthly Report Submission", due: "2 days", priority: "medium" },
  { task: "Safety Training", due: "1 week", priority: "low" },
];

export default function CollectorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [todaysProgress, setTodaysProgress] = useState(65);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Route optimization available for today's schedule", time: "10m ago", read: false },
    { id: 2, text: "Vehicle service reminder", time: "1h ago", read: false },
    { id: 3, text: "New collection area added to your route", time: "2h ago", read: true },
  ]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTodaysProgress(prev => {
        if (prev >= 100) return 0;
        return prev + Math.random() * 5;
      });
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800 animate-pulse';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <BsCheckCircle className="text-emerald-600" />;
      case 'in-progress': return <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />;
      case 'pending': return <div className="w-2 h-2 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 text-gray-900 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left section */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              
              <Link to="/" className="flex items-center space-x-2 ml-4 lg:ml-0">
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
                  <GiBroom className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  SweepOkhara
                </span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Collector
                </span>
              </Link>
            </div>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bins, locations, or tasks..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative">
                  <BsBell size={20} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold">{dummyCollectorData.name}</p>
                  <p className="text-xs text-gray-500">{dummyCollectorData.id}</p>
                </div>
                <div className="relative">
                  <img 
                    src={dummyCollectorData.avatar} 
                    alt="Collector"
                    className="w-10 h-10 rounded-full border-2 border-emerald-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={dummyCollectorData.avatar}
                    alt="Collector"
                    className="w-12 h-12 rounded-full border-3 border-emerald-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <BsShieldCheck className="text-white text-xs" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{dummyCollectorData.name}</h3>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-500">Rating:</span>
                    <BsStar className="text-amber-500 text-xs" />
                    <span className="text-xs font-semibold">{dummyCollectorData.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiHome size={20} />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("schedule")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "schedule"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BsCalendar size={20} />
                <span className="font-medium">Today's Schedule</span>
              </button>

              <button
                onClick={() => setActiveTab("map")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "map"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BsMap size={20} />
                <span className="font-medium">Live Route Map</span>
              </button>

              <button
                onClick={() => setActiveTab("tasks")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "tasks"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BsListTask size={20} />
                <span className="font-medium">Tasks & Reports</span>
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "analytics"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BsBarChart size={20} />
                <span className="font-medium">Performance</span>
              </button>

              <button
                onClick={() => setActiveTab("earnings")}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === "earnings"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BsCashCoin size={20} />
                <span className="font-medium">Earnings</span>
              </button>

              <div className="pt-6">
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300">
                  <BsGear size={20} />
                  <span className="font-medium">Settings</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 mt-1">
                  <FiLogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>

            {/* Vehicle Status */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-300">VEHICLE STATUS</span>
                  <div className={`w-2 h-2 rounded-full ${dummyCollectorData.vehicle.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></div>
                </div>
                <p className="font-bold">{dummyCollectorData.vehicle.id}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-xs">
                    <p className="text-gray-400">Fuel</p>
                    <p className="font-semibold">{dummyCollectorData.vehicle.fuelLevel}%</p>
                  </div>
                  <div className="text-xs">
                    <p className="text-gray-400">Capacity</p>
                    <p className="font-semibold">{dummyCollectorData.vehicle.capacity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Good Morning, <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">{dummyCollectorData.name.split(' ')[0]}!</span>
                </h1>
                <p className="text-gray-600">
                  Ready to make Pokhara cleaner today? You have {todaysSchedule.filter(t => t.status === 'pending').length} locations remaining.
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden lg:flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                  <BsClock className="text-emerald-600" />
                  <span className="font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                  <MdAssignmentTurnedIn />
                  <span>Start Collection</span>
                </button>
              </div>
            </div>
          </div>

          {/* Performance Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {performanceStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                      <Icon className={`text-${stat.color}-600 text-xl`} />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
                      Today
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Today's Progress & Schedule */}
            <div className="lg:col-span-2 space-y-8">
              {/* Today's Progress */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BsClock className="text-emerald-600" />
                    Today's Collection Progress
                  </h2>
                  <span className="text-sm font-semibold text-emerald-600">
                    {Math.round(todaysProgress)}% Complete
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000"
                      style={{ width: `${todaysProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>9:00 AM</span>
                    <span>12:00 PM</span>
                    <span>3:00 PM</span>
                    <span>6:00 PM</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="text-2xl font-bold text-gray-900">{dummyCollectorData.todayCollections}</p>
                      </div>
                      <BsCheckCircle className="text-emerald-600 text-2xl" />
                    </div>
                    <p className="text-xs text-emerald-600 mt-2">+2 from yesterday</p>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Remaining</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {todaysSchedule.reduce((acc, curr) => acc + curr.bins, 0) - dummyCollectorData.todayCollections}
                        </p>
                      </div>
                      <TbTrashX className="text-blue-600 text-2xl" />
                    </div>
                    <p className="text-xs text-blue-600 mt-2">Approx. 2 hours remaining</p>
                  </div>
                </div>
              </div>

              {/* Today's Schedule */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BsCalendar className="text-emerald-600" />
                    Today's Collection Schedule
                  </h2>
                  <button className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                    <FiFilter />
                    Filter
                  </button>
                </div>

                <div className="space-y-4">
                  {todaysSchedule.map((schedule) => (
                    <div 
                      key={schedule.id}
                      className="flex items-center justify-between p-4 rounded-xl border hover:border-emerald-300 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col items-center">
                          <span className="text-sm font-semibold text-gray-500">{schedule.time.split(':')[0]}</span>
                          <span className="text-xs text-gray-400">{schedule.time.split(' ')[1]}</span>
                        </div>
                        <div className="w-px h-10 bg-gray-300"></div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <MdLocationPin className="text-emerald-600" />
                            <h3 className="font-semibold text-gray-900">{schedule.location}</h3>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                              <BsFillTrashFill className="text-gray-400" />
                              <span>{schedule.bins} bins</span>
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(schedule.priority)}`}>
                              {schedule.priority.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)} flex items-center space-x-2`}>
                          {getStatusIcon(schedule.status)}
                          <span className="capitalize">{schedule.status.replace('-', ' ')}</span>
                        </div>
                        <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-emerald-100 hover:text-emerald-600 transition-colors duration-300 opacity-0 group-hover:opacity-100">
                          <FiChevronRight />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Recent & Upcoming */}
            <div className="space-y-8">
              {/* Recent Collections */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BsFillTrashFill className="text-emerald-600" />
                  Recent Collections
                </h2>
                
                <div className="space-y-4">
                  {recentCollections.map((collection, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <BsFillTrashFill className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Bin #{collection.id}</p>
                          <p className="text-sm text-gray-500">{collection.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{collection.weight}</p>
                        <p className="text-xs text-gray-500">{collection.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-6 py-3 text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center justify-center gap-2">
                  View All Collections
                  <FiChevronRight />
                </button>
              </div>

              {/* Upcoming Tasks */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BsListTask className="text-emerald-600" />
                  Upcoming Tasks
                </h2>
                
                <div className="space-y-4">
                  {upcomingTasks.map((task, index) => (
                    <div key={index} className="p-4 rounded-xl border border-gray-200 hover:border-emerald-300 transition-all duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{task.task}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${task.priority === 'high' ? 'bg-red-100 text-red-800' : task.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                          {task.priority}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaRegCalendarCheck />
                          Due in {task.due}
                        </span>
                        <button className="text-emerald-600 hover:text-emerald-700 text-xs font-medium">
                          Mark Complete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Efficiency Badge */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">Weekly Efficiency</h3>
                  <BsStar className="text-amber-300 text-xl" />
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Current Streak</span>
                    <span className="font-bold">{dummyCollectorData.streak} days</span>
                  </div>
                  <div className="h-2 bg-emerald-700 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(dummyCollectorData.streak / 30) * 100}%` }} />
                  </div>
                </div>
                <p className="text-sm text-emerald-100">
                  Keep it up! {30 - dummyCollectorData.streak} more days for the perfect month badge.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex justify-around items-center h-16">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center p-2 ${activeTab === "dashboard" ? "text-emerald-600" : "text-gray-500"}`}
          >
            <FiHome size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`flex flex-col items-center p-2 ${activeTab === "schedule" ? "text-emerald-600" : "text-gray-500"}`}
          >
            <BsCalendar size={20} />
            <span className="text-xs mt-1">Schedule</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("map")}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <BsMap size={20} />
            <span className="text-xs mt-1">Map</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("tasks")}
            className="flex flex-col items-center p-2 text-gray-500"
          >
            <BsListTask size={20} />
            <span className="text-xs mt-1">Tasks</span>
          </button>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #10b981;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </div>
  );
}