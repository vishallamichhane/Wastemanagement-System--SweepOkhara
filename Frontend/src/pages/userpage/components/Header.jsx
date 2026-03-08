import {useState, useEffect, useRef} from 'react'
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { GiBroom } from "react-icons/gi";
import { FiLogOut, FiUser, FiSettings, FiHome, FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi";
import { useClerk, useUser } from '@clerk/clerk-react';
import NotificationCenter from './NotificationCenter';
import { useDarkMode } from '../../../context/DarkModeContext';
import sweepPokharaLogo from '../../../assets/images/sweeppokhara-final-logo.png';

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const mobileDropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isProfileActive = location.pathname.startsWith('/user/profile');
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const { signOut } = useClerk();
    const { user, isLoaded } = useUser();

    useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (
        mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) &&
        (!mobileDropdownRef.current || !mobileDropdownRef.current.contains(event.target))
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setShowProfileDropdown(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    setShowProfileDropdown(false);
    try {
      console.log('🚪 User logging out...');
      
      // Clear all user-related localStorage data
      localStorage.removeItem('currentUser');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('registeredUsers');
      localStorage.removeItem('lastRegisteredUser');
      localStorage.removeItem('userRole');
      
      // Sign out from Clerk
      await signOut();
      
      console.log('✅ User logged out successfully');
      
      // Navigate to login
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Clear localStorage even if signOut fails
      localStorage.removeItem('currentUser');
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('registeredUsers');
      localStorage.removeItem('lastRegisteredUser');
      localStorage.removeItem('userRole');
      
      console.log('✅ User logged out (with errors)');
      
      // Still navigate to login
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    navigate('/user/profile');
  };

  const handleHomeClick = () => {
    setShowProfileDropdown(false);
    navigate('/user');
  };

  return (
    <>
    <div className={`fixed inset-0 -z-10 overflow-hidden ${isDarkMode ? 'opacity-50' : ''}`}>
            <div className={`absolute top-20 left-10 w-72 h-72 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-200/40'} rounded-full mix-blend-multiply filter blur-3xl animate-float-slow`}></div>
            <div className={`absolute top-60 right-20 w-96 h-96 ${isDarkMode ? 'bg-teal-500/15' : 'bg-teal-200/30'} rounded-full mix-blend-multiply filter blur-3xl animate-float-medium`}></div>
            <div className={`absolute bottom-40 left-1/3 w-80 h-80 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-200/20'} rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-3000`}></div>
          </div>
    
          {/* Enhanced Navigation Bar */}
          <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
              ? isDarkMode 
                ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-700' 
                : 'bg-white/95 backdrop-blur-xl shadow-2xl'
              : isDarkMode
                ? 'bg-gradient-to-r from-gray-900/95 to-gray-800/95 backdrop-blur-xl shadow-lg border-b border-gray-700'
                : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
          } ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6 lg:px-10 py-3 sm:py-4">
              <Link to="/user" className="transform hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-center">
                  <img 
                    src={sweepPokharaLogo} 
                    alt="SweepPokhara Logo" 
                    className="h-11 sm:h-12 w-auto object-contain"
                  />
                </div>
              </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex gap-4 lg:gap-8 text-sm font-semibold">
            {[{label:"Home", path:"/user"}, {label:"Schedule", path:"/user/schedule"}, {label:"My Reports", path:"/user/myreport"}].map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  end={item.path === "/user"}
                  className={({isActive})=>`relative px-3 lg:px-4 py-2 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? isDarkMode 
                        ? "text-emerald-400 bg-emerald-900/50 shadow-sm" 
                        : "text-emerald-700 bg-emerald-50/80 shadow-sm"
                      : isDarkMode
                        ? "text-gray-300 hover:text-emerald-400 hover:bg-gray-800/80"
                        : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
                  }`}
                >
                  {({isActive}) => (
                    <>
                      {item.label}
                      <span className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 ${isActive ? "w-4/5 left-1/10" : "w-0 group-hover:w-4/5 group-hover:left-1/10"}`}></span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
              
              {/* Desktop Actions */}
              <div className="hidden md:flex gap-2 items-center">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  } shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300`}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <FiSun className="text-lg sm:text-xl" /> : <FiMoon className="text-lg sm:text-xl" />}
                </button>

                <NotificationCenter />
                
                {/* Profile Dropdown */}
                <div className="relative ml-4 lg:ml-16" ref={dropdownRef}>
                  {isLoaded && user ? (
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
                          isProfileActive ? 'scale-110' : 'hover:scale-110'
                        }`}
                      >
                        <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full overflow-hidden flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                          isProfileActive 
                            ? 'border-emerald-400 ring-2 ring-emerald-300' 
                            : 'border-emerald-300 group-hover:border-emerald-400'
                        }`}>
                          {user.imageUrl ? (
                            <img 
                              src={user.imageUrl} 
                              alt={user.fullName || 'Profile'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-lg">
                              {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-center max-w-16">
                          <p className={`truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {user.firstName || user.username || 'User'}
                          </p>
                        </div>
                      </button>

                      {/* Dropdown Menu */}
                      {showProfileDropdown && (
                        <div className={`absolute right-0 mt-12 w-64 ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-700' 
                            : 'bg-white border-emerald-100'
                        } rounded-xl shadow-2xl border overflow-hidden z-50 animate-fadeIn`}>
                          {/* User Info Header */}
                          <div className={`px-4 py-4 border-b ${
                            isDarkMode 
                              ? 'border-gray-700 bg-gray-900/50' 
                              : 'border-emerald-50 bg-emerald-50/50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-emerald-300">
                                {user.imageUrl ? (
                                  <img 
                                    src={user.imageUrl} 
                                    alt={user.fullName || 'Profile'} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold">
                                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} truncate`}>
                                  {user.fullName || user.firstName || 'User'}
                                </p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                                  {user.primaryEmailAddress?.emailAddress || 'No email'}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="py-2">
                            <button
                              onClick={handleHomeClick}
                              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                                isDarkMode 
                                  ? 'hover:bg-gray-700 text-gray-200 hover:text-emerald-400' 
                                  : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-700'
                              }`}
                            >
                              <FiHome className="text-lg" />
                              <span className="font-semibold">Home</span>
                            </button>
                            
                            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} my-1`}></div>
                            
                            <button
                              onClick={handleProfileClick}
                              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                                isDarkMode 
                                  ? 'hover:bg-gray-700 text-gray-200 hover:text-emerald-400' 
                                  : 'hover:bg-emerald-50 text-gray-700 hover:text-emerald-700'
                              }`}
                            >
                              <FiSettings className="text-lg" />
                              <span className="font-semibold">Profile Settings</span>
                            </button>
                            
                            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} my-1`}></div>
                            
                            <button
                              onClick={handleLogout}
                              className={`w-full px-4 py-3 text-left flex items-center gap-3 transition-all duration-200 ${
                                isDarkMode 
                                  ? 'hover:bg-red-900/50 text-gray-200 hover:text-red-400' 
                                  : 'hover:bg-red-50 text-gray-700 hover:text-red-600'
                              }`}
                            >
                              <FiLogOut className="text-lg" />
                              <span className="font-semibold">Logout</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300`}>
                      <FiUser className="text-lg sm:text-xl" />
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex md:hidden items-center gap-2" ref={mobileMenuRef}>
                <button
                  onClick={toggleDarkMode}
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-700 text-yellow-400' 
                      : 'bg-gray-100 text-gray-700'
                  } shadow transition-all duration-300`}
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <FiSun className="text-base" /> : <FiMoon className="text-base" />}
                </button>

                <NotificationCenter />

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } shadow transition-all duration-300`}
                  aria-label="Toggle mobile menu"
                >
                  {mobileMenuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                </button>
              </div>
            </div>

            {/* Mobile Slide-Down Menu */}
            <div ref={mobileDropdownRef} className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
              <div className={`px-4 pb-4 pt-2 space-y-1 border-t ${
                isDarkMode ? 'border-gray-700 bg-gray-900/95' : 'border-gray-200 bg-white/95'
              }`}>
                {/* Mobile User Info Header */}
                {isLoaded && user && (
                  <>
                    <div className={`px-3 py-3 rounded-xl mb-2 ${
                      isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-emerald-50 border border-emerald-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-emerald-300">
                          {user.imageUrl ? (
                            <img 
                              src={user.imageUrl} 
                              alt={user.fullName || 'Profile'} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-bold text-sm">
                              {user.firstName ? user.firstName.charAt(0).toUpperCase() : user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-800'} truncate`}>
                            {user.fullName || user.firstName || 'User'}
                          </p>
                          <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                            {user.primaryEmailAddress?.emailAddress || 'No email'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} my-2`}></div>
                  </>
                )}
                
                {[{label:"Home", path:"/user", icon: <FiHome className="text-lg" />}, {label:"Schedule", path:"/user/schedule", icon: <FiSettings className="text-lg" />}, {label:"My Reports", path:"/user/myreport", icon: <FiUser className="text-lg" />}].map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    end={item.path === "/user"}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({isActive})=>`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? isDarkMode 
                          ? "text-emerald-400 bg-emerald-900/50" 
                          : "text-emerald-700 bg-emerald-50"
                        : isDarkMode
                          ? "text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
                          : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                ))}

                <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} my-2`}></div>

                <NavLink
                  to="/user/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({isActive})=>`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isActive
                      ? isDarkMode 
                        ? "text-emerald-400 bg-emerald-900/50" 
                        : "text-emerald-700 bg-emerald-50"
                      : isDarkMode
                        ? "text-gray-300 hover:text-emerald-400 hover:bg-gray-800"
                        : "text-gray-600 hover:text-emerald-700 hover:bg-gray-50"
                  }`}
                >
                  <FiUser className="text-lg" />
                  Profile Settings
                </NavLink>

                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isDarkMode
                      ? 'text-red-400 hover:bg-red-900/50'
                      : 'text-red-600 hover:bg-red-50'
                  }`}
                >
                  <FiLogOut className="text-lg" />
                  Logout
                </button>
              </div>
            </div>
          </nav>
    
          {/* Spacer for fixed nav */}
          <div className="h-16 sm:h-20"></div>
          </>
  )

}

export default Header
