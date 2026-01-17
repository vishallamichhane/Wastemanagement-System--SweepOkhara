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
  BsTrophy
} from 'react-icons/bs';

function CollectorNotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize collector-specific notifications on component mount
  useEffect(() => {
    const collectorNotifications = [
      {
        id: 1,
        type: 'task-urgent',
        title: 'Urgent: New Task in Ward 5',
        message: 'Overflowing bin at Mahendra Pul requires immediate attention (95% full)',
        icon: 'urgent',
        read: false,
        timestamp: new Date(Date.now() - 10 * 60000),
        link: '/collector/tasks',
        ward: 'Ward 5',
        location: 'Mahendra Pul'
      },
      {
        id: 2,
        type: 'user-report',
        title: 'User Report Assigned: Ward 12',
        message: 'Admin assigned you report #UR2847: Missed pickup at Lakeside East residential area',
        icon: 'report',
        read: false,
        timestamp: new Date(Date.now() - 45 * 60000),
        link: '/collector/tasks',
        ward: 'Ward 12',
        reportId: 'UR2847'
      },
      {
        id: 3,
        type: 'task-new',
        title: 'New Task Assigned: Ward 8',
        message: '3 new bins added to your route in City Center area',
        icon: 'task',
        read: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60000),
        link: '/collector/tasks',
        ward: 'Ward 8'
      },
      {
        id: 4,
        type: 'user-report',
        title: 'User Report: Damaged Bin - Ward 3',
        message: 'Report #UR2851: Citizen reports damaged bin at Baseline Road. Inspect and confirm.',
        icon: 'report',
        read: false,
        timestamp: new Date(Date.now() - 3 * 60 * 60000),
        link: '/collector/tasks',
        ward: 'Ward 3',
        reportId: 'UR2851'
      },
      {
        id: 5,
        type: 'route-change',
        title: 'Route Update: Ward 7',
        message: 'Your collection route has been optimized. New sequence available.',
        icon: 'route',
        read: true,
        timestamp: new Date(Date.now() - 5 * 60 * 60000),
        link: '/collector/map'
      },
      {
        id: 6,
        type: 'weather',
        title: 'Weather Alert: Heavy Rain Expected',
        message: 'Monsoon forecast for tomorrow. Prepare for wet conditions during collection.',
        icon: 'weather',
        read: true,
        timestamp: new Date(Date.now() - 8 * 60 * 60000),
        link: '/collector/tasks'
      },
      {
        id: 7,
        type: 'maintenance',
        title: 'Vehicle Maintenance Due',
        message: 'Collection truck TRK-104 requires scheduled service check before next week.',
        icon: 'maintenance',
        read: true,
        timestamp: new Date(Date.now() - 12 * 60 * 60000),
        link: '/collector/dashboard'
      },
      {
        id: 8,
        type: 'achievement',
        title: 'Achievement Unlocked: 100 Tasks Completed',
        message: 'Congratulations! You have successfully completed 100 collection tasks this month.',
        icon: 'achievement',
        read: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60000),
        link: '/collector/dashboard'
      },
      {
        id: 9,
        type: 'schedule',
        title: 'Schedule Change: Ward 6',
        message: 'Collection time tomorrow moved to 7:00 AM due to community event.',
        icon: 'schedule',
        read: true,
        timestamp: new Date(Date.now() - 36 * 60 * 60000),
        link: '/collector/tasks'
      },
      {
        id: 10,
        type: 'resolved',
        title: 'Report Resolved: Ward 12',
        message: 'Report #UR2847 marked as completed. User confirmed successful pickup.',
        icon: 'resolved',
        read: true,
        timestamp: new Date(Date.now() - 48 * 60 * 60000),
        link: '/collector/tasks',
        ward: 'Ward 12',
        reportId: 'UR2847'
      }
    ];

    setNotifications(collectorNotifications);
    const unread = collectorNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
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
  };

  const deleteNotification = (id) => {
    const notifToDelete = notifications.find(n => n.id === id);
    setNotifications(notifications.filter(notif => notif.id !== id));
    if (!notifToDelete.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
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
        return <BsClock className="text-indigo-500 text-lg" />;
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
          className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fadeInDown"
          style={{ maxHeight: '32rem' }}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center justify-between z-10">
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
          <div className="overflow-y-auto" style={{ maxHeight: '24rem' }}>
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
                    className={`group relative px-6 py-4 transition-all duration-300 hover:bg-gray-50 cursor-pointer ${
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
            <div className="sticky bottom-0 bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between">
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
