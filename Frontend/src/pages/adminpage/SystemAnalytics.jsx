import React, { useState, useEffect } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
  FiCalendar,
  FiDownload,
  FiRefreshCw,
  FiAlertTriangle,
  FiCheckCircle,
  FiZap,
  FiUsers,
  FiTruck,
  FiActivity
} from "react-icons/fi";

// Analytics Data
const analyticsData = {
  timeRange: "this-month",
  systemHealth: {
    uptime: 99.8,
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 58,
    avgResponseTime: 245, // milliseconds
    errorRate: 0.12
  },
  userEngagement: {
    totalSessions: 15420,
    activeUsers: 2450,
    newUsers: 145,
    avgSessionDuration: 8.5, // minutes
    bounceRate: 12.3 // percentage
  },
  collectionMetrics: {
    totalCollections: 1024,
    successfulCollections: 987,
    missedCollections: 37,
    avgCollectionTime: 2.3, // hours
    costPerCollection: 450 // currency units
  },
  reportingMetrics: {
    totalReports: 523,
    resolvedReports: 487,
    pendingReports: 36,
    avgResolutionTime: 18.5, // hours
    userSatisfaction: 94.2 // percentage
  },
  weeklyTrends: [
    { day: "Mon", collections: 142, reports: 56, users: 320 },
    { day: "Tue", collections: 158, reports: 63, users: 345 },
    { day: "Wed", collections: 175, reports: 71, users: 380 },
    { day: "Thu", collections: 168, reports: 68, users: 370 },
    { day: "Fri", collections: 189, reports: 82, users: 410 },
    { day: "Sat", collections: 145, reports: 52, users: 290 },
    { day: "Sun", collections: 118, reports: 41, users: 210 }
  ],
  performanceMetrics: {
    appLoad: 1.2, // seconds
    dbQuery: 0.45, // seconds
    apiResponse: 0.8, // seconds
    cacheHitRate: 78.5 // percentage
  }
};

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

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
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
              className={`flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 ${refreshing ? "animate-spin" : ""}`}
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

      {/* System Health Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusBadge status="operational" value="All Systems Operational" icon={FiCheckCircle} />
        <StatusBadge status="operational" value="99.8% Uptime" icon={FiActivity} />
        <StatusBadge status="warning" value="2 Non-Critical Alerts" icon={FiAlertTriangle} />
      </div>

      {/* Key Performance Indicators - Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="System Uptime"
          value={analyticsData.systemHealth.uptime}
          unit="%"
          change={0.5}
          trend="up"
          icon={FiActivity}
          color="green"
        />
        <MetricCard
          title="Avg Response Time"
          value={analyticsData.systemHealth.avgResponseTime}
          unit="ms"
          change={5.2}
          trend="down"
          icon={FiZap}
          color="blue"
        />
        <MetricCard
          title="Error Rate"
          value={analyticsData.systemHealth.errorRate}
          unit="%"
          change={0.03}
          trend="down"
          icon={FiAlertTriangle}
          color="red"
        />
        <MetricCard
          title="Active Sessions"
          value={analyticsData.userEngagement.totalSessions.toLocaleString()}
          unit=""
          change={12.4}
          trend="up"
          icon={FiUsers}
          color="purple"
        />
      </div>

      {/* Key Performance Indicators - Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Collections"
          value={analyticsData.collectionMetrics.totalCollections}
          unit=""
          change={8.7}
          trend="up"
          icon={FiTruck}
          color="amber"
        />
        <MetricCard
          title="Success Rate"
          value={analyticsData.collectionMetrics.successfulCollections}
          unit=""
          change={2.1}
          trend="up"
          icon={FiCheckCircle}
          color="green"
        />
        <MetricCard
          title="Resolved Reports"
          value={analyticsData.reportingMetrics.resolvedReports}
          unit=""
          change={15.3}
          trend="up"
          icon={FiCheckCircle}
          color="green"
        />
        <MetricCard
          title="User Satisfaction"
          value={analyticsData.reportingMetrics.userSatisfaction}
          unit="%"
          change={1.8}
          trend="up"
          icon={FiTrendingUp}
          color="indigo"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Weekly Collections Trend */}
        <BarChart
          title="Weekly Collections Trend"
          data={analyticsData.weeklyTrends}
          dataKey="collections"
          color="emerald"
        />

        {/* Weekly Reports Trend */}
        <BarChart
          title="Weekly Reports Trend"
          data={analyticsData.weeklyTrends}
          dataKey="reports"
          color="blue"
        />
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <PerformanceGauge
          title="App Load Time"
          value={analyticsData.performanceMetrics.appLoad}
          unit="sec"
          target={3}
          color="emerald"
        />
        <PerformanceGauge
          title="Database Query Time"
          value={analyticsData.performanceMetrics.dbQuery}
          unit="sec"
          target={1}
          color="emerald"
        />
        <PerformanceGauge
          title="API Response Time"
          value={analyticsData.performanceMetrics.apiResponse}
          unit="sec"
          target={2}
          color="emerald"
        />
        <PerformanceGauge
          title="Cache Hit Rate"
          value={analyticsData.performanceMetrics.cacheHitRate}
          unit="%"
          target={100}
          color="emerald"
        />
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
              <span className="text-sm font-medium text-gray-700">Active Users</span>
              <span className="text-lg font-bold text-purple-600">{analyticsData.userEngagement.activeUsers.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">New Users</span>
              <span className="text-lg font-bold text-blue-600">+{analyticsData.userEngagement.newUsers}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Avg Session Duration</span>
              <span className="text-lg font-bold text-amber-600">{analyticsData.userEngagement.avgSessionDuration}m</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Bounce Rate</span>
              <span className="text-lg font-bold text-red-600">{analyticsData.userEngagement.bounceRate}%</span>
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
              <span className="text-sm font-medium text-gray-700">Success Rate</span>
              <span className="text-lg font-bold text-emerald-600">
                {(
                  (analyticsData.collectionMetrics.successfulCollections /
                    analyticsData.collectionMetrics.totalCollections) *
                  100
                ).toFixed(1)}
                %
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Missed Collections</span>
              <span className="text-lg font-bold text-red-600">{analyticsData.collectionMetrics.missedCollections}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Avg Time per Collection</span>
              <span className="text-lg font-bold text-indigo-600">{analyticsData.collectionMetrics.avgCollectionTime}h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Cost per Collection</span>
              <span className="text-lg font-bold text-blue-600">₹{analyticsData.collectionMetrics.costPerCollection}</span>
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
              <span className="text-sm font-medium text-gray-700">Avg Resolution Time</span>
              <span className="text-lg font-bold text-purple-600">{analyticsData.reportingMetrics.avgResolutionTime}h</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">User Satisfaction</span>
              <span className="text-lg font-bold text-green-600">{analyticsData.reportingMetrics.userSatisfaction}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* System Resources */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-6">System Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* CPU Usage */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">CPU Usage</span>
              <span className="text-sm font-bold text-gray-900">{analyticsData.systemHealth.cpuUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  analyticsData.systemHealth.cpuUsage > 80
                    ? "bg-red-500"
                    : analyticsData.systemHealth.cpuUsage > 60
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${analyticsData.systemHealth.cpuUsage}%` }}
              ></div>
            </div>
          </div>

          {/* Memory Usage */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Memory Usage</span>
              <span className="text-sm font-bold text-gray-900">{analyticsData.systemHealth.memoryUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  analyticsData.systemHealth.memoryUsage > 80
                    ? "bg-red-500"
                    : analyticsData.systemHealth.memoryUsage > 60
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${analyticsData.systemHealth.memoryUsage}%` }}
              ></div>
            </div>
          </div>

          {/* Disk Usage */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Disk Usage</span>
              <span className="text-sm font-bold text-gray-900">{analyticsData.systemHealth.diskUsage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  analyticsData.systemHealth.diskUsage > 80
                    ? "bg-red-500"
                    : analyticsData.systemHealth.diskUsage > 60
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${analyticsData.systemHealth.diskUsage}%` }}
              ></div>
            </div>
          </div>

          {/* Network Status */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-medium text-gray-700">Network Status</span>
              <span className="text-sm font-bold text-emerald-600">Healthy</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className="h-3 rounded-full bg-emerald-500 transition-all duration-300" style={{ width: "100%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Last Updated:</span> Just now
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Analytics data updates every 5 minutes. For real-time monitoring, please use the system dashboard.
        </p>
      </div>
    </div>
  );
};

export default SystemAnalytics;
