import {useState, useEffect} from 'react'
import { NavLink, Link } from "react-router-dom";
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
            <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
            <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
            <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-3000"></div>
          </div>
    
          {/* Enhanced Navigation Bar */}
          <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
            isScrolled 
              ? 'bg-white/95 backdrop-blur-xl shadow-2xl' 
              : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
          }`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
              <Link to="/" className="transform hover:scale-105 transition-transform duration-300">
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
            {[{label:"Home", path:"/"}, {label:"Features", path:"/feature"}, {label:"About Us", path:"/aboutus"}, {label:"Contact", path:"/contact"}].map((item) => (
              <li key={item.label}>
                <NavLink
                  to={item.path}
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
              
              <div className="hidden md:flex gap-4">
                <Link to="/login">
                  <button className="text-emerald-700 font-semibold px-6 py-2.5 rounded-xl border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/80 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-8 py-2.5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:from-emerald-700 hover:to-teal-700">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </nav>
    
          {/* Spacer for fixed nav */}
          <div className="h-20"></div>
          </>
  )
}

export default Header