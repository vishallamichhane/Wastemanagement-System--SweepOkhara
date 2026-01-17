import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FiHome, 
  FiCalendar, 
  FiLogOut, 
  FiChevronDown,
  FiArrowRight,
  FiMapPin,
  FiFilter,
  FiSearch,
  FiChevronLeft
} from 'react-icons/fi';
import { 
  BsBell, 
  BsTruck, 
  BsFillTrashFill, 
  BsSortDown, 
  BsMap, 
  BsListUl,
  BsCheckCircleFill,
  BsClock
} from "react-icons/bs";
import { GiBroom } from "react-icons/gi";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useScrollToTop from "../../hooks/useScrollToTop";
import CollectorNotificationCenter from "./components/CollectorNotificationCenter";

// -------------------------
// ENHANCED VEHICLE SVG ICON (From your map)
// -------------------------
const createVehicleIcon = (status) => {
  const color = status === "active" ? "#10B981" : "#6B7280";
  const animation = status === "active" ? 'animation: pulse 2s infinite;' : '';
  
  const vehicleSvg = `
    <div style="
      background: white;
      border-radius: 50%;
      padding: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      border: 3px solid ${color};
      ${animation}
    ">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.22-.624l-2.96-3.7A1 1 0 0 0 18.04 8H16V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>
        <path d="M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
        <path d="M18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: vehicleSvg,
    className: "custom-vehicle-icon",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// -------------------------
// ENHANCED TRASH BIN ICON (From your map)
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
        <!-- Fill Level - Dynamic based on status -->
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

const trashBins = [
  { 
    id: "TB1024", 
    position: [28.2106, 83.9856], 
    fillStatus: "full", 
    binType: "General Waste", 
    lastCollection: "2 days ago", 
    location: "Mahendra Pul, Pokhara", 
    fillLevel: 95,
    assigned: true
  },
  { 
    id: "TB1025", 
    position: [28.209, 83.9884], 
    fillStatus: "half", 
    binType: "General Waste", 
    lastCollection: "1 day ago", 
    location: "Lakeside, Pokhara", 
    fillLevel: 55,
    assigned: true
  },
  { 
    id: "TB1026", 
    position: [28.2248, 83.9829], 
    fillStatus: "empty", 
    binType: "Recyclable Waste", 
    lastCollection: "6 hours ago", 
    location: "Baseline, Pokhara", 
    fillLevel: 20,
    assigned: false
  },
  { 
    id: "TB1027", 
    position: [28.213, 83.983], 
    fillStatus: "half", 
    binType: "Organic Waste", 
    lastCollection: "12 hours ago", 
    location: "City Center, Pokhara", 
    fillLevel: 65,
    assigned: true
  },
  { 
    id: "TB1028", 
    position: [28.207, 83.986], 
    fillStatus: "empty", 
    binType: "General Waste", 
    lastCollection: "3 hours ago", 
    location: "Lakeside East, Pokhara", 
    fillLevel: 10,
    assigned: false
  },
];

const vehicles = [
  { 
    id: "V001", 
    position: [28.212, 83.984], 
    status: "active", 
    driver: "John Doe", 
    location: "Route 1 - Mahendra Pul", 
    lastUpdated: "1m ago" 
  },
  { 
    id: "V002", 
    position: [28.208, 83.987], 
    status: "inactive", 
    driver: "Jane Smith", 
    location: "Route 2 - Lakeside Area", 
    lastUpdated: "3m ago" 
  },
];

const wards = Array.from({ length: 33 }, (_, i) => `Ward ${i + 1}`);


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
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${valueColors[color]}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-full ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="text-xl" />
        </div>
      </div>
    </div>
  );
};

// Map Section Component
const MapSection = () => {
  const [selectedWard, setSelectedWard] = useState('Ward 1');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Pokhara City: Real-Time Collection Route</h3>
          <p className="text-gray-500 mt-1">Live tracking of collection vehicles and bin status</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-2">
            <FiFilter className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Ward</span>
            <div className="relative">
              <select 
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {wards.map(ward => (
                  <option key={ward} value={ward}>{ward}</option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-[400px] rounded-lg overflow-hidden border border-gray-200" style={{ zIndex: 0, position: "relative" }}>
        <MapContainer
          center={[28.2096, 83.9856]}
          zoom={14}
          style={{ height: '100%', width: '100%', zIndex: 0, position: "relative" }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Trash Bin Markers */}
          {trashBins.map((bin) => (
            <Marker key={bin.id} position={bin.position} icon={createTrashBinIcon(bin.fillStatus)}>
              <Popup className="custom-popup">
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      bin.fillStatus === "full" ? "bg-red-500" : 
                      bin.fillStatus === "half" ? "bg-yellow-500" : "bg-green-500"
                    }`}></div>
                    <h3 className="font-bold text-gray-900">Trash Bin #{bin.id}</h3>
                    {bin.assigned && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Your Task
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
                        {bin.fillStatus.toUpperCase()}
                      </span>
                    </p>
                    <p><span className="font-semibold">Fill Level:</span> {bin.fillLevel}%</p>
                    <p><span className="font-semibold">Last Collection:</span> {bin.lastCollection}</p>
                    <p><span className="font-semibold">Location:</span> {bin.location}</p>
                    {bin.assigned && (
                      <button className="w-full mt-3 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                        Mark as Collected
                      </button>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Vehicle Markers */}
          {vehicles.map((vehicle) => (
            <Marker key={vehicle.id} position={vehicle.position} icon={createVehicleIcon(vehicle.status)}>
              <Popup className="custom-popup">
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-3 h-3 rounded-full ${
                      vehicle.status === "active" ? "bg-green-500 animate-pulse" : "bg-gray-500"
                    }`}></div>
                    <h3 className="font-bold text-gray-900">Vehicle #{vehicle.id}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        vehicle.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}>
                        {vehicle.status.toUpperCase()}
                      </span>
                    </p>
                    <p><span className="font-semibold">Driver:</span> {vehicle.driver}</p>
                    <p><span className="font-semibold">Route:</span> {vehicle.location}</p>
                    <p><span className="font-semibold">Last Updated:</span> {vehicle.lastUpdated}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <ZoomControl position="bottomright" />
        </MapContainer>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-100 text-gray-900 flex flex-col">
      {/* Background Elements (from Header) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
        <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-green-200/20 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow animation-delay-3000"></div>
      </div>

      {/* Enhanced Navbar with Header styling */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
          {/* Left: Logo (from Header) */}
          <Link to="/collector" className="transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
                <GiBroom className="text-white text-xl" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  SweePokhara
                </span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
                Collector
              </span>
            </div>
          </Link>

          {/* Right: Navigation */}
          <div className="flex items-center space-x-6">
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
            
            {/* Notification Center */}
            <CollectorNotificationCenter />
            
            <button 
              onClick={() => navigate('/login')}
              className="relative px-6 py-2.5 rounded-xl text-emerald-700 font-semibold border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/80 hover:shadow-lg transition-all duration-300 hover:scale-105 group"
            >
              <div className="flex items-center space-x-2">
                <FiLogOut />
                <span>Logout</span>
              </div>
              <div className="absolute inset-0 bg-emerald-50/50 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
            
            {/* Profile */}
            <div 
              onClick={() => navigate('/collector/profile')}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">{collectorData.name}</p>
                <p className="text-xs text-gray-500">Collector ID: {collectorData.id}</p>
              </div>
              <div className="relative group">
                <img 
                  src={collectorData.avatar} 
                  alt="Collector"
                  className="w-11 h-11 rounded-full border-2 border-emerald-500 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white group-hover:scale-110 transition-transform duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-24"></div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Collector Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome, <span className="text-emerald-700 font-semibold">{collectorData.name.split(' ')[0]}</span>! Here's your workload overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        <div className="flex justify-center mb-8">
          <Link to="/collector/tasks">
            <button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold px-10 py-3.5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:from-emerald-700 hover:to-teal-700 group relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <span>View Assigned Tasks</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </button>
          </Link>
        </div>

        {/* Map Section */}
        <div className="mb-8">
          <MapSection />
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Today's Collection</h3>
              <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">Active</span>
            </div>
            <p className="text-3xl font-bold text-emerald-700">{collectorData.todayCollections} bins</p>
            <p className="text-sm text-gray-500 mt-2">+2 from yesterday</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Collection Efficiency</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Good</span>
            </div>
            <p className="text-3xl font-bold text-blue-700">94%</p>
            <p className="text-sm text-gray-500 mt-2">Above average</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300 hover:-translate-y-1 transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Current Rating</h3>
              <div className="flex items-center space-x-1">
                <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">{collectorData.rating}/5</span>
              </div>
            </div>
            <p className="text-3xl font-bold text-amber-700">{collectorData.rating}</p>
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