import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsBell, BsShieldCheck, BsEye, BsEyeSlash, BsPerson, BsCheck, BsArrowLeft } from "react-icons/bs";
import { FiLogOut, FiUser, FiSettings, FiLock } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import Header from "./components/Header";
import useScrollToTop from '../../hooks/useScrollToTop';

export default function PrivacySettingsPage() {
  useScrollToTop();
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
    <>

      {/* Main content */}
      <main className="flex-grow max-w-4xl mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-8 mt-6 sm:mt-10 mb-16 pb-20 sm:pb-0 space-y-6 sm:space-y-8 relative z-10">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-green-800 bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
              Privacy Settings
            </h1>
            <p className="text-gray-600 mt-2 text-base sm:text-lg font-medium max-w-2xl mx-auto">
              Control your privacy and data sharing preferences
            </p>
          </div>
        </section>

        {/* Privacy Settings Cards */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
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
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-green-100 p-2 rounded-xl">
                <BsEye className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Contact Information</h3>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-purple-100 p-2 rounded-xl">
                <FiLock className="text-purple-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Message Settings</h3>
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
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-green-100/50 animate-fade-in-delay">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-amber-100 p-2 rounded-xl">
                <BsShieldCheck className="text-amber-600 text-xl" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Data & Privacy</h3>
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
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-200 animate-fade-in">
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
  );
}