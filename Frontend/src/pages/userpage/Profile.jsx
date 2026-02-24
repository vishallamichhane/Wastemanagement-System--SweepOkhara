import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet, useLocation } from "react-router-dom";
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsPerson, BsEnvelope, BsTelephone, BsHouse, BsCamera, BsCheck, BsPencil, BsShieldCheck } from "react-icons/bs";
import { FiLogOut, FiUser, FiSettings } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import Header from "./components/Header";
import useScrollToTop from '../../hooks/useScrollToTop';
import { useUser } from "@clerk/clerk-react";

const dummyAvatar = "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"


export default function UserProfilePage() {
  useScrollToTop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const location = useLocation();
  const isProfileRoot = location.pathname === '/user/profile';
  const { user: clerkUser, isLoaded } = useUser();
  
  // Map Clerk user to expected format
  const user = clerkUser ? {
    id: clerkUser.id,
    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || clerkUser.username,
    email: clerkUser.emailAddresses?.[0]?.emailAddress || '',
    image: clerkUser.imageUrl,
    phone: clerkUser.publicMetadata?.phone || clerkUser.unsafeMetadata?.phone || '',
    address: clerkUser.publicMetadata?.address || clerkUser.unsafeMetadata?.address || '',
    ward: clerkUser.publicMetadata?.ward || clerkUser.unsafeMetadata?.ward || '',
    houseNumber: clerkUser.publicMetadata?.houseNumber || clerkUser.unsafeMetadata?.houseNumber || '',
    createdAt: clerkUser.createdAt,
  } : null;
  console.log('Current user:', user)
  

  // const [userData, setUserData] = useState({
  //   fullName: "John Doe",
  //   email: "john.doe@example.com",
  //   phone: "+977 9841234567",
  //   address: "123 Lakeside, Pokhara",
  //   wardNumber: "15",
  //   joinDate: "January 15, 2024",
  //   avatar: "https://i.pinimg.com/1200x/6e/59/95/6e599501252c23bcf02658617b29c894.jpg"
  // });

  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    ward: '',
    houseNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);

  useEffect(() => {
    // Update editData when clerkUser data loads or changes
    if (clerkUser && user) {
      console.log('Updating editData with user:', user);
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        ward: user.ward || '',
        houseNumber: user.houseNumber || ''
      });

      // Check if profile is incomplete (missing phone or houseNumber)
      const isProfileIncomplete = !user.phone || !user.houseNumber;
      if (isProfileIncomplete && isProfileRoot) {
        setShowIncompleteModal(true);
      }
    }
  }, [clerkUser?.id, isProfileRoot]); // Use clerkUser.id as dependency to avoid unnecessary updates

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

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      console.log('=== Saving Profile ===');
      console.log('Edit data to save:', editData);

      const response = await fetch('http://localhost:3000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editData.name,
          phone: editData.phone,
          address: editData.address,
          ward: editData.ward,
          houseNumber: editData.houseNumber,
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to update profile');
      }

      setSaveSuccess(true);
      setIsEditing(false);
      
      console.log('✅ Profile saved successfully!');
      
      // Refresh session to get updated user data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('❌ Save error:', error);
      setSaveError(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Canceling edit, restoring original user data');
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        ward: user.ward || '',
        houseNumber: user.houseNumber || ''
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    console.log(`Updating ${field}:`, value);
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const stats = [
    { label: "Reports Submitted", value: "24", color: "from-blue-500 to-cyan-500" },
    { label: "Issues Resolved", value: "18", color: "from-green-500 to-emerald-500" },
    { label: "Community Points", value: "1,250", color: "from-amber-500 to-orange-500" },
    { label: "Days Active", value: "45", color: "from-purple-500 to-pink-500" }
  ];

  return (
    <>
      <Outlet />
      {isProfileRoot && (
      <>
      {/* Incomplete Profile Warning Banner - hides on scroll */}
      {showIncompleteModal && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 transition-all duration-300 ${isScrolled ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0 animate-slide-down'}`}>
          <div className="bg-red-600 text-white rounded-xl shadow-2xl px-5 py-4 flex items-start gap-3">
            <BsExclamationTriangle className="text-xl mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-bold text-sm">Profile Incomplete!</p>
              <p className="text-red-100 text-xs mt-1">
                Please add your {!user?.phone && 'phone number'}{!user?.phone && !user?.houseNumber && ', '}{!user?.houseNumber && 'house number'}{(!user?.phone || !user?.houseNumber) && !user?.ward ? ', ' : ''}{!user?.ward && 'ward number'} to use the other features.
              </p>
            </div>
            <button
              onClick={() => {
                setShowIncompleteModal(false);
                setIsEditing(true);
              }}
              className="bg-white text-red-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
            >
              Fill Now
            </button>
            <button
              onClick={() => setShowIncompleteModal(false)}
              className="text-red-200 hover:text-white transition-colors text-lg leading-none flex-shrink-0"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-10 mb-16 pb-20 sm:pb-0 space-y-6 sm:space-y-8 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-4 sm:mb-6 transition-all duration-300 group text-sm sm:text-base"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Home
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                My Profile
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base md:text-lg font-medium">
                Manage your account details and preferences
              </p>
              {saveSuccess && (
                <div className="mt-2 text-green-600 text-sm font-medium">
                  ✓ Profile updated successfully!
                </div>
              )}
              {saveError && (
                <div className="mt-2 text-red-600 text-sm font-medium">
                  ✗ {saveError}
                </div>
              )}
            </div>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <BsPencil className="text-sm" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none bg-gray-500 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <BsCheck className="text-sm" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={user?.avatar || dummyAvatar}
                    alt="Profile"
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-emerald-500 text-white p-2 rounded-full shadow-lg hover:bg-emerald-600 transition-colors duration-300">
                      <BsCamera className="text-sm" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-center bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                      placeholder="Your name"
                    />
                  ) : (
                    user?.name
                  )}
                </h2>
                
                <p className="text-gray-600 mb-4">Active Community Member</p>
                
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <BsShieldCheck className="text-lg" />
                    <span className="font-semibold">Verified Citizen</span>
                  </div>
                  <p className="text-sm text-emerald-600 mt-1">Member since {new Date(user?.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in-delay">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <FiSettings className="text-emerald-600" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="text-center">
                    <div className={`bg-gradient-to-r ${stat.color} text-white rounded-xl p-2 sm:p-3 shadow-lg mb-2`}>
                      <span className="text-xl sm:text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 font-medium">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Details and Settings */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Profile Details Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <BsPerson className="text-emerald-600" />
                Personal Information
              </h3>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Email */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  <div className="bg-emerald-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                    <BsEnvelope className="text-emerald-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                        placeholder="Your email"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user?.email}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  <div className="bg-blue-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                    <BsTelephone className="text-blue-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                        placeholder="Phone number"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user?.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  <div className="bg-amber-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                    <BsHouse className="text-amber-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address & Ward</label>
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editData.address || ''}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Street Address"
                          className="w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                        />
                        <input
                          type="text"
                          value={editData.ward || ''}
                          onChange={(e) => handleInputChange('ward', e.target.value)}
                          placeholder="Ward Number"
                          className="w-24 bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                    ) : (
                      <p className="text-gray-800 font-medium">{user?.address}, {user?.ward}</p>
                    )}
                  </div>
                </div>

                {/* House Number */}
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  <div className="bg-purple-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                    <BsHouse className="text-purple-600 text-lg sm:text-xl" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">House Number</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.houseNumber || ''}
                        onChange={(e) => handleInputChange('houseNumber', e.target.value)}
                        placeholder="Enter house number"
                        className="w-full bg-transparent border-b-2 border-emerald-500 focus:outline-none focus:border-emerald-600"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">{user?.houseNumber || 'Not specified'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Settings - Updated without Notification Settings */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center gap-2">
                <FiSettings className="text-emerald-600" />
                Account Settings
              </h3>
              
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <Link to="/user/profile/changepw" className="block">
                <button className="w-full p-3 sm:p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-emerald-200 transition-all duration-300 text-left group">
                  <div className="text-emerald-600 mb-2">🔒</div>
                  <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account security</p>
                </button>
                </Link>

                <Link to="/user/profile/privacy" className="block">
                  <button className="w-full p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-emerald-200 transition-all duration-300 text-left group">
                    <div className="text-emerald-600 mb-2">👥</div>
                    <h4 className="font-semibold text-gray-800 group-hover:text-emerald-700">Privacy Settings</h4>
                    <p className="text-sm text-gray-600">Control your data visibility</p>
                  </button>
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </main>

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
      )}
    </>
  );
}