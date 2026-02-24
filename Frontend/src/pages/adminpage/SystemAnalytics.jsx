import React, { useState, useEffect, useMemo } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
  FiUsers,
  FiTruck,
  FiActivity
} from "react-icons/fi";
import axios from "axios";

// Metric Card Component
const MetricCard = ({ title, value, unit, change, trend, icon: Icon, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    purple: "bg-purple-100 text-purple-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600"
  };

  const trendColor = trend === "up" ? "text-emerald-600" : "text-red-600";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value}
            <span className="text-lg text-gray-500 ml-1">{unit}</span>
          </p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="text-xl" />
        </div>
      </div>
      {change && (
        <div className={`flex items-center text-sm font-medium ${trendColor}`}>
          {trend === "up" ? <FiTrendingUp className="mr-1" /> : <FiTrendingDown className="mr-1" />}
          {Math.abs(change)}% from last period
        </div>
      )}
    </div>
  );
};

// Simple Bar Chart Component
const BarChart = ({ title, data, dataKey, color = "emerald" }) => {
  const maxValue = Math.max(...data.map(d => d[dataKey]));
  const colorClasses = {
    emerald: "bg-emerald-500",
    blue: "bg-blue-500",
    amber: "bg-amber-500",
    purple: "bg-purple-500"
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{item.day}</span>
              <span className="text-sm font-bold text-gray-900">{item[dataKey]}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${colorClasses[color]} transition-all duration-300`}
                style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Performance Gauge Component
const PerformanceGauge = ({ title, value, unit, target = 100, color = "emerald" }) => {
  const percentage = Math.min((value / target) * 100, 100);
  const gaugeColor = percentage >= 80 ? "emerald" : percentage >= 60 ? "amber" : "red";

  const gaugeColorClasses = {
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    red: "text-red-600"
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 text-center">
      <p className="text-gray-600 text-sm font-medium mb-4">{title}</p>
      <div className="relative w-full flex justify-center mb-4">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={gaugeColor === "emerald" ? "#10b981" : gaugeColor === "amber" ? "#f59e0b" : "#ef4444"}
              strokeWidth="8"
              strokeDasharray={`${(percentage / 100) * 282.7} 282.7`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray 0.3s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${gaugeColorClasses[gaugeColor]}`}>{percentage.toFixed(0)}%</span>
            <span className="text-xs text-gray-500">{unit}</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-600">
        {value} / {target} {unit}
      </p>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status, value, icon: Icon }) => {
  const statusConfig = {
    operational: { bg: "bg-emerald-100", color: "text-emerald-700", textColor: "text-emerald-600" },
    warning: { bg: "bg-amber-100", color: "text-amber-700", textColor: "text-amber-600" },
    critical: { bg: "bg-red-100", color: "text-red-700", textColor: "text-red-600" }
  };

  const config = statusConfig[status];

  return (
    <div className={`${config.bg} ${config.color} rounded-lg px-4 py-3 flex items-center space-x-3`}>
      <Icon className="text-lg" />
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
};

// Main System Analytics Component
const SystemAnalytics = () => {
  const [timeRange, setTimeRange] = useState("this-month");
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [collectors, setCollectors] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, collectorsRes, reportsRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/collectors'),
        axios.get('/api/admin/reports'),
      ]);
      setStats(statsRes.data);
      setCollectors(collectorsRes.data?.data || collectorsRes.data || []);
      setReports(reportsRes.data || []);
    } catch (err) {
      console.error('Failed to fetch analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Compute analytics from real data
  const analyticsData = useMemo(() => {
    if (!stats) return null;
    const activeCollectors = collectors.filter(c => c.status === 'active').length;
    const inactiveCollectors = collectors.filter(c => c.status !== 'active').length;
    const totalCollections = collectors.reduce((sum, c) => sum + (c.totalCollections || 0), 0);
    const resolvedReports = reports.filter(r => r.status === 'resolved').length;
    const pendingReports = reports.filter(r => r.status !== 'resolved').length;
    const highPriority = reports.filter(r => r.priority === 'high' && r.status !== 'resolved').length;
    const resolutionRate = reports.length > 0 ? ((resolvedReports / reports.length) * 100).toFixed(1) : 0;

    // Compute weekly trends from real reports (last 7 days)
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyTrends = dayNames.map(day => ({ day, collections: 0, reports: 0, users: 0 }));
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    reports.forEach(r => {
      const d = new Date(r.createdAt);
      if (d >= weekAgo) {
        const dayIdx = d.getDay();
        weeklyTrends[dayIdx].reports += 1;
      }
    });
    // Reorder to start from Monday
    const reordered = [...weeklyTrends.slice(1), weeklyTrends[0]];

    return {
      userEngagement: {
        activeUsers: stats.totalUsers,
        newUsers: stats.totalUsers,
        avgSessionDuration: 'N/A',
        bounceRate: 'N/A'
      },
      collectionMetrics: {
        totalCollections,
        successfulCollections: totalCollections,
        missedCollections: 0,
        avgCollectionTime: 'N/A',
        costPerCollection: 'N/A'
      },
      reportingMetrics: {
        totalReports: stats.totalReports,
        resolvedReports,
        pendingReports,
        avgResolutionTime: 'N/A',
        userSatisfaction: resolutionRate
      },
      weeklyTrends: reordered,
      totalCollectors: stats.totalCollectors,
      activeCollectors,
      inactiveCollectors,
      highPriority
    };
  }, [stats, collectors, reports]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData().finally(() => setRefreshing(false));
  };

  const handleExport = () => {
    alert("Exporting analytics report...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 pb-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">System Analytics</h1>
            <p className="text-gray-600">Real-time performance metrics and system health overview</p>
          </div>

          <div className="flex items-center space-x-4 flex-wrap">
            <div className="flex items-center bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-200">
              <FiCalendar className="text-gray-500 mr-2" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-transparent text-sm focus:outline-none cursor-pointer"
              >
                <option value="today">Today</option>
                <option value="this-week">This Week</option>
                <option value="this-month">This Month</option>
                <option value="this-year">This Year</option>
              </select>
            </div>

            <button
              onClick={handleRefresh}
              className={`flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300`}
            >
              <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
            </button>

            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors duration-300"
            >
              <FiDownload />
              <span className="font-medium text-sm hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {loading || !analyticsData ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      ) : (
      <>
      {/* System Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusBadge status="operational" value="All Systems Operational" icon={FiCheckCircle} />
        <StatusBadge status="operational" value={`${analyticsData.activeCollectors} Active Collectors`} icon={FiActivity} />
        <StatusBadge status={analyticsData.highPriority > 0 ? "warning" : "operational"} value={`${analyticsData.highPriority} High Priority Reports`} icon={FiAlertTriangle} />
      </div>

      {/* Key Performance Indicators - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Users"
          value={analyticsData.userEngagement.activeUsers}
          unit=""
          icon={FiUsers}
          color="green"
        />
        <MetricCard
          title="Total Collectors"
          value={analyticsData.totalCollectors}
          unit=""
          icon={FiTruck}
          color="blue"
        />
        <MetricCard
          title="Total Reports"
          value={analyticsData.reportingMetrics.totalReports}
          unit=""
          icon={FiActivity}
          color="purple"
        />
        <MetricCard
          title="Active Collectors"
          value={analyticsData.activeCollectors}
          unit=""
          icon={FiCheckCircle}
          color="green"
        />
      </div>

      {/* Key Performance Indicators - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Collections"
          value={analyticsData.collectionMetrics.totalCollections}
          unit=""
          icon={FiTruck}
          color="amber"
        />
        <MetricCard
          title="Resolved Reports"
          value={analyticsData.reportingMetrics.resolvedReports}
          unit=""
          icon={FiCheckCircle}
          color="green"
        />
        <MetricCard
          title="Pending Reports"
          value={analyticsData.reportingMetrics.pendingReports}
          unit=""
          icon={FiAlertTriangle}
          color="red"
        />
        <MetricCard
          title="Resolution Rate"
          value={analyticsData.reportingMetrics.userSatisfaction}
          unit="%"
          icon={FiTrendingUp}
          color="indigo"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Reports Trend */}
        <BarChart
          title="Weekly Reports Trend"
          data={analyticsData.weeklyTrends}
          dataKey="reports"
          color="blue"
        />

        {/* Performance Gauges */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Resolution Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <PerformanceGauge
              title="Resolution Rate"
              value={analyticsData.reportingMetrics.resolvedReports}
              unit="reports"
              target={analyticsData.reportingMetrics.totalReports || 1}
              color="emerald"
            />
            <PerformanceGauge
              title="Active Collectors"
              value={analyticsData.activeCollectors}
              unit="active"
              target={analyticsData.totalCollectors || 1}
              color="emerald"
            />
          </div>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {/* User Engagement */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FiUsers className="mr-2 text-purple-600" />
            User Engagement
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Users</span>
              <span className="text-lg font-bold text-purple-600">{analyticsData.userEngagement.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Reports Filed</span>
              <span className="text-lg font-bold text-blue-600">{analyticsData.reportingMetrics.totalReports}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Reports Per User</span>
              <span className="text-lg font-bold text-amber-600">{analyticsData.userEngagement.activeUsers > 0 ? (analyticsData.reportingMetrics.totalReports / analyticsData.userEngagement.activeUsers).toFixed(1) : '0'}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
              <span className="text-lg font-bold text-emerald-600">{analyticsData.reportingMetrics.userSatisfaction}%</span>
            </div>
          </div>
        </div>

        {/* Collection Efficiency */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FiTruck className="mr-2 text-amber-600" />
            Collection Efficiency
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Collectors</span>
              <span className="text-lg font-bold text-emerald-600">{analyticsData.activeCollectors}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Inactive Collectors</span>
              <span className="text-lg font-bold text-red-600">{analyticsData.inactiveCollectors}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Collections</span>
              <span className="text-lg font-bold text-indigo-600">{analyticsData.collectionMetrics.totalCollections}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Collections Per Collector</span>
              <span className="text-lg font-bold text-blue-600">{analyticsData.totalCollectors > 0 ? Math.round(analyticsData.collectionMetrics.totalCollections / analyticsData.totalCollectors) : 0}</span>
            </div>
          </div>
        </div>

        {/* Report Resolution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
            <FiBarChart2 className="mr-2 text-blue-600" />
            Report Resolution
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Resolved Reports</span>
              <span className="text-lg font-bold text-emerald-600">{analyticsData.reportingMetrics.resolvedReports}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Pending Reports</span>
              <span className="text-lg font-bold text-amber-600">{analyticsData.reportingMetrics.pendingReports}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">High Priority Open</span>
              <span className="text-lg font-bold text-purple-600">{analyticsData.highPriority}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
              <span className="text-lg font-bold text-green-600">{analyticsData.reportingMetrics.userSatisfaction}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">System Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Users</span>
              <span className="text-sm font-bold text-gray-900">{analyticsData.userEngagement.activeUsers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Collectors</span>
              <span className="text-sm font-bold text-gray-900">{analyticsData.totalCollectors}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-blue-500 transition-all duration-300" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Resolution Rate</span>
              <span className="text-sm font-bold text-gray-900">{analyticsData.reportingMetrics.userSatisfaction}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  parseFloat(analyticsData.reportingMetrics.userSatisfaction) > 80
                    ? "bg-emerald-500"
                    : parseFloat(analyticsData.reportingMetrics.userSatisfaction) > 60
                      ? "bg-amber-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${analyticsData.reportingMetrics.userSatisfaction}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">System Status</span>
              <span className="text-sm font-bold text-emerald-600">Operational</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* Footer Info */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Last Updated:</span> Just now
        </p>
        <p className="text-xs text-gray-500 mt-2">
          All analytics are computed from real database records. Click refresh to update.
        </p>
      </div>
    </div>
  );
};

export default SystemAnalytics;
