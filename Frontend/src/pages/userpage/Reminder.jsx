import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GiBroom } from 'react-icons/gi';
import { BsBell, BsCheckCircle, BsEnvelope, BsPhone } from 'react-icons/bs';
import { FiLogOut, FiChevronLeft } from 'react-icons/fi';

const PickupReminders = () => {
  const [notificationMethods, setNotificationMethods] = useState({
    inApp: false,
    email: true,
    sms: false
  });
  
  const [reminderTimings, setReminderTimings] = useState({
    firstReminder: '1 day before',
    secondReminder: '1 hour before'
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleNotificationToggle = (method) => {
    setNotificationMethods(prev => ({
      ...prev,
      [method]: !prev[method]
    }));
  };

  const handleReminderChange = (reminderType, value) => {
    setReminderTimings(prev => ({
      ...prev,
      [reminderType]: value
    }));
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    
    // Simulate API call or processing
    setTimeout(() => {
      setIsSaving(false);
      setShowConfirmation(true);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);
    }, 1500);
  };

  const handleCancel = () => {
    // Reset to default values or navigate back
    setNotificationMethods({
      inApp: false,
      email: true,
      sms: false
    });
    setReminderTimings({
      firstReminder: '1 day before',
      secondReminder: '1 hour before'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-float-slow"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-200 rounded-full opacity-20 mix-blend-multiply filter blur-xl animate-float-medium"></div>
        <div className="absolute bottom-20 left-1/4 w-80 h-80 bg-teal-200 rounded-full opacity-15 mix-blend-multiply filter blur-xl animate-float-slow animation-delay-2000"></div>
      </div>

      {/* Enhanced Header with new navbar animations */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
          {/* Logo Section */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <GiBroom className="text-emerald-600 text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              SweepOkhara
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link 
              to="/userhome" 
              className="relative px-4 py-2 rounded-xl transition-all duration-300 group text-gray-600 hover:text-emerald-700 hover:bg-white/80"
            >
              Home
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5"></span>
            </Link>
            <Link 
              to="/schedule" 
              className="relative px-4 py-2 rounded-xl transition-all duration-300 group text-gray-600 hover:text-emerald-700 hover:bg-white/80"
            >
              Schedule
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5"></span>
            </Link>
            <Link 
              to="/myreports" 
              className="relative px-4 py-2 rounded-xl transition-all duration-300 group text-gray-600 hover:text-emerald-700 hover:bg-white/80"
            >
              My Reports
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5"></span>
            </Link>
            
            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="relative group transform transition-all duration-300 hover:text-emerald-700 hover:scale-110 focus:outline-none p-2 rounded-xl hover:bg-emerald-50/80"
            >
              <BsBell className="text-xl" />
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600 animate-ping opacity-75"></span>
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600"></span>
            </button>

            {/* User Icon */}
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center font-semibold select-none shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer group relative">
              U
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
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

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link to="/schedule" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group">
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Schedule</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">
            Pickup Reminders
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Never miss a waste collection. Set your preferred notification methods and reminder timings.
          </p>
        </div>

        {/* Reminder Settings Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transform hover:scale-[1.01] transition-all duration-500 border border-emerald-100">
          {/* Enable Pickup Reminders Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <BsBell className="text-emerald-600 text-xl" />
              Enable Pickup Reminders
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                How should we notify you?
              </h3>
              
              <div className="space-y-4">
                {/* In-App Notification */}
                <button
                  onClick={() => handleNotificationToggle('inApp')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group ${
                    notificationMethods.inApp 
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        notificationMethods.inApp 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-400 group-hover:border-emerald-400'
                      }`}>
                        {notificationMethods.inApp && (
                          <BsCheckCircle className="text-white text-sm" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <BsBell className={`text-xl ${
                          notificationMethods.inApp ? 'text-emerald-600' : 'text-gray-500'
                        }`} />
                        <div className="text-left">
                          <span className={`font-semibold block ${
                            notificationMethods.inApp ? 'text-emerald-700' : 'text-gray-700'
                          }`}>
                            In-App Notification
                          </span>
                          <span className="text-sm text-gray-500">
                            Get notifications within the app
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* Email Notification */}
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group ${
                    notificationMethods.email 
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        notificationMethods.email 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-400 group-hover:border-emerald-400'
                      }`}>
                        {notificationMethods.email && (
                          <BsCheckCircle className="text-white text-sm" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <BsEnvelope className={`text-xl ${
                          notificationMethods.email ? 'text-emerald-600' : 'text-gray-500'
                        }`} />
                        <div className="text-left">
                          <span className={`font-semibold block ${
                            notificationMethods.email ? 'text-emerald-700' : 'text-gray-700'
                          }`}>
                            Email
                          </span>
                          <span className="text-sm text-gray-500">
                            Receive reminders via email
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {/* SMS Notification */}
                <button
                  onClick={() => handleNotificationToggle('sms')}
                  className={`w-full p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] group ${
                    notificationMethods.sms 
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg' 
                      : 'border-gray-200 hover:border-emerald-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        notificationMethods.sms 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-400 group-hover:border-emerald-400'
                      }`}>
                        {notificationMethods.sms && (
                          <BsCheckCircle className="text-white text-sm" />
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <BsPhone className={`text-xl ${
                          notificationMethods.sms ? 'text-emerald-600' : 'text-gray-500'
                        }`} />
                        <div className="text-left">
                          <span className={`font-semibold block ${
                            notificationMethods.sms ? 'text-emerald-700' : 'text-gray-700'
                          }`}>
                            SMS
                          </span>
                          <span className="text-sm text-gray-500">
                            Get text message reminders
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Reminder Timings Section */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-gray-700 mb-6">
              When should we remind you?
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Reminder */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
                <h4 className="font-bold text-gray-800 mb-4 text-center">First Reminder</h4>
                <div className="space-y-3">
                  {['1 day before', '12 hours before', '6 hours before', '3 hours before'].map((time) => (
                    <button
                      key={time}
                      onClick={() => handleReminderChange('firstReminder', time)}
                      className={`w-full py-3 px-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                        reminderTimings.firstReminder === time
                          ? 'border-emerald-500 bg-white shadow-lg text-emerald-700 font-semibold'
                          : 'border-gray-200 bg-white/80 hover:border-emerald-300 text-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Second Reminder */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200">
                <h4 className="font-bold text-gray-800 mb-4 text-center">Second Reminder</h4>
                <div className="space-y-3">
                  {['1 hour before', '30 minutes before', '15 minutes before', 'At pickup time'].map((time) => (
                    <button
                      key={time}
                      onClick={() => handleReminderChange('secondReminder', time)}
                      className={`w-full py-3 px-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                        reminderTimings.secondReminder === time
                          ? 'border-blue-500 bg-white shadow-lg text-blue-700 font-semibold'
                          : 'border-gray-200 bg-white/80 hover:border-blue-300 text-gray-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
            <button 
              onClick={handleCancel}
              className="px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              disabled={isSaving}
              className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform ${
                isSaving 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-2xl hover:scale-105'
              }`}
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 py-6 text-center text-green-800 text-sm select-none flex flex-col sm:flex-row gap-3 sm:gap-6 justify-center items-center relative z-10 mt-8">
        <span className="font-semibold">© 2024 SweepOkhara. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Privacy Policy
          </a>
          <a href="#" className="underline hover:text-green-900 transition-colors duration-300 font-medium">
            Terms of Service
          </a>
        </div>
      </footer>

      {/* Success Confirmation Popup */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl transform animate-confirmation-popup border border-emerald-200">
            <div className="text-center">
              {/* Animated Checkmark */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg 
                    className="w-10 h-10 text-white animate-checkmark" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                {/* Pulsing Ring Effect */}
                <div className="absolute inset-0 border-4 border-emerald-200 rounded-full animate-ping-slow opacity-75"></div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                Settings Updated!
              </h3>
              <p className="text-gray-600 mb-6">
                Your pickup reminder preferences have been successfully saved.
              </p>
              
              <button
                onClick={() => setShowConfirmation(false)}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

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

        /* Confirmation Popup Animation */
        @keyframes confirmation-popup {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          70% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Checkmark Animation */
        @keyframes checkmark {
          0% {
            stroke-dashoffset: 100;
            opacity: 0;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Slow Ping Animation */
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.75;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
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
        
        .animate-confirmation-popup {
          animation: confirmation-popup 0.5s ease-out both;
        }

        .animate-checkmark {
          animation: checkmark 0.6s ease-in-out both;
        }

        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default PickupReminders;