import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import sweepPokharaLogo from '../assets/images/sweeppokhara-final-logo.png';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { BsArrowUpCircle } from 'react-icons/bs';

function Footer(){
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [pendingLink, setPendingLink] = useState('');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle quick link clicks — prompt logout if signed in
  const handleQuickLink = (e, path) => {
    if (isSignedIn) {
      e.preventDefault();
      setPendingLink(path);
      setShowLogoutModal(true);
    }
    // If not signed in, the Link navigates normally
  };

  const handleLogoutConfirm = async () => {
    try {
      await signOut();
      localStorage.clear();
      setShowLogoutModal(false);
      navigate(pendingLink);
    } catch (err) {
      console.error('Logout error:', err);
      setShowLogoutModal(false);
      navigate(pendingLink);
    }
  };

  return (
    <>
      <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300 pt-16 pb-8 mt-20">
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            
            {/* Company Info */}
            <div className="space-y-6">
              <div className="flex items-center">
                <img 
                  src={sweepPokharaLogo} 
                  alt="SweepPokhara Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <p className="text-gray-400 leading-relaxed text-sm">
                Making Pokhara cleaner, greener, and smarter through innovative waste management solutions. Join us in creating a sustainable future.
              </p>
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                >
                  <FaFacebookF className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                >
                  <FaTwitter className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                >
                  <FaInstagram className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-600 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                >
                  <FaLinkedinIn className="text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" onClick={(e) => handleQuickLink(e, '/')} className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/feature" onClick={(e) => handleQuickLink(e, '/feature')} className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/aboutus" onClick={(e) => handleQuickLink(e, '/aboutus')} className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={(e) => handleQuickLink(e, '/contact')} className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/login" onClick={(e) => handleQuickLink(e, '/login')} className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                Legal
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/policy" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-400 hover:text-emerald-400 transition-colors duration-300 flex items-center group">
                    <span className="w-0 group-hover:w-2 h-0.5 bg-emerald-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                Contact Us
                <span className="absolute bottom-0 left-0 w-12 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3 group">
                  <FaMapMarkerAlt className="text-emerald-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-400 text-sm leading-relaxed">
                    Lakeside, Pokhara-6<br />
                    Kaski, Nepal
                  </span>
                </li>
                <li className="flex items-center space-x-3 group">
                  <FaPhoneAlt className="text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href="tel:+9779806563442" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    +977 9806563442
                  </a>
                </li>
                <li className="flex items-center space-x-3 group">
                  <FaEnvelope className="text-emerald-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                  <a href="mailto:sweeppokhara@gmail.com" className="text-gray-400 hover:text-emerald-400 transition-colors text-sm">
                    sweeppokhara@gmail.com
                  </a>
                </li>
              </ul>

              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="mt-6 w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl group"
              >
                <BsArrowUpCircle className="group-hover:translate-y-[-4px] transition-transform" />
                <span className="font-semibold text-sm">Back to Top</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} <span className="text-emerald-400 font-semibold">SweepPokhara</span>. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              
              <span className="text-gray-600">|</span>
              <span className="text-gray-500">
                Version 1.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full shadow-2xl transform animate-[scale-in_0.2s_ease-out]">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Logout Required</h3>
              <p className="text-gray-600 text-sm mb-6">
                This link will take you to the public page. You will be logged out of your account. Do you want to continue?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogoutConfirm}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg"
                >
                  Logout & Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}


export default Footer