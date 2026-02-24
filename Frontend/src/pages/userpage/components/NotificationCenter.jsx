import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BsBell, BsTrash2, BsCheckCircle, BsClock, BsExclamationTriangle, BsCalendarEvent, BsTruck, BsCheckAll } from 'react-icons/bs';
import { useUser } from '@clerk/clerk-react';
import { WARD_SCHEDULES } from '../../../data/wardSchedules';

// Day name mapping
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [wardCollector, setWardCollector] = useState(null); // Real collector from DB
  const dropdownRef = useRef(null);
  const emailSentRef = useRef(false);
  const { user: clerkUser, isLoaded } = useUser();

  // Get user's ward from Clerk metadata
  const userWard = clerkUser?.publicMetadata?.ward || clerkUser?.unsafeMetadata?.ward || '';
  // Parse ward number safely from both "Ward 14" and "14" formats
  const wardNum = parseInt(String(userWard).replace(/\D/g, '')) || 0;

  // Get ward schedule info for the user
  const getWardSchedule = (wardNum) => {
    const key = `Ward ${wardNum}`;
    return WARD_SCHEDULES[key] || null;
  };

  // Fetch real collector assigned to user's ward from the database
  useEffect(() => {
    if (!wardNum) return;
    fetch(`http://localhost:3000/api/collectors/ward/${wardNum}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.data) setWardCollector(data.data);
        else setWardCollector(null);
      })
      .catch(() => setWardCollector(null));
  }, [wardNum]);

  // Get upcoming pickup days for a schedule
  const getUpcomingPickups = (schedule) => {
    if (!schedule) return [];
    const now = new Date();
    const today = now.getDay();
    const pickups = [];

    for (let offset = 0; offset < 7; offset++) {
      const dayIndex = (today + offset) % 7;
      if (schedule.pickupDays.includes(dayIndex)) {
        const pickupDate = new Date(now);
        pickupDate.setDate(pickupDate.getDate() + offset);
        pickupDate.setHours(0, 0, 0, 0);
        pickups.push({
          date: pickupDate,
          dayName: DAY_NAMES[dayIndex],
          dayOffset: offset,
          timeSlot: schedule.timeSlot,
        });
      }
    }
    return pickups;
  };

  // Check if current time is before the pickup time window
  const isBeforePickupWindow = (timeSlot) => {
    const now = new Date();
    const startTime = timeSlot.split(' - ')[0];
    const [time, period] = startTime.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    const pickupHour = hours;
    return now.getHours() < pickupHour;
  };

  // Build schedule-based notifications
  const buildScheduleNotifications = () => {
    const scheduleNotifs = [];
    if (!wardNum) return scheduleNotifs;

    const schedule = getWardSchedule(wardNum);
    if (!schedule) return scheduleNotifs;

    const upcomingPickups = getUpcomingPickups(schedule);
    const readIds = JSON.parse(localStorage.getItem('userReadNotifications') || '[]');

    // Use real collector data from database if available
    const collectorInfo = wardCollector
      ? `Collector: ${wardCollector.name} (Vehicle: ${wardCollector.vehicleId})`
      : '';

    upcomingPickups.forEach((pickup, index) => {
      const notifId = `schedule-ward${wardNum}-${pickup.dayName}-${pickup.date.toISOString().split('T')[0]}`;

      if (pickup.dayOffset === 0) {
        // TODAY's pickup
        const beforeWindow = isBeforePickupWindow(pickup.timeSlot);
        scheduleNotifs.push({
          id: notifId,
          type: 'schedule',
          title: `🚛 Waste Pickup TODAY!`,
          message: `Your ward (Ward ${wardNum}) has waste collection today at ${pickup.timeSlot}.${collectorInfo ? ' ' + collectorInfo + '.' : ''} Please have your waste ready before pickup time!`,
          icon: beforeWindow ? 'schedule-urgent' : 'schedule-today',
          read: readIds.includes(notifId),
          timestamp: new Date(),
          link: '/user/schedule',
        });
      } else if (pickup.dayOffset === 1) {
        // TOMORROW's pickup
        scheduleNotifs.push({
          id: notifId,
          type: 'schedule',
          title: `📅 Pickup Tomorrow - ${pickup.dayName}`,
          message: `Reminder: Waste collection in Ward ${wardNum} is scheduled for tomorrow (${pickup.dayName}) at ${pickup.timeSlot}.${collectorInfo ? ' ' + collectorInfo + '.' : ''} Prepare your waste in advance!`,
          icon: 'schedule-tomorrow',
          read: readIds.includes(notifId),
          timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
          link: '/user/schedule',
        });
      } else if (index < 3) {
        // Upcoming (next few days, limit to 3 total)
        scheduleNotifs.push({
          id: notifId,
          type: 'schedule',
          title: `Next Pickup: ${pickup.dayName}`,
          message: `Upcoming waste collection on ${pickup.dayName} at ${pickup.timeSlot} for Ward ${wardNum}.`,
          icon: 'schedule-upcoming',
          read: true, // Upcoming ones are read by default
          timestamp: new Date(new Date().setHours(new Date().getHours() - 2)),
          link: '/user/schedule',
        });
      }
    });

    return scheduleNotifs;
  };

  // Fetch real reports from the API and generate notifications
  useEffect(() => {
    if (!isLoaded) return;

    const fetchReportNotifications = async () => {
      try {
        const response = await axios.get('/api/reports/my-reports');
        const reports = response.data;
        let reportNotifications = [];

        if (reports && reports.length > 0) {
          // Read dismissed/read notification IDs from localStorage
          const readIds = JSON.parse(localStorage.getItem('userReadNotifications') || '[]');

          reportNotifications = reports.map((report) => {
            const reportId = report._id.slice(-6).toUpperCase();
            const isResolved = report.status === 'resolved';
            const isInProgress = report.status === 'in-progress';

            let icon, title, message;

            if (isResolved) {
              icon = 'resolved';
              title = `Report #${reportId} Resolved`;
              message = `Your report about "${report.reportLabel}" at ${report.location || 'your location'} has been resolved by ${report.assignedCollectorName || 'the assigned collector'}.`;
            } else if (isInProgress) {
              icon = 'progress';
              title = `Report #${reportId} In Progress`;
              message = `Your report about "${report.reportLabel}" is being handled by ${report.assignedCollectorName || 'the assigned collector'}.`;
            } else {
              // received status
              icon = 'pending';
              title = `Report #${reportId} Received`;
              message = `Your report about "${report.reportLabel}" has been received and is awaiting action.`;
            }

            return {
              id: report._id,
              type: 'report',
              title,
              message,
              icon,
              read: readIds.includes(report._id),
              timestamp: new Date(report.updatedAt || report.createdAt),
              link: '/user/myreport',
            };
          });
        }

        // Build schedule notifications
        const scheduleNotifs = buildScheduleNotifications();

        // Fetch real-time ward task status from the collector task system
        let liveStatusNotifs = [];
        if (wardNum) {
            const readIds = JSON.parse(localStorage.getItem('userReadNotifications') || '[]');
            const now = new Date();
            const todayStr = now.toISOString().split('T')[0];

            // Fetch today's status
            try {
              const statusRes = await axios.get(`http://localhost:3000/api/ward-tasks/status/${wardNum}/${todayStr}`);
              if (statusRes.data?.success && statusRes.data?.data) {
                const taskData = statusRes.data.data;
                const statusId = `pickup-status-ward${wardNum}-${todayStr}`;

                if (taskData.status === 'completed') {
                  const completedTime = taskData.completedAt
                    ? new Date(taskData.completedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    : '';
                  liveStatusNotifs.push({
                    id: statusId,
                    type: 'pickup-completed',
                    title: `✅ Waste Pickup Completed!`,
                    message: `Great news! Your ward (Ward ${wardNum}) waste has been collected successfully today${completedTime ? ' at ' + completedTime : ''}. Thank you for keeping your area clean!`,
                    icon: 'pickup-done',
                    read: readIds.includes(statusId),
                    timestamp: taskData.completedAt ? new Date(taskData.completedAt) : new Date(),
                    link: '/user/schedule',
                  });
                } else if (taskData.status === 'in-progress') {
                  liveStatusNotifs.push({
                    id: statusId,
                    type: 'pickup-inprogress',
                    title: `🚛 Collection In Progress`,
                    message: `The waste collection truck is currently operating in Ward ${wardNum}. Your waste will be picked up shortly!`,
                    icon: 'schedule-urgent',
                    read: readIds.includes(statusId),
                    timestamp: new Date(),
                    link: '/user/schedule',
                  });
                } else if (taskData.status === 'scheduled') {
                  liveStatusNotifs.push({
                    id: statusId,
                    type: 'pickup-scheduled',
                    title: `📋 Pickup Scheduled — Awaiting Collection`,
                    message: `Today's waste pickup for Ward ${wardNum} (${taskData.timeSlot}) is scheduled. The collector has not started yet. Please keep your waste ready!`,
                    icon: 'schedule-today',
                    read: readIds.includes(statusId),
                    timestamp: new Date(),
                    link: '/user/schedule',
                  });
                }
              }
            } catch (err) {
              // Silently fail — API may not be available
            }

            // Fetch tomorrow's status (so users know a day before)
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split('T')[0];
            try {
              const tomorrowRes = await axios.get(`http://localhost:3000/api/ward-tasks/status/${wardNum}/${tomorrowStr}`);
              if (tomorrowRes.data?.success && tomorrowRes.data?.data) {
                const tData = tomorrowRes.data.data;
                // Only show if there's a pickup tomorrow (not 'no-pickup')
                if (tData.status !== 'no-pickup') {
                  const tmrwId = `pickup-tomorrow-ward${wardNum}-${tomorrowStr}`;
                  const tomorrowDayName = DAY_NAMES[tomorrow.getDay()];
                  const collectorNote = wardCollector ? ` Collector: ${wardCollector.name}.` : '';
                  liveStatusNotifs.push({
                    id: tmrwId,
                    type: 'pickup-tomorrow-reminder',
                    title: `📅 Pickup Tomorrow — ${tomorrowDayName}`,
                    message: `Reminder: Waste collection for Ward ${wardNum} is scheduled for tomorrow (${tomorrowDayName}) at ${tData.timeSlot}.${collectorNote} Please prepare your waste tonight!`,
                    icon: 'schedule-tomorrow',
                    read: readIds.includes(tmrwId),
                    timestamp: new Date(new Date().setHours(new Date().getHours() - 1)),
                    link: '/user/schedule',
                  });
                }
              }
            } catch (err) {
              // Silently fail
            }
        }

        // When we have live status, filter out the client-side schedule notifs for today/tomorrow
        // to avoid duplicates (live status is more accurate)
        const hasLiveTodayStatus = liveStatusNotifs.some(n => 
          n.type === 'pickup-completed' || n.type === 'pickup-inprogress' || n.type === 'pickup-scheduled'
        );
        const hasLiveTomorrowStatus = liveStatusNotifs.some(n => n.type === 'pickup-tomorrow-reminder');

        const filteredScheduleNotifs = scheduleNotifs.filter(n => {
          // Remove client-side today notification if we have live status
          if (hasLiveTodayStatus && (n.icon === 'schedule-urgent' || n.icon === 'schedule-today')) return false;
          // Remove client-side tomorrow notification if we have live tomorrow status
          if (hasLiveTomorrowStatus && n.icon === 'schedule-tomorrow') return false;
          return true;
        });

        // Combine and sort: live status first, then schedule, then reports
        const allNotifications = [...liveStatusNotifs, ...filteredScheduleNotifs, ...reportNotifications];
        allNotifications.sort((a, b) => {
          // Priority: schedule-urgent > schedule-today > schedule-tomorrow > rest by timestamp
          const getPriority = (n) => {
            if (n.icon === 'pickup-done') return -1;
            if (n.type === 'pickup-inprogress') return 0;
            if (n.type === 'pickup-scheduled') return 1;
            if (n.icon === 'schedule-urgent') return 2;
            if (n.icon === 'schedule-today') return 3;
            if (n.type === 'pickup-tomorrow-reminder') return 4;
            if (n.icon === 'schedule-tomorrow') return 5;
            return 6;
          };
          const pa = getPriority(a);
          const pb = getPriority(b);
          if (pa !== pb) return pa - pb;
          return b.timestamp - a.timestamp;
        });

        setNotifications(allNotifications);
        const unread = allNotifications.filter(n => !n.read).length;
        setUnreadCount(unread);

        // Send email reminder for today's pickup (only once per session)
        if (!emailSentRef.current && userWard) {
          const todaySchedule = scheduleNotifs.find(
            n => n.icon === 'schedule-urgent' || n.icon === 'schedule-today'
          );
          if (todaySchedule) {
            const emailKey = `scheduleEmailSent-${userWard}-${new Date().toISOString().split('T')[0]}`;
            if (!localStorage.getItem(emailKey)) {
              try {
                await axios.post('/api/users/schedule-reminder', {
                  ward: userWard,
                });
                localStorage.setItem(emailKey, 'true');
                emailSentRef.current = true;
                console.log('📧 Schedule reminder email sent for ward', userWard);
              } catch (emailErr) {
                console.error('Failed to send schedule reminder email:', emailErr);
              }
            } else {
              emailSentRef.current = true;
            }
          }
        }
      } catch (error) {
        console.error('Error fetching report notifications:', error);
        // Still show schedule notifications even if report fetch fails
        const scheduleNotifs = buildScheduleNotifications();
        if (scheduleNotifs.length > 0) {
          setNotifications(scheduleNotifs);
          setUnreadCount(scheduleNotifs.filter(n => !n.read).length);
        }
      }
    };

    fetchReportNotifications();

    // Poll every 30 seconds for status updates
    const interval = setInterval(fetchReportNotifications, 30000);
    return () => clearInterval(interval);
  }, [isLoaded, wardNum, wardCollector]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
    // Persist read state in localStorage
    const readIds = JSON.parse(localStorage.getItem('userReadNotifications') || '[]');
    if (!readIds.includes(id)) {
      readIds.push(id);
      localStorage.setItem('userReadNotifications', JSON.stringify(readIds));
    }
  };

  const deleteNotification = (id) => {
    const wasUnread = notifications.find(n => n.id === id && !n.read);
    setNotifications(notifications.filter(notif => notif.id !== id));
    if (wasUnread) setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
    localStorage.setItem('userReadNotifications', JSON.stringify(allIds));
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'resolved':
        return <BsCheckCircle className="text-emerald-500 text-lg" />;
      case 'progress':
        return <BsClock className="text-amber-500 text-lg" />;
      case 'pending':
        return <BsExclamationTriangle className="text-blue-500 text-lg" />;
      case 'schedule-urgent':
        return <BsTruck className="text-red-500 text-lg animate-pulse" />;
      case 'schedule-today':
        return <BsTruck className="text-emerald-600 text-lg" />;
      case 'schedule-tomorrow':
        return <BsCalendarEvent className="text-blue-600 text-lg" />;
      case 'schedule-upcoming':
        return <BsCalendarEvent className="text-gray-500 text-lg" />;
      case 'pickup-done':
        return <BsCheckAll className="text-emerald-600 text-lg" />;
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
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-gray-600 hover:text-emerald-700 transition-all duration-300 hover:bg-emerald-50/50 rounded-xl"
        title="Notifications"
      >
        <BsBell className="text-xl" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <>
            <div className="absolute -top-1 -right-1 flex items-center justify-center">
              <div className="absolute w-5 h-5 bg-red-500 rounded-full animate-pulse"></div>
              <span className="relative text-white text-xs font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            </div>
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="fixed inset-x-0 top-14 sm:absolute sm:inset-x-auto sm:top-auto sm:right-0 sm:mt-4 mx-2 sm:mx-0 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeInDown max-h-[80vh] sm:max-h-none">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between z-10">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <BsBell className="text-xl" />
              Notifications
            </h3>
            {notifications.length > 0 && (
              <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <BsBell className="text-4xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-1">Stay updated with your waste management activities</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-6 py-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 cursor-pointer group ${
                    !notification.read ? 'bg-emerald-50/30' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) markAsRead(notification.id);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-semibold text-sm ${!notification.read ? 'text-emerald-800' : 'text-gray-800'}`}>
                            {notification.title}
                          </h4>
                          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Unread Indicator */}
                        {!notification.read && (
                          <div className="flex-shrink-0 w-2 h-2 bg-emerald-500 rounded-full mt-1"></div>
                        )}
                      </div>

                      {/* Time */}
                      <p className="text-gray-400 text-xs mt-2">
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
                      title="Delete"
                    >
                      <BsTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between gap-3">
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors duration-300 hover:bg-emerald-50/50 px-3 py-1.5 rounded-lg"
              >
                Mark all as read
              </button>
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors duration-300 hover:bg-red-50/50 px-3 py-1.5 rounded-lg"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default NotificationCenter;
