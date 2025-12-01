import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsPerson, BsEnvelope, BsTelephone, BsHouse, BsCamera, BsCheck, BsPencil, BsShieldCheck } from "react-icons/bs";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

export default function UserProfilePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+977 9841234567",
    address: "123 Lakeside, Pokhara",
    wardNumber: "15",
    joinDate: "January 15, 2024",
    avatar: "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"
  });

  const [editData, setEditData] = useState({ ...userData });

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

  const handleSave = () => {
    setUserData({ ...editData });
    setIsEditing(false);
    // Here you would typically make an API call to save the data
  };

  const handleCancel = () => {
    setEditData({ ...userData });
    setIsEditing(false);
  };

  const stats = [
    { label: "Reports Submitted", value: "24", color: "from-blue-500 to-cyan-500" },
    { label: "Issues Resolved", value: "18", color: "from-green-500 to-emerald-500" },
    { label: "Community Points", value: "1,250", color: "from-amber-500 to-orange-500" },
    { label: "Days Active", value: "45", color: "from-purple-500 to-pink-500" }
  ];

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
          <Link to="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <GiBroom className="text-emerald-600 text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              SweepOkhara
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {["Home", "Schedule", "My Reports"].map((item) => (
              <Link
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s/g, "")}`}
                className={`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                  item === "Home" 
                    ? "text-gray-600 hover:text-emerald-700 hover:bg-white/80" 
                    : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
                }`}
              >
                {item}
                <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5`}></span>
              </Link>
            ))}
            
            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative group transform transition-all duration-300 hover:text-emerald-700 hover:scale-110 focus:outline-none p-2 rounded-xl hover:bg-emerald-50/80"
            >
              <BsBell className="text-xl" />
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600 animate-ping opacity-75"></span>
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600"></span>
            </button>

            {/* User Profile Icon - Active with bigger size */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center font-semibold select-none shadow-lg border-4 border-emerald-300 cursor-default transform scale-110">
                <FiUser className="text-lg" />
              </div>
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-30"></div>
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
      <main className="flex-grow max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 space-y-8 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all duration-300 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </button>
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 mt-2 text-lg font-medium">
                Manage your account details and preferences
              </p>
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <BsPencil className="text-sm" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
                >
                  <BsCheck className="text-sm" />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={userData.avatar}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300">
                      <BsCamera className="text-sm" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.fullName}
                      onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                      className="text-center bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                    />
                  ) : (
                    userData.fullName
                  )}
                </h2>
                
                <p className="text-gray-600 mb-4">Active Community Member</p>
                
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <BsShieldCheck className="text-lg" />
                    <span className="font-semibold">Verified Citizen</span>
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">Member since {userData.joinDate}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in-delay">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiSettings className="text-emerald-600" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className={`bg-gradient-to-r ${stat.color} text-white rounded-xl p-3 shadow-lg mb-2`}>
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details and Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <BsPerson className="text-emerald-600" />
                Personal Information
              </h3>
              
              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  <div className="bg-emerald-100 p-3 rounded-xl">
                    <BsEnvelope className="text-emerald-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                        className="w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{userData.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <BsTelephone className="text-blue-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) => setEditData({...editData, phone: e.target.value})}
                        className="w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{userData.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  <div className="bg-amber-100 p-3 rounded-xl">
                    <BsHouse className="text-amber-600 text-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address & Ward</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editData.address}
                          onChange={(e) => setEditData({...editData, address: e.target.value})}
                          placeholder="Street Address"
                          className="w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                        />
                        <input
                          type="text"
                          value={editData.wardNumber}
                          onChange={(e) => setEditData({...editData, wardNumber: e.target.value})}
                          placeholder="Ward Number"
                          className="w-24 bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800 font-medium">{userData.address}, Ward {userData.wardNumber}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings - Updated without Notification Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FiSettings className="text-emerald-600" />
                Account Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-emerald-200 transition-all duration-300 text-left group">
                  <div className="text-emerald-600 mb-2">🔒</div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account security</p>
                </button>
                
                <Link to="/privacy-settings" className="block">
                  <button className="w-full p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-emerald-200 transition-all duration-300 text-left group">
                    <div className="text-emerald-600 mb-2">👥</div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700">Privacy Settings</h4>
                    <p className="text-sm text-gray-600">Control your data visibility</p>
                  </button>
                </Link>
                
                <button className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-emerald-200 transition-all duration-300 text-left group">
                  <div className="text-emerald-600 mb-2">📋</div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700">My Reports</h4>
                  <p className="text-sm text-gray-600">View your submitted reports</p>
                </button>
                
                <button className="p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-red-200 transition-all duration-300 text-left group">
                  <div className="text-red-600 mb-2">🗑️</div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-red-700">Delete Account</h4>
                  <p className="text-sm text-gray-600">Permanently remove your account</p>
                </button>
              </div>
            </div>
          </div>
        </div>
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
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
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
        
        .animate-fade-in {
          animation: fade-in 1s ease-out 0.2s both;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 1s ease-out 0.5s both;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}