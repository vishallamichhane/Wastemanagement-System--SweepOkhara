import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiUserCheck,
  FiUserX,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiDownload,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiBriefcase,
  FiHome,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiRefreshCw
} from 'react-icons/fi';
import {
  BsPersonPlus,
  BsShieldCheck,
  BsThreeDotsVertical,
  BsPersonBadge,
  BsBuildings
} from "react-icons/bs";
import { FaUserTie, FaCity } from "react-icons/fa";
import axios from "axios";

const userTypes = ["All", "Resident", "Business", "Commercial", "Government"];
const userStatuses = ["All", "active", "inactive", "suspended"];

// Status Badge Component
const StatusBadge = ({ status }) => {
  const config = {
    active: { color: 'bg-emerald-100 text-emerald-800', icon: FiUserCheck },
    inactive: { color: 'bg-gray-100 text-gray-800', icon: FiUserX },
    suspended: { color: 'bg-red-100 text-red-800', icon: FiUserX }
  };
  
  const { color, icon: Icon } = config[status] || config.active;
  const statusText = status.charAt(0).toUpperCase() + status.slice(1);
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${color}`}>
      <Icon className="text-xs" />
      {statusText}
    </span>
  );
};

// User Type Badge Component
const TypeBadge = ({ type }) => {
  const config = {
    Resident: 'bg-blue-100 text-blue-800',
    Business: 'bg-purple-100 text-purple-800',
    Commercial: 'bg-amber-100 text-amber-800',
    Government: 'bg-indigo-100 text-indigo-800'
  };
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${config[type] || 'bg-gray-100 text-gray-800'}`}>
      {type}
    </span>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [registrationRequests, setRegistrationRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch real users from backend API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Failed to load users from server');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search, type, and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === "All" || user.type === selectedType;
    const matchesStatus = selectedStatus === "All" || user.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  // Filter requests based on active tab
  const filteredRequests = registrationRequests.filter(request => 
    activeTab === "pending" ? request.status === "pending" : 
    activeTab === "approved" ? request.status === "approved" : 
    request.status === "declined"
  );

  // Handle user actions
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    alert(`Edit user: ${user.name}`);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
      alert(`User ${userToDelete.name} deleted successfully`);
    }
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleExportUsers = () => {
    const rows = [
      ["Name", "Email", "Phone", "Type", "Status", "Ward", "Reports", "Joined"],
      ...users.map(u => [u.name, u.email, u.phone, u.type, u.status, u.ward, u.reports, u.joined])
    ];
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
  };

  const handleChangeStatus = (userId, newStatus) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  // New functions for registration requests
  const handleViewRequest = (request) => {
    setSelectedRequest(request);
  };

  const handleApproveRequest = (requestId) => {
    const request = registrationRequests.find(req => req.id === requestId);
    if (request) {
      // Add to users list
      const newUser = {
        id: `USR-${String(users.length + 1).padStart(3, '0')}`,
        name: request.name,
        email: request.email,
        phone: request.phone,
        type: request.requestedType,
        status: "active",
        reports: 0,
        joined: new Date().toISOString().split('T')[0],
        lastActive: "Just now",
        address: request.address,
        ward: request.ward
      };
      
      setUsers([...users, newUser]);
      
      // Update request status
      setRegistrationRequests(registrationRequests.map(req => 
        req.id === requestId ? { ...req, status: "approved" } : req
      ));
      
      alert(`User ${request.name} approved successfully!`);
      
      if (selectedRequest?.id === requestId) {
        setSelectedRequest({ ...request, status: "approved" });
      }
    }
  };

  const handleDeclineRequest = (requestId, reason = "") => {
    const request = registrationRequests.find(req => req.id === requestId);
    if (request) {
      // Update request status
      setRegistrationRequests(registrationRequests.map(req => 
        req.id === requestId ? { ...req, status: "declined" } : req
      ));
      
      alert(`Registration request for ${request.name} has been declined.`);
      
      if (selectedRequest?.id === requestId) {
        setSelectedRequest({ ...request, status: "declined" });
      }
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 lg:p-8 animate-fadeInUp">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">User Management</h1>
            <p className="text-gray-600">Manage all registered users and their accounts</p>
          </div>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium text-sm"
          >
            <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="ml-4 text-gray-600">Loading users...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
          <button onClick={fetchUsers} className="ml-4 text-red-800 underline font-medium">Retry</button>
        </div>
      )}

      {!loading && (
      <>
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">{users.length}</p>
              <p className="text-xs text-gray-500 mt-2">From database</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BsPersonPlus className="text-3xl text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {users.filter(u => u.status === 'active').length}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {Math.round((users.filter(u => u.status === 'active').length / users.length) * 100)}% active
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <FiUserCheck className="text-3xl text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-4xl font-bold text-gray-900 mt-2">
                {users.reduce((sum, user) => sum + user.reports, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Avg: {(users.reduce((sum, user) => sum + user.reports, 0) / users.length).toFixed(1)} per user
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <FiEye className="text-3xl text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Search Users</label>
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or ID..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">User Type</label>
              <select 
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {userTypes.map(type => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Types" : type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {userStatuses.map(status => (
                  <option key={status} value={status}>
                    {status === "All" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-1 lg:col-span-3 flex items-end gap-3">
              <button
                onClick={resetFilters}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
              >
                Reset Filters
              </button>
              
              <button
                onClick={handleAddUser}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
              >
                <FiPlus /> Add User
              </button>
              
              <button
                onClick={handleExportUsers}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium text-gray-700"
              >
                <FiDownload /> Export
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">User Name</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Type</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Ward</th>
                <th className="text-left py-4 px-6 text-sm font-bold text-gray-700">Reports</th>
                <th className="text-center py-4 px-6 text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.length > 0 ? (
                currentUsers.map((user, index) => (
                  <tr key={user.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                          <span className="font-bold text-white text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-gray-700">{user.email}</p>
                    </td>
                    <td className="py-4 px-6">
                      <TypeBadge type={user.type} />
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-900 px-3 py-1 bg-gray-100 rounded-lg">{user.ward}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-center">
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-lg font-semibold text-sm">{user.reports}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="flex items-center gap-2 px-3 py-2 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium text-sm"
                          title="View User Details"
                        >
                          <FiEye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Edit User"
                        >
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all duration-200 hover:scale-110"
                          title="Delete User"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="p-4 bg-gray-100 rounded-full mb-3">
                        <FiUser className="text-4xl text-gray-400" />
                      </div>
                      <p className="text-gray-600 font-medium">No users found</p>
                      <p className="text-gray-500 text-sm">Try adjusting your filters or search criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm font-medium text-gray-700">
              Showing <span className="text-emerald-600">{indexOfFirstUser + 1}</span> to <span className="text-emerald-600">{Math.min(indexOfLastUser, filteredUsers.length)}</span> of <span className="text-emerald-600">{filteredUsers.length}</span> users
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white border border-gray-200'}`}
              >
                <FiChevronLeft size={20} />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 rounded-lg font-medium transition-all ${
                      currentPage === pageNum
                        ? 'bg-emerald-600 text-white'
                        : 'text-gray-600 border border-gray-200 hover:bg-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-white border border-gray-200'}`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
      </>
      )}

      {/* Registration Requests Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">User Registration Requests</h3>
                  <p className="text-gray-600 mt-1">Review and approve new user registrations</p>
                </div>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setActiveTab("pending")}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    activeTab === "pending"
                      ? "bg-emerald-100 text-emerald-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiClock />
                  Pending
                  <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                    {registrationRequests.filter(r => r.status === "pending").length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("approved")}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    activeTab === "approved"
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiCheck />
                  Approved
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {registrationRequests.filter(r => r.status === "approved").length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("declined")}
                  className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                    activeTab === "declined"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiX />
                  Declined
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {registrationRequests.filter(r => r.status === "declined").length}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Request List */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                <div className="p-4">
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Requests
                  </h4>
                  <div className="space-y-3">
                    {filteredRequests.map((request) => (
                      <div
                        key={request.id}
                        onClick={() => handleViewRequest(request)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedRequest?.id === request.id
                            ? "bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200"
                            : "bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            request.requestedType === "Resident" ? "bg-blue-100" :
                            request.requestedType === "Business" ? "bg-purple-100" :
                            request.requestedType === "Commercial" ? "bg-amber-100" :
                            "bg-indigo-100"
                          }`}>
                            {request.requestedType === "Resident" && <FaUserTie className="text-blue-600" />}
                            {request.requestedType === "Business" && <FiBriefcase className="text-purple-600" />}
                            {request.requestedType === "Commercial" && <BsBuildings className="text-amber-600" />}
                            {request.requestedType === "Government" && <FaCity className="text-indigo-600" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="font-semibold text-gray-900 truncate">{request.name}</h5>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                request.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                request.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                                "bg-red-100 text-red-800"
                              }`}>
                                {request.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">{request.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FiMapPin /> {request.ward}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FiCalendar /> {request.dateSubmitted.split(' ')[0]}
                              </span>
                            </div>
                            {request.businessName && (
                              <p className="text-xs text-gray-700 mt-1 truncate">
                                {request.businessName}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="flex-1 overflow-y-auto p-6">
                {selectedRequest ? (
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900">{selectedRequest.name}</h4>
                        <p className="text-gray-500">{selectedRequest.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedRequest.requestedType === "Resident" ? "bg-blue-100 text-blue-800" :
                          selectedRequest.requestedType === "Business" ? "bg-purple-100 text-purple-800" :
                          selectedRequest.requestedType === "Commercial" ? "bg-amber-100 text-amber-800" :
                          "bg-indigo-100 text-indigo-800"
                        }`}>
                          {selectedRequest.requestedType}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedRequest.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          selectedRequest.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {selectedRequest.status}
                        </span>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500 flex items-center gap-2">
                          <FiMail /> Email
                        </label>
                        <p className="font-medium">{selectedRequest.email}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500 flex items-center gap-2">
                          <FiPhone /> Phone
                        </label>
                        <p className="font-medium">{selectedRequest.phone}</p>
                      </div>
                    </div>

                    {/* Location Information */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500 flex items-center gap-2">
                          <FiMapPin /> Ward Number
                        </label>
                        <p className="font-medium">{selectedRequest.ward}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm text-gray-500 flex items-center gap-2">
                          <FiHome /> Address
                        </label>
                        <p className="font-medium">{selectedRequest.address}</p>
                      </div>
                    </div>

                    {/* Business Information (if applicable) */}
                    {selectedRequest.businessName && (
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <FiBriefcase /> Business Information
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-sm text-gray-500">Business Name</label>
                            <p className="font-medium">{selectedRequest.businessName}</p>
                          </div>
                          <div className="space-y-1">
                            <label className="text-sm text-gray-500">Business Type</label>
                            <p className="font-medium">{selectedRequest.businessType}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Verification Documents */}
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                      <h5 className="font-semibold text-gray-900 mb-3">Verification Documents</h5>
                      <div className="space-y-2">
                        {selectedRequest.verificationDocs.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-amber-100 rounded-lg">
                                <BsPersonBadge className="text-amber-600" />
                              </div>
                              <span className="font-medium">{doc}</span>
                            </div>
                            <button className="px-3 py-1 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200">
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    {selectedRequest.notes && (
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                        <h5 className="font-semibold text-gray-900 mb-2">Additional Notes</h5>
                        <p className="text-gray-700">{selectedRequest.notes}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {selectedRequest.status === "pending" && (
                      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => handleDeclineRequest(selectedRequest.id, "Insufficient documentation")}
                          className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
                        >
                          <FiX /> Decline Request
                        </button>
                        <button
                          onClick={() => handleApproveRequest(selectedRequest.id)}
                          className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                        >
                          <FiCheck /> Approve User
                        </button>
                      </div>
                    )}

                    {/* Status Message */}
                    {selectedRequest.status !== "pending" && (
                      <div className={`p-4 rounded-xl ${
                        selectedRequest.status === "approved" 
                          ? "bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200"
                          : "bg-gradient-to-r from-red-50 to-pink-50 border border-red-200"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedRequest.status === "approved" 
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {selectedRequest.status === "approved" ? <FiCheck /> : <FiX />}
                          </div>
                          <div>
                            <p className="font-semibold">
                              Request {selectedRequest.status === "approved" ? "Approved" : "Declined"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {selectedRequest.status === "approved" 
                                ? "This user has been added to the system."
                                : "This registration request has been declined."}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <FiUser className="text-4xl" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Select a Request</h4>
                    <p>Choose a registration request from the list to view details</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredRequests.length} of {registrationRequests.length} total requests
                </p>
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-white transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeInUp">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100">
            {/* Modal Header - Attractive Top Section */}
            <div className="relative">
              {/* Background Gradient */}
              <div className="h-32 bg-linear-to-r from-blue-600 via-cyan-500 to-teal-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowUserModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white text-gray-600 rounded-full shadow-lg transition-all duration-200 z-10"
              >
                <FiX size={24} />
              </button>

              {/* User Card Overlapping Header */}
              <div className="px-6 pb-6 pt-0 -mt-12 relative z-10">
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                        <span className="text-4xl font-bold text-white">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedUser.name}</h2>
                      <p className="text-sm text-gray-600 mb-3">{selectedUser.id}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <TypeBadge type={selectedUser.type} />
                        <StatusBadge status={selectedUser.status} />
                        <div className="px-3 py-1 bg-linear-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                          <FiMapPin size={14} /> {selectedUser.ward}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs font-medium">Joined</p>
                          <p className="text-gray-900 font-semibold">{selectedUser.joined}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs font-medium">Last Active</p>
                          <p className="text-gray-900 font-semibold">{selectedUser.lastActive}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Contact Information</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-600 rounded-lg">
                        <FiMail className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">Email Address</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{selectedUser.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-linear-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-emerald-600 rounded-lg">
                        <FiPhone className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-600 font-medium">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-900 truncate">{selectedUser.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Location Details</h3>
                <div className="p-4 bg-linear-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-600 rounded-lg">
                      <FiHome className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 font-medium">Address</p>
                      <p className="text-sm font-semibold text-gray-900">{selectedUser.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reports Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Activity</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-purple-600 rounded-lg">
                        <FiBriefcase className="text-white" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Reports</p>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 ml-10">{selectedUser.reports}</p>
                  </div>
                  <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 bg-green-600 rounded-lg">
                        <FiClock className="text-white" />
                      </div>
                      <p className="text-xs text-gray-600 font-medium">Joined</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900 ml-10">{selectedUser.joined}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-linear-to-r from-gray-50 to-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowUserModal(false)}
                className="px-6 py-2.5 border border-gray-300 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={() => handleEditUser(selectedUser)}
                className="px-6 py-2.5 bg-linear-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center gap-2"
              >
                <FiEdit size={18} />
                Edit User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiTrash2 className="text-red-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete User</h3>
                <p className="text-gray-600">
                  Are you sure you want to delete <span className="font-semibold">{userToDelete.name}</span>? 
                  This action cannot be undone.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                  }}
                  className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteUser}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;