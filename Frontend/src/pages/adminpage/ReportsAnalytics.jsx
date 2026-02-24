import React, { useMemo, useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiMapPin,
  FiEye,
  FiArrowRight,
  FiRefreshCw,
} from "react-icons/fi";
import {
  BsCheckCircle,
  BsExclamationTriangle,
  BsArrowClockwise,
  BsClock,
} from "react-icons/bs";
import axios from "axios";

const statusConfig = {
  received: {
    label: "Received",
    color: "text-blue-700",
    bg: "bg-blue-100",
    icon: BsClock,
  },
  "in-progress": {
    label: "In Progress",
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: BsArrowClockwise,
  },
  resolved: {
    label: "Resolved",
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: BsCheckCircle,
  },
};

const priorityConfig = {
  high: { label: "High", color: "text-red-700", bg: "bg-red-100" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-100" },
  low: { label: "Low", color: "text-blue-700", bg: "bg-blue-100" },
};

const ReportsTable = ({ reports, onView }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Report ID
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Issue
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Location
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Ward
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Priority
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Reported By
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Assigned
              </th>
              <th className="text-right px-6 py-4 font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <BsExclamationTriangle className="mx-auto text-2xl mb-2 text-amber-500" />
                  No reports match the filters.
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const StatusIcon = statusConfig[report.status]?.icon || BsClock;
                return (
                  <tr
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                    key={report.id}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {report.id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {report.issueType}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-gray-500 flex-shrink-0" />
                        <span className="truncate max-w-xs block">
                          {report.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                        Ward {report.ward}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[report.status]?.bg || "bg-gray-100"} ${statusConfig[report.status]?.color || "text-gray-700"}`}
                      >
                        <StatusIcon size={14} />{" "}
                        {statusConfig[report.status]?.label || report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[report.priority]?.bg || "bg-gray-100"} ${priorityConfig[report.priority]?.color || "text-gray-700"}`}
                      >
                        {priorityConfig[report.priority]?.label || report.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {report.reportedBy}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {report.assignedTo}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                        onClick={() => onView(report)}
                      >
                        <FiEye />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsAnalytics = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [modalReport, setModalReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/admin/reports");
      setReports(
        (res.data || []).map((r) => ({
          id: r._id.slice(-6).toUpperCase(),
          fullId: r._id,
          date: new Date(r.createdAt).toISOString().split("T")[0],
          issueType: r.reportLabel,
          status: r.status,
          location: r.location,
          ward: r.ward || "N/A",
          latitude: r.latitude,
          longitude: r.longitude,
          assignedTo: r.assignedCollectorName || "No Collector Assigned",
          assignedCollectorId: r.assignedCollectorId || null,
          assignedVehicleId: r.assignedVehicleId || null,
          priority: r.priority,
          description: r.description,
          images: r.images ? r.images.length : 0,
          photos: r.images || [],
          reportedBy: r.userName || "Unknown User",
          reportedByEmail: r.userEmail || "",
        }))
      );
    } catch (err) {
      console.error("Failed to fetch reports:", err);
      setError("Failed to load reports. Please try again.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch =
        r.issueType?.toLowerCase()?.includes(search.toLowerCase()) ||
        r.location?.toLowerCase()?.includes(search.toLowerCase()) ||
        r.id?.toLowerCase()?.includes(search.toLowerCase()) ||
        r.ward?.toString()?.includes(search.toLowerCase()) ||
        r.assignedTo?.toLowerCase()?.includes(search.toLowerCase()) ||
        r.reportedBy?.toLowerCase()?.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesPriority =
        priorityFilter === "all" || r.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, statusFilter, priorityFilter, reports]);

  const handleExport = () => {
    const rows = [
      [
        "Report ID",
        "Issue",
        "Status",
        "Priority",
        "Location",
        "Ward",
        "Reported By",
        "Assigned Collector",
        "Collector ID",
        "Vehicle ID",
        "Date",
      ],
      ...filteredReports.map((r) => [
        r.id,
        r.issueType,
        r.status,
        r.priority,
        `"${r.location}"`,
        r.ward,
        r.reportedBy,
        r.assignedTo,
        r.assignedCollectorId || "N/A",
        r.assignedVehicleId || "N/A",
        r.date,
      ]),
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports.csv";
    a.click();
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Reports</h1>
          <p className="text-gray-600">
            View and manage user-reported issues from the database.
          </p>
        </div>
        <button
          onClick={fetchReports}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm font-medium text-sm transition"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-gray-600">Loading reports...</span>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <BsExclamationTriangle className="mx-auto text-3xl text-red-500 mb-2" />
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchReports}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Reports Content */}
      {!loading && !error && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, issue, location, ward, assignee, reporter..."
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
                  <option value="received">Received</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="relative">
                <FiFilter className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                >
                  <option value="all">All priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredReports.length} of {reports.length} reports
              </span>
            </div>
          </div>

          {/* Reports Table */}
          <ReportsTable reports={filteredReports} onView={setModalReport} />
        </div>
      )}

      {/* Report Detail Modal */}
      {modalReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setModalReport(null)}
          />
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl animate-slide-up border border-gray-100">
            <div className="sticky top-0 bg-white/95 backdrop-blur px-5 py-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold text-emerald-700">
                  {modalReport.issueType}
                </span>
                <div>
                  <p className="text-xs text-gray-500">
                    Report #{modalReport.id}
                  </p>
                  <p className="text-sm font-semibold text-gray-800">
                    {modalReport.location}
                  </p>
                </div>
              </div>
              <button
                className="text-gray-500 hover:text-gray-800 text-2xl font-bold leading-none"
                onClick={() => setModalReport(null)}
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Reported By */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
                  👤 Reported By
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {modalReport.reportedBy}
                </p>
                {modalReport.reportedByEmail && (
                  <p className="text-xs text-gray-600 mt-1">
                    {modalReport.reportedByEmail}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    📍 Location
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {modalReport.location}
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-600 uppercase mb-1">
                    🏘️ Ward
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    Ward {modalReport.ward}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-1">
                    🌐 Latitude
                  </p>
                  <p className="text-sm font-mono font-bold text-gray-800">
                    {modalReport.latitude}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <p className="text-xs font-semibold text-purple-600 uppercase mb-1">
                    🌐 Longitude
                  </p>
                  <p className="text-sm font-mono font-bold text-gray-800">
                    {modalReport.longitude}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    📅 Report Date
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {modalReport.date}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    ⚡ Priority
                  </p>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[modalReport.priority]?.bg || "bg-gray-100"} ${priorityConfig[modalReport.priority]?.color || "text-gray-700"}`}
                  >
                    {priorityConfig[modalReport.priority]?.label ||
                      modalReport.priority}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                  📝 Description
                </p>
                <p className="text-sm text-gray-800 leading-relaxed">
                  {modalReport.description}
                </p>
              </div>

              {/* Assigned Collector Information */}
              <div
                className={`rounded-xl p-4 border ${modalReport.assignedCollectorId ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}
              >
                <p className="text-xs font-semibold uppercase mb-2 flex items-center gap-2">
                  {modalReport.assignedCollectorId ? (
                    <span className="text-emerald-600">
                      ✅ Assigned Collector
                    </span>
                  ) : (
                    <span className="text-amber-600">
                      ⚠️ No Collector Assigned
                    </span>
                  )}
                </p>
                {modalReport.assignedCollectorId ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-gray-600">Collector Name</p>
                      <p className="text-sm font-bold text-gray-800">
                        {modalReport.assignedTo}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Collector ID</p>
                      <p className="text-sm font-mono font-semibold text-emerald-700">
                        {modalReport.assignedCollectorId}
                      </p>
                    </div>
                    {modalReport.assignedVehicleId && (
                      <div>
                        <p className="text-xs text-gray-600">Vehicle ID</p>
                        <p className="text-sm font-mono font-semibold text-blue-700">
                          {modalReport.assignedVehicleId}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-amber-700">
                    No collector is currently assigned to this ward. Please
                    assign manually or check collector availability for Ward{" "}
                    {modalReport.ward}.
                  </p>
                )}
              </div>

              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                  🖼️ Attached Images
                </p>
                <p className="text-sm font-medium text-gray-800 mb-2">
                  {modalReport.images} image(s)
                </p>
                {modalReport.images > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      {modalReport.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <img
                            src={photo}
                            alt={`Report ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {modalReport.images === 0 && (
                  <p className="text-xs text-gray-500 italic">
                    No images attached
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
                  onClick={() => setModalReport(null)}
                >
                  Close
                </button>
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-transform"
                  onClick={() =>
                    console.log(
                      `Assign report ${modalReport.id} to collector`
                    )
                  }
                >
                  <FiArrowRight className="text-sm" />
                  Assign to Collector
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 180ms ease-out; }
        .animate-slide-up { animation: slide-up 220ms ease-out; }
      `}</style>
    </div>
  );
};

export default ReportsAnalytics;
