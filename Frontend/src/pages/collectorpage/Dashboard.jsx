import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiCalendar, 
  FiLogOut, 
  FiArrowRight,
  FiSearch,
  FiChevronLeft,
  FiUser,
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { 
  BsBell, 
  BsTruck, 
  BsFillTrashFill, 
  BsSortDown, 
  BsListUl,
  BsCheckCircleFill,
  BsClock,
  BsExclamationTriangle
} from "react-icons/bs";
import { GiBroom } from "react-icons/gi";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useScrollToTop from "../../hooks/useScrollToTop";
import CollectorNotificationCenter from "./components/CollectorNotificationCenter";
import sweepPokharaLogo from '../../assets/images/sweeppokhara-final-logo.png';

// -------------------------
// ENHANCED TRASH BIN ICON (same as Collectormap)
// -------------------------
const createTrashBinIcon = (fillStatus) => {
  let color, fillLevel, animation;
  
  switch (fillStatus) {
    case "full":
      color = "#EF4444";
      fillLevel = "85%";
      animation = 'animation: bounce 1s infinite;';
      break;
    case "half":
      color = "#F59E0B";
      fillLevel = "50%";
      animation = '';
      break;
    case "empty":
    default:
      color = "#10B981";
      fillLevel = "15%";
      animation = '';
      break;
  }

  const trashBinSvg = `
    <div style="
      background: white;
      border-radius: 8px;
      padding: 6px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 2px solid ${color};
      ${animation}
    ">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5">
        <!-- Bin Body -->
        <rect x="3" y="6" width="18" height="14" rx="1" fill="white" stroke="${color}" stroke-width="1.5"/>
        <!-- Fill Level -->
        <rect x="4" y="${20 - (parseInt(fillLevel) / 100 * 12)}" width="16" height="${parseInt(fillLevel) / 100 * 12}" rx="0.5" fill="${color}" opacity="0.7"/>
        <!-- Lid -->
        <rect x="2" y="4" width="20" height="2" rx="1" fill="${color}"/>
        <!-- Handle -->
        <rect x="10" y="2" width="4" height="2" rx="1" fill="${color}"/>
        <!-- Decorative lines -->
        <line x1="8" y1="8" x2="16" y2="8" stroke="${color}" stroke-width="0.5" opacity="0.6"/>
        <line x1="8" y1="11" x2="16" y2="11" stroke="${color}" stroke-width="0.5" opacity="0.6"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: trashBinSvg,
    className: "custom-trashbin-icon",
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44],
  });
};

// -------------------------
// STATIC DATA (same bins as Collectormap)
// -------------------------
const trashBins = [
  { id: "TB1025", position: [28.2090, 83.9596], fillStatus: "half", binType: "General Waste", lastCollection: "1 day ago", location: "Lakeside, Pokhara", fillLevel: 55, ward: 5 },
  { id: "TB1026", position: [28.2144, 83.9851], fillStatus: "empty", binType: "Recyclable Waste", lastCollection: "6 hours ago", location: "Baseline, Pokhara", fillLevel: 20, ward: 10 },
  { id: "TB1027", position: [28.2096, 83.9896], fillStatus: "half", binType: "Organic Waste", lastCollection: "12 hours ago", location: "City Center, Pokhara", fillLevel: 65, ward: 8 },
  { id: "TB1028", position: [28.2115, 83.9650], fillStatus: "empty", binType: "General Waste", lastCollection: "3 hours ago", location: "Lakeside East, Pokhara", fillLevel: 10, ward: 5 },
  { id: "TB1029", position: [28.21118953908775, 83.9771218979668], fillStatus: "empty", binType: "IoT Smart Bin", lastCollection: "Just now", location: "Pokhara Engineering College", fillLevel: 0, ward: 14 },
];

// -------------------------
// ESP32 CONFIG
// -------------------------
const ESP32_IP = "172.20.10.3";
const ESP32_BIN_ID = "TB1029";


// -------------------------
// STATIC DATA
// -------------------------
const collectorData = {
  id: "COL-007",
  name: "Rajesh Kumar",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector007",
  rating: 4.8,
  todayCollections: 23,
};

const stats = {
  total: 50,
  pending: 35,
  inProgress: 5,
  completed: 10
};

// Stat Card Component
const StatCard = ({ title, value, color, icon: Icon }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };

  const valueColors = {
    green: 'text-gray-900',
    yellow: 'text-yellow-600',
    blue: 'text-blue-600',
    emerald: 'text-emerald-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-2xl sm:text-3xl font-bold ${valueColors[color]}`}>{value}</p>
        </div>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="text-lg sm:text-xl" />
        </div>
      </div>
    </div>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
const CollectorDashboard = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  
  // Get collector data from localStorage
  const [collectorData, setCollectorData] = useState(null);
  
  useEffect(() => {
    const storedData = localStorage.getItem('collectorData');
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setCollectorData(data);
      } catch (error) {
        console.error('Error parsing collector data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  // ── Get collector's assigned ward numbers ────────────────────────────────
  const collectorWardNumbers = (collectorData?.assignedWards || []).map(Number);

  // ── Filter bins by collector's assigned wards (always include ESP32 ward)
  const esp32BinWard = trashBins.find(b => b.id === ESP32_BIN_ID)?.ward;
  const wardSet = new Set([...collectorWardNumbers, esp32BinWard]);
  const wardFilteredBins = trashBins.filter(bin => wardSet.has(Number(bin.ward)));

  // ── ESP32 Live Sensor State ──────────────────────────────────────────────
  const [esp32Data, setEsp32Data] = useState({
    distance: null,
    percentage: 0,
    status: "EMPTY",
    fillStatus: "empty",
    lastUpdated: "Connecting…",
    isLive: false,
    error: false,
  });

  // ── Track previous bin status for transition detection ─────────────────
  const prevBinStatusRef = useRef(null);
  const alertInProgressRef = useRef(false);

  useEffect(() => {
    const fetchEsp32 = async () => {
      try {
        const res = await fetch(`http://${ESP32_IP}/data`, {
          signal: AbortSignal.timeout(4000),
        });
        const data = await res.json();
        const pct = Math.max(0, Math.min(100, data.percentage));
        const statusUp = (data.status || "EMPTY").toUpperCase();

        let fillStatus = "empty";
        if (pct >= 90 || statusUp === "FULL") fillStatus = "full";
        else if (pct >= 40) fillStatus = "half";

        setEsp32Data({
          distance: parseFloat(data.distance).toFixed(1),
          percentage: pct,
          status: data.status,
          lastUpdated: "Just now",
          isLive: true,
          error: false,
          fillStatus,
        });

        // ── Transition Detection: Send alerts on bin full/emptied ────────
        const isFull = fillStatus === "full";
        const prevStatus = prevBinStatusRef.current;

        if (prevStatus !== null && !alertInProgressRef.current) {
          const espBin = wardFilteredBins.find(b => b.id === ESP32_BIN_ID);
          const binLocation = espBin?.location || "Unknown Location";
          const binWard = espBin?.ward || 14;

          if (!prevStatus && isFull) {
            alertInProgressRef.current = true;
            try {
              await fetch("http://localhost:3000/api/bin-status/alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ binId: ESP32_BIN_ID, ward: binWard, status: "full", location: binLocation, fillLevel: pct }),
              });
              const binNotifs = JSON.parse(localStorage.getItem("binAlertNotifications") || "[]");
              binNotifs.unshift({
                id: `bin-full-${ESP32_BIN_ID}-${Date.now()}`, type: "bin-full",
                title: `🚨 Dustbin Full — ${ESP32_BIN_ID}`,
                message: `Dustbin at ${binLocation} (Ward ${binWard}) is ${pct}% full and needs immediate collection.`,
                icon: "bin-full", timestamp: new Date().toISOString(), read: false,
              });
              localStorage.setItem("binAlertNotifications", JSON.stringify(binNotifs.slice(0, 50)));
            } catch (err) { console.error("Failed to send bin full alert:", err); }
            finally { alertInProgressRef.current = false; }
          }

          if (prevStatus && !isFull) {
            alertInProgressRef.current = true;
            try {
              await fetch("http://localhost:3000/api/bin-status/alert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ binId: ESP32_BIN_ID, ward: binWard, status: "emptied", location: binLocation, fillLevel: pct }),
              });
              const binNotifs = JSON.parse(localStorage.getItem("binAlertNotifications") || "[]");
              binNotifs.unshift({
                id: `bin-emptied-${ESP32_BIN_ID}-${Date.now()}`, type: "bin-emptied",
                title: `✅ Dustbin Emptied — ${ESP32_BIN_ID}`,
                message: `Dustbin at ${binLocation} (Ward ${binWard}) has been emptied and is now at ${pct}%.`,
                icon: "bin-emptied", timestamp: new Date().toISOString(), read: false,
              });
              localStorage.setItem("binAlertNotifications", JSON.stringify(binNotifs.slice(0, 50)));
            } catch (err) { console.error("Failed to send bin emptied alert:", err); }
            finally { alertInProgressRef.current = false; }
          }
        }

        prevBinStatusRef.current = isFull;
      } catch {
        setEsp32Data((prev) => ({ ...prev, lastUpdated: "Offline", isLive: false, error: true }));
      }
    };

    fetchEsp32();
    const interval = setInterval(fetchEsp32, 2500);
    return () => clearInterval(interval);
  }, []);

  // Merge ESP32 live data into the TB1029 entry
  const liveBins = wardFilteredBins.map((bin) => {
    if (bin.id !== ESP32_BIN_ID) return bin;
    return {
      ...bin,
      fillLevel: esp32Data.percentage,
      fillStatus: esp32Data.fillStatus ?? bin.fillStatus,
      lastCollection: esp32Data.lastUpdated,
      binType: esp32Data.isLive ? "IoT Smart Bin (Live)" : bin.binType,
    };
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsScrolled(currentScroll > 50);

      if (currentScroll < lastScrollY - 10) {
        setIsNavVisible(true);
      } else if (currentScroll > lastScrollY + 10 && currentScroll > 80) {
        setIsNavVisible(false);
      }

      setLastScrollY(currentScroll);
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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileDropdown(false);
    
    console.log('🚪 Collector logging out...');
    
    // Clear collector data from localStorage
    localStorage.removeItem('collectorToken');
    localStorage.removeItem('collectorData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    
    console.log('✅ Collector logged out successfully');
    
    navigate('/login');
  };

  const handleProfileClick = () => {
    setShowProfileDropdown(false);
    navigate('/collector/profile');
  };

  const handleDashboardClick = () => {
    setShowProfileDropdown(false);
    navigate('/collector/dashboard');
  };

  // Show loading if collector data is not yet loaded
  if (!collectorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 text-gray-900 flex flex-col">
      {/* Background Elements (from Header) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-3000"></div>
      </div>

      {/* Enhanced Navbar with Header styling */}
      <nav ref={mobileMenuRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6 lg:px-10 py-3 sm:py-4">
          {/* Left: Logo (from Header) */}
          <Link to="/collector" className="transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <img 
                src={sweepPokharaLogo} 
                alt="SweepPokhara Logo" 
                className="h-11 sm:h-12 w-auto object-contain"
              />
              <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
                Collector
              </span>
            </div>
          </Link>

          {/* Right: Navigation - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => {
                setActiveNav('home');
                navigate('/collector/dashboard');
              }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                activeNav === 'home' 
                  ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiHome />
                <span className="font-semibold">Dashboard</span>
              </div>
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 ${
                activeNav === 'home' ? "w-4/5 left-1/10" : ""
              }`}></span>
            </button>
            
            <button
              onClick={() => {
                setActiveNav('schedule');
                navigate('/collector/tasks');
              }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                activeNav === 'schedule' 
                  ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiCalendar />
                <span className="font-semibold">Schedule</span>
              </div>
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 ${
                activeNav === 'schedule' ? "w-4/5 left-1/10" : ""
              }`}></span>
            </button>

            <button
              onClick={() => {
                setActiveNav('reports');
                navigate('/collector/reports');
              }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                activeNav === 'reports' 
                  ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BsExclamationTriangle />
                <span className="font-semibold">Reports</span>
              </div>
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 ${
                activeNav === 'reports' ? "w-4/5 left-1/10" : ""
              }`}></span>
            </button>
            
            {/* Notification Center */}
            <CollectorNotificationCenter />
            
            {/* Profile Dropdown */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-11 h-11 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
              >
                <FiUser className="text-xl" />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-emerald-100 overflow-hidden z-50 animate-fadeIn">
                  <div className="py-2">
                    <button
                      onClick={handleDashboardClick}
                      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-emerald-50 transition-all duration-200 text-gray-700 hover:text-emerald-700"
                    >
                      <FiHome className="text-lg" />
                      <span className="font-semibold">Dashboard</span>
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

          {/* Mobile: notification + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <CollectorNotificationCenter />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-emerald-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <FiX className="text-2xl" /> : <FiMenu className="text-2xl" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-emerald-100 bg-white/95 backdrop-blur-xl px-4 py-3 space-y-1">
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-emerald-700 bg-emerald-50/80 font-semibold">
              <FiHome /> Dashboard
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/tasks'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 font-semibold">
              <FiCalendar /> Schedule
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/reports'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 font-semibold">
              <BsExclamationTriangle /> Reports
            </button>
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/profile'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 font-semibold">
              <FiUser /> Profile
            </button>
            <button onClick={() => { setMobileMenuOpen(false); handleLogout(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-semibold">
              <FiLogOut /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 sm:h-20 md:h-24"></div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Collector Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome, <span className="text-emerald-700 font-semibold">
              {collectorData?.name?.split(' ')[0] || 'Collector'}
            </span>! Here's your workload overview.
          </p>
          {collectorData?.collectorId && (
            <p className="text-sm text-gray-500 mt-1">
              ID: <span className="font-mono font-semibold">{collectorData?.collectorId}</span> | 
              Assigned to: <span className="font-semibold">{collectorData?.assignedWards?.length || 0} wards</span>
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <StatCard 
            title="Total Tasks" 
            value={stats.total} 
            color="green"
            icon={BsFillTrashFill}
          />
          <StatCard 
            title="Pending Tasks" 
            value={stats.pending} 
            color="yellow"
            icon={BsClock}
          />
          <StatCard 
            title="In Progress Tasks" 
            value={stats.inProgress} 
            color="blue"
            icon={BsTruck}
          />
          <StatCard 
            title="Completed Tasks" 
            value={stats.completed} 
            color="emerald"
            icon={BsCheckCircleFill}
          />
        </div>

        {/* Primary Button with Header-style animation */}
        <div className="flex justify-center mb-6 sm:mb-8 px-2">
          <Link to="/collector/tasks" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-6 sm:px-10 py-3 sm:py-3.5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <span>View Assigned Tasks</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </Link>
        </div>

        {/* Live Map Section — same map as Collectormap with ESP32 live data */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Live Dustbin Map</h2>
              <p className="text-sm text-gray-500">Real-time tracking of waste bins in Ward {collectorWardNumbers.join(', ') || '—'}</p>
            </div>
            <Link to="/collector/map" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center gap-1 transition-colors">
              View Full Map <FiArrowRight />
            </Link>
          </div>
          {wardFilteredBins.length === 0 ? (
            <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-200 p-8">
              <div className="text-center">
                <BsFillTrashFill className="text-5xl text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-700 mb-1">No Bins in Your Ward</h3>
                <p className="text-gray-500 text-sm">There are currently no smart bins assigned to your wards.</p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden shadow-lg border border-emerald-200 bg-white/80 backdrop-blur-sm relative" style={{ height: "400px", zIndex: 0, position: "relative" }}>
              <MapContainer
                center={[28.2096, 83.9856]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full rounded-2xl"
                zoomControl={false}
                style={{ zIndex: 0, position: "relative" }}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Trash Bin Markers with live ESP32 data */}
                {liveBins.map((bin) => (
                  <Marker
                    key={bin.id === ESP32_BIN_ID ? `${bin.id}-${bin.fillLevel}-${bin.fillStatus}` : bin.id}
                    position={bin.position}
                    icon={createTrashBinIcon(bin.fillStatus)}
                  >
                    <Popup className="custom-popup">
                      <div className="p-3 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-3 h-3 rounded-full ${
                            bin.fillStatus === "full" ? "bg-red-500" : 
                            bin.fillStatus === "half" ? "bg-yellow-500" : "bg-green-500"
                          }`}></div>
                          <h3 className="font-bold text-gray-900">Trash Bin #{bin.id}</h3>
                          {/* Live badge for ESP32-connected bin */}
                          {bin.id === ESP32_BIN_ID && (
                            <span
                              style={{
                                display: "inline-flex", alignItems: "center", gap: 4,
                                fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999,
                                background: esp32Data.isLive ? "#d1fae5" : "#f3f4f6",
                                color: esp32Data.isLive ? "#065f46" : "#6b7280",
                                border: `1px solid ${esp32Data.isLive ? "#6ee7b7" : "#d1d5db"}`,
                              }}
                            >
                              <span
                                style={{
                                  width: 6, height: 6, borderRadius: "50%",
                                  background: esp32Data.isLive ? "#10b981" : "#9ca3af",
                                  display: "inline-block",
                                }}
                              />
                              {esp32Data.isLive ? "LIVE" : "OFFLINE"}
                            </span>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-semibold">Type:</span> {bin.binType}</p>
                          <p><span className="font-semibold">Status:</span> 
                            <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              bin.fillStatus === "full" ? "bg-red-100 text-red-800" : 
                              bin.fillStatus === "half" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                            }`}>
                              {bin.id === ESP32_BIN_ID
                                ? (esp32Data.status || bin.fillStatus).toUpperCase()
                                : bin.fillStatus.toUpperCase()}
                            </span>
                          </p>
                          {/* Distance — only for ESP32 bin */}
                          {bin.id === ESP32_BIN_ID && esp32Data.distance !== null && (
                            <p><span className="font-semibold">Distance:</span> {esp32Data.distance} cm</p>
                          )}
                          <p><span className="font-semibold">Fill Level:</span> {bin.fillLevel}%</p>
                          <p><span className="font-semibold">Last Collection:</span> {bin.lastCollection}</p>
                          <p><span className="font-semibold">Location:</span> {bin.location}</p>
                          {/* Error hint */}
                          {bin.id === ESP32_BIN_ID && esp32Data.error && (
                            <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>
                              ⚠ Cannot reach ESP32 at {ESP32_IP}
                            </p>
                          )}
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                <ZoomControl position="bottomright" />
              </MapContainer>
            </div>
          )}
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Today's Collection</h3>
              <span className="text-xs sm:text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700">{collectorData?.todayCollections || 0} bins</p>
            <p className="text-sm text-gray-500 mt-2">+2 from yesterday</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Collection Efficiency</h3>
              <span className="text-xs sm:text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Good</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700">{collectorData?.efficiency || 94}%</p>
            <p className="text-sm text-gray-500 mt-2">Above average</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Current Rating</h3>
              <div className="flex items-center space-x-1">
                <span className="text-xs sm:text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{collectorData?.rating || 4.0}/5</span>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-amber-700">{collectorData?.rating || 4.0}</p>
            <p className="text-sm text-gray-500 mt-2">Based on 124 reviews</p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-500 text-sm mb-6">
          <p>Data updates every 5 minutes. Last updated: Just now</p>
        </div>
      </main>

      {/* Footer - Same as user map */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-green-200 py-8 text-center text-green-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10 mt-12">
        <span className="font-semibold">© 2024 SweepPokhara. All rights reserved.</span>
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

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
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

        /* Custom popup styles */
        :global(.custom-popup .leaflet-popup-content-wrapper) {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
        }

        :global(.custom-popup .leaflet-popup-tip) {
          background: white;
          border: 1px solid #e5e7eb;
        }

        /* Fix z-index for leaflet map to stay below navbar (navbar is z-50) */
        :global(.leaflet-container) {
          z-index: 0 !important;
          position: relative !important;
        }
        
        :global(.leaflet-pane),
        :global(.leaflet-map-pane),
        :global(.leaflet-tile-pane),
        :global(.leaflet-overlay-pane),
        :global(.leaflet-shadow-pane),
        :global(.leaflet-marker-pane),
        :global(.leaflet-tooltip-pane),
        :global(.leaflet-popup-pane) {
          z-index: auto !important;
        }
        
        :global(.leaflet-top),
        :global(.leaflet-bottom) {
          z-index: 400 !important;
        }
        
        :global(.leaflet-control) {
          z-index: 400 !important;
        }
      `}</style>
    </div>
  );
};

export default CollectorDashboard;