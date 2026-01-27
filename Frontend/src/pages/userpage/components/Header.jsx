import {useState, useEffect, useRef} from 'react'
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { GiBroom } from "react-icons/gi";
import { FiLogOut, FiUser, FiSettings, FiHome } from "react-icons/fi";
import NotificationCenter from './NotificationCenter';

function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
  const location = useLocation();
  const isProfileActive = location.pathname.startsWith('/user/profile');

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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileDropdown(false);
    navigate('/login');
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
    <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
            <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
            <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-3000"></div>
          </div>
    
          {/* Enhanced Navigation Bar */}
          <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-xl shadow-2xl' 
              : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
          } ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
          }`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
              <Link to="/user" className="transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center space-x-3 group cursor-pointer">
                <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
                  <GiBroom className="text-white text-xl" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                    SweePokhara
                  </span>
                </div>
              </div>
              </Link>

          <ul className="hidden md:flex gap-8 text-sm font-semibold">
            {[{label:"Home", path:"/user"}, {label:"Schedule", path:"/user/schedule"}, {label:"My Reports", path:"/user/myreport"}].map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
                  end={item.path === "/user"}
                  className={({isActive})=>`relative px-4 py-2 rounded-xl transition-all duration-300 group ${isActive? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
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
              
              <div className="hidden md:flex gap-2 items-center">
                <NotificationCenter />
                
                {/* Profile Dropdown */}
                <div className="relative ml-16" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className={`w-11 h-11 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 ${
                      isProfileActive ? 'ring-4 ring-emerald-300' : ''
                    }`}
                  >
                    <FiUser className="text-xl" />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-emerald-100 overflow-hidden z-50 animate-fadeIn">
                      <div className="py-2">
                        <button
                          onClick={handleHomeClick}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all duration-200 text-gray-700 hover:text-emerald-700"
                        >
                          <FiHome className="text-lg" />
                          <span className="font-semibold">Home</span>
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={handleProfileClick}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all duration-200 text-gray-700 hover:text-emerald-700"
                        >
                          <FiSettings className="text-lg" />
                          <span className="font-semibold">Profile Settings</span>
                        </button>
                        
                        <div className="border-t border-gray-100 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-50 transition-all duration-200 text-gray-700 hover:text-red-600"
                        >
                          <FiLogOut className="text-lg" />
                          <span className="font-semibold">Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </nav>
    
          {/* Spacer for fixed nav */}
          <div className="h-20"></div>
          </>
  )

}

export default Header