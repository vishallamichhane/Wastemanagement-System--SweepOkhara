import React, { useState, useMemo } from "react";
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
  FiSave
} from "react-icons/fi";
import { BsFillTrashFill, BsExclamationTriangle } from "react-icons/bs";

const binStatusConfig = {
  empty: { label: "Empty", color: "text-green-700", bg: "bg-green-100", progress: 10 },
  moderate: { label: "Moderate", color: "text-blue-700", bg: "bg-blue-100", progress: 50 },
  high: { label: "High", color: "text-amber-700", bg: "bg-amber-100", progress: 75 },
  full: { label: "Full", color: "text-red-700", bg: "bg-red-100", progress: 100 },
  maintenance: { label: "Maintenance", color: "text-gray-700", bg: "bg-gray-100", progress: 0 }
};

const sampleBins = [
  {
    id: "BIN-001",
    location: "Lakeside Road, Ward 6",
    coordinates: { lat: 28.2096, lng: 83.9856 },
    status: "full",
    capacity: 95,
    lastEmptied: "2024-07-14",
    nextScheduled: "2024-07-15",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: false,
    lastUpdated: "2 hours ago"
  },
  {
    id: "BIN-002",
    location: "City Center, Ward 5",
    coordinates: { lat: 28.2050, lng: 83.9800 },
    status: "high",
    capacity: 78,
    lastEmptied: "2024-07-13",
    nextScheduled: "2024-07-16",
    type: "Public",
    size: "120L",
    material: "Plastic",
    sensorInstalled: true,
    lastUpdated: "5 minutes ago"
  },
  {
    id: "BIN-003",
    location: "Old Bazaar, Ward 1",
    coordinates: { lat: 28.2150, lng: 83.9700 },
    status: "moderate",
    capacity: 62,
    lastEmptied: "2024-07-12",
    nextScheduled: "2024-07-18",
    type: "Market",
    size: "240L",
    material: "Metal",
    sensorInstalled: false,
    lastUpdated: "30 minutes ago"
  },
  {
    id: "BIN-004",
    location: "New Road, Ward 2",
    coordinates: { lat: 28.2000, lng: 83.9850 },
    status: "empty",
    capacity: 15,
    lastEmptied: "2024-07-14",
    nextScheduled: "2024-07-20",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: true,
    lastUpdated: "10 minutes ago"
  },
  {
    id: "BIN-005",
    location: "Chipledhunga, Ward 3",
    coordinates: { lat: 28.2120, lng: 83.9750 },
    status: "full",
    capacity: 92,
    lastEmptied: "2024-07-10",
    nextScheduled: "2024-07-15",
    type: "Residential",
    size: "120L",
    material: "Plastic",
    sensorInstalled: false,
    lastUpdated: "1 hour ago"
  },
  {
    id: "BIN-006",
    location: "Birauta, Ward 8",
    coordinates: { lat: 28.1950, lng: 83.9900 },
    status: "moderate",
    capacity: 55,
    lastEmptied: "2024-07-13",
    nextScheduled: "2024-07-17",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: false,
    lastUpdated: "45 minutes ago"
  },
  {
    id: "BIN-007",
    location: "Seti River Bank, Ward 9",
    coordinates: { lat: 28.1900, lng: 83.9950 },
    status: "maintenance",
    capacity: 0,
    lastEmptied: "2024-07-08",
    nextScheduled: "2024-07-20",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: false,
    lastUpdated: "3 days ago"
  },
  {
    id: "BIN-008",
    location: "Tourist Info Center, Ward 4",
    coordinates: { lat: 28.2080, lng: 83.9780 },
    status: "high",
    capacity: 72,
    lastEmptied: "2024-07-11",
    nextScheduled: "2024-07-16",
    type: "Public",
    size: "120L",
    material: "Metal",
    sensorInstalled: true,
    lastUpdated: "8 minutes ago"
  }
];

const BinCard = ({ bin, onView, onEdit, onDelete }) => {
  const statusConfig = binStatusConfig[bin.status];
  
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-gray-900">{bin.id}</h3>
            {bin.sensorInstalled && (
              <span className="px-2 py-1 text-xs font-semibold bg-purple-100 text-purple-700 rounded-lg">
                📡 Sensor
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FiMapPin size={14} />
            {bin.location}
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
          <div className="text-gray-500 font-semibold uppercase mb-1">Last Emptied</div>
          <div className="font-medium">{bin.lastEmptied}</div>
        </div>
        <div>
          <div className="text-gray-500 font-semibold uppercase mb-1">Type</div>
          <div className="font-medium">{bin.type}</div>
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
  const [view, setView] = useState("grid"); // grid or table
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBin, setSelectedBin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bins, setBins] = useState(sampleBins);

  const filteredBins = useMemo(() => {
    return bins.filter((bin) => {
      const matchesSearch = bin.id.toLowerCase().includes(search.toLowerCase()) ||
        bin.location.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || bin.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, bins]);

  const stats = {
    total: bins.length,
    full: bins.filter((b) => b.status === "full").length,
    empty: bins.filter((b) => b.status === "empty").length,
    withSensor: bins.filter((b) => b.sensorInstalled).length
  };

  const handleEdit = (binId) => {
    const bin = bins.find((b) => b.id === binId);
    setSelectedBin(bin);
    setShowModal(true);
  };

  const handleSave = (updatedBin) => {
    setBins(bins.map((b) => (b.id === updatedBin.id ? updatedBin : b)));
  };

  const handleDelete = (binId) => {
    if (window.confirm("Are you sure you want to delete this bin?")) {
      setBins(bins.filter((b) => b.id !== binId));
    }
  };

  const handleView = (binId) => {
    const bin = bins.find((b) => b.id === binId);
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
          <span className="text-sm text-gray-600">Showing {filteredBins.length} of {bins.length} bins</span>
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
                        <td className="px-6 py-4 font-bold text-gray-900">{bin.id}</td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <FiMapPin size={16} className="text-gray-500" />
                            <span className="truncate max-w-xs block">{bin.location}</span>
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
                        <td className="px-6 py-4 text-gray-700">{bin.type}</td>
                        <td className="px-6 py-4">
                          {bin.sensorInstalled ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold">
                              📡 Yes
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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
        <div className="flex gap-3">
          <span className="text-lg">💡</span>
          <div>
            <div className="font-semibold mb-1">Sensor Integration Coming Soon</div>
            <p>Once you install IoT sensors in the bins, capacity levels will automatically update. Currently, you can manually adjust bin status for monitoring.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinManagement;
