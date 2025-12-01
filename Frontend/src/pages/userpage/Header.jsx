import {useState, useEffect} from 'react'
import { BsBell } from "react-icons/bs";
import { NavLink, Link } from 'react-router-dom'
import { FiLogOut } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";


function Header() {
    const [isScrolled, setIsScrolled] = useState(false);

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
                    {[{label:"Home", path:"/user"}, {label:"Schedule", path:"../schedule"}, {label:"My Reports", path:"../myreport"}].map((item) => (
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
    </>
  )
}

export default Header