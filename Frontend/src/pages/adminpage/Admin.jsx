import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiHome, 
  FiUsers, 
  FiTruck, 
  FiBarChart2,
  FiBell,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiDownload,
  FiLogOut,
  FiAlertTriangle
} from 'react-icons/fi';
import { 
  BsFillTrashFill, 
  BsExclamationTriangle,
  BsShieldCheck,
  BsPeople,
  BsTruck,
  BsCheckCircle
} from "react-icons/bs";
import { GiBroom } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";
import useScrollToTop from "../../hooks/useScrollToTop";
import UserManagement from "./UserManagement";
import CollectorManagement from "./CollectorManagement";
import ReportsAnalytics from "./ReportsAnalytics";
import BinManagement from "./BinManagement";
import SystemAnalytics from "./SystemAnalytics";

// Dummy Data - Can be replaced with API calls
const dummyAdminData = {
  id: "ADMIN-001",
  name: "Admin Pokhara",
  email: "admin@sweepokhara.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin001",
};

const systemStats = {
  totalUsers: 2450,
  totalCollectors: 47,
  activeCollections: 23,
  fullBins: 128,
  revenueToday: "₹12,450",
  efficiencyRate: "94%",
  pendingReports: 18,
  avgResponseTime: "2.3h"
};

const userActivity = [
  { id: "USR-001", name: "Ramesh Thapa", type: "Resident", reports: 3, lastActive: "2h ago", status: "active" },
  { id: "USR-002", name: "Sunita Gurung", type: "Business", reports: 7, lastActive: "1d ago", status: "active" },
  { id: "USR-003", name: "Hotel Mountain View", type: "Commercial", reports: 12, lastActive: "3h ago", status: "active" },
  { id: "USR-004", name: "Tourist Info Center", type: "Government", reports: 5, lastActive: "5d ago", status: "inactive" },
];

// Stats Card Component
const StatCard = ({ title, value, change, icon: Icon, color, trend = "up" }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-emerald-100 text-emerald-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 transform border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
        <div className={`flex items-center text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {change && (
            <>
              {trend === 'up' ? '↑' : '↓'} {change}
            </>
          )}
        </div>
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-1">{value}</h3>
      <p className="text-gray-600 text-sm">{title}</p>
    </div>
  );
};

const AdminDashboard = () => {
  useScrollToTop();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [dateRange, setDateRange] = useState("today");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll for navbar hide/show animation
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsNavVisible(false);
      } else {
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Sample Notifications Data
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "High CPU Usage Detected",
      message: "System CPU usage is at 85%. Please monitor performance.",
      timestamp: "5 minutes ago",
      icon: BsExclamationTriangle,
      color: "red",
      read: false
    },
    {
      id: 2,
      type: "success",
      title: "Collection Task Completed",
      message: "Collection Team A completed their daily route successfully.",
      timestamp: "2 hours ago",
      icon: BsCheckCircle,
      color: "emerald",
      read: false
    },
    {
      id: 3,
      type: "info",
      title: "New Report Submitted",
      message: "5 new waste management reports submitted by users.",
      timestamp: "4 hours ago",
      icon: FiBell,
      color: "blue",
      read: false
    },
    {
      id: 4,
      type: "warning",
      title: "Bin Maintenance Due",
      message: "3 bins require routine maintenance this week.",
      timestamp: "1 day ago",
      icon: FiAlertTriangle,
      color: "amber",
      read: true
    }
  ]);

  const handleExportData = () => {
    alert("Exporting data... This would download system analytics.");
  };

  const handleMarkAllRead = () => {
    setUnreadNotifications(0);
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(
      notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const handleRemoveNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    setUnreadNotifications(Math.max(0, unreadNotifications - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-900 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className={`bg-white/95 backdrop-blur-md border-b border-gray-200 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-500 ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo and Brand */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden mr-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
                  <GiBroom className="text-white text-xl" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                    SweePokhara
                  </span>
                  <span className="block text-xs text-gray-500 font-medium">Administration Portal</span>
                </div>
              </Link>
            </div>

            {/* Center: Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports, users, collectors..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Admin Controls */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 relative transition-colors duration-200"
                  onClick={() => setNotificationOpen(!notificationOpen)}
                >
                  <FiBell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-bold">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fadeInDown">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 flex items-center justify-between">
                      <h3 className="font-bold">Notifications ({notifications.length})</h3>
                      <button
                        onClick={() => setNotificationOpen(false)}
                        className="hover:bg-white hover:bg-opacity-20 p-1 rounded-lg transition-all"
                      >
                        <FiSearch className="rotate-45" />
                      </button>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => {
                          const IconComponent = notif.icon;
                          const colorClasses = {
                            red: "bg-red-100 text-red-600",
                            emerald: "bg-emerald-100 text-emerald-600",
                            blue: "bg-blue-100 text-blue-600",
                            amber: "bg-amber-100 text-amber-600",
                          };

                          return (
                            <div
                              key={notif.id}
                              onClick={() => handleNotificationClick(notif.id)}
                              className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                                notif.read ? "opacity-75" : "bg-blue-50 border-l-4 border-l-emerald-600"
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${colorClasses[notif.color]} flex-shrink-0 mt-1`}>
                                  <IconComponent className="text-lg" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-gray-900 text-sm">{notif.title}</p>
                                  <p className="text-gray-600 text-xs mt-1 line-clamp-2">{notif.message}</p>
                                  <p className="text-gray-400 text-xs mt-2">{notif.timestamp}</p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveNotification(notif.id);
                                  }}
                                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors"
                                >
                                  <FiSearch className="rotate-45 text-lg" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 text-center">
                          <FiBell className="mx-auto text-4xl text-gray-300 mb-2" />
                          <p className="text-gray-500 font-medium">No notifications</p>
                          <p className="text-gray-400 text-sm">You're all caught up!</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="bg-gray-50 p-3 border-t border-gray-200 flex gap-2">
                        <button
                          onClick={() => {
                            handleMarkAllRead();
                            setNotificationOpen(false);
                          }}
                          className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                          Mark All Read
                        </button>
                        <button
                          onClick={() => setNotificationOpen(false)}
                          className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Backdrop */}
                {notificationOpen && (
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationOpen(false)}
                  ></div>
                )}
              </div>



              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold">{dummyAdminData.name}</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
                <div className="relative group">
                  <img 
                    src={dummyAdminData.avatar} 
                    alt="Admin"
                    className="w-10 h-10 rounded-full border-2 border-emerald-500 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <BsShieldCheck className="text-white text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`
          fixed top-24 left-0 z-40 h-[calc(100vh-96px)] w-64 bg-white/95 backdrop-blur-md border-r border-gray-200 transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 overflow-y-auto
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={dummyAdminData.avatar}
                    alt="Admin"
                    className="w-12 h-12 rounded-full border-3 border-emerald-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                    <BsShieldCheck className="text-white text-xs" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{dummyAdminData.name}</h3>
                  <p className="text-xs text-gray-500">{dummyAdminData.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto animate-slideInLeft">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "dashboard"
                    ? "active bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
                }`}
              >
                <FiHome size={20} />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "users"
                    ? "active bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
                }`}
              >
                <FiUsers size={20} />
                <span className="font-medium">User Management</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {systemStats.totalUsers}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("collectors")}
                className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "collectors"
                    ? "active bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
                }`}
              >
                <FiTruck size={20} />
                <span className="font-medium">Collector Management</span>
                <span className="ml-auto text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                  {systemStats.totalCollectors}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("reports")}
                className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "reports"
                    ? "active bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
                }`}
              >
                <TbReportAnalytics size={20} />
                <span className="font-medium">Reports & Analytics</span>
                <span className="ml-auto text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {systemStats.pendingReports}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("bins")}
                className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "bins"
                    ? "active bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
                }`}
              >
                <BsFillTrashFill size={20} />
                <span className="font-medium">Bin Management</span>
                <span className="ml-auto text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                  {systemStats.fullBins}
                </span>
              </button>



              <button
                onClick={() => setActiveTab("analytics")}
                className={`sidebar-item w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === "analytics"
                    ? "active bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-100 hover:text-emerald-700"
                }`}
              >
                <FiBarChart2 size={20} />
                <span className="font-medium">System Analytics</span>
              </button>

              <div className="pt-6">
                <button className="w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 transform hover:scale-105">
                  <FiLogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </nav>

            {/* System Status */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-300">SYSTEM STATUS</span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                    <span className="text-xs">Operational</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  <p>Uptime: 99.8%</p>
                  <p className="mt-1">Last updated: Today, 10:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 lg:ml-64">
          <div className="p-4 lg:p-8 min-h-full">
            {/* Conditional Rendering based on activeTab */}
            {activeTab === "users" ? (
              <UserManagement />
            ) : activeTab === "collectors" ? (
              <CollectorManagement />
            ) : activeTab === "reports" ? (
              <ReportsAnalytics />
            ) : activeTab === "bins" ? (
              <BinManagement />
            ) : activeTab === "analytics" ? (
              <SystemAnalytics />
            ) : (
              <>
                {/* Welcome Header */}
                <div className="mb-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                      Admin Dashboard
                    </h1>
                    <p className="text-gray-600">
                      Comprehensive overview of SweePokhara waste management system
                    </p>
                  </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
                  <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-transparent text-sm focus:outline-none"
                  >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                  </select>
                </div>
                <button 
                  onClick={handleExportData}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-300"
                >
                  <FiDownload />
                  <span className="font-medium text-sm">Export Data</span>
                </button>
              </div>
            </div>
          </div>

          {/* System Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Total Users" 
              value={systemStats.totalUsers} 
              change="+12%"
              icon={BsPeople}
              color="blue"
              trend="up"
            />
            <StatCard 
              title="Active Collectors" 
              value={systemStats.totalCollectors} 
              change="+3"
              icon={BsTruck}
              color="green"
              trend="up"
            />
            <StatCard 
              title="Full Bins" 
              value={systemStats.fullBins} 
              change="+8"
              icon={BsFillTrashFill}
              color="amber"
              trend="up"
            />
            <StatCard 
              title="Pending Reports" 
              value={systemStats.pendingReports} 
              change="-2"
              icon={BsExclamationTriangle}
              color="red"
              trend="down"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Recent Reports */}
            <div className="lg:col-span-2 space-y-8">



            </div>

            {/* Right Column - Performance & Notifications */}
            <div className="space-y-8">
            </div>
          </div>

          {/* Footer Stats */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900">99.8%</p>
                <p className="text-sm text-gray-600">System Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">245</p>
                <p className="text-sm text-gray-600">Daily Active Users</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">94%</p>
                <p className="text-sm text-gray-600">User Satisfaction</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">2.3h</p>
                <p className="text-sm text-gray-600">Avg. Issue Resolution</p>
              </div>
            </div>
          </div>
              </>
            )}
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
            <span className="text-xs mt-1">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("reports")}
            className={`flex flex-col items-center p-2 ${activeTab === "reports" ? "text-emerald-600" : "text-gray-500"}`}
          >
            <TbReportAnalytics size={20} />
            <span className="text-xs mt-1">Reports</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("users")}
            className={`flex flex-col items-center p-2 ${activeTab === "users" ? "text-emerald-600" : "text-gray-500"}`}
          >
            <FiUsers size={20} />
            <span className="text-xs mt-1">Users</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`flex flex-col items-center p-2 ${activeTab === "analytics" ? "text-emerald-600" : "text-gray-500"}`}
          >
            <FiBarChart2 size={20} />
            <span className="text-xs mt-1">Analytics</span>
          </button>
        </div>
      </div>

      {/* Custom Styles */}
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease-out;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out;
        }

        .sidebar-item {
          position: relative;
        }

        .sidebar-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 4px;
          background: linear-gradient(to bottom, #10b981, #14b8a6);
          border-radius: 0 4px 4px 0;
          transform: scaleY(0);
          transform-origin: center;
          transition: transform 0.3s ease;
        }

        .sidebar-item.active::before {
          transform: scaleY(1);
        }

        main {
          scrollbar-width: thin;
          scrollbar-color: rgba(16, 185, 129, 0.5) transparent;
        }

        main::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        main::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 10px;
        }

        main::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 10px;
          transition: background 0.3s ease;
        }

        main::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.8);
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

export default AdminDashboard;