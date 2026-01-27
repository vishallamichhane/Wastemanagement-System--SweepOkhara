import React, { useEffect, useMemo, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiTrendingUp,
  FiTrendingDown,
  FiClock,
  FiMapPin,
  FiBarChart2,
  FiPieChart,
  FiGrid,
  FiEye,
  FiArrowRight,
} from "react-icons/fi";
import {
  BsCheckCircle,
  BsExclamationTriangle,
  BsArrowClockwise,
  BsClock,
} from "react-icons/bs";
import axios from "axios";


const statusConfig = {
  pending: {
    label: "Pending",
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

const sampleReports = [
  {
    id: "803F9A",
    date: "2024-07-15",
    issueType: "Overflowing Bin",
    status: "resolved",
    location: "Lakeside Road, Ward 6",
    latitude: "28.2096",
    longitude: "83.9586",
    assignedTo: "Cleanup Team A",
    priority: "medium",
    description: "Public bin near Lakeside overflowing with tourist waste",
    images: 2,
    photos: ["photo1.jpg", "photo2.jpg"],
  },
  // {
  //   id: "48168C",
  //   date: "2024-07-12",
  //   issueType: "Missed Pickup",
  //   status: "in-progress",
  //   location: "Birauta, Ward 8",
  //   latitude: "28.2380",
  //   longitude: "83.9956",
  //   assignedTo: "Collection Team B",
  //   priority: "high",
  //   description: "Regular waste pickup missed in residential area",
  //   images: 1,
  //   photos: ["photo3.jpg"]
  // },
  // {
  //   id: "E2H5K7",
  //   date: "2024-07-11",
  //   issueType: "Illegal Dumping",
  //   status: "received",
  //   location: "Seti River Bank, Ward 9",
  //   latitude: "28.2126",
  //   longitude: "83.9630",
  //   assignedTo: "Pending Assignment",
  //   priority: "high",
  //   description: "Construction waste dumped illegally near riverbank",
  //   images: 3,
  //   photos: ["photo4.jpg", "photo5.jpg", "photo6.jpg"]
  // },
  // {
  //   id: "9F632N",
  //   date: "2024-07-05",
  //   issueType: "Damaged Bin",
  //   status: "resolved",
  //   location: "Chipledhunga, Ward 3",
  //   latitude: "28.2180",
  //   longitude: "83.9856",
  //   assignedTo: "Maintenance Team",
  //   priority: "medium",
  //   description: "Public bin damaged and needs replacement",
  //   images: 1,
  //   photos: ["photo7.jpg"]
  // },
  // {
  //   id: "1C3P8Q",
  //   date: "2024-06-28",
  //   issueType: "Overflowing Bin",
  //   status: "resolved",
  //   location: "Old Bazaar, Ward 1",
  //   latitude: "28.2090",
  //   longitude: "83.9850",
  //   assignedTo: "Cleanup Team C",
  //   priority: "high",
  //   description: "Market area bin overflowing during peak hours",
  //   images: 2,
  //   photos: ["photo8.jpg", "photo9.jpg"]
  // },
  // {
  //   id: "7D4G2M",
  //   date: "2024-06-25",
  //   issueType: "Street Litter",
  //   status: "in-progress",
  //   location: "New Road, Ward 2",
  //   latitude: "28.2110",
  //   longitude: "83.9890",
  //   assignedTo: "Street Cleaning Team",
  //   priority: "medium",
  //   description: "Accumulated litter on main street",
  //   images: 0,
  //   photos: []
  // }
];

const summaryStats = [
  {
    label: "Total Reports",
    value: 487,
    change: "+12%",
    trend: "up",
    icon: FiGrid,
    color: "blue",
  },
  {
    label: "Resolved",
    value: 412,
    change: "+8%",
    trend: "up",
    icon: FiTrendingUp,
    color: "green",
  },
  {
    label: "In Progress",
    value: 45,
    change: "+3",
    trend: "up",
    icon: FiClock,
    color: "amber",
  },
  {
    label: "Received",
    value: 30,
    change: "-5",
    trend: "down",
    icon: FiTrendingDown,
    color: "indigo",
  },
];

const issueBreakdown = [
  { label: "Overflowing Bin", count: 156, percent: 32 },
  { label: "Missed Pickup", count: 124, percent: 25 },
  { label: "Illegal Dumping", count: 98, percent: 20 },
  { label: "Broken Container", count: 67, percent: 14 },
  { label: "Street Litter", count: 42, percent: 9 },
];

const areaBreakdown = [
  { label: "Ward 1", count: 89 },
  { label: "Ward 2", count: 76 },
  { label: "Ward 3", count: 92 },
  { label: "Ward 4", count: 81 },
  { label: "Ward 5", count: 95 },
  { label: "Ward 6", count: 54 },
];

const trendData = [
  { month: "Jan", submitted: 45, resolved: 42 },
  { month: "Feb", submitted: 56, resolved: 50 },
  { month: "Mar", submitted: 62, resolved: 58 },
  { month: "Apr", submitted: 71, resolved: 62 },
  { month: "May", submitted: 85, resolved: 75 },
  { month: "Jun", submitted: 92, resolved: 82 },
  { month: "Jul", submitted: 76, resolved: 63 },
];

const StatCard = ({ label, value, change, trend, icon: Icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-red-50 text-red-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          <Icon className="text-xl" />
        </div>
        <div
          className={`text-sm font-semibold flex items-center gap-1 ${trend === "up" ? "text-emerald-600" : "text-red-600"}`}
        >
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
        {accent === "pie" ? (
          <FiPieChart className="text-gray-500" />
        ) : (
          <FiBarChart2 className="text-gray-500" />
        )}
      </div>
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm text-gray-700 font-medium">
              <span>{item.label}</span>
              <span>
                {item.count}
                {item.percent ? ` • ${item.percent}%` : ""}
              </span>
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
            <span className="text-xs font-semibold text-gray-600">
              {item.month}
            </span>
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
                Status
              </th>
              <th className="text-left px-6 py-4 font-semibold text-gray-700">
                Priority
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
                  colSpan="7"
                  className="px-6 py-10 text-center text-gray-500"
                >
                  <BsExclamationTriangle className="mx-auto text-2xl mb-2 text-amber-500" />
                  No reports match the filters.
                </td>
              </tr>
            ) : (
              reports.map((report) => {
                const StatusIcon = statusConfig[report?.status]?.icon;
                return (
                  <tr
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                    key={report._id}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {report._id}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {report.reportType}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="text-gray-500" />
                        <span className="truncate max-w-xs block">
                          {report.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig[report?.status]?.bg} ${statusConfig[report?.status]?.color}`}
                      >
                        <StatusIcon size={14} />{" "}
                        {statusConfig[report?.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[report?.priority]?.bg} ${priorityConfig[report?.priority]?.color}`}
                      >
                        {priorityConfig[report?.priority]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {report?.assignedTo}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
                        onClick={() => onView(report)}
                      >
                        <FiEye />
                        View Details
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
  const [view, setView] = useState("analytics");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [modalReport, setModalReport] = useState(null);
  const [isLoading, setIsLoading]=useState(false);
  const [reports, setReports] = useState([])
  

useEffect(() => {
  setIsLoading(true);

  axios.get("/api/reports")
    .then(res => {
      const normalized = res.data.map(r => ({
        id: r._id,
        issueType: r.reportLabel,    
        reportType: r.reportType,      
        description: r.description,
        location: r.location,
        latitude: r.latitude,
        longitude: r.longitude,
        status: r.status.toLowerCase(),
        photos: r.imageUrl || [],
        images: r.imageUrl?.length || 0,
        date: new Date(r.createdAt).toISOString().split("T")[0],
        assignedTo: "Unassigned",      
        priority: "medium",            
      }));

      setReports(normalized);
    })
    .catch(err => {
      console.error("Error fetching reports:", err);
    })
    .finally(() => setIsLoading(false));
}, []);

const filteredReports = useMemo(() => {
  return reports.filter(r => {
    const q = search.toLowerCase();

    const matchesSearch =
      r.issueType?.toLowerCase().includes(q) ||
      r.location?.toLowerCase().includes(q) ||
      r.id?.toLowerCase().includes(q) ||
      r.description?.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === "all" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
}, [search, statusFilter, reports]);

  // const filteredReports = useMemo(() => {
  //   return reports.filter((r) => {
  //     const matchesSearch =
  //       r.issueType.toLowerCase().includes(search.toLowerCase()) ||
  //       r.location.toLowerCase().includes(search.toLowerCase()) ||
  //       r.id.toLowerCase().includes(search.toLowerCase()) ||
  //       r.assignedTo.toLowerCase().includes(search.toLowerCase());
  //     const matchesStatus = statusFilter === "all" || r.status === statusFilter;
  //     const matchesPriority =
  //       priorityFilter === "all" || r.priority === priorityFilter;
  //     return matchesSearch && matchesStatus && matchesPriority;
  //   });
  // }, [search, statusFilter, priorityFilter]);

  const handleExport = () => {
  const rows = [
    ["ID", "Issue", "Status", "Location", "Date"],
    ...filteredReports.map(r => [
      r.id,
      r.issueType,
      r.status,
      r.location,
      r.date,
    ]),
  ];

  const csv = rows.map(row => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reports.csv";
  a.click();
};
  // const handleExport = () => {
  //   const rows = [
  //     [
  //       "Report ID",
  //       "Issue",
  //       "Status",
  //       "Priority",
  //       "Location",
  //       "Assigned To",
  //       "Date",
  //     ],
  //     ...filteredReports.map((r) => [
  //       r.id,
  //       r.issueType,
  //       r.status,
  //       r.priority,
  //       r.location,
  //       r.assignedTo,
  //       r.date,
  //     ]),
  //   ];
  //   const csv = rows.map((row) => row.join(",")).join("\n");
  //   const blob = new Blob([csv], { type: "text/csv" });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = "reports-analytics.csv";
  //   a.click();
  // };


  return (
    <div className="space-y-6 animate-fadeInUp">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Monitor user reports, track resolution, and export insights.
          </p>
        </div>
        <div className="flex gap-2 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === "analytics"
                ? "bg-emerald-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setView("analytics")}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              view === "reports"
                ? "bg-emerald-600 text-white shadow"
                : "text-gray-700 hover:bg-gray-50"
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
            <BarList
              title="Reports by Ward"
              data={areaBreakdown}
              accent="bar"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BarList
              title="Top Issue Types"
              data={issueBreakdown}
              accent="pie"
            />
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  At a Glance
                </h3>
                <FiGrid className="text-gray-500" />
              </div>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Average Resolution</span>
                  <span className="font-semibold">2.3 days</span>
                </div>
                <div className="flex justify-between">
                  <span>High Priority Open</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Assignments</span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex justify-between">
                  <span>User Satisfaction</span>
                  <span className="font-semibold">94%</span>
                </div>
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
                  placeholder="Search by ID, issue, location, assignee"
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
                Showing {filteredReports.length} of {sampleReports.length}{" "}
                reports
              </span>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow hover:shadow-md"
              >
                <FiDownload /> Export CSV
              </button>
            </div>
          </div>
          {isLoading?<div>Loading...</div>:
          <ReportsTable reports={filteredReports} onView={setModalReport} />}
        </div>
      )}
      {(Array.isArray(modalReport) && modalReport?.images?.length > 0) ? (
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    📍 Location
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {modalReport.location}
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
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${priorityConfig[modalReport.priority].bg} ${priorityConfig[modalReport.priority].color}`}
                  >
                    {priorityConfig[modalReport.priority].label}
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
                          className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
                        >
                          <span className="text-xs text-gray-500">
                            📷 {photo}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      * Photo preview feature coming soon
                    </p>
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
                    console.log(`Assign report ${modalReport.id} to collector`)
                  }
                >
                  <FiArrowRight className="text-sm" />
                  Assign to Collector
                </button>
              </div>
            </div>
          </div>
        </div>
      ):<p>No images attached</p>}
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
