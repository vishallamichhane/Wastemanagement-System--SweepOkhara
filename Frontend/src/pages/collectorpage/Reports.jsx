import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GiBroom } from 'react-icons/gi';
import { BsBell, BsEye, BsFilter, BsSearch, BsClock, BsCheckCircle, BsExclamationTriangle, BsArrowClockwise, BsPinMap, BsImage, BsFile, BsPlay } from 'react-icons/bs';
import { FiLogOut, FiChevronLeft, FiHome, FiCalendar, FiDownload, FiUser, FiSettings } from 'react-icons/fi';
import useScrollToTop from '../../hooks/useScrollToTop';
import CollectorNotificationCenter from './components/CollectorNotificationCenter';

const CollectorReports = () => {
  useScrollToTop();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeNav, setActiveNav] = useState('reports');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sample reports assigned to collector from users
  const sampleReports = [
    {
      id: '803F9A',
      date: 'July 15, 2024',
      issueType: 'Overflowing Bin',
      status: 'pending',
      description: 'Public bin near Lakeside overflowing with tourist waste',
      location: 'Lakeside Road, Pokhara-6',
      coordinates: [28.2090, 83.9596],
      priority: 'high',
      reportedBy: 'Rama Sharma',
      assignedDate: 'July 16, 2024',
      media: [
        { type: 'image', name: 'overflow_bin_1.jpg', url: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=500' },
        { type: 'image', name: 'overflow_bin_2.jpg', url: 'https://images.unsplash.com/photo-1559976615-cd4628902249?w=500' }
      ]
    },
    {
      id: '48168C',
      date: 'July 12, 2024',
      issueType: 'Missed Pickup',
      status: 'in-progress',
      description: 'Regular waste pickup missed in residential area',
      location: 'Birauta, Pokhara-8',
      coordinates: [28.2115, 83.9650],
      priority: 'high',
      reportedBy: 'Priya Patel',
      assignedDate: 'July 13, 2024',
      media: [
        { type: 'image', name: 'missed_pickup.jpg', url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a7a8?w=500' }
      ]
    },
    {
      id: 'E2H5K7',
      date: 'July 11, 2024',
      issueType: 'Illegal Dumping',
      status: 'pending',
      description: 'Construction waste dumped illegally near riverbank',
      location: 'Seti River Bank, Pokhara-9',
      coordinates: [28.2144, 83.9851],
      priority: 'high',
      reportedBy: 'Deepak Thapa',
      assignedDate: 'July 12, 2024',
      media: [
        { type: 'image', name: 'dump_site_1.jpg', url: 'https://images.unsplash.com/photo-1532996122724-8f3c2cd83c5d?w=500' },
        { type: 'image', name: 'dump_site_2.jpg', url: 'https://images.unsplash.com/photo-1505994278828-cd271d694d30?w=500' },
        { type: 'image', name: 'dump_site_3.jpg', url: 'https://images.unsplash.com/photo-1542601906960-ba2006ce398f?w=500' },
        { type: 'file', name: 'survey_report.pdf', url: '#' }
      ]
    },
    {
      id: '9F632N',
      date: 'July 05, 2024',
      issueType: 'Damaged Bin',
      status: 'completed',
      description: 'Public bin damaged and needs replacement',
      location: 'City Center, Pokhara-3',
      coordinates: [28.2096, 83.9896],
      priority: 'medium',
      reportedBy: 'Anita Sharma',
      assignedDate: 'July 6, 2024',
      media: [
        { type: 'image', name: 'damaged_bin.jpg', url: 'https://images.unsplash.com/photo-1559772212-ad4a9c0ef4b5?w=500' }
      ]
    },
    {
      id: '1C3P8Q',
      date: 'June 28, 2024',
      issueType: 'Overflowing Bin',
      status: 'completed',
      description: 'Market area bin overflowing during peak hours',
      location: 'Old Bazaar, Pokhara-1',
      coordinates: [28.21118953908775, 83.9771218979668],
      priority: 'high',
      reportedBy: 'Mohan Singh',
      assignedDate: 'June 29, 2024',
      media: [
        { type: 'image', name: 'market_overflow_1.jpg', url: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=500' },
        { type: 'image', name: 'market_overflow_2.jpg', url: 'https://images.unsplash.com/photo-1559976615-cd4628902249?w=500' },
        { type: 'video', name: 'overflow_video.mp4', url: '#' }
      ]
    },
    {
      id: '7D4G2M',
      date: 'June 25, 2024',
      issueType: 'Street Litter',
      status: 'in-progress',
      description: 'Accumulated litter on main street',
      location: 'New Road, Pokhara-2',
      coordinates: [28.2106, 83.9856],
      priority: 'medium',
      reportedBy: 'Sunita Gupta',
      assignedDate: 'June 26, 2024',
      media: []
    }
  ];

  const statusConfig = {
    'pending': { label: 'Pending', color: 'text-blue-600', bgColor: 'bg-blue-100', dotColor: 'bg-blue-500' },
    'in-progress': { label: 'In Progress', color: 'text-amber-600', bgColor: 'bg-amber-100', dotColor: 'bg-amber-500' },
    'completed': { label: 'Completed', color: 'text-emerald-600', bgColor: 'bg-emerald-100', dotColor: 'bg-emerald-500' }
  };

  const priorityConfig = {
    'high': { label: 'High', color: 'text-red-600', bgColor: 'bg-red-100' },
    'medium': { label: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    'low': { label: 'Low', color: 'text-blue-600', bgColor: 'bg-blue-100' }
  };

  useEffect(() => {
    setTimeout(() => {
      setReports(sampleReports);
      setFilteredReports(sampleReports);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, reports]);

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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileDropdown(false);
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <BsCheckCircle className="text-emerald-500" />;
      case 'in-progress':
        return <BsArrowClockwise className="text-amber-500" />;
      case 'pending':
        return <BsClock className="text-blue-500" />;
      default:
        return <BsExclamationTriangle className="text-gray-500" />;
    }
  };

  const handleStatusUpdate = (reportId, newStatus) => {
    const updatedReports = reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    );
    setReports(updatedReports);
    setSelectedReport(updatedReports.find(r => r.id === reportId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 text-gray-900 flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float-slow"></div>
        <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full mix-blend-multiply filter blur-3xl animate-float-medium"></div>
      </div>

      {/* Enhanced Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 transform ${
        isNavVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-emerald-100' 
          : 'bg-gradient-to-r from-white/95 to-emerald-50/95 backdrop-blur-xl shadow-lg'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 lg:px-10 py-4">
          {/* Left: Logo */}
          <Link to="/collector/dashboard" className="transform hover:scale-105 transition-transform duration-300">
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

            <button
              onClick={() => setActiveNav('reports')}
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
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow mx-auto p-6 w-full max-w-7xl flex flex-col mt-24">
        {/* Header Section */}
        <div className="mb-8">
          <Link to="/collector/dashboard" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group">
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-2">
                Assigned Reports
              </h1>
              <p className="text-gray-600 text-lg">
                Manage waste management reports assigned to you by the admin
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-semibold text-sm">
                Total: {reports.length}
              </div>
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold text-sm">
                Pending: {reports.filter(r => r.status === 'pending').length}
              </div>
              <div className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold text-sm">
                In Progress: {reports.filter(r => r.status === 'in-progress').length}
              </div>
              <div className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-lg font-semibold text-sm">
                Completed: {reports.filter(r => r.status === 'completed').length}
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 bg-white rounded-2xl shadow-lg p-4 border border-emerald-100">
            <div className="flex-1 relative">
              <BsSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by issue type, location, or report ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
            </div>
            
            <div className="flex gap-3">
              <div className="relative">
                <BsFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-12 pr-4 py-3 rounded-lg border-2 border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none appearance-none bg-white cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500 font-semibold">Loading reports...</p>
            </div>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg border border-emerald-100">
            <div className="text-center">
              <BsExclamationTriangle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-semibold">No reports found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  setSelectedReport(report);
                  setShowDetailsModal(true);
                }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-emerald-100 group"
              >
                {/* Header with Status */}
                <div className={`p-4 ${statusConfig[report.status].bgColor} flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(report.status)}
                    <span className={`font-semibold text-sm ${statusConfig[report.status].color}`}>
                      {statusConfig[report.status].label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${priorityConfig[report.priority].bgColor} ${priorityConfig[report.priority].color}`}>
                    {report.priority.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{report.issueType}</h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                  
                  <div className="flex items-start gap-2 mb-4 text-sm text-gray-700">
                    <BsPinMap className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{report.location}</span>
                  </div>

                  <div className="space-y-2 text-xs text-gray-500 mb-4 pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-semibold">Reported by:</span>
                      <span>{report.reportedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Assigned:</span>
                      <span>{report.assignedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Report ID:</span>
                      <span className="font-mono">{report.id}</span>
                    </div>
                  </div>

                  <button className="w-full py-2 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Details Modal */}
      {showDetailsModal && selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`p-6 ${statusConfig[selectedReport.status].bgColor} flex items-center justify-between border-b`}>
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedReport.status)}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedReport.issueType}</h2>
                  <p className="text-sm text-gray-600">Report ID: {selectedReport.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
              </div>

              {/* Media Section */}
              {selectedReport.media && selectedReport.media.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Attached Media</h3>
                  
                  {/* Images Gallery */}
                  {selectedReport.media.filter(m => m.type === 'image').length > 0 && (
                    <div className="mb-6">
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {selectedReport.media.filter(m => m.type === 'image').map((image, idx) => (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedImageIndex(idx);
                              setShowImageGallery(true);
                            }}
                            className="relative group cursor-pointer rounded-lg overflow-hidden bg-gray-200 aspect-square"
                          >
                            <img
                              src={image.url}
                              alt={image.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <BsEye className="text-white text-2xl" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Files and Videos */}
                  {selectedReport.media.filter(m => m.type !== 'image').length > 0 && (
                    <div className="space-y-2">
                      {selectedReport.media.filter(m => m.type !== 'image').map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all">
                          <div className="flex items-center gap-3 flex-1">
                            {file.type === 'video' ? (
                              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BsPlay className="text-red-600 text-lg" />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <BsFile className="text-blue-600 text-lg" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-sm text-gray-900">{file.name}</p>
                              <p className="text-xs text-gray-500">{file.type === 'video' ? 'Video File' : 'Document'}</p>
                            </div>
                          </div>
                          <button className="p-2 hover:bg-white rounded-lg transition-all">
                            <FiDownload className="text-emerald-600 text-lg" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Status</label>
                  <p className={`mt-1 px-3 py-2 rounded-lg font-semibold text-sm w-fit ${statusConfig[selectedReport.status].bgColor} ${statusConfig[selectedReport.status].color}`}>
                    {statusConfig[selectedReport.status].label}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Priority</label>
                  <p className={`mt-1 px-3 py-2 rounded-lg font-semibold text-sm w-fit ${priorityConfig[selectedReport.priority].bgColor} ${priorityConfig[selectedReport.priority].color}`}>
                    {selectedReport.priority.toUpperCase()}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Location</label>
                <p className="mt-1 text-gray-700 flex items-center gap-2">
                  <BsPinMap className="text-emerald-600" />
                  {selectedReport.location}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Coordinates: {selectedReport.coordinates[0].toFixed(4)}, {selectedReport.coordinates[1].toFixed(4)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600">Reported by</label>
                  <p className="mt-1 text-gray-700">{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-600">Assigned Date</label>
                  <p className="mt-1 text-gray-700">{selectedReport.assignedDate}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600 block mb-3">Update Status</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusUpdate(selectedReport.id, 'pending')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedReport.status === 'pending'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedReport.id, 'in-progress')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedReport.status === 'in-progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedReport.id, 'completed')}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      selectedReport.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageGallery && selectedReport && selectedReport.media && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowImageGallery(false)}
                className="text-white hover:text-gray-300 text-3xl font-bold"
              >
                ×
              </button>
              <p className="text-white font-semibold">
                {selectedImageIndex + 1} / {selectedReport.media.filter(m => m.type === 'image').length}
              </p>
            </div>

            <div className="relative bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center">
              <img
                src={selectedReport.media.filter(m => m.type === 'image')[selectedImageIndex]?.url}
                alt="Full view"
                className="w-full h-full object-contain"
              />

              {/* Navigation Buttons */}
              {selectedReport.media.filter(m => m.type === 'image').length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === 0 ? selectedReport.media.filter(m => m.type === 'image').length - 1 : prev - 1
                    )}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all text-2xl"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex(prev => 
                      prev === selectedReport.media.filter(m => m.type === 'image').length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-all text-2xl"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {selectedReport.media.filter(m => m.type === 'image').length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {selectedReport.media.filter(m => m.type === 'image').map((image, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === selectedImageIndex
                        ? 'border-white'
                        : 'border-transparent hover:border-gray-500'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorReports;
