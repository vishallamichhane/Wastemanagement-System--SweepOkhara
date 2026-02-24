import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GiBroom } from "react-icons/gi";
import {
  BsBell,
  BsEye,
  BsFilter,
  BsSearch,
  BsClock,
  BsCheckCircle,
  BsExclamationTriangle,
  BsArrowClockwise,
} from "react-icons/bs";
import { FiLogOut, FiChevronLeft } from "react-icons/fi";
import Header from "./components/Header";
import useScrollToTop from "../../hooks/useScrollToTop";
import axios from "axios";

const MyReports = () => {
  useScrollToTop();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusConfig = {
    received: {
      label: "Received",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      dotColor: "bg-blue-500",
    },
    "in-progress": {
      label: "In Progress",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
      dotColor: "bg-amber-500",
    },
    resolved: {
      label: "Resolved",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      dotColor: "bg-emerald-500",
    },
  };

  const priorityConfig = {
    high: { label: "High", color: "text-red-600", bgColor: "bg-red-100" },
    medium: {
      label: "Medium",
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    low: { label: "Low", color: "text-blue-600", bgColor: "bg-blue-100" },
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/reports/my-reports")
      .then((res) => {
        const refinedData = res.data.map((report) => ({
          id: report._id.slice(-6).toUpperCase(),
          date: new Date(report.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          issueType: report.reportLabel,
          status: report.status,
          description: report.description,
          location: report.location,
          latitude: report.latitude,
          longitude: report.longitude,
          assignedTo: report.assignedCollectorName || "Pending Assignment",
          ward: report.ward || "N/A",
          priority: report.priority || "medium",
          images: report.images ? report.images.length : 0,
          photos: report.images || [],
          contactName: report.contactName || "N/A",
          contactPhone: report.contactPhone || "N/A",
        }));
        setReports(refinedData);
        setFilteredReports(refinedData);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (report) =>
          report.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.id.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <BsCheckCircle className="text-emerald-500" />;
      case "in-progress":
        return <BsArrowClockwise className="text-amber-500" />;
      case "received":
        return <BsClock className="text-blue-500" />;
      default:
        return <BsExclamationTriangle className="text-gray-500" />;
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setSelectedReport(null);
  };

  return (
    <>
      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 w-full pb-20 sm:pb-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link
            to="/user"
            className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group"
          >
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Home</span>
          </Link>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            My Reports
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Track the status of all your submitted reports here.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          {[
            {
              label: "Total Reports",
              value: reports.length,
              color: "from-blue-500 to-cyan-500",
            },
            {
              label: "Resolved",
              value: reports.filter((r) => r.status === "resolved").length,
              color: "from-emerald-500 to-teal-500",
            },
            {
              label: "In Progress",
              value: reports.filter((r) => r.status === "in-progress").length,
              color: "from-amber-500 to-yellow-500",
            },
            {
              label: "Received",
              value: reports.filter((r) => r.status === "received").length,
              color: "from-purple-500 to-pink-500",
            },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl mb-3`}
              >
                {stat.value}
              </div>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Box */}
            <div className="relative flex-1 w-full">
              <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by ID, issue type, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <BsFilter className="text-emerald-600 text-lg" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
              >
                <option value="all">All Status</option>
                <option value="received">Received</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {loading ? (
            // Loading Skeleton
            <div className="p-8">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : filteredReports.length === 0 ? (
            // Empty State
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsExclamationTriangle className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No reports found
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <Link
                to="/user/report"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Report New Issue
              </Link>
            </div>
          ) : (
            <>
            {/* Mobile Card View */}
            <div className="block md:hidden divide-y divide-gray-200">
              {filteredReports.map((report, index) => (
                <div
                  key={report.id}
                  className="p-4 hover:bg-gray-50/50 transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg text-sm">
                      #{report.id}
                    </span>
                    <div
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${statusConfig[report.status].bgColor} ${statusConfig[report.status].color} font-medium`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusConfig[report.status].dotColor} animate-pulse`}
                      ></span>
                      {statusConfig[report.status].label}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{getIssueTypeIcon(report.issueType)}</span>
                    <span className="font-medium text-gray-700 text-sm">{report.issueType}</span>
                  </div>
                  <p className="text-gray-500 text-xs mb-1 truncate">{report.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400 text-xs">{report.date}</span>
                    <button
                      onClick={() => handleViewDetails(report)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold text-xs shadow hover:shadow-lg hover:scale-105 transition-all duration-300 transform"
                    >
                      <BsEye className="text-xs" />
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      REPORT ID
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      DATE
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      ISSUE TYPE
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      LOCATION
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      STATUS
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs lg:text-sm font-semibold text-gray-700">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr
                      key={report.id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/50 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 lg:px-3 py-1 rounded-lg text-sm">
                          #{report.id}
                        </span>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-600 font-medium text-sm">
                        {report.date}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {getIssueTypeIcon(report.issueType)}
                          </span>
                          <span className="font-medium text-gray-700 text-sm">
                            {report.issueType}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4 text-gray-600 max-w-xs truncate text-sm">
                        {report.location}
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${statusConfig[report.status].bgColor} ${statusConfig[report.status].color} font-medium`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${statusConfig[report.status].dotColor} animate-pulse`}
                          ></span>
                          {statusConfig[report.status].label}
                        </div>
                      </td>
                      <td className="px-4 lg:px-6 py-3 lg:py-4">
                        <button
                          onClick={() => handleViewDetails(report)}
                          className="inline-flex items-center gap-2 px-3 lg:px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform"
                        >
                          <BsEye className="text-sm" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <Link
            to="/user/report"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl sm:rounded-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 transform text-sm sm:text-base"
          >
            <span>+</span>
            Report New Issue
          </Link>
        </div>
      </main>

      {/* Report Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-fade-in-up">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 p-4 sm:p-6 flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="text-2xl sm:text-3xl">
                  {getIssueTypeIcon(selectedReport.issueType)}
                </span>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-white">
                    {selectedReport.issueType}
                  </h2>
                  <p className="text-emerald-100">
                    Report #{selectedReport.id}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-emerald-100 transition-colors text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Status
                  </p>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedReport.status)}
                    <span
                      className={`font-bold ${statusConfig[selectedReport.status].color}`}
                    >
                      {statusConfig[selectedReport.status].label}
                    </span>
                  </div>
                </div>
                <div
                  className={`rounded-xl p-4 border ${priorityConfig[selectedReport.priority].bgColor} bg-gradient-to-br`}
                >
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Priority
                  </p>
                  <span
                    className={`font-bold ${priorityConfig[selectedReport.priority].color}`}
                  >
                    {priorityConfig[selectedReport.priority].label}
                  </span>
                </div>
              </div>

              {/* Report Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    📍 Location
                  </p>
                  <p className="text-lg font-medium text-gray-800">
                    {selectedReport.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm font-semibold text-blue-600 mb-2">
                      🌐 Latitude
                    </p>
                    <p className="text-lg font-mono font-bold text-gray-800">
                      {selectedReport.latitude}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
                    <p className="text-sm font-semibold text-purple-600 mb-2">
                      🌐 Longitude
                    </p>
                    <p className="text-lg font-mono font-bold text-gray-800">
                      {selectedReport.longitude}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    📅 Report Date
                  </p>
                  <p className="text-lg font-medium text-gray-800">
                    {selectedReport.date}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    📝 Description
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedReport.description}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    🖼️ Attached Images
                  </p>
                  <p className="text-lg font-medium text-gray-800">
                    {selectedReport.images} image(s)
                  </p>
                  {selectedReport.images > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {selectedReport.photos.map((photo, index) => (
                          <div
                            key={index}
                            className="aspect-square overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-100"
                          >
                            <img
                              src={photo}
                              alt={`Report image ${index + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 italic">
                        * Photo preview feature coming soon
                      </p>
                    </div>
                  )}
                  {selectedReport.images === 0 && (
                    <p className="text-sm text-gray-500 mt-2 italic">
                      No images attached
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseModal}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced animations */}
      <style jsx>{`
        /* Floating background elements */
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(-3deg);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
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
      `}</style>
    </>
  );
};

// Helper function for issue type icons
const getIssueTypeIcon = (issueType) => {
  const icons = {
    "Overflowing Bin": "🗑️",
    "Missed Pickup": "🚛",
    "Illegal Dumping": "⚠️",
    "Damaged Bin": "🔧",
    "Street Litter": "🧹",
    "Other Issue": "❓",
  };
  return icons[issueType] || "📋";
};

export default MyReports;
