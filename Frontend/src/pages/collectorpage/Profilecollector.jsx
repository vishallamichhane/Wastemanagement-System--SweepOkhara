import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiHome, 
  FiCalendar, 
  FiLogOut, 
  FiArrowLeft,
  FiEdit2,
  FiSettings,
  FiStar,
  FiAward,
  FiTrendingUp,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCheckCircle
} from 'react-icons/fi';
import { 
  BsBell, 
  BsTruck, 
  BsFillTrashFill, 
  BsPeople,
  BsShieldCheck,
  BsCalendarCheck,
  BsGraphUp,
  BsCashCoin,
  BsStarFill,
  BsListUl
} from "react-icons/bs";
import { GiBroom, GiPathDistance, GiRank3 } from "react-icons/gi";
import { MdOutlineVerified, MdLocationPin, MdWorkHistory } from "react-icons/md";

// -------------------------
// DUMMY PROFILE DATA
// -------------------------
const collectorProfileData = {
  personal: {
    id: "COL-007",
    name: "Rajesh Kumar",
    role: "Senior Waste Collector",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector007",
    joinDate: "March 15, 2022",
    employeeId: "SWP-2022-007",
    status: "Active",
    badge: "Gold Tier"
  },
  
  contact: {
    phone: "+977 9800000000",
    email: "rajesh.kumar@sweepokhara.com",
    address: "Lakeside, Pokhara, Nepal",
    emergencyContact: "+977 9812345678"
  },
  
  performance: {
    rating: 4.8,
    totalCollections: 1247,
    thisMonth: 156,
    efficiency: 94.5,
    accuracy: 98.2,
    attendance: 99.1,
    safetyScore: 97.5
  },
  
  achievements: [
    { id: 1, title: "Perfect Month", description: "Completed all assigned tasks for 3 consecutive months", date: "May 2024", icon: FiAward },
    { id: 2, title: "Safety First", description: "Zero safety incidents for 6 months", date: "April 2024", icon: BsShieldCheck },
    { id: 3, title: "Efficiency Master", description: "Achieved 95%+ efficiency for 4 months straight", date: "March 2024", icon: FiTrendingUp },
    { id: 4, title: "Customer Favorite", description: "Highest customer satisfaction rating", date: "February 2024", icon: BsStarFill }
  ],
  
  stats: {
    totalDistance: "2,847 km",
    binsCollected: "12,470",
    workingHours: "1,840 hrs",
    fuelEfficiency: "8.2 km/L",
    carbonSaved: "24.7 tons"
  },
  
  vehicle: {
    id: "TRK-05",
    type: "Waste Collection Truck",
    capacity: "2.5 Tons",
    registration: "PHA-05-2345",
    lastService: "2 weeks ago",
    nextService: "In 2 weeks",
    status: "Active",
    fuelType: "Diesel"
  },
  
  currentTasks: {
    today: 15,
    pending: 6,
    inProgress: 2,
    completed: 7
  }
};

// -------------------------
// STAT CARD COMPONENT
// -------------------------
const ProfileStatCard = ({ title, value, icon: Icon, color, unit, trend }) => {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    purple: 'bg-purple-100 text-purple-600',
    red: 'bg-red-100 text-red-600'
  };

  const valueColors = {
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    amber: 'text-amber-700',
    purple: 'text-purple-700',
    red: 'text-red-700'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 rounded-full ${colorClasses[color]} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="text-2xl" />
        </div>
        {trend && (
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900 mb-1">
          {value} {unit && <span className="text-lg text-gray-600">{unit}</span>}
        </p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

// -------------------------
// ACHIEVEMENT CARD COMPONENT
// -------------------------
const AchievementCard = ({ achievement }) => {
  const Icon = achievement.icon;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="text-2xl text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-gray-900">{achievement.title}</h4>
            <span className="text-xs text-gray-500">{achievement.date}</span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
          <div className="flex items-center text-xs text-amber-600">
            <MdOutlineVerified className="mr-1" />
            <span>Verified Achievement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------
// PROGRESS BAR COMPONENT
// -------------------------
const ProgressBar = ({ label, value, color, showValue = true }) => {
  const colorClasses = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    purple: 'bg-purple-500'
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {showValue && <span className="text-sm font-bold text-gray-900">{value}%</span>}
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${colorClasses[color]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
const CollectorProfile = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [activeNav, setActiveNav] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(collectorProfileData);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In real app, save to backend here
    console.log('Profile saved');
  };

  const handleLogout = () => {
    // In real app, handle logout logic
    navigate('/login');
  };

  const formatJoinDuration = (joinDate) => {
    const join = new Date(joinDate);
    const now = new Date();
    const diffMonths = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth());
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;
    
    if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${months > 0 ? `${months} month${months > 1 ? 's' : ''}` : ''}`;
    }
    return `${months} month${months > 1 ? 's' : ''}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
      </div>

      {/* UPDATED NAVBAR - Same as Collector Dashboard */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <GiBroom className="text-emerald-600 text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              SweepOkhara
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
              Collector
            </span>
          </div>

          {/* Navigation */}
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
              onClick={() => {
                setActiveNav('tasks');
                navigate('/collector/tasks');
              }}
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
                              activeNav === 'schedule' ? "w-4/5 left-1/10" : ""
                            }`}></span>
                          </button>
            
            
            
            <button className="relative px-6 py-2.5 rounded-xl text-emerald-700 font-semibold border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/80 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center space-x-2">
                <FiLogOut />
                <span>Logout</span>
              </div>
              <div className="absolute inset-0 bg-emerald-50/50 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
            
            {/* Profile */}
<div className="relative group/profile">
  <Link 
    to="/collector/profile" 
    className="flex items-center space-x-3"
    onClick={() => setActiveNav('profile')}
  >
    <div className="text-right hidden md:block">
      <p className={`text-sm font-semibold ${
        activeNav === 'profile' ? "text-emerald-700" : "text-gray-700"
      }`}>
        {profileData.personal.name}
      </p>
      <p className="text-xs text-gray-500">ID: {profileData.personal.id}</p>
    </div>
    
    {/* Avatar Container */}
    <div className="relative">
      {/* Outer glow ring on hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-300 blur-sm group-hover/profile:blur-md -z-10"></div>
      
      {/* Avatar */}
      <div className="relative">
        <img 
          src={profileData.personal.avatar} 
          alt="Collector"
          className={`w-11 h-11 rounded-full border-2 transition-all duration-300 ${
            activeNav === 'profile'
              ? "border-emerald-600"
              : "border-emerald-500 group-hover/profile:border-emerald-400"
          }`}
        />
        
        {/* Active indicator */}
        {activeNav === 'profile' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-emerald-900/20 rounded-full opacity-0 group-hover/profile:opacity-100 transition-opacity duration-300"></div>
        
        {/* Hover ring animation */}
        <div className="absolute -inset-1 rounded-full border-2 border-emerald-400 opacity-0 group-hover/profile:opacity-100 transition-opacity duration-500 animate-ping-once pointer-events-none"></div>
      </div>
    </div>
  </Link>
</div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-24"></div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Back Button and Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/collector/dashboard')}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-6 group"
          >
            <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Profile Header */}
            <div className="flex items-start space-x-6">
              <div className="relative group">
                <img 
                  src={profileData.personal.avatar} 
                  alt={profileData.personal.name}
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-full border-3 border-white flex items-center justify-center">
                  <MdOutlineVerified className="text-white text-lg" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{profileData.personal.name}</h1>
                  <span className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold rounded-full">
                    {profileData.personal.badge}
                  </span>
                </div>
                <p className="text-xl text-gray-600 mb-3">{profileData.personal.role}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <FiStar className="text-amber-500" />
                    <span className="font-semibold text-gray-700">{profileData.performance.rating}/5</span>
                    <span>(124 reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsCalendarCheck />
                    <span>Joined {profileData.personal.joinDate}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BsShieldCheck className="text-emerald-500" />
                    <span>{profileData.personal.status}</span>
                  </div>
                </div>
              </div>
            </div>
            
           
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-gray-200">
            {['overview', 'performance', 'achievements', 'vehicle'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium transition-all duration-300 relative ${
                  activeTab === tab
                    ? 'text-emerald-700 border-b-2 border-emerald-600'
                    : 'text-gray-600 hover:text-emerald-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Performance Stats */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BsGraphUp className="text-emerald-600" />
                  Performance Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <ProfileStatCard
                    title="Total Collections"
                    value={profileData.performance.totalCollections}
                    icon={BsFillTrashFill}
                    color="emerald"
                    trend={2.5}
                  />
                  <ProfileStatCard
                    title="Efficiency Rate"
                    value={profileData.performance.efficiency}
                    icon={FiTrendingUp}
                    color="blue"
                    unit="%"
                    trend={1.2}
                  />
                  <ProfileStatCard
                    title="Accuracy Score"
                    value={profileData.performance.accuracy}
                    icon={FiCheckCircle}
                    color="purple"
                    unit="%"
                    trend={0.8}
                  />
                  <ProfileStatCard
                    title="Attendance"
                    value={profileData.performance.attendance}
                    icon={BsCalendarCheck}
                    color="amber"
                    unit="%"
                    trend={0.3}
                  />
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-2">
                  <ProgressBar label="Collection Efficiency" value={profileData.performance.efficiency} color="emerald" />
                  <ProgressBar label="Safety Compliance" value={profileData.performance.safetyScore} color="blue" />
                  <ProgressBar label="Route Optimization" value={92.3} color="purple" />
                  <ProgressBar label="Customer Satisfaction" value={96.8} color="amber" />
                </div>
              </div>

              {/* Current Tasks */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BsTruck className="text-emerald-600" />
                  Current Task Status
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(profileData.currentTasks).map(([key, value]) => {
                    const labels = {
                      today: 'Today',
                      pending: 'Pending',
                      inProgress: 'In Progress',
                      completed: 'Completed'
                    };
                    
                    const colors = {
                      today: 'bg-emerald-500',
                      pending: 'bg-amber-500',
                      inProgress: 'bg-blue-500',
                      completed: 'bg-purple-500'
                    };
                    
                    return (
                      <div key={key} className="text-center">
                        <div className={`text-4xl font-bold mb-2 ${key === 'completed' ? 'text-emerald-700' : 'text-gray-900'}`}>
                          {value}
                        </div>
                        <div className="flex items-center justify-center">
                          <div className={`w-3 h-3 rounded-full ${colors[key]} mr-2`}></div>
                          <span className="text-sm text-gray-600">{labels[key]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                  <p className="text-sm text-emerald-800 font-medium">
                    <span className="font-bold">Tip:</span> Complete 3 more pending tasks today to maintain your Gold Tier status!
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Personal Details */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BsPeople className="text-emerald-600" />
                  Contact Information
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <FiPhone className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">{profileData.contact.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <FiMail className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{profileData.contact.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                    <MdLocationPin className="text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{profileData.contact.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors duration-300">
                    <FiPhone className="text-red-500" />
                    <div>
                      <p className="text-sm text-red-500">Emergency Contact</p>
                      <p className="font-medium text-red-700">{profileData.contact.emergencyContact}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Info */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <BsTruck className="text-emerald-400" />
                  Assigned Vehicle
                </h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Vehicle ID</span>
                    <span className="font-bold text-xl">{profileData.vehicle.id}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Type</span>
                    <span className="font-semibold">{profileData.vehicle.type}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Capacity</span>
                    <span className="font-semibold">{profileData.vehicle.capacity}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Status</span>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                      {profileData.vehicle.status}
                    </span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-sm text-gray-400">Next Service Due</p>
                    <p className="font-semibold text-lg">{profileData.vehicle.nextService}</p>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Employment Details</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employee ID</span>
                    <span className="font-semibold">{profileData.personal.employeeId}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Joined</span>
                    <span className="font-semibold">{profileData.personal.joinDate}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold">{formatJoinDuration(profileData.personal.joinDate)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-semibold">
                      {profileData.personal.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Performance Metrics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <ProfileStatCard
                  title="Total Distance"
                  value={profileData.stats.totalDistance}
                  icon={GiPathDistance}
                  color="blue"
                />
                <ProfileStatCard
                  title="Bins Collected"
                  value={profileData.stats.binsCollected}
                  icon={BsFillTrashFill}
                  color="emerald"
                />
                <ProfileStatCard
                  title="Working Hours"
                  value={profileData.stats.workingHours}
                  icon={FiClock}
                  color="purple"
                />
                <ProfileStatCard
                  title="Carbon Saved"
                  value={profileData.stats.carbonSaved}
                  icon={BsShieldCheck}
                  color="amber"
                />
              </div>
              
              {/* Monthly Performance Chart (Placeholder) */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance Trend</h3>
                <div className="h-48 bg-white/80 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Performance chart visualization would appear here</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiAward className="text-amber-600" />
                Achievements & Badges
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData.achievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
              
              {/* Badge Collection */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Badge Collection</h3>
                <div className="flex flex-wrap gap-4">
                  {['Gold Tier', 'Safety Star', 'Efficiency Expert', 'Customer Champion', 'Perfect Attendance', 'Route Master'].map(badge => (
                    <div key={badge} className="flex flex-col items-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-yellow-200 rounded-full flex items-center justify-center mb-2">
                        <FiAward className="text-amber-600 text-2xl" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'vehicle' && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Vehicle Details & Maintenance</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Vehicle Info */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Vehicle Specifications</h3>
                  <div className="space-y-4">
                    {Object.entries(profileData.vehicle).map(([key, value]) => {
                      const labels = {
                        id: 'Vehicle ID',
                        type: 'Vehicle Type',
                        capacity: 'Capacity',
                        registration: 'Registration',
                        lastService: 'Last Service',
                        nextService: 'Next Service Due',
                        status: 'Current Status',
                        fuelType: 'Fuel Type'
                      };
                      
                      return (
                        <div key={key} className="flex justify-between items-center py-3 border-b border-gray-100">
                          <span className="text-gray-600">{labels[key]}</span>
                          <span className={`font-semibold ${
                            key === 'status' ? (
                              value === 'Active' ? 'text-emerald-600' : 'text-amber-600'
                            ) : 'text-gray-900'
                          }`}>
                            {value}
                            {key === 'status' && (
                              <div className={`inline-block w-2 h-2 rounded-full ml-2 ${
                                value === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                              }`}></div>
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Maintenance Schedule */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Maintenance Schedule</h3>
                  <div className="space-y-4">
                    {[
                      { service: 'Oil Change', due: 'In 500 km', status: 'Upcoming' },
                      { service: 'Tire Rotation', due: 'In 2 weeks', status: 'Scheduled' },
                      { service: 'Brake Inspection', due: 'Next month', status: 'Planned' },
                      { service: 'Engine Tune-up', due: 'In 3 months', status: 'Future' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                        <div>
                          <h4 className="font-semibold text-gray-900">{item.service}</h4>
                          <p className="text-sm text-gray-600">{item.due}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          item.status === 'Upcoming' ? 'bg-amber-100 text-amber-800' :
                          item.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'Planned' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                    <p className="text-sm text-blue-800 font-medium">
                      <span className="font-bold">Note:</span> Regular maintenance ensures vehicle efficiency and safety compliance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-emerald-200 py-8 text-center text-emerald-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10 mt-12">
        <span className="font-semibold">© 2024 SweepOkhara. All rights reserved.</span>
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

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default CollectorProfile;