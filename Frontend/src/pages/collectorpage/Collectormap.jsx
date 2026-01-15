import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft,
  FiFilter,
  FiChevronRight,
  FiMapPin,
  FiNavigation,
  FiHome,
  FiCalendar,
  FiLogOut,
  FiSearch
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
  BsGeoAlt
} from "react-icons/bs";
import { GiBroom, GiPathDistance } from "react-icons/gi";
import { MdOutlineDeleteSweep, MdMyLocation } from "react-icons/md";
import { TbRoute } from "react-icons/tb";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
    id: "TB1024",
    binId: "TB1024",
    location: "Mahendra Pul, Pokhara",
    coordinates: [28.2106, 83.9856],
    fillLevel: 95,
    status: "pending",
    priority: "high",
    wasteType: "General Waste",
    address: "Near Mahendra Pul Bridge, Ward No. 5",
    lastCollection: "2 days ago",
    collectionTime: "09:00 AM",
    notes: "Bin is overflowing, urgent collection needed"
  },
  {
    id: "TB1025",
    binId: "TB1025",
    location: "Lakeside, Pokhara",
    coordinates: [28.209, 83.9884],
    fillLevel: 55,
    status: "in-progress",
    priority: "medium",
    wasteType: "General Waste",
    address: "Lakeside Main Road, Opposite Hotel Bluebird",
    lastCollection: "1 day ago",
    collectionTime: "09:30 AM",
    notes: "Regular collection, accessible location"
  },
  {
    id: "TB1027",
    binId: "TB1027",
    location: "City Center, Pokhara",
    coordinates: [28.213, 83.983],
    fillLevel: 65,
    status: "pending",
    priority: "high",
    wasteType: "Organic Waste",
    address: "City Center Market, Near Bus Park",
    lastCollection: "12 hours ago",
    collectionTime: "10:15 AM",
    notes: "Organic waste - separate collection required"
  },
  {
    id: "TB1030",
    binId: "TB1030",
    location: "Baseline, Pokhara",
    coordinates: [28.2248, 83.9829],
    fillLevel: 45,
    status: "pending",
    priority: "medium",
    wasteType: "Recyclable Waste",
    address: "Baseline Road, Near Government Hospital",
    lastCollection: "6 hours ago",
    collectionTime: "11:00 AM",
    notes: "Plastic and paper recycling"
  },
  {
    id: "TB1032",
    binId: "TB1032",
    location: "Lakeside East, Pokhara",
    coordinates: [28.207, 83.986],
    fillLevel: 30,
    status: "pending",
    priority: "low",
    wasteType: "General Waste",
    address: "Lakeside East Residential Area",
    lastCollection: "3 hours ago",
    collectionTime: "11:45 AM",
    notes: "Regular collection, easy access"
  },
  {
    id: "TB1035",
    binId: "TB1035",
    location: "Tourist Area, Pokhara",
    coordinates: [28.211, 83.987],
    fillLevel: 80,
    status: "pending",
    priority: "high",
    wasteType: "Mixed Waste",
    address: "Tourist Street, Near Fewa Lake",
    lastCollection: "4 hours ago",
    collectionTime: "12:30 PM",
    notes: "High traffic area, morning collection preferred"
  }
];

const routePath = [
  [28.2106, 83.9856], // Start: Mahendra Pul
  [28.209, 83.9884],  // Lakeside
  [28.213, 83.983],   // City Center
  [28.2248, 83.9829], // Baseline
  [28.207, 83.986],   // Lakeside East
  [28.211, 83.987]    // Tourist Area (End)
];

// -------------------------
// CUSTOM MAP ICONS
// -------------------------
const createBinIcon = (fillLevel, status, priority) => {
  let color, animation = '';
  
  // Color based on fill level
  if (fillLevel >= 80) color = "#EF4444"; // Red
  else if (fillLevel >= 50) color = "#F59E0B"; // Amber
  else color = "#10B981"; // Green
  
  // Animation based on priority
  if (priority === "high") animation = 'animation: pulse 2s infinite;';
  if (status === "in-progress") animation = 'animation: bounce 1s infinite;';
  
  const svg = `
    <div style="
      background: white;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      border: 3px solid ${color};
      ${animation}
    ">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2">
        <rect x="3" y="6" width="18" height="14" rx="1" fill="white"/>
        <rect x="4" y="${20 - (fillLevel / 100 * 12)}" width="16" height="${fillLevel / 100 * 12}" fill="${color}" opacity="0.6"/>
        <rect x="2" y="4" width="20" height="2" rx="1" fill="${color}"/>
        <rect x="10" y="2" width="4" height="2" rx="1" fill="${color}"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svg,
    className: "custom-bin-icon",
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
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
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBin, setSelectedBin] = useState(null);
  const [viewMode, setViewMode] = useState("map"); // "map" or "list"
  const [userLocation, setUserLocation] = useState([28.2096, 83.9856]);
  const [mapCenter, setMapCenter] = useState([28.2096, 83.9856]);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [activeNav, setActiveNav] = useState("map");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <GiBroom className="text-emerald-600 text-4xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              SweepOkhara
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-sm font-semibold rounded-full border border-emerald-200">
              Collector
            </span>
          </div>

          {/* Navigation */}
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
                              activeNav === 'schedule' ? "w-4/5 left-1/10" : ""
                            }`}></span>
                          </button>
            
            <button className="relative px-6 py-2.5 rounded-xl text-emerald-700 font-semibold border border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/80 hover:shadow-lg transition-all duration-300 hover:scale-105 group">
              <div className="flex items-center space-x-2">
                <FiLogOut />
                <span>Logout</span>
              </div>
              <div className="absolute inset-0 bg-emerald-50/50 rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
            </button>
            
            {/* Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold">{collectorData.name}</p>
                <p className="text-xs text-gray-500">Vehicle: {collectorData.vehicle.id}</p>
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
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Collection Route Map
              </h1>
              <p className="text-gray-600 text-lg">
                Visualize your route and manage collection points in real-time
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Bins</p>
                <p className="text-3xl font-bold text-gray-900">{assignedBins.length}</p>
                <p className="text-xs text-gray-500 mt-1">In current route</p>
              </div>
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <BsFillTrashFill className="text-emerald-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{pendingBins.length}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting collection</p>
              </div>
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                <BsClock className="text-amber-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Route Distance</p>
                <p className="text-3xl font-bold text-gray-900">{collectorData.currentRoute.totalDistance}</p>
                <p className="text-xs text-gray-500 mt-1">Total coverage</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <GiPathDistance className="text-blue-600 text-2xl" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Progress</p>
                <p className="text-3xl font-bold text-gray-900">{progressPercentage}%</p>
                <p className="text-xs text-gray-500 mt-1">Collection completed</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <BsCheckCircle className="text-purple-600 text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
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
            
            <div className="flex space-x-2">
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
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[600px] border border-emerald-100">
                {typeof window !== 'undefined' && MapContainer ? (
                  <MapContainer
                    center={mapCenter}
                    zoom={zoomLevel}
                    scrollWheelZoom={false}
                    className="h-full w-full"
                    zoomControl={false}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    {/* Route Path */}
                    <Polyline
                      pathOptions={{
                        color: '#10B981',
                        weight: 4,
                        opacity: 0.7,
                        dashArray: '10, 10'
                      }}
                      positions={routePath}
                    />
                    
                    {/* Bin Markers */}
                    {assignedBins.map((bin) => (
                      <Marker 
                        key={bin.id} 
                        position={bin.coordinates}
                        icon={createBinIcon(bin.fillLevel, bin.status, bin.priority)}
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
                    onClick={() => setMapCenter(userLocation)}
                    className="w-full flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <MdMyLocation className="text-xl" />
                      <span>Go to My Location</span>
                    </div>
                    <FiChevronRight />
                  </button>
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
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-emerald-100">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Map Legend</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
      `}</style>
    </div>
  );
};

export default CollectorMapView;