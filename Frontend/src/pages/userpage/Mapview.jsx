import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BsBell, BsTruck, BsFillTrashFill, BsSortDown, BsMap, BsListUl } from "react-icons/bs";
import { FiLogOut, FiChevronLeft, FiSearch, FiPlus, FiFilter } from "react-icons/fi";
import { GiBroom } from "react-icons/gi";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useScrollToTop from '../../hooks/useScrollToTop';

// -------------------------
// ENHANCED VEHICLE SVG ICON
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
// ENHANCED TRASH BIN ICON
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
const trashBins = [
  { 
    id: "TB1024", 
    position: [28.2106, 83.9856], 
    fillStatus: "full", 
    binType: "General Waste", 
    lastCollection: "2 days ago", 
    location: "Mahendra Pul, Pokhara", 
    fillLevel: 95 
  },
  { 
    id: "TB1025", 
    position: [28.209, 83.9884], 
    fillStatus: "half", 
    binType: "General Waste", 
    lastCollection: "1 day ago", 
    location: "Lakeside, Pokhara", 
    fillLevel: 55 
  },
  { 
    id: "TB1026", 
    position: [28.2248, 83.9829], 
    fillStatus: "empty", 
    binType: "Recyclable Waste", 
    lastCollection: "6 hours ago", 
    location: "Baseline, Pokhara", 
    fillLevel: 20 
  },
  { 
    id: "TB1027", 
    position: [28.213, 83.983], 
    fillStatus: "half", 
    binType: "Organic Waste", 
    lastCollection: "12 hours ago", 
    location: "City Center, Pokhara", 
    fillLevel: 65 
  },
  { 
    id: "TB1028", 
    position: [28.207, 83.986], 
    fillStatus: "empty", 
    binType: "General Waste", 
    lastCollection: "3 hours ago", 
    location: "Lakeside East, Pokhara", 
    fillLevel: 10 
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

// -------------------------
// MAIN COMPONENT
// -------------------------
export default function MapStatusPage() {
  const [viewMode, setViewMode] = useState("map");
  const [dynamicTrashBins, setDynamicTrashBins] = useState([]);
  const [dynamicVehicles, setDynamicVehicles] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter data based on search
  const filteredListData = [
    ...trashBins.map(bin => ({
      id: `Trash Bin #${bin.id}`,
      type: "Trash Bin",
      location: bin.location,
      status: bin.fillLevel,
      lastUpdated: bin.lastCollection,
      fillStatus: bin.fillStatus,
    })),
    ...vehicles.map(vehicle => ({
      id: `Vehicle #${vehicle.id}`,
      type: "Vehicle",
      location: vehicle.location,
      status: vehicle.status === "active" ? "Active" : "Idle",
      lastUpdated: vehicle.lastUpdated,
    })),
  ].filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (typeof status === "number") {
      if (status <= 30) return "text-green-600 bg-green-100";
      if (status <= 70) return "text-yellow-600 bg-yellow-100";
      return "text-red-600 bg-red-100";
    }
    return status === "Active" ? "text-green-600 bg-green-100" : "text-gray-600 bg-gray-100";
  };

  const renderStatus = (item) => {
    if (item.type === "Trash Bin") {
      return (
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(item.status)}`}>
            {item.status}% Full
          </div>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
            item.status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
            {item.status}
          </div>
        </div>
      );
    }
  };

  return (
    <>

      {/* Content */}
      <main className="flex-grow mx-auto p-6 w-full max-w-7xl flex flex-col">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/user" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group">
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Home</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2">
                {viewMode === "map" ? "Live Asset Map" : "Asset Overview"}
              </h1>
              <p className="text-gray-600 text-lg">
                {viewMode === "map" 
                  ? "Real-time tracking of waste collection vehicles and trash bin status across Pokhara" 
                  : "Comprehensive overview of all waste management assets and their current status"}
              </p>
            </div>
            
            {/* View Toggle Buttons */}
            <div className="flex space-x-3 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-emerald-100">
              <button
                onClick={() => setViewMode("map")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "map"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <BsMap className="text-lg" />
                Map View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                    : "text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <BsListUl className="text-lg" />
                List View
              </button>
            </div>
          </div>
        </div>

        {/* MAP OR LIST */}
        {viewMode === "map" ? (
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-emerald-200 flex-grow bg-white/80 backdrop-blur-sm relative" style={{ height: "70vh", zIndex: 0, position: "relative" }}>
            <MapContainer
              center={[28.2096, 83.9856]}
              zoom={14}
              scrollWheelZoom={false}
              className="h-full w-full rounded-3xl"
              zoomControl={false}
              style={{ zIndex: 0, position: "relative" }}
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
        ) : (
          <>
            {/* Search and Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 min-w-0 w-full sm:max-w-md">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input 
                  type="text" 
                  placeholder="Search assets by ID, location, or type..." 
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-2xl hover:bg-gray-50 transition-colors duration-300 bg-white/80 backdrop-blur-sm">
                <FiFilter className="text-lg" />
                <span>Filters</span>
              </button>
            </div>

            {/* List Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden border border-emerald-100">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-50 to-teal-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Asset</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Last Updated</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200/50">
                    {filteredListData.map((item, index) => (
                      <tr key={index} className="hover:bg-emerald-50/50 transition-colors duration-200 group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              item.type === "Trash Bin" 
                                ? "bg-emerald-100 text-emerald-600" 
                                : "bg-blue-100 text-blue-600"
                            }`}>
                              {item.type === "Trash Bin" ? <BsFillTrashFill /> : <BsTruck />}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{item.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.type === "Trash Bin" 
                              ? "bg-purple-100 text-purple-800" 
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {item.type}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700 max-w-xs truncate">{item.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStatus(item)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.lastUpdated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Enhanced animations */}
      <style jsx>{`
        /* Floating background elements */
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
        
        .animation-delay-2000 {
          animation-delay: 2s;
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
    </>
  );
}