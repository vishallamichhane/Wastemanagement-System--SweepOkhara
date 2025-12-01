import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsBell, BsShieldCheck, BsEye, BsEyeSlash, BsPerson, BsCheck, BsArrowLeft } from "react-icons/bs";
import { FiLogOut, FiUser, FiSettings, FiLock } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

export default function PrivacySettingsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public", // public, contacts, private
    showEmail: true,
    showPhone: false,
    showLocation: true,
    dataCollection: true,
    personalizedAds: false,
    activityTracking: true,
    allowMessages: "everyone", // everyone, contacts, none
    searchVisibility: true
  });

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

  const handleSettingChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleSaveSettings = () => {
    // Here you would typically make an API call to save the settings
    alert("Privacy settings saved successfully!");
  };

  const handleResetToDefault = () => {
    setPrivacySettings({
      profileVisibility: "public",
      showEmail: true,
      showPhone: false,
      showLocation: true,
      dataCollection: true,
      personalizedAds: false,
      activityTracking: true,
      allowMessages: "everyone",
      searchVisibility: true
    });
  };

  const privacyOptions = {
    profileVisibility: [
      { value: "public", label: "Public", description: "Anyone can see your profile" },
      { value: "contacts", label: "Contacts Only", description: "Only your contacts can see your profile" },
      { value: "private", label: "Private", description: "Only you can see your profile" }
    ],
    allowMessages: [
      { value: "everyone", label: "Everyone", description: "Anyone can send you messages" },
      { value: "contacts", label: "Contacts Only", description: "Only your contacts can message you" },
      { value: "none", label: "No One", description: "Nobody can send you messages" }
    ]
  };

  const toggleSettings = [
    {
      id: "showEmail",
      label: "Show Email Address",
      description: "Allow others to see your email address",
      value: privacySettings.showEmail
    },
    {
      id: "showPhone",
      label: "Show Phone Number",
      description: "Allow others to see your phone number",
      value: privacySettings.showPhone
    },
    {
      id: "showLocation",
      label: "Show Location",
      description: "Show your general location in reports",
      value: privacySettings.showLocation
    },
    {
      id: "dataCollection",
      label: "Data Collection",
      description: "Allow us to collect data to improve services",
      value: privacySettings.dataCollection
    },
    {
      id: "personalizedAds",
      label: "Personalized Ads",
      description: "Show personalized advertisements",
      value: privacySettings.personalizedAds
    },
    {
      id: "activityTracking",
      label: "Activity Tracking",
      description: "Track your activity for better recommendations",
      value: privacySettings.activityTracking
    },
    {
      id: "searchVisibility",
      label: "Search Visibility",
      description: "Allow your profile to appear in search results",
      value: privacySettings.searchVisibility
    }
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

            {/* User Profile Icon - Active with bigger size (same as profile page) */}
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
      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10 mb-16 space-y-8 relative z-10">
        {/* Back button and header */}
        <section className="animate-slide-down">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-6 transition-all duration-300 group"
          >
            <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </button>
          
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl text-white shadow-lg">
                <BsShieldCheck className="text-2xl" />
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Privacy Settings
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium max-w-2xl mx-auto">
              Control your privacy and data sharing preferences
            </p>
          </div>
        </section>

        {/* Privacy Settings Cards */}
        <div className="space-y-6">
          {/* Profile Visibility */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-xl">
                <BsPerson className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Profile Visibility</h3>
                <p className="text-gray-600">Control who can see your profile information</p>
              </div>
            </div>

            <div className="space-y-4">
              {privacyOptions.profileVisibility.map((option) => (
                <label key={option.value} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-blue-200 transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value={option.value}
                    checked={privacySettings.profileVisibility === option.value}
                    onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 group-hover:text-blue-700">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Contact Preferences */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-xl">
                <BsEye className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Contact Information</h3>
                <p className="text-gray-600">Manage what contact information is visible to others</p>
              </div>
            </div>

            <div className="space-y-4">
              {toggleSettings.slice(0, 3).map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white transition-all duration-200">
                  <div>
                    <div className="font-semibold text-gray-800">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => handleSettingChange(setting.id, !setting.value)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      setting.value ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Message Settings */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-xl">
                <FiLock className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Message Settings</h3>
                <p className="text-gray-600">Control who can send you messages</p>
              </div>
            </div>

            <div className="space-y-4">
              {privacyOptions.allowMessages.map((option) => (
                <label key={option.value} className="flex items-center gap-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white hover:border-purple-200 transition-all duration-200 cursor-pointer group">
                  <input
                    type="radio"
                    name="allowMessages"
                    value={option.value}
                    checked={privacySettings.allowMessages === option.value}
                    onChange={(e) => handleSettingChange('allowMessages', e.target.value)}
                    className="text-purple-600 focus:ring-purple-500"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 group-hover:text-purple-700">
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {option.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100/50 animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-2 rounded-xl">
                <BsShieldCheck className="text-amber-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">Data & Privacy</h3>
                <p className="text-gray-600">Manage how your data is used and collected</p>
              </div>
            </div>

            <div className="space-y-4">
              {toggleSettings.slice(3).map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-200 hover:bg-white transition-all duration-200">
                  <div>
                    <div className="font-semibold text-gray-800">{setting.label}</div>
                    <div className="text-sm text-gray-600">{setting.description}</div>
                  </div>
                  <button
                    onClick={() => handleSettingChange(setting.id, !setting.value)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                      setting.value ? 'bg-amber-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        setting.value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Information */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 animate-fade-in">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                <BsShieldCheck className="text-blue-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-800 mb-2">Your Privacy Matters</h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  We are committed to protecting your privacy. Your personal information is encrypted and 
                  stored securely. We never share your data with third parties without your explicit consent. 
                  You can review our complete privacy policy for more details.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 animate-fade-in">
            <button
              onClick={handleResetToDefault}
              className="text-gray-600 border border-gray-300 rounded-xl px-6 py-3 font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
            >
              Reset to Default
            </button>
            
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                onClick={() => navigate(-1)}
                className="bg-gray-500 text-white rounded-xl px-6 py-3 font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <BsCheck className="text-lg" />
                Save Changes
              </button>
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