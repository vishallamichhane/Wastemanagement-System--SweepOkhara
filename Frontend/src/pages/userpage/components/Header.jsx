import {useState, useEffect, useRef} from 'react'
import { BsCalendarEvent, BsBell, BsMapFill, BsExclamationTriangle, BsCheckCircle, BsClock, BsTrash } from "react-icons/bs";
import { NavLink, Link } from 'react-router-dom'
import { FiLogOut, FiHome } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";

const navItems = [
  {label:"Home", path:"/user"}, 
  {label:"Schedule", path:"/user/schedule"},
  {label:"My Reports", path:"/user/myreport"}
]

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (notificationRef.current && !notificationRef.current.contains(event.target)) {
            setShowNotifications(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

        const notifications = [
          {
            id: 1,
            type: "schedule",
            title: "Waste Collection Tomorrow",
            message: "General & Recyclable waste collection scheduled for your area tomorrow. Please keep your bins accessible.",
            time: "2 hours ago",
            icon: <BsCalendarEvent className="text-blue-500" />,
            read: false
          },
          {
            id: 2,
            type: "report",
            title: "Report #2456 Resolved",
            message: "Your reported issue at Lakeside area has been resolved. Thank you for keeping Pokhara clean!",
            time: "1 day ago",
            icon: <BsCheckCircle className="text-green-500" />,
            read: false
          },
          {
            id: 3,
            type: "schedule",
            title: "Organic Waste Collection",
            message: "Organic waste collection scheduled for July 1st. Remember to separate your food scraps.",
            time: "2 days ago",
            icon: <BsClock className="text-amber-500" />,
            read: true
          },
          {
            id: 4,
            type: "report",
            title: "Report #2451 In Progress",
            message: "Your reported overflowing bin at Fewa Lake is being addressed. Expected resolution: 24 hours.",
            time: "3 days ago",
            icon: <BsTrash className="text-orange-500" />,
            read: true
          },
          {
            id: 5,
            type: "schedule",
            title: "Monthly Deep Cleaning",
            message: "Monthly deep cleaning program scheduled for your ward next week. Please cooperate.",
            time: "1 week ago",
            icon: <GiBroom className="text-purple-500" />,
            read: true
          }
        ];
      

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

        const unreadCount = notifications.filter(notification => !notification.read).length;

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <>
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
                <Link to="/user">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="relative">
                    <GiBroom className="text-emerald-600 text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                    SweepOkhara
                  </span>
                </div>
                </Link>
      
                {/* Navigation Links */}
                <nav className="hidden md:flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-sm font-medium justify-end">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({isActive})=>`relative px-4 py-2 rounded-xl transition-all duration-300 group ${
                          isActive
                            ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                            : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
                        }`}
                      >
                        {item.label}
                        <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 ${
                          item === "Home" ? "w-4/5" : ""
                        }`}></span>
                      </NavLink>
                    ))}
                  
                  {/* Notification Bell with Popup */}
                  <div className="relative" ref={notificationRef}>
                    <button
                      aria-label="Notifications"
                      onClick={handleNotificationClick}
                      className="relative group transform transition-all duration-300 hover:text-emerald-700 hover:scale-110 focus:outline-none p-2 rounded-xl hover:bg-emerald-50/80"
                    >
                      <BsBell className="text-xl" />
                      {/* Notification badge */}
                      {unreadCount > 0 && (
                        <>
                          <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600 animate-ping opacity-75"></span>
                          <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                          </span>
                        </>
                      )}
                    </button>
      
                    {/* Notification Popup */}
                    {showNotifications && (
                      <div className="absolute right-0 top-12 w-80 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-green-100/50 z-50 animate-slide-down">
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Notifications</h3>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {unreadCount} unread
                            </span>
                          </div>
                        </div>
      
                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-gray-100 hover:bg-gray-50/80 transition-colors duration-200 cursor-pointer ${
                                !notification.read ? 'bg-blue-50/50' : ''
                              }`}
                              onClick={() => setShowNotifications(false)}
                            >
                              <div className="flex gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  {notification.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-1">
                                    <h4 className={`font-semibold text-sm ${
                                      !notification.read ? 'text-gray-900' : 'text-gray-700'
                                    }`}>
                                      {notification.title}
                                    </h4>
                                    {!notification.read && (
                                      <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 text-xs mb-2 leading-relaxed">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                      {notification.time}
                                    </span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      notification.type === 'schedule' 
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                    }`}>
                                      {notification.type === 'schedule' ? 'Schedule' : 'Report'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
      
                        {/* Footer */}
                        <div className="p-3 border-t border-gray-200">
                          <button 
                            onClick={() => setShowNotifications(false)}
                            className="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium py-2 hover:bg-emerald-50/50 rounded-xl transition-colors duration-200"
                          >
                            Mark all as read
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
      
                  {/* User Icon */}
                    <Link
                    to="/user/profile"
                     >                 
                  <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center font-semibold select-none shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 cursor-pointer group relative">
                     U                                                  
                    <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                  </div>
                    </Link>
      
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

            {/* Mobile bottom nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl shadow-[0_-8px_25px_rgba(0,0,0,0.08)] border-t border-emerald-100/60">
              <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-2">
                {navItems.map((item) => {
                  const isHome = item.path === '/user';
                  const Icon = isHome ? FiHome : item.label === 'Schedule' ? BsCalendarEvent : BsCheckCircle;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `flex-1 flex flex-col items-center justify-center py-2 rounded-xl transition-all duration-200 ${
                        isActive ? 'text-emerald-700 bg-emerald-50' : 'text-gray-500 hover:text-emerald-700 hover:bg-emerald-50/70'
                      }`}
                    >
                      <Icon className="text-lg mb-1" />
                      <span className="text-xs font-semibold">{isHome ? 'Home' : item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
      
            {/* Spacer for fixed nav */}
            <div className="h-20"></div>
    </>
  )

  
}

export default Header