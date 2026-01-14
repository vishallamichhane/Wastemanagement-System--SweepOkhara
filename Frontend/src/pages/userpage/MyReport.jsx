import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GiBroom } from 'react-icons/gi';
import { BsBell, BsEye, BsFilter, BsSearch, BsClock, BsCheckCircle, BsExclamationTriangle, BsArrowClockwise } from 'react-icons/bs';
import { FiLogOut, FiChevronLeft } from 'react-icons/fi';
import Header from './components/Header';

const MyReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sample reports data
  const sampleReports = [
    {
      id: '803F9A',
      date: 'July 15, 2024',
      issueType: 'Overflowing Bin',
      status: 'resolved',
      description: 'Public bin near Lakeside overflowing with tourist waste',
      location: 'Lakeside Road, Pokhara-6',
      assignedTo: 'Cleanup Team A',
      priority: 'medium',
      images: 2
    },
    {
      id: '48168C',
      date: 'July 12, 2024',
      issueType: 'Missed Pickup',
      status: 'in-progress',
      description: 'Regular waste pickup missed in residential area',
      location: 'Birauta, Pokhara-8',
      assignedTo: 'Collection Team B',
      priority: 'high',
      images: 1
    },
    {
      id: 'E2H5K7',
      date: 'July 11, 2024',
      issueType: 'Illegal Dumping',
      status: 'received',
      description: 'Construction waste dumped illegally near riverbank',
      location: 'Seti River Bank, Pokhara-9',
      assignedTo: 'Pending Assignment',
      priority: 'high',
      images: 3
    },
    {
      id: '9F632N',
      date: 'July 05, 2024',
      issueType: 'Damaged Bin',
      status: 'resolved',
      description: 'Public bin damaged and needs replacement',
      location: 'Chipledhunga, Pokhara-3',
      assignedTo: 'Maintenance Team',
      priority: 'medium',
      images: 1
    },
    {
      id: '1C3P8Q',
      date: 'June 28, 2024',
      issueType: 'Overflowing Bin',
      status: 'resolved',
      description: 'Market area bin overflowing during peak hours',
      location: 'Old Bazaar, Pokhara-1',
      assignedTo: 'Cleanup Team C',
      priority: 'high',
      images: 2
    },
    {
      id: '7D4G2M',
      date: 'June 25, 2024',
      issueType: 'Street Litter',
      status: 'in-progress',
      description: 'Accumulated litter on main street',
      location: 'New Road, Pokhara-2',
      assignedTo: 'Street Cleaning Team',
      priority: 'medium',
      images: 0
    }
  ];

  const statusConfig = {
    'received': { label: 'Received', color: 'text-blue-600', bgColor: 'bg-blue-100', dotColor: 'bg-blue-500' },
    'in-progress': { label: 'In Progress', color: 'text-amber-600', bgColor: 'bg-amber-100', dotColor: 'bg-amber-500' },
    'resolved': { label: 'Resolved', color: 'text-emerald-600', bgColor: 'bg-emerald-100', dotColor: 'bg-emerald-500' }
  };

  const priorityConfig = {
    'high': { label: 'High', color: 'text-red-600', bgColor: 'bg-red-100' },
    'medium': { label: 'Medium', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    'low': { label: 'Low', color: 'text-blue-600', bgColor: 'bg-blue-100' }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(sampleReports);
      setFilteredReports(sampleReports);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.issueType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved':
        return <BsCheckCircle className="text-emerald-500" />;
      case 'in-progress':
        return <BsArrowClockwise className="text-amber-500" />;
      case 'received':
        return <BsClock className="text-blue-500" />;
      default:
        return <BsExclamationTriangle className="text-gray-500" />;
    }
  };

  return (
    <>
      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-8 py-8 w-full">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <Link to="/user" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 transition-colors duration-300 mb-4 group">
            <FiChevronLeft className="text-lg group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-semibold">Back to Dashboard</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent mb-3">
            My Reports
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track the status of all your submitted reports here.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Reports', value: reports.length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Resolved', value: reports.filter(r => r.status === 'resolved').length, color: 'from-emerald-500 to-teal-500' },
            { label: 'In Progress', value: reports.filter(r => r.status === 'in-progress').length, color: 'from-amber-500 to-yellow-500' },
            { label: 'Received', value: reports.filter(r => r.status === 'received').length, color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transform hover:scale-105 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white text-xl mb-3`}>
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
                <div key={index} className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-200 last:border-b-0">
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
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No reports found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
              <Link
                to="/user/report"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                Report New Issue
              </Link>
            </div>
          ) : (
            // Reports List
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">REPORT ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">DATE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ISSUE TYPE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">LOCATION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">STATUS</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr 
                      key={report.id}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/50 transition-all duration-300 animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                          #{report.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-medium">{report.date}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getIssueTypeIcon(report.issueType)}</span>
                          <span className="font-medium text-gray-700">{report.issueType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{report.location}</td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${statusConfig[report.status].bgColor} ${statusConfig[report.status].color} font-medium`}>
                          <span className={`w-2 h-2 rounded-full ${statusConfig[report.status].dotColor} animate-pulse`}></span>
                          {statusConfig[report.status].label}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 transform">
                          <BsEye className="text-sm" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/user/report"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-500 transform"
          >
            <span>+</span>
            Report New Issue
          </Link>
        </div>
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
      `}</style>
    </>
  );
};

// Helper function for issue type icons
const getIssueTypeIcon = (issueType) => {
  const icons = {
    'Overflowing Bin': '🗑️',
    'Missed Pickup': '🚛',
    'Illegal Dumping': '⚠️',
    'Damaged Bin': '🔧',
    'Street Litter': '🧹',
    'Other Issue': '❓'
  };
  return icons[issueType] || '📋';
};

export default MyReports;