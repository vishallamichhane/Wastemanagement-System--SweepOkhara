import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  FiArrowLeft,
  FiFilter,
  FiChevronRight,
  FiMapPin,
  FiNavigation,
  FiHome,
  FiCalendar,
  FiLogOut,
  FiSearch,
  FiUser,
  FiSettings,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { 
  BsTruck,
  BsFillTrashFill,
  BsPinMapFill,
  BsExclamationCircle,
  BsClock,
  BsCheckCircle,
  BsArrowRightCircle,
  BsListUl,
  BsGeoAlt,
  BsExclamationTriangle
} from "react-icons/bs";
import { GiBroom, GiPathDistance } from "react-icons/gi";
import { MdOutlineDeleteSweep, MdMyLocation } from "react-icons/md";
import { TbRoute } from "react-icons/tb";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useScrollToTop from "../../hooks/useScrollToTop";
import CollectorNotificationCenter from "./components/CollectorNotificationCenter";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl
} from 'react-leaflet';


// -------------------------
// DUMMY DATA - Can be replaced with backend API
// -------------------------
const collectorData = {
  id: "COL-007",
  name: "Rajesh Kumar",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector007",
  vehicle: {
    id: "TRK-05",
    type: "Waste Collection Truck",
    currentLocation: [28.2106, 83.9856],
    status: "active",
    fuel: 78,
    speed: "25 km/h"
  },
  currentRoute: {
    id: "ROUTE-A",
    name: "Lakeside Collection Route",
    totalDistance: "11.6 km",
    estimatedTime: "2.5 hours",
    bins: 6,
    progress: 35
  }
};

const assignedBins = [
  {
    id: "TB1025",
    binId: "TB1025",
    location: "Lakeside, Pokhara",
    coordinates: [28.2090, 83.9596],
    fillLevel: 55,
    fillStatus: "half",
    status: "in-progress",
    priority: "medium",
    wasteType: "General Waste",
    address: "Lakeside, Pokhara",
    lastCollection: "1 day ago",
    collectionTime: "09:30 AM",
    notes: "Regular collection, accessible location"
  },
  {
    id: "TB1026",
    binId: "TB1026",
    location: "Baseline, Pokhara",
    coordinates: [28.2144, 83.9851],
    fillLevel: 20,
    fillStatus: "empty",
    status: "pending",
    priority: "low",
    wasteType: "Recyclable Waste",
    address: "Baseline, Pokhara",
    lastCollection: "6 hours ago",
    collectionTime: "11:00 AM",
    notes: "Plastic and paper recycling"
  },
  {
    id: "TB1027",
    binId: "TB1027",
    location: "City Center, Pokhara",
    coordinates: [28.2096, 83.9896],
    fillLevel: 65,
    fillStatus: "half",
    status: "pending",
    priority: "high",
    wasteType: "Organic Waste",
    address: "City Center, Pokhara",
    lastCollection: "12 hours ago",
    collectionTime: "10:15 AM",
    notes: "Organic waste - separate collection required"
  },
  {
    id: "TB1028",
    binId: "TB1028",
    location: "Lakeside East, Pokhara",
    coordinates: [28.2115, 83.9650],
    fillLevel: 10,
    fillStatus: "empty",
    status: "pending",
    priority: "low",
    wasteType: "General Waste",
    address: "Lakeside East, Pokhara",
    lastCollection: "3 hours ago",
    collectionTime: "11:45 AM",
    notes: "Regular collection, easy access"
  },
  {
    id: "TB1029",
    binId: "TB1029",
    location: "Pokhara Engineering College",
    coordinates: [28.21118953908775, 83.9771218979668],
    fillLevel: 0,
    fillStatus: "empty",
    status: "pending",
    priority: "low",
    wasteType: "Smart Bin (Demo)",
    address: "Pokhara Engineering College",
    lastCollection: "Just now",
    collectionTime: "12:30 PM",
    notes: "Demo smart bin with ultrasonic sensor"
  }
];

const routePath = [
  [28.2090, 83.9596],  // Lakeside
  [28.2144, 83.9851],  // Baseline
  [28.2096, 83.9896],  // City Center
  [28.2115, 83.9650],  // Lakeside East
  [28.21118953908775, 83.9771218979668]  // Demo Site (End)
];

// -------------------------
// CUSTOM MAP ICONS
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

const createVehicleIcon = () => {
  const svg = `
    <div style="
      background: linear-gradient(135deg, #10B981, #059669);
      border-radius: 50%;
      padding: 12px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
      border: 3px solid white;
      animation: pulse 2s infinite;
    ">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1.5">
        <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.22-.624l-2.96-3.7A1 1 0 0 0 18.04 8H16V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h2"/>
        <path d="M6 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
        <path d="M18 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svg,
    className: "custom-vehicle-icon",
    iconSize: [56, 56],
    iconAnchor: [28, 56],
    popupAnchor: [0, -56],
  });
};

// -------------------------
// MAIN COMPONENT
// -------------------------
const CollectorMapView = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBin, setSelectedBin] = useState(null);
  const [viewMode, setViewMode] = useState("map"); // "map" or "list"
  const [userLocation, setUserLocation] = useState([28.2096, 83.9856]);
  const [mapCenter, setMapCenter] = useState([28.2096, 83.9856]);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [activeNav, setActiveNav] = useState("map");
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);

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

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          setMapCenter([latitude, longitude]);
        },
        () => {
          console.log("Using default location");
        }
      );
    }
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-100 text-emerald-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFillLevelColor = (level) => {
    if (level >= 80) return 'bg-red-500 text-white';
    if (level >= 50) return 'bg-amber-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const handleBinSelect = (bin) => {
    setSelectedBin(bin);
    setMapCenter(bin.coordinates);
    setZoomLevel(16);
  };

  const handleStartNavigation = (bin) => {
    const { coordinates } = bin;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates[0]},${coordinates[1]}`;
    window.open(url, '_blank');
  };

  const handleMarkComplete = (binId) => {
    // In real app, this would be an API call
    console.log(`Marked bin ${binId} as complete`);
    setSelectedBin(null);
  };

  const handleStartCollection = (binId) => {
    // In real app, this would be an API call
    console.log(`Started collection for bin ${binId}`);
    setSelectedBin(null);
  };

  const filteredBins = assignedBins.filter(bin => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return bin.status === "pending";
    if (activeFilter === "in-progress") return bin.status === "in-progress";
    if (activeFilter === "high") return bin.priority === "high";
    if (activeFilter === "completed") return bin.status === "completed";
    return true;
  }).filter(bin => 
    bin.binId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bin.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bin.wasteType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter for route calculation
  const pendingBins = assignedBins.filter(b => b.status === "pending");
  const completedBins = assignedBins.filter(b => b.status === "completed");
  const progressPercentage = assignedBins.length > 0 
    ? Math.round((completedBins.length / assignedBins.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
      </div>

      {/* SAME NAVBAR AS ASSIGNED TASKS PAGE */}
      <nav ref={mobileMenuRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-3 sm:px-6 lg:px-10 py-3 sm:py-4">
          {/* Logo - Match Collector Dashboard */}
          <Link to="/collector" className="transform hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer">
              <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-xl">
                <GiBroom className="text-white text-xl" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  SweePokhara
                </span>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
                Collector
              </span>
            </div>
          </Link>

          {/* Navigation - Desktop */}
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
                setActiveNav('tasks');
                navigate('/collector/tasks');
              }}
              className={`relative px-5 py-2.5 rounded-xl transition-all duration-300 group ${
                activeNav === 'tasks' 
                  ? "text-emerald-700 bg-emerald-50/80 shadow-sm" 
                  : "text-gray-600 hover:text-emerald-700 hover:bg-white/80"
              }`}
            >
              <div className="flex items-center space-x-2">
                <FiCalendar />
                <span className="font-semibold">Schedule</span>
              </div>
              <span className={`absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300 group-hover:w-4/5 group-hover:left-1/10 ${
                activeNav === 'tasks' ? "w-4/5 left-1/10" : ""
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
            <button onClick={() => { setMobileMenuOpen(false); navigate('/collector/dashboard'); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-emerald-50 font-semibold">
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
        {/* Header Section */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/collector/tasks')}
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group"
          >
            <FiArrowLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Tasks</span>
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Collection Route Map
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Visualize your route and manage collection points in real-time
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl px-4 py-2">
                <p className="text-sm text-emerald-700 font-medium flex items-center gap-2">
                  <TbRoute />
                  {collectorData.currentRoute.name}
                </p>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setViewMode("map")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === "map"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  Map View
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  List View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Bins</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{assignedBins.length}</p>
                <p className="text-xs text-gray-500 mt-1">In current route</p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <BsFillTrashFill className="text-emerald-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingBins.length}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting collection</p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full flex items-center justify-center">
                <BsClock className="text-amber-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Route Distance</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{collectorData.currentRoute.totalDistance}</p>
                <p className="text-xs text-gray-500 mt-1">Total coverage</p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <GiPathDistance className="text-blue-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Progress</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{progressPercentage}%</p>
                <p className="text-xs text-gray-500 mt-1">Collection completed</p>
              </div>
              <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <BsCheckCircle className="text-purple-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1 w-full">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search bins by ID, location, or waste type..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["all", "pending", "in-progress", "high"].map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                    activeFilter === filter
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                      : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                  }`}
                >
                  {filter === "all" ? "All" : filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
              <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                <FiFilter />
                <span>More</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        {viewMode === "map" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Map Container - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[350px] sm:h-[450px] lg:h-[600px] border border-emerald-100" style={{ zIndex: 0, position: "relative" }}>
                {typeof window !== 'undefined' && MapContainer ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={zoomLevel}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    style={{ zIndex: 0, position: "relative" }}
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Bin Markers */}
                    {assignedBins.map((bin) => (
                      <Marker 
                        key={bin.id} 
                        position={bin.coordinates}
                        icon={createTrashBinIcon(bin.fillStatus)}
                        eventHandlers={{
                          click: () => handleBinSelect(bin),
                        }}
                      >
                        <Popup className="custom-popup">
                          <div className="p-3 min-w-[250px]">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-3 h-3 rounded-full ${
                                bin.fillLevel >= 80 ? 'bg-red-500' : 
                                bin.fillLevel >= 50 ? 'bg-amber-500' : 'bg-green-500'
                              }`}></div>
                              <h3 className="font-bold text-gray-900">Bin #{bin.binId}</h3>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p><span className="font-semibold">Location:</span> {bin.location}</p>
                              <p><span className="font-semibold">Fill Level:</span> {bin.fillLevel}%</p>
                              <p><span className="font-semibold">Status:</span> 
                                <span className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                  bin.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                                  bin.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {bin.status.toUpperCase()}
                                </span>
                              </p>
                              <p><span className="font-semibold">Collection Time:</span> {bin.collectionTime}</p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                    
                    {/* Vehicle Marker */}
                    <Marker 
                      position={collectorData.vehicle.currentLocation}
                      icon={createVehicleIcon()}
                    >
                      <Popup>
                        <div className="p-3 min-w-[200px]">
                          <h3 className="font-bold text-gray-900 mb-2">Vehicle #{collectorData.vehicle.id}</h3>
                          <div className="space-y-1 text-sm">
                            <p><span className="font-semibold">Status:</span> {collectorData.vehicle.status}</p>
                            <p><span className="font-semibold">Fuel:</span> {collectorData.vehicle.fuel}%</p>
                            <p><span className="font-semibold">Speed:</span> {collectorData.vehicle.speed}</p>
                          </div>
                        </div>
                      </Popup>
                    </Marker>

                    <ZoomControl position="bottomright" />
                  </MapContainer>
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100">
                    <p className="text-gray-500">Loading map...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Side Panel - 1/3 width */}
            <div className="space-y-6">
              {/* Selected Bin Details */}
              {selectedBin ? (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Selected Bin</h3>
                    <button 
                      onClick={() => setSelectedBin(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900">Bin #{selectedBin.binId}</h4>
                        <p className="text-sm text-gray-600">{selectedBin.location}</p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getFillLevelColor(selectedBin.fillLevel)}`}>
                        {selectedBin.fillLevel}%
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500">Waste Type</p>
                        <p className="font-medium">{selectedBin.wasteType}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Priority</p>
                        <p className={`font-medium ${selectedBin.priority === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                          {selectedBin.priority.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="text-sm">{selectedBin.address}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Notes</p>
                      <p className="text-sm">{selectedBin.notes}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button 
                        onClick={() => handleStartNavigation(selectedBin)}
                        className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300"
                      >
                        <FiNavigation />
                        <span>Navigate</span>
                      </button>
                      {selectedBin.status === "pending" ? (
                        <button 
                          onClick={() => handleStartCollection(selectedBin.id)}
                          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-300"
                        >
                          <BsArrowRightCircle />
                          <span>Start</span>
                        </button>
                      ) : selectedBin.status === "in-progress" ? (
                        <button 
                          onClick={() => handleMarkComplete(selectedBin.id)}
                          className="flex items-center justify-center space-x-2 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-700 transition-colors duration-300"
                        >
                          <BsCheckCircle />
                          <span>Complete</span>
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                  <div className="text-center py-8">
                    <BsPinMapFill className="text-4xl text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Select a Bin</h3>
                    <p className="text-gray-600 text-sm">
                      Click on any bin marker on the map to view details and actions
                    </p>
                  </div>
                </div>
              )}

              {/* Vehicle Status */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Vehicle Status</h3>
                  <BsTruck className="text-2xl text-emerald-200" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Vehicle ID</span>
                    <span className="font-bold">{collectorData.vehicle.id}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Status</span>
                    <span className="font-bold flex items-center gap-2">
                      <div className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse"></div>
                      {collectorData.vehicle.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-100">Fuel Level</span>
                    <span className="font-bold">{collectorData.vehicle.fuel}%</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => navigate('/collector/tasks')}
                    className="w-full flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <BsListUl className="text-xl" />
                      <span>View All Tasks</span>
                    </div>
                    <FiChevronRight />
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="w-full flex items-center justify-between p-3 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <FiArrowLeft className="text-xl transform rotate-180" />
                      <span>Print Route</span>
                    </div>
                    <FiChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-emerald-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Bin ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Fill Level</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50">
                  {filteredBins.map((bin) => (
                    <tr key={bin.id} className="hover:bg-emerald-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">#{bin.binId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <BsGeoAlt className="text-emerald-600" />
                          <div>
                            <div className="font-medium">{bin.location}</div>
                            <div className="text-sm text-gray-500">{bin.collectionTime}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-20 h-2 bg-gray-200 rounded-full overflow-hidden`}>
                            <div 
                              className={`h-full ${
                                bin.fillLevel >= 80 ? 'bg-red-500' : 
                                bin.fillLevel >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${bin.fillLevel}%` }}
                            ></div>
                          </div>
                          <span className="font-semibold">{bin.fillLevel}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(bin.status)}`}>
                          {bin.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(bin.priority)}`}>
                          {bin.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleBinSelect(bin)}
                            className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors duration-300 text-sm"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleStartNavigation(bin)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-300 text-sm"
                          >
                            Navigate
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-emerald-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Map Legend</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-3 border-red-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-sm">High Fill Level (&gt;80%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-3 border-amber-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              </div>
              <span className="text-sm">Medium Fill Level (50-80%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full border-3 border-emerald-500 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <span className="text-sm">Low Fill Level (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 border-3 border-white"></div>
              <span className="text-sm">Your Vehicle</span>
            </div>
          </div>
        </div>
      </main>

      {/* SAME FOOTER AS ASSIGNED TASKS PAGE */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-emerald-200 py-8 text-center text-emerald-800 text-sm select-none flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center relative z-10 mt-12">
        <span className="font-semibold">© 2024 SweepOkhara. All rights reserved.</span>
        <div className="flex gap-6">
          <a href="#" className="underline hover:text-emerald-900 transition-colors duration-300 font-medium">
            Privacy Policy
          </a>
          <a href="#" className="underline hover:text-emerald-900 transition-colors duration-300 font-medium">
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
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
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

        /* Leaflet popup customization */
        :global(.leaflet-popup-content-wrapper) {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          border: 1px solid #e5e7eb;
        }

        :global(.leaflet-popup-tip) {
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

export default CollectorMapView;