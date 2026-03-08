import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMapPin,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
  FiEye,
  FiX,
  FiSave,
  FiWifi,
  FiWifiOff
} from "react-icons/fi";
import { BsFillTrashFill, BsExclamationTriangle } from "react-icons/bs";

const binStatusConfig = {
  empty: { label: "Empty", color: "text-green-700", bg: "bg-green-100", progress: 10 },
  moderate: { label: "Moderate", color: "text-blue-700", bg: "bg-blue-100", progress: 50 },
  high: { label: "High", color: "text-amber-700", bg: "bg-amber-100", progress: 75 },
  full: { label: "Full", color: "text-red-700", bg: "bg-red-100", progress: 100 },
  maintenance: { label: "Maintenance", color: "text-gray-700", bg: "bg-gray-100", progress: 0 }
};

// ── Real bin data (same as MapOverview) ────────────────────────────────
const realBins = [
  {
    id: "TB1025",
    location: "Lakeside, Pokhara",
    ward: 5,
    coordinates: { lat: 28.2090, lng: 83.9596 },
    capacity: 55,
    binType: "General Waste",
    lastCollection: "1 day ago",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: false,
    lastUpdated: "Static data"
  },
  {
    id: "TB1026",
    location: "Baseline, Pokhara",
    ward: 10,
    coordinates: { lat: 28.2144, lng: 83.9851 },
    capacity: 20,
    binType: "Recyclable Waste",
    lastCollection: "6 hours ago",
    type: "Public",
    size: "120L",
    material: "Plastic",
    sensorInstalled: false,
    lastUpdated: "Static data"
  },
  {
    id: "TB1027",
    location: "City Center, Pokhara",
    ward: 8,
    coordinates: { lat: 28.2096, lng: 83.9896 },
    capacity: 65,
    binType: "Organic Waste",
    lastCollection: "12 hours ago",
    type: "Public",
    size: "240L",
    material: "Metal",
    sensorInstalled: false,
    lastUpdated: "Static data"
  },
  {
    id: "TB1028",
    location: "Lakeside East, Pokhara",
    ward: 5,
    coordinates: { lat: 28.2115, lng: 83.9650 },
    capacity: 10,
    binType: "General Waste",
    lastCollection: "3 hours ago",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: false,
    lastUpdated: "Static data"
  },
  {
    id: "TB1029",
    location: "Pokhara Engineering College",
    ward: 14,
    coordinates: { lat: 28.21118953908775, lng: 83.9771218979668 },
    capacity: 0,
    binType: "IoT Smart Bin",
    lastCollection: "Just now",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: true,
    lastUpdated: "Connecting…"
  },
];

// ── ESP32 CONFIG ───────────────────────────────────────────────────────
const ESP32_IP = "172.20.10.3";
const ESP32_BIN_ID = "TB1029";

// Helper: derive status string from capacity %
const getStatusFromCapacity = (capacity) => {
  if (capacity >= 90) return "full";
  if (capacity >= 60) return "high";
  if (capacity >= 30) return "moderate";
  return "empty";
};

const BinCard = ({ bin, onView, onEdit, onDelete }) => {
  const statusConfig = binStatusConfig[bin.status];
  const isEsp32 = bin.id === ESP32_BIN_ID;
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-bold text-gray-900">{bin.id}</h3>
            {bin.sensorInstalled && (
              <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-lg">
                📡 IoT Sensor
              </span>
            )}
            {isEsp32 && bin.isLive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full border border-green-200">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                LIVE
              </span>
            )}
            {isEsp32 && bin.isLive === false && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                OFFLINE
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FiMapPin size={14} />
            {bin.location}, Ward {bin.ward}
          </div>
        </div>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Capacity</span>
          <span className="font-semibold text-gray-900">{bin.capacity}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              bin.status === "full" ? "bg-red-500" :
              bin.status === "high" ? "bg-amber-500" :
              bin.status === "moderate" ? "bg-blue-500" :
              bin.status === "empty" ? "bg-green-500" :
              "bg-gray-400"
            }`}
            style={{ width: `${bin.capacity}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
        <div>
          <div className="text-gray-500 font-semibold uppercase mb-1">Last Collection</div>
          <div className="font-medium">{bin.lastCollection}</div>
        </div>
        <div>
          <div className="text-gray-500 font-semibold uppercase mb-1">Bin Type</div>
          <div className="font-medium">{bin.binType}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
        <div>
          <div className="text-gray-500 font-semibold uppercase mb-1">Size</div>
          <div className="font-medium">{bin.size}</div>
        </div>
        <div>
          <div className="text-gray-500 font-semibold uppercase mb-1">Material</div>
          <div className="font-medium">{bin.material}</div>
        </div>
      </div>

      {/* ESP32 distance row */}
      {isEsp32 && bin.distance != null && (
        <div className="text-xs bg-blue-50 text-blue-800 rounded-lg px-3 py-1.5 font-medium">
          📏 Sensor Distance: {bin.distance} cm
        </div>
      )}

      <div className="pt-2 border-t border-gray-100 flex gap-2">
        <button
          onClick={() => onView(bin.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm hover:bg-blue-100 transition"
        >
          <FiEye size={16} /> View
        </button>
        <button
          onClick={() => onEdit(bin.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition"
        >
          <FiEdit2 size={16} /> Edit
        </button>
        <button
          onClick={() => onDelete(bin.id)}
          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-700 font-semibold text-sm hover:bg-red-100 transition"
        >
          <FiTrash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const BinModal = ({ bin, onClose, onSave }) => {
  const [status, setStatus] = useState(bin?.status || "empty");
  const [capacity, setCapacity] = useState(bin?.capacity || 0);

  const handleSave = () => {
    onSave({ ...bin, status, capacity });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Edit Bin Status</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bin ID</label>
            <input type="text" value={bin?.id || ""} disabled className="w-full px-3 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="empty">Empty</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="full">Full</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Capacity Level: {capacity}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow hover:shadow-md transition"
          >
            <FiSave size={16} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

const BinManagement = () => {
  const [view, setView] = useState("grid");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBin, setSelectedBin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bins, setBins] = useState(() =>
    realBins.map((b) => ({ ...b, status: getStatusFromCapacity(b.capacity) }))
  );

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

  const prevBinStatusRef = useRef(null);
  const alertInProgressRef = useRef(false);

  // Poll ESP32 every 2.5s
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

        // ── Transition Detection: alerts ────────
        const isFull = fillStatus === "full";
        const prevStatus = prevBinStatusRef.current;

        if (prevStatus !== null && !alertInProgressRef.current) {
          const espBin = realBins.find((b) => b.id === ESP32_BIN_ID);
          const binLocation = espBin?.location || "Unknown";
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
            } catch (err) { console.error("Bin full alert error:", err); }
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
            } catch (err) { console.error("Bin emptied alert error:", err); }
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

  // Merge ESP32 live data into bins list
  const liveBins = useMemo(() => {
    return bins.map((bin) => {
      if (bin.id !== ESP32_BIN_ID) return bin;
      const pct = esp32Data.percentage;
      return {
        ...bin,
        capacity: pct,
        status: getStatusFromCapacity(pct),
        lastCollection: esp32Data.lastUpdated,
        binType: esp32Data.isLive ? "IoT Smart Bin (Live)" : bin.binType,
        lastUpdated: esp32Data.lastUpdated,
        isLive: esp32Data.isLive,
        distance: esp32Data.distance,
        esp32Status: esp32Data.status,
      };
    });
  }, [bins, esp32Data]);

  const filteredBins = useMemo(() => {
    return liveBins.filter((bin) => {
      const matchesSearch = bin.id.toLowerCase().includes(search.toLowerCase()) ||
        bin.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || bin.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, liveBins]);

  const stats = {
    total: liveBins.length,
    full: liveBins.filter((b) => b.status === "full").length,
    empty: liveBins.filter((b) => b.status === "empty").length,
    withSensor: liveBins.filter((b) => b.sensorInstalled).length
  };

  const handleEdit = (binId) => {
    const bin = liveBins.find((b) => b.id === binId);
    setSelectedBin(bin);
    setShowModal(true);
  };

  const handleSave = (updatedBin) => {
    const withStatus = { ...updatedBin, status: getStatusFromCapacity(updatedBin.capacity) };
    setBins(bins.map((b) => (b.id === withStatus.id ? withStatus : b)));
  };

  const handleDelete = (binId) => {
    if (window.confirm("Are you sure you want to delete this bin?")) {
      setBins(bins.filter((b) => b.id !== binId));
    }
  };

  const handleView = (binId) => {
    const bin = liveBins.find((b) => b.id === binId);
    setSelectedBin(bin);
    setShowModal(true);
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Bin Management</h1>
          <p className="text-gray-600">Monitor and manage waste bins across the city</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow hover:shadow-md transition">
          <FiPlus /> Add New Bin
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-600 font-semibold mb-1">Total Bins</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">Active across city</div>
        </div>
        <div className="bg-white border border-red-100 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-red-700 font-semibold mb-1">Full Bins</div>
          <div className="text-3xl font-bold text-red-700">{stats.full}</div>
          <div className="text-xs text-red-600 mt-1">Need emptying</div>
        </div>
        <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-green-700 font-semibold mb-1">Empty</div>
          <div className="text-3xl font-bold text-green-700">{stats.empty}</div>
          <div className="text-xs text-green-600 mt-1">Ready to collect</div>
        </div>
        <div className="bg-white border border-purple-100 rounded-xl p-4 shadow-sm">
          <div className="text-sm text-purple-700 font-semibold mb-1">With Sensors</div>
          <div className="text-3xl font-bold text-purple-700">{stats.withSensor}</div>
          <div className="text-xs text-purple-600 mt-1">Smart monitoring</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-2">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by bin ID or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <FiFilter className="absolute left-3 top-3 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
            >
              <option value="all">All status</option>
              <option value="empty">Empty</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="full">Full</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Showing {filteredBins.length} of {liveBins.length} bins</span>
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition ${view === "grid" ? "bg-white text-gray-900 shadow" : "text-gray-600"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 rounded text-sm font-semibold transition ${view === "table" ? "bg-white text-gray-900 shadow" : "text-gray-600"}`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {view === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBins.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <BsExclamationTriangle className="mx-auto text-3xl text-amber-500 mb-2" />
              <p className="text-gray-600">No bins match your filters.</p>
            </div>
          ) : (
            filteredBins.map((bin) => (
              <BinCard key={bin.id} bin={bin} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
            ))
          )}
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Bin ID</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Location</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Capacity</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700">Sensor</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBins.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                      No bins match your filters.
                    </td>
                  </tr>
                ) : (
                  filteredBins.map((bin) => {
                    const statusConfig = binStatusConfig[bin.status];
                    return (
                      <tr key={bin.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4 font-bold text-gray-900">
                          <div className="flex items-center gap-2">
                            {bin.id}
                            {bin.id === ESP32_BIN_ID && bin.isLive && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-bold bg-green-100 text-green-700 rounded-full">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                LIVE
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <FiMapPin size={16} className="text-gray-500" />
                            <span className="truncate max-w-xs block">{bin.location}, Ward {bin.ward}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-sm font-semibold text-gray-900">{bin.capacity}%</div>
                            <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  bin.status === "full" ? "bg-red-500" :
                                  bin.status === "high" ? "bg-amber-500" :
                                  bin.status === "moderate" ? "bg-blue-500" :
                                  bin.status === "empty" ? "bg-green-500" :
                                  "bg-gray-400"
                                }`}
                                style={{ width: `${bin.capacity}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{bin.binType}</td>
                        <td className="px-6 py-4">
                          {bin.sensorInstalled ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                              bin.isLive ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              📡 {bin.isLive ? 'Live' : 'Yes'}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleView(bin.id)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View"
                            >
                              <FiEye size={16} />
                            </button>
                            <button
                              onClick={() => handleEdit(bin.id)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Edit"
                            >
                              <FiEdit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(bin.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && <BinModal bin={selectedBin} onClose={() => { setShowModal(false); setSelectedBin(null); }} onSave={handleSave} />}

      {/* Info Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-900">
        <div className="flex gap-3">
          <span className="text-lg">📡</span>
          <div>
            <div className="font-semibold mb-1">Live IoT Sensor Active</div>
            <p>
              Bin <strong>{ESP32_BIN_ID}</strong> at Pokhara Engineering College (Ward 14) is connected to an ESP32 sensor.
              Its capacity updates automatically every 2.5 seconds.
              {esp32Data.isLive
                ? <span className="text-green-700 font-semibold"> Status: Online ✓</span>
                : <span className="text-red-600 font-semibold"> Status: Offline — cannot reach sensor at {ESP32_IP}</span>
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinManagement;
