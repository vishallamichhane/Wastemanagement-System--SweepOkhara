import React, { useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiBarChart2,
  FiPieChart,
  FiGrid,
  FiEye
} from "react-icons/fi";
import { BsCheckCircle, BsExclamationTriangle, BsArrowClockwise, BsClock } from "react-icons/bs";

const statusConfig = {
  received: { label: "Received", color: "text-blue-700", bg: "bg-blue-100", icon: BsClock },
  "in-progress": { label: "In Progress", color: "text-amber-700", bg: "bg-amber-100", icon: BsArrowClockwise },
  resolved: { label: "Resolved", color: "text-emerald-700", bg: "bg-emerald-100", icon: BsCheckCircle }
};

const priorityConfig = {
  high: { label: "High", color: "text-red-700", bg: "bg-red-100" },
  medium: { label: "Medium", color: "text-amber-700", bg: "bg-amber-100" },
  low: { label: "Low", color: "text-blue-700", bg: "bg-blue-100" }
};

const sampleReports = [
  {
    id: "803F9A",
    date: "2024-07-15",
    issueType: "Overflowing Bin",
    status: "resolved",
    location: "Lakeside Road, Ward 6",
    assignedTo: "Cleanup Team A",
    priority: "medium",
    reporter: "Ramesh Thapa",
    reporterEmail: "ramesh.thapa@example.com",
    reporterPhone: "+977 9841000001",
    description: "Public bin near Lakeside overflowing with tourist waste",
    images: 2
  },
  {
    id: "48168C",
    date: "2024-07-12",
    issueType: "Missed Pickup",
    status: "in-progress",
    location: "Birauta, Ward 8",
    assignedTo: "Collection Team B",
    priority: "high",
    reporter: "Sunita Gurung",
    reporterEmail: "sunita.gurung@example.com",
    reporterPhone: "+977 9841000002",
    description: "Regular waste pickup missed in residential area",
    images: 1
  },
  {
    id: "E2H5K7",
    date: "2024-07-11",
    issueType: "Illegal Dumping",
    status: "received",
    location: "Seti River Bank, Ward 9",
    assignedTo: "Pending Assignment",
    priority: "high",
    reporter: "Hotel Mountain View",
    reporterEmail: "info@mountainview.com",
    reporterPhone: "+977 9841000003",
    description: "Construction waste dumped illegally near riverbank",
    images: 3
  },
  {
    id: "9F632N",
    date: "2024-07-05",
    issueType: "Damaged Bin",
    status: "resolved",
    location: "Chipledhunga, Ward 3",
    assignedTo: "Maintenance Team",
    priority: "medium",
    reporter: "Tourist Info Center",
    reporterEmail: "info@touristcenter.com",
    reporterPhone: "+977 9841000004",
    description: "Public bin damaged and needs replacement",
    images: 1
  },
  {
    id: "1C3P8Q",
    date: "2024-06-28",
    issueType: "Overflowing Bin",
    status: "resolved",
    location: "Old Bazaar, Ward 1",
    assignedTo: "Cleanup Team C",
    priority: "high",
    reporter: "Rajesh Sharma",
    reporterEmail: "rajesh.sharma@example.com",
    reporterPhone: "+977 9841000005",
    description: "Market area bin overflowing during peak hours",
    images: 2
  },
  {
    id: "7D4G2M",
    date: "2024-06-25",
    issueType: "Street Litter",
    status: "in-progress",
    location: "New Road, Ward 2",
    assignedTo: "Street Cleaning Team",
    priority: "medium",
    reporter: "Maya Paudel",
    reporterEmail: "maya.paudel@example.com",
    reporterPhone: "+977 9841000006",
    description: "Accumulated litter on main street",
    images: 0
  }
];

const summaryStats = [
  { label: "Total Reports", value: 487, change: "+12%", trend: "up", icon: FiGrid, color: "blue" },
  { label: "Resolved", value: 412, change: "+8%", trend: "up", icon: FiTrendingUp, color: "green" },
  { label: "In Progress", value: 45, change: "+3", trend: "up", icon: FiClock, color: "amber" },
  { label: "Received", value: 30, change: "-5", trend: "down", icon: FiTrendingDown, color: "indigo" }
];

const issueBreakdown = [
  { label: "Overflowing Bin", count: 156, percent: 32 },
  { label: "Missed Pickup", count: 124, percent: 25 },
  { label: "Illegal Dumping", count: 98, percent: 20 },
  { label: "Broken Container", count: 67, percent: 14 },
  { label: "Street Litter", count: 42, percent: 9 }
];

const areaBreakdown = [
  { label: "Ward 1", count: 89 },
  { label: "Ward 2", count: 76 },
  { label: "Ward 3", count: 92 },
  { label: "Ward 4", count: 81 },
  { label: "Ward 5", count: 95 },
  { label: "Ward 6", count: 54 }
];

const trendData = [
  { month: "Jan", submitted: 45, resolved: 42 },
  { month: "Feb", submitted: 56, resolved: 50 },
  { month: "Mar", submitted: 62, resolved: 58 },
  { month: "Apr", submitted: 71, resolved: 62 },
  { month: "May", submitted: 85, resolved: 75 },
  { month: "Jun", submitted: 92, resolved: 82 },
  { month: "Jul", submitted: 76, resolved: 63 }
];

const StatCard = ({ label, value, change, trend, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    indigo: "bg-indigo-50 text-indigo-700"
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="text-xl" />
        </div>
        <div className={`text-sm font-semibold flex items-center gap-1 ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
          {trend === "up" ? <FiTrendingUp /> : <FiTrendingDown />} {change}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
};

const BarList = ({ title, data, accent }) => {
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {accent === "pie" ? <FiPieChart className="text-gray-500" /> : <FiBarChart2 className="text-gray-500" />}
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm text-gray-700 font-medium">
              <span>{item.label}</span>
              <span>{item.count}{item.percent ? ` • ${item.percent}%` : ""}</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                style={{ width: `${(item.count / max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendBars = ({ data }) => {
  const max = Math.max(...data.map((d) => d.submitted));
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Trend</h3>
        <FiBarChart2 className="text-gray-500" />
      </div>
      <div className="grid grid-cols-7 gap-3">
        {data.map((item) => (
          <div key={item.month} className="flex flex-col items-center gap-2">
            <div className="w-full bg-gray-100 rounded-xl h-28 flex items-end gap-1 p-1">
              <div
                className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-lg"
                style={{ height: `${(item.submitted / max) * 100}%` }}
              ></div>
              <div
                className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-lg"
                style={{ height: `${(item.resolved / max) * 100}%` }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-gray-600">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500"></span> Submitted
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Resolved
        </div>
      </div>
    </div>
  );
};

const ReportsTable = ({ reports, onExpand, expandedId }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Report ID</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Issue</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Location</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Status</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Priority</th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">Assigned</th>
              <th className="text-right px-6 py-4 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                  <BsExclamationTriangle className="mx-auto text-2xl mb-2 text-amber-500" />
                  No reports match the filters.
                </td>
              </tr>
            )}
            {reports.map((report) => {
              const StatusIcon = statusConfig[report.status].icon;
              return (
                <React.Fragment key={report.id}>
                  <tr className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-semibold text-gray-900">{report.id}</td>
                    <td className="px-6 py-4 text-gray-700">{report.issueType}</td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-gray-500" />
                        <span className="truncate max-w-xs block">{report.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[report.status].bg} ${statusConfig[report.status].color}`}>
                        <StatusIcon size={14} /> {statusConfig[report.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[report.priority].bg} ${priorityConfig[report.priority].color}`}>
                        {priorityConfig[report.priority].label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{report.assignedTo}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                        onClick={() => onExpand(expandedId === report.id ? null : report.id)}
                      >
                        <FiEye />
                        {expandedId === report.id ? "Close" : "View"}
                      </button>
                    </td>
                  </tr>
                  {expandedId === report.id && (
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <td colSpan="7" className="px-6 py-5">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-2 space-y-3">
                            <div>
                              <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Description</div>
                              <div className="text-gray-800 leading-relaxed">{report.description}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Submitted</div>
                                {report.date}
                              </div>
                              <div>
                                <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Images</div>
                                {report.images} attachments
                              </div>
                            </div>
                          </div>
                          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                                <FiUser />
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 font-semibold">Reporter</div>
                                <div className="font-semibold text-gray-900">{report.reporter}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                              <FiMail className="text-gray-500" />
                              <span className="break-all">{report.reporterEmail}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-700">
                              <FiPhone className="text-gray-500" />
                              <span>{report.reporterPhone}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ReportsAnalytics = () => {
  const [view, setView] = useState("analytics");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);

  const filteredReports = useMemo(() => {
    return sampleReports.filter((r) => {
      const matchesSearch =
        r.issueType.toLowerCase().includes(search.toLowerCase()) ||
        r.location.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.reporter.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      const matchesPriority = priorityFilter === "all" || r.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, statusFilter, priorityFilter]);

  const handleExport = () => {
    const rows = [
      ["Report ID", "Issue", "Status", "Priority", "Location", "Assigned To", "Reporter", "Date"],
      ...filteredReports.map((r) => [
        r.id,
        r.issueType,
        r.status,
        r.priority,
        r.location,
        r.assignedTo,
        r.reporter,
        r.date
      ])
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports-analytics.csv";
    a.click();
  };

  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Monitor user reports, track resolution, and export insights.</p>
        </div>
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === "analytics" ? "bg-emerald-600 text-white shadow" : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setView("analytics")}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === "reports" ? "bg-emerald-600 text-white shadow" : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setView("reports")}
          >
            Reports
          </button>
        </div>
      </div>

      {view === "analytics" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {summaryStats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <TrendBars data={trendData} />
            </div>
            <BarList title="Reports by Ward" data={areaBreakdown} accent="bar" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarList title="Top Issue Types" data={issueBreakdown} accent="pie" />
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">At a Glance</h3>
                <FiGrid className="text-gray-500" />
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between"><span>Average Resolution</span><span className="font-semibold">2.3 days</span></div>
                <div className="flex justify-between"><span>High Priority Open</span><span className="font-semibold">12</span></div>
                <div className="flex justify-between"><span>Pending Assignments</span><span className="font-semibold">18</span></div>
                <div className="flex justify-between"><span>User Satisfaction</span><span className="font-semibold">94%</span></div>
              </div>
            </div>
          </div>
        </>
      )}

      {view === "reports" && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2 relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by ID, issue, location, reporter"
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
              <span>Showing {filteredReports.length} of {sampleReports.length} reports</span>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow hover:shadow-md"
              >
                <FiDownload /> Export CSV
              </button>
            </div>
          </div>

          <ReportsTable reports={filteredReports} onExpand={setExpandedId} expandedId={expandedId} />
        </div>
      )}
    </div>
  );
};

export default ReportsAnalytics;
