import React, { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiMapPin, FiTrendingUp } from "react-icons/fi";
import { BsMap, BsListUl, BsFillTrashFill, BsTruck } from "react-icons/bs";
import { MapContainer, TileLayer, Marker, Popup, Polyline, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import useScrollToTop from "../../hooks/useScrollToTop";

// -------------------------
// CUSTOM MAP ICONS
// -------------------------
const createTrashBinIcon = (fillStatus) => {
  let color, fillLevel, animation;

  switch (fillStatus) {
    case "full":
      color = "#EF4444";
      fillLevel = "85%";
      animation = "animation: bounce 1s infinite;";
      break;
    case "half":
      color = "#F59E0B";
      fillLevel = "50%";
      animation = "";
      break;
    case "empty":
    default:
      color = "#10B981";
      fillLevel = "15%";
      animation = "";
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

const createVehicleIcon = (status = "active") => {
  const color = status === "active" ? "#10B981" : "#6B7280";
  const gradientStart = status === "active" ? "#10B981" : "#9CA3AF";
  const gradientEnd = status === "active" ? "#059669" : "#6B7280";
  const animation = status === "active" ? "animation: pulse 2s infinite;" : "";

  const svg = `
    <div style="
      background: linear-gradient(135deg, ${gradientStart}, ${gradientEnd});
      border-radius: 50%;
      padding: 12px;
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
      border: 3px solid white;
      ${animation}
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
// SAMPLE DATA
// -------------------------
const trashBins = [
  {
    id: "TB1025",
    position: [28.209, 83.9596],
    fillStatus: "half",
    binType: "General Waste",
    lastCollection: "1 day ago",
    location: "Lakeside, Pokhara",
    fillLevel: 55,
  },
  {
    id: "TB1026",
    position: [28.2144, 83.9851],
    fillStatus: "empty",
    binType: "Recyclable Waste",
    lastCollection: "6 hours ago",
    location: "Baseline, Pokhara",
    fillLevel: 20,
  },
  {
    id: "TB1027",
    position: [28.2096, 83.9896],
    fillStatus: "half",
    binType: "Organic Waste",
    lastCollection: "12 hours ago",
    location: "City Center, Pokhara",
    fillLevel: 65,
  },
  {
    id: "TB1028",
    position: [28.2115, 83.965],
    fillStatus: "empty",
    binType: "General Waste",
    lastCollection: "3 hours ago",
    location: "Lakeside East, Pokhara",
    fillLevel: 10,
  },
  {
    id: "TB1029",
    position: [28.2111895, 83.9771218],
    fillStatus: "empty",
    binType: "Smart Bin (Demo)",
    lastCollection: "Just now",
    location: "Pokhara Engineering College",
    fillLevel: 0,
  },
];

const vehicles = [
  {
    id: "V001",
    position: [28.212, 83.984],
    status: "active",
    driver: "John Doe",
    location: "Route 1 - Mahendra Pul",
    speed: "25 km/h",
    fuel: 78,
  },
  {
    id: "V002",
    position: [28.208, 83.987],
    status: "inactive",
    driver: "Jane Smith",
    location: "Route 2 - Lakeside Area",
    speed: "0 km/h",
    fuel: 65,
  },
];

const routePaths = [
  [
    [28.209, 83.9596],
    [28.2144, 83.9851],
    [28.2096, 83.9896],
    [28.2115, 83.965],
    [28.2111895, 83.9771218],
  ],
];

// -------------------------
// STATS CARD COMPONENT
// -------------------------
const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    red: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="text-xl" />
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

// -------------------------
// MAIN COMPONENT
// -------------------------
export default function AdminMapOverview() {
  useScrollToTop();
  const [viewMode, setViewMode] = useState("map");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedMarker, setSelectedMarker] = useState(null);

  // Filter data
  const filteredBins = trashBins.filter((bin) => {
    if (filterType === "all") return true;
    if (filterType === "full") return bin.fillStatus === "full";
    if (filterType === "half") return bin.fillStatus === "half";
    if (filterType === "empty") return bin.fillStatus === "empty";
    return true;
  }).filter(
    (bin) =>
      bin.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bin.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vehicle.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const totalBins = trashBins.length;
  const fullBins = trashBins.filter((b) => b.fillStatus === "full").length;
  const activeBins = trashBins.filter((b) => b.fillStatus !== "empty").length;
  const activeVehicles = vehicles.filter((v) => v.status === "active").length;

  const getFillStatusColor = (status) => {
    switch (status) {
      case "full":
        return "bg-red-100 text-red-800";
      case "half":
        return "bg-amber-100 text-amber-800";
      case "empty":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Map Overview</h1>
        <p className="text-gray-600">
          Real-time tracking of all waste collection vehicles and trash bin status across Pokhara
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={BsFillTrashFill}
          label="Total Bins"
          value={totalBins}
          color="blue"
        />
        <StatsCard icon={FiTrendingUp} label="Full Bins" value={fullBins} color="red" />
        <StatsCard
          icon={BsFillTrashFill}
          label="Active Bins"
          value={activeBins}
          color="amber"
        />
        <StatsCard
          icon={BsTruck}
          label="Active Vehicles"
          value={activeVehicles}
          color="emerald"
        />
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative col-span-2">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search bins, vehicles, locations..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          >
            <option value="all">All Bins</option>
            <option value="full">Full Bins</option>
            <option value="half">Half Full</option>
            <option value="empty">Empty Bins</option>
          </select>

          {/* View Toggle */}
          <div className="flex space-x-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode("map")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                viewMode === "map"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-600 hover:text-emerald-700"
              }`}
            >
              <BsMap className="text-lg" />
              Map
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm ${
                viewMode === "list"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-600 hover:text-emerald-700"
              }`}
            >
              <BsListUl className="text-lg" />
              List
            </button>
          </div>
        </div>
      </div>

      {/* Map or List View */}
      {viewMode === "map" ? (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100" style={{ height: "65vh" }}>
          <MapContainer
            center={[28.2096, 83.9856]}
            zoom={14}
            scrollWheelZoom={true}
            className="h-full w-full"
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ZoomControl position="bottomright" />

            {/* Route Lines */}
            {routePaths.map((path, idx) => (
              <Polyline
                key={`route-${idx}`}
                positions={path}
                color="#10B981"
                weight={3}
                opacity={0.5}
                dashArray="10, 5"
              />
            ))}

            {/* Trash Bins */}
            {filteredBins.map((bin) => (
              <Marker
                key={`bin-${bin.id}`}
                position={bin.position}
                icon={createTrashBinIcon(bin.fillStatus)}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: "bin", data: bin }),
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <h3 className="font-bold text-gray-900 mb-2">{bin.id}</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-gray-700">Location:</span>{" "}
                        {bin.location}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Type:</span>{" "}
                        {bin.binType}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Fill Level:</span>{" "}
                        <span className={`px-2 py-1 rounded font-semibold ${getFillStatusColor(bin.fillStatus)}`}>
                          {bin.fillLevel}%
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Last Collection:</span>{" "}
                        {bin.lastCollection}
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Vehicles */}
            {filteredVehicles.map((vehicle) => (
              <Marker
                key={`vehicle-${vehicle.id}`}
                position={vehicle.position}
                icon={createVehicleIcon(vehicle.status)}
                eventHandlers={{
                  click: () => setSelectedMarker({ type: "vehicle", data: vehicle }),
                }}
              >
                <Popup>
                  <div className="p-3 min-w-[250px]">
                    <h3 className="font-bold text-gray-900 mb-2">{vehicle.id}</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-gray-700">Driver:</span>{" "}
                        {vehicle.driver}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Route:</span>{" "}
                        {vehicle.location}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded font-semibold text-xs ${
                            vehicle.status === "active"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {vehicle.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Speed:</span>{" "}
                        {vehicle.speed}
                      </p>
                      <p>
                        <span className="font-semibold text-gray-700">Fuel:</span>{" "}
                        <span className="font-semibold text-blue-600">{vehicle.fuel}%</span>
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Trash Bins List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <BsFillTrashFill /> Trash Bins ({filteredBins.length})
              </h2>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
              {filteredBins.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No bins match your search</p>
                </div>
              ) : (
                filteredBins.map((bin) => (
                  <div
                    key={bin.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{bin.id}</h3>
                        <p className="text-sm text-gray-600 mt-1">{bin.location}</p>
                        <p className="text-xs text-gray-500 mt-1">{bin.binType}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getFillStatusColor(
                          bin.fillStatus
                        )}`}
                      >
                        {bin.fillLevel}%
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-600">
                      <p>Last collection: {bin.lastCollection}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Vehicles List */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <BsTruck /> Vehicles ({filteredVehicles.length})
              </h2>
            </div>
            <div className="overflow-y-auto max-h-[500px]">
              {filteredVehicles.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No vehicles match your search</p>
                </div>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900">{vehicle.id}</h3>
                        <p className="text-sm text-gray-600 mt-1">{vehicle.driver}</p>
                        <p className="text-xs text-gray-500 mt-1">{vehicle.location}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${
                          vehicle.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {vehicle.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-gray-600 space-y-1">
                      <p>Speed: <span className="font-semibold">{vehicle.speed}</span></p>
                      <p>Fuel: <span className="font-semibold text-blue-600">{vehicle.fuel}%</span></p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .custom-vehicle-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }

        .custom-trashbin-icon {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
        }
      `}</style>
    </div>
  );
}
