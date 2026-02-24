import React, { useState, useEffect, useRef } from 'react';
import { 
  BsBell, 
  BsTrash2, 
  BsCheckCircle, 
  BsClock, 
  BsExclamationTriangle, 
  BsCalendarEvent,
  BsGeoAlt,
  BsPersonCircle,
  BsTools,
  BsCloudRain,
  BsTrophy,
  BsTruck
} from 'react-icons/bs';

function CollectorNotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch real reports + today's scheduled ward tasks and generate notifications
  useEffect(() => {
    const fetchAllNotifications = async () => {
      try {
        const token = localStorage.getItem('collectorToken');
        if (!token) return;

        // Read dismissed/read notification IDs from localStorage
        const readIds = JSON.parse(localStorage.getItem('collectorReadNotifications') || '[]');

        // Fetch reports and today's ward tasks in parallel
        const [reportsRes, tasksRes] = await Promise.all([
          fetch('http://localhost:3000/api/collectors/my-reports', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
          fetch('http://localhost:3000/api/ward-tasks/today', {
            headers: { 'Authorization': `Bearer ${token}` },
          }),
        ]);

        // --- Report Notifications ---
        let reportNotifications = [];
        const reportResult = await reportsRes.json();
        if (reportResult.success && reportResult.data) {
          reportNotifications = reportResult.data.map((report) => {
            const reportId = report._id.slice(-6).toUpperCase();
            const isResolved = report.status === 'resolved';
            const isInProgress = report.status === 'in-progress';

            let type, icon, title, message;

            if (isResolved) {
              type = 'resolved';
              icon = 'resolved';
              title = `Report Resolved: Ward ${report.ward}`;
              message = `Report #${reportId} (${report.reportLabel}) has been resolved.`;
            } else if (isInProgress) {
              type = 'task-new';
              icon = 'task';
              title = `In Progress: ${report.reportLabel} - Ward ${report.ward}`;
              message = `Report #${reportId}: ${report.description?.slice(0, 80)}${report.description?.length > 80 ? '...' : ''}`;
            } else {
              const priority = report.priority || 'medium';
              type = priority === 'high' ? 'task-urgent' : 'user-report';
              icon = priority === 'high' ? 'urgent' : 'report';
              title = priority === 'high'
                ? `Urgent Report: ${report.reportLabel} - Ward ${report.ward}`
                : `New Report: ${report.reportLabel} - Ward ${report.ward}`;
              message = `Report #${reportId} by ${report.userName || 'User'}: ${report.description?.slice(0, 80)}${report.description?.length > 80 ? '...' : ''}`;
            }

            return {
              id: report._id,
              type,
              title,
              message,
              icon,
              read: readIds.includes(report._id) || isResolved,
              timestamp: new Date(report.createdAt),
              link: '/collector/reports',
              ward: `Ward ${report.ward}`,
              reportId: reportId,
              location: report.location,
            };
          });
        }

        // --- Helper: parse end time from timeSlot like "6:00 AM - 8:00 AM" ---
        const parseEndTime = (timeSlot) => {
          try {
            const endPart = timeSlot.split('-')[1]?.trim(); // e.g. "8:00 AM"
            if (!endPart) return null;
            const [timePart, ampm] = endPart.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);
            if (ampm?.toUpperCase() === 'PM' && hours !== 12) hours += 12;
            if (ampm?.toUpperCase() === 'AM' && hours === 12) hours = 0;
            const now = new Date();
            return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
          } catch { return null; }
        };

        // --- Schedule / Ward Task Notifications ---
        let scheduleNotifications = [];
        const tasksResult = await tasksRes.json();
        if (tasksResult.success && tasksResult.data) {
          const today = new Date();
          const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
          const dateStr = today.toISOString().split('T')[0];

          tasksResult.data.forEach((task) => {
            const scheduleId = `schedule-${task.ward}-${dateStr}`;
            let icon, title, message, type;

            // Check if the task is overdue (time slot has passed but not completed)
            const endTime = parseEndTime(task.timeSlot);
            const isOverdue = endTime && today > endTime && task.status !== 'completed';

            if (task.status === 'completed') {
              icon = 'resolved';
              type = 'schedule-done';
              title = `Ward ${task.ward} — Collection Done ✓`;
              message = `Today's pickup for Ward ${task.ward} (${task.timeSlot}) has been completed.`;
            } else if (isOverdue) {
              // Overdue — time slot passed but task not completed
              icon = 'urgent';
              type = 'schedule-overdue';
              title = `⚠️ Overdue: Ward ${task.ward}`;
              message = task.status === 'in-progress'
                ? `Collection in Ward ${task.ward} is still in progress past the scheduled time (${task.timeSlot}). Please complete it ASAP.`
                : `Waste pickup for Ward ${task.ward} was scheduled for ${task.timeSlot} but has not been started. Please take action immediately.`;
            } else if (task.status === 'in-progress') {
              icon = 'schedule';
              type = 'schedule-active';
              title = `Ward ${task.ward} — Collection In Progress`;
              message = `You're currently collecting in Ward ${task.ward}. Time slot: ${task.timeSlot}.`;
            } else {
              icon = 'schedule';
              type = 'schedule-pending';
              title = `Scheduled Today: Ward ${task.ward}`;
              message = `Pickup scheduled for ${dayName} in Ward ${task.ward}. Time slot: ${task.timeSlot}. Tap to start collection.`;
            }

            scheduleNotifications.push({
              id: scheduleId,
              type,
              title,
              message,
              icon,
              read: readIds.includes(scheduleId) || task.status === 'completed',
              timestamp: today,
              link: '/collector/tasks',
              ward: `Ward ${task.ward}`,
              reportId: null,
            });

            // Add a separate urgent overdue alert notification (never auto-read)
            if (isOverdue) {
              const overdueId = `overdue-${task.ward}-${dateStr}`;
              scheduleNotifications.push({
                id: overdueId,
                type: 'schedule-overdue',
                title: `🚨 Ward ${task.ward} — Pickup Not Completed`,
                message: `The scheduled time (${task.timeSlot}) has passed and Ward ${task.ward} waste has not been collected. Residents are still waiting.`,
                icon: 'urgent',
                read: readIds.includes(overdueId),
                timestamp: endTime || today,
                link: '/collector/tasks',
                ward: `Ward ${task.ward}`,
                reportId: null,
              });
            }
          });
        }

        // Merge: overdue first, then schedule, then reports
        const allNotifications = [...scheduleNotifications, ...reportNotifications];
        allNotifications.sort((a, b) => {
          // Overdue notifications always at the very top
          const aIsOverdue = a.type === 'schedule-overdue' ? 2 : 0;
          const bIsOverdue = b.type === 'schedule-overdue' ? 2 : 0;
          if (aIsOverdue !== bIsOverdue) return bIsOverdue - aIsOverdue;
          // Schedule notifications next
          const aIsSchedule = a.type?.startsWith('schedule-') ? 1 : 0;
          const bIsSchedule = b.type?.startsWith('schedule-') ? 1 : 0;
          if (aIsSchedule !== bIsSchedule) return bIsSchedule - aIsSchedule;
          return b.timestamp - a.timestamp;
        });

        setNotifications(allNotifications);
        const unread = allNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchAllNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchAllNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    // Persist read state
    const readIds = JSON.parse(localStorage.getItem('collectorReadNotifications') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('collectorReadNotifications', JSON.stringify(readIds));
    }
  };

  const deleteNotification = (id) => {
    const notifToDelete = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(notif => notif.id !== id));
    if (notifToDelete && !notifToDelete.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
    // Persist all as read
    const allIds = notifications.map(n => n.id);
    localStorage.setItem('collectorReadNotifications', JSON.stringify(allIds));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'urgent':
        return <BsExclamationTriangle className="text-red-500 text-lg" />;
      case 'report':
        return <BsPersonCircle className="text-orange-500 text-lg" />;
      case 'task':
        return <BsCalendarEvent className="text-blue-500 text-lg" />;
      case 'route':
        return <BsGeoAlt className="text-purple-500 text-lg" />;
      case 'weather':
        return <BsCloudRain className="text-cyan-500 text-lg" />;
      case 'resolved':
        return <BsCheckCircle className="text-emerald-500 text-lg" />;
      case 'maintenance':
        return <BsTools className="text-amber-500 text-lg" />;
      case 'achievement':
        return <BsTrophy className="text-yellow-500 text-lg" />;
      case 'schedule':
        return <BsTruck className="text-indigo-500 text-lg" />;
      default:
        return <BsBell className="text-gray-500 text-lg" />;
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-700 hover:bg-emerald-50 rounded-full transition-all duration-300 group"
        aria-label="Notifications"
      >
        <BsBell className="text-xl transition-transform group-hover:scale-110" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full px-1.5 animate-pulse shadow-lg">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div 
          className="fixed inset-x-0 top-16 mx-2 sm:absolute sm:inset-x-auto sm:top-full sm:mt-3 sm:right-0 sm:mx-0 w-auto sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fadeInDown"
          style={{ maxHeight: '80vh' }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <BsBell className="text-white text-xl" />
              <h3 className="text-white text-lg font-bold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-white/90 hover:text-white text-xs font-semibold px-3 py-1.5 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6">
                <BsBell className="text-6xl text-gray-300 mb-4" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-1">Stay updated with your collection tasks</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative px-4 sm:px-6 py-3 sm:py-4 transition-all duration-300 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? 'bg-emerald-50/30' : 'bg-white'
                    }`}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                      if (notification.link) window.location.href = notification.link;
                    }}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.icon)}
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-1"></div>
                          )}
                        </div>
                        <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        {/* Metadata */}
                        {(notification.ward || notification.reportId) && (
                          <div className="flex items-center gap-2 mt-2">
                            {notification.ward && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium text-xs">
                                <BsGeoAlt className="text-xs" />
                                {notification.ward}
                              </span>
                            )}
                            {notification.reportId && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-mono font-medium text-xs">
                                #{notification.reportId}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                          <BsClock className="text-xs" />
                          {formatTime(notification.timestamp)}
                        </p>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="flex-shrink-0 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
                        aria-label="Delete notification"
                      >
                        <BsTrash2 className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={clearAll}
                className="text-red-500 hover:text-red-600 text-sm font-semibold px-3 py-1.5 hover:bg-red-50 rounded-lg transition-all duration-300 flex items-center gap-1.5"
              >
                <BsTrash2 className="text-sm" />
                Clear All
              </button>
              <p className="text-gray-500 text-xs">
                {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CollectorNotificationCenter;
