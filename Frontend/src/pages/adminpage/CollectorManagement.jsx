import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiDownload,
  FiMail,
  FiPhone,
  FiCalendar,
  FiMapPin,
  FiCheck,
  FiX,
  FiClock,
  FiUser,
  FiTruck,
  FiStar,
  FiActivity,
  FiAward,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import {
  BsPersonPlus,
  BsShieldCheck,
  BsThreeDotsVertical,
  BsTruck,
  BsSpeedometer2,
  BsGeoAlt,
  BsCalendarCheck,
  BsStarFill,
  BsPersonBadge
} from "react-icons/bs";
import { MdOutlineRoute, MdWorkHistory } from "react-icons/md";
import { GiPathDistance } from "react-icons/gi";

// -------------------------
// DUMMY COLLECTOR DATA - Replace with actual backend API
// -------------------------
const dummyCollectors = [
  {
    id: "COL-001",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@sweepokhara.com",
    phone: "+977 9800000001",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector001",
    status: "active",
    badge: "Gold",
    rating: 4.8,
    efficiency: 96,
    totalCollections: 1247,
    thisMonth: 156,
    assignedRoute: "Route A - Lakeside",
    vehicle: { id: "TRK-01", type: "Waste Truck", capacity: "2.5 Tons", registration: "PHA-01-1234" },
    ward: "Ward 5",
    joinDate: "2022-03-15",
    lastActive: "10 mins ago",
    tasksToday: { total: 15, completed: 12, pending: 3 },
    distanceCovered: "45.2 km",
    attendance: 99.1
  },
  {
    id: "COL-002",
    name: "Suresh Yadav",
    email: "suresh.yadav@sweepokhara.com",
    phone: "+977 9800000002",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector002",
    status: "active",
    badge: "Silver",
    rating: 4.5,
    efficiency: 92,
    totalCollections: 987,
    thisMonth: 142,
    assignedRoute: "Route B - City Center",
    vehicle: { id: "TRK-02", type: "Waste Truck", capacity: "2.5 Tons", registration: "PHA-02-2345" },
    ward: "Ward 3",
    joinDate: "2022-06-20",
    lastActive: "25 mins ago",
    tasksToday: { total: 14, completed: 10, pending: 4 },
    distanceCovered: "38.7 km",
    attendance: 97.5
  },
  {
    id: "COL-003",
    name: "Amit Sharma",
    email: "amit.sharma@sweepokhara.com",
    phone: "+977 9800000003",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector003",
    status: "inactive",
    badge: "Bronze",
    rating: 4.2,
    efficiency: 88,
    totalCollections: 654,
    thisMonth: 0,
    assignedRoute: "Route C - Mahendra Pul",
    vehicle: { id: "TRK-03", type: "Waste Truck", capacity: "2.0 Tons", registration: "PHA-03-3456" },
    ward: "Ward 2",
    joinDate: "2023-01-10",
    lastActive: "2 days ago",
    tasksToday: { total: 0, completed: 0, pending: 0 },
    distanceCovered: "0 km",
    attendance: 85.2
  },
  {
    id: "COL-004",
    name: "Priya Singh",
    email: "priya.singh@sweepokhara.com",
    phone: "+977 9800000004",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector004",
    status: "active",
    badge: "Gold",
    rating: 4.7,
    efficiency: 94,
    totalCollections: 1089,
    thisMonth: 148,
    assignedRoute: "Route D - Baseline",
    vehicle: { id: "TRK-04", type: "Waste Truck", capacity: "2.5 Tons", registration: "PHA-04-4567" },
    ward: "Ward 4",
    joinDate: "2022-08-05",
    lastActive: "5 mins ago",
    tasksToday: { total: 16, completed: 14, pending: 2 },
    distanceCovered: "52.1 km",
    attendance: 98.8
  },
  {
    id: "COL-005",
    name: "Bikash Adhikari",
    email: "bikash.adhikari@sweepokhara.com",
    phone: "+977 9800000005",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector005",
    status: "on-leave",
    badge: "Silver",
    rating: 4.4,
    efficiency: 91,
    totalCollections: 876,
    thisMonth: 98,
    assignedRoute: "Route E - Damside",
    vehicle: { id: "TRK-05", type: "Waste Truck", capacity: "2.0 Tons", registration: "PHA-05-5678" },
    ward: "Ward 6",
    joinDate: "2022-11-18",
    lastActive: "1 week ago",
    tasksToday: { total: 0, completed: 0, pending: 0 },
    distanceCovered: "0 km",
    attendance: 92.3
  },
  {
    id: "COL-006",
    name: "Krishna Bahadur",
    email: "krishna.bahadur@sweepokhara.com",
    phone: "+977 9800000006",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector006",
    status: "active",
    badge: "Bronze",
    rating: 4.0,
    efficiency: 86,
    totalCollections: 432,
    thisMonth: 112,
    assignedRoute: "Route F - Chipledhunga",
    vehicle: { id: "TRK-06", type: "Waste Truck", capacity: "2.0 Tons", registration: "PHA-06-6789" },
    ward: "Ward 1",
    joinDate: "2023-05-22",
    lastActive: "1 hour ago",
    tasksToday: { total: 12, completed: 8, pending: 4 },
    distanceCovered: "28.4 km",
    attendance: 94.1
  },
  {
    id: "COL-007",
    name: "Deepak Poudel",
    email: "deepak.poudel@sweepokhara.com",
    phone: "+977 9800000007",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector007",
    status: "active",
    badge: "Silver",
    rating: 4.6,
    efficiency: 93,
    totalCollections: 765,
    thisMonth: 134,
    assignedRoute: "Route G - Nayabazar",
    vehicle: { id: "TRK-07", type: "Waste Truck", capacity: "2.5 Tons", registration: "PHA-07-7890" },
    ward: "Ward 7",
    joinDate: "2023-02-14",
    lastActive: "15 mins ago",
    tasksToday: { total: 13, completed: 11, pending: 2 },
    distanceCovered: "41.8 km",
    attendance: 96.7
  },
  {
    id: "COL-008",
    name: "Suman Tamang",
    email: "suman.tamang@sweepokhara.com",
    phone: "+977 9800000008",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=collector008",
    status: "active",
    badge: "Gold",
    rating: 4.9,
    efficiency: 97,
    totalCollections: 1456,
    thisMonth: 162,
    assignedRoute: "Route H - Bagar",
    vehicle: { id: "TRK-08", type: "Waste Truck", capacity: "3.0 Tons", registration: "PHA-08-8901" },
    ward: "Ward 8",
    joinDate: "2021-12-01",
    lastActive: "2 mins ago",
    tasksToday: { total: 18, completed: 16, pending: 2 },
    distanceCovered: "58.3 km",
    attendance: 99.5
  }
];

// -------------------------
// STATUS BADGE COMPONENT
// -------------------------
const StatusBadge = ({ status }) => {
  const config = {
    active: { 
      bg: 'bg-emerald-100', 
      text: 'text-emerald-700', 
      dot: 'bg-emerald-500',
      label: 'Active'
    },
    inactive: { 
      bg: 'bg-gray-100', 
      text: 'text-gray-700', 
      dot: 'bg-gray-400',
      label: 'Inactive'
    },
    'on-leave': { 
      bg: 'bg-amber-100', 
      text: 'text-amber-700', 
      dot: 'bg-amber-500',
      label: 'On Leave'
    }
  };

  const { bg, text, dot, label } = config[status] || config.inactive;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot} animate-pulse`}></span>
      {label}
    </span>
  );
};

// -------------------------
// BADGE COMPONENT
// -------------------------
const CollectorBadge = ({ badge }) => {
  const config = {
    Gold: { bg: 'bg-gradient-to-r from-yellow-400 to-amber-500', text: 'text-white', icon: '🥇' },
    Silver: { bg: 'bg-gradient-to-r from-gray-300 to-gray-400', text: 'text-gray-800', icon: '🥈' },
    Bronze: { bg: 'bg-gradient-to-r from-orange-400 to-orange-600', text: 'text-white', icon: '🥉' }
  };

  const { bg, text, icon } = config[badge] || config.Bronze;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
      <span>{icon}</span>
      {badge}
    </span>
  );
};

// -------------------------
// RATING STARS COMPONENT
// -------------------------
const RatingStars = ({ rating }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <BsStarFill 
          key={i} 
          className={`w-3 h-3 ${i < Math.floor(rating) ? 'text-amber-400' : 'text-gray-300'}`} 
        />
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700">{rating}</span>
    </div>
  );
};

// -------------------------
// EFFICIENCY BAR COMPONENT
// -------------------------
const EfficiencyBar = ({ efficiency }) => {
  const getColor = (value) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${getColor(efficiency)}`}
          style={{ width: `${efficiency}%` }}
        />
      </div>
      <span className={`text-sm font-semibold ${efficiency >= 90 ? 'text-emerald-600' : efficiency >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
        {efficiency}%
      </span>
    </div>
  );
};

// -------------------------
// COLLECTOR DETAIL MODAL
// -------------------------
const CollectorDetailModal = ({ collector, onClose }) => {
  if (!collector) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <img 
                src={collector.avatar} 
                alt={collector.name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
              <div className="text-white">
                <h2 className="text-2xl font-bold">{collector.name}</h2>
                <p className="text-emerald-100">{collector.id} • {collector.assignedRoute}</p>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={collector.status} />
                  <CollectorBadge badge={collector.badge} />
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FiCheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Total Collections</span>
              </div>
              <p className="text-2xl font-bold text-blue-800">{collector.totalCollections.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <BsSpeedometer2 className="w-5 h-5" />
                <span className="text-sm font-medium">Efficiency</span>
              </div>
              <p className="text-2xl font-bold text-emerald-800">{collector.efficiency}%</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <FiStar className="w-5 h-5" />
                <span className="text-sm font-medium">Rating</span>
              </div>
              <p className="text-2xl font-bold text-amber-800">{collector.rating}/5.0</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <BsCalendarCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Attendance</span>
              </div>
              <p className="text-2xl font-bold text-purple-800">{collector.attendance}%</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiUser className="text-emerald-600" />
                Contact Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FiMail className="text-gray-400" />
                  <span className="text-gray-700">{collector.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiPhone className="text-gray-400" />
                  <span className="text-gray-700">{collector.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiMapPin className="text-gray-400" />
                  <span className="text-gray-700">{collector.ward}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiCalendar className="text-gray-400" />
                  <span className="text-gray-700">Joined: {new Date(collector.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Vehicle Info */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BsTruck className="text-emerald-600" />
                Assigned Vehicle
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Vehicle ID</span>
                  <span className="font-medium text-gray-900">{collector.vehicle.id}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Type</span>
                  <span className="font-medium text-gray-900">{collector.vehicle.type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-medium text-gray-900">{collector.vehicle.capacity}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Registration</span>
                  <span className="font-medium text-gray-900">{collector.vehicle.registration}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Tasks */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MdWorkHistory className="text-emerald-600" />
              Today's Performance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-3xl font-bold text-gray-900">{collector.tasksToday.total}</p>
                <p className="text-sm text-gray-500">Total Tasks</p>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <p className="text-3xl font-bold text-emerald-600">{collector.tasksToday.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-3xl font-bold text-amber-600">{collector.tasksToday.pending}</p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 text-gray-600">
                <GiPathDistance className="w-5 h-5" />
                <span className="text-sm">Distance Covered Today</span>
              </div>
              <span className="font-semibold text-gray-900">{collector.distanceCovered}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors">
              <FiEdit className="w-4 h-4" />
              Edit Profile
            </button>
            <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
              <MdOutlineRoute className="w-4 h-4" />
              Assign Route
            </button>
            <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors">
              <BsTruck className="w-4 h-4" />
              Assign Vehicle
            </button>
            <button className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
              <FiEye className="w-4 h-4" />
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------
// ADD COLLECTOR MODAL
// -------------------------
const AddCollectorModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    ward: '',
    assignedRoute: '',
    vehicleId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BsPersonPlus className="text-emerald-600" />
              Add New Collector
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter collector's full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="collector@sweepokhara.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              placeholder="+977 98XXXXXXXX"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ward</label>
              <select
                value={formData.ward}
                onChange={(e) => setFormData({...formData, ward: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select Ward</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i} value={`Ward ${i + 1}`}>Ward {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Route</label>
              <select
                value={formData.assignedRoute}
                onChange={(e) => setFormData({...formData, assignedRoute: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                required
              >
                <option value="">Select Route</option>
                <option value="Route A - Lakeside">Route A - Lakeside</option>
                <option value="Route B - City Center">Route B - City Center</option>
                <option value="Route C - Mahendra Pul">Route C - Mahendra Pul</option>
                <option value="Route D - Baseline">Route D - Baseline</option>
                <option value="Route E - Damside">Route E - Damside</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign Vehicle</label>
            <select
              value={formData.vehicleId}
              onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
              required
            >
              <option value="">Select Vehicle</option>
              <option value="TRK-09">TRK-09 - Waste Truck (2.5 Tons)</option>
              <option value="TRK-10">TRK-10 - Waste Truck (2.0 Tons)</option>
              <option value="TRK-11">TRK-11 - Waste Truck (3.0 Tons)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Add Collector
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// -------------------------
// MAIN COLLECTOR MANAGEMENT COMPONENT
// -------------------------
const CollectorManagement = () => {
  const [collectors, setCollectors] = useState(dummyCollectors);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [badgeFilter, setBadgeFilter] = useState("all");
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const itemsPerPage = 6;

  // Filter collectors
  const filteredCollectors = collectors.filter(collector => {
    const matchesSearch = 
      collector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collector.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collector.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collector.assignedRoute.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || collector.status === statusFilter;
    const matchesBadge = badgeFilter === "all" || collector.badge === badgeFilter;
    
    return matchesSearch && matchesStatus && matchesBadge;
  });

  // Pagination
  const totalPages = Math.ceil(filteredCollectors.length / itemsPerPage);
  const paginatedCollectors = filteredCollectors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const stats = {
    total: collectors.length,
    active: collectors.filter(c => c.status === 'active').length,
    onLeave: collectors.filter(c => c.status === 'on-leave').length,
    inactive: collectors.filter(c => c.status === 'inactive').length,
    avgEfficiency: Math.round(collectors.reduce((sum, c) => sum + c.efficiency, 0) / collectors.length),
    totalCollectionsToday: collectors.reduce((sum, c) => sum + c.tasksToday.completed, 0)
  };

  const handleAddCollector = (data) => {
    const newCollector = {
      id: `COL-${String(collectors.length + 1).padStart(3, '0')}`,
      ...data,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.replace(/\s/g, '')}`,
      status: 'active',
      badge: 'Bronze',
      rating: 0,
      efficiency: 0,
      totalCollections: 0,
      thisMonth: 0,
      vehicle: { id: data.vehicleId, type: 'Waste Truck', capacity: '2.5 Tons', registration: 'NEW-REG' },
      joinDate: new Date().toISOString().split('T')[0],
      lastActive: 'Just now',
      tasksToday: { total: 0, completed: 0, pending: 0 },
      distanceCovered: '0 km',
      attendance: 0
    };
    setCollectors([...collectors, newCollector]);
  };

  const handleDeleteCollector = (id) => {
    if (window.confirm('Are you sure you want to remove this collector?')) {
      setCollectors(collectors.filter(c => c.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setCollectors(collectors.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'active' ? 'inactive' : 'active' };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl">
              <BsTruck className="text-white text-xl" />
            </div>
            Collector Management
          </h1>
          <p className="text-gray-600 mt-1">Manage and monitor waste collection team</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <FiPlus className="w-4 h-4" />
            Add Collector
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors">
            <FiDownload className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Collectors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <BsPersonBadge className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Now</p>
              <p className="text-2xl font-bold text-emerald-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <FiActivity className="text-emerald-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">On Leave</p>
              <p className="text-2xl font-bold text-amber-600">{stats.onLeave}</p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <FiClock className="text-amber-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Efficiency</p>
              <p className="text-2xl font-bold text-purple-600">{stats.avgEfficiency}%</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <BsSpeedometer2 className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Collections Today</p>
              <p className="text-2xl font-bold text-teal-600">{stats.totalCollectionsToday}</p>
            </div>
            <div className="p-3 bg-teal-100 rounded-xl">
              <FiCheckCircle className="text-teal-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, email, or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
          </div>

          {/* Badge Filter */}
          <select
            value={badgeFilter}
            onChange={(e) => setBadgeFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white"
          >
            <option value="all">All Badges</option>
            <option value="Gold">🥇 Gold</option>
            <option value="Silver">🥈 Silver</option>
            <option value="Bronze">🥉 Bronze</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'table' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Table
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-emerald-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Collector List */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Collector</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Route & Vehicle</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Performance</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Today's Tasks</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCollectors.map((collector) => (
                  <tr 
                    key={collector.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={collector.avatar} 
                          alt={collector.name}
                          className="w-12 h-12 rounded-full border-2 border-emerald-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-gray-900">{collector.name}</p>
                            <CollectorBadge badge={collector.badge} />
                          </div>
                          <p className="text-sm text-gray-500">{collector.id} • {collector.ward}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <MdOutlineRoute className="text-gray-400" />
                          {collector.assignedRoute}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <BsTruck className="text-gray-400" />
                          {collector.vehicle.id}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-2">
                        <RatingStars rating={collector.rating} />
                        <EfficiencyBar efficiency={collector.efficiency} />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-emerald-600">{collector.tasksToday.completed}</p>
                          <p className="text-xs text-gray-500">Done</p>
                        </div>
                        <div className="text-gray-300">/</div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-700">{collector.tasksToday.total}</p>
                          <p className="text-xs text-gray-500">Total</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <StatusBadge status={collector.status} />
                      <p className="text-xs text-gray-400 mt-1">{collector.lastActive}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedCollector(collector)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleToggleStatus(collector.id)}
                          className={`p-2 ${collector.status === 'active' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'} rounded-lg transition-colors`}
                          title={collector.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {collector.status === 'active' ? <FiAlertCircle className="w-4 h-4" /> : <FiCheckCircle className="w-4 h-4" />}
                        </button>
                        <button 
                          onClick={() => handleDeleteCollector(collector.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCollectors.length)} of {filteredCollectors.length} collectors
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="w-4 h-4" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-emerald-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCollectors.map((collector) => (
            <div 
              key={collector.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-4">
                <div className="flex items-center justify-between">
                  <StatusBadge status={collector.status} />
                  <CollectorBadge badge={collector.badge} />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <img 
                    src={collector.avatar} 
                    alt={collector.name}
                    className="w-16 h-16 rounded-full border-3 border-emerald-200 shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{collector.name}</h3>
                    <p className="text-sm text-gray-500">{collector.id}</p>
                    <RatingStars rating={collector.rating} />
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MdOutlineRoute className="text-emerald-500" />
                    {collector.assignedRoute}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BsTruck className="text-emerald-500" />
                    {collector.vehicle.id} • {collector.vehicle.capacity}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="text-emerald-500" />
                    {collector.ward}
                  </div>
                </div>

                {/* Performance */}
                <div className="bg-gray-50 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Efficiency</span>
                    <span className={`text-sm font-bold ${collector.efficiency >= 90 ? 'text-emerald-600' : collector.efficiency >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                      {collector.efficiency}%
                    </span>
                  </div>
                  <EfficiencyBar efficiency={collector.efficiency} />
                </div>

                {/* Today's Progress */}
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-xl mb-4">
                  <span className="text-sm text-gray-600">Today's Tasks</span>
                  <span className="font-bold text-emerald-700">
                    {collector.tasksToday.completed}/{collector.tasksToday.total}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setSelectedCollector(collector)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    <FiEye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(collector.id)}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    {collector.status === 'active' ? <FiAlertCircle className="w-4 h-4 text-amber-600" /> : <FiCheckCircle className="w-4 h-4 text-emerald-600" />}
                  </button>
                  <button 
                    onClick={() => handleDeleteCollector(collector.id)}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-red-50 text-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCollectors.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BsTruck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No collectors found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => { setSearchQuery(''); setStatusFilter('all'); setBadgeFilter('all'); }}
            className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedCollector && (
        <CollectorDetailModal 
          collector={selectedCollector} 
          onClose={() => setSelectedCollector(null)} 
        />
      )}

      {showAddModal && (
        <AddCollectorModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCollector}
        />
      )}
    </div>
  );
};

export default CollectorManagement;
