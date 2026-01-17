import React, { useState, useEffect, useRef } from 'react';
import { BsBell, BsTrash2, BsCheckCircle, BsClock, BsExclamationTriangle, BsCalendarEvent } from 'react-icons/bs';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Initialize notifications on component mount
  useEffect(() => {
    // Fetch or generate initial notifications
    const initialNotifications = [
      {
        id: 1,
        type: 'schedule',
        title: 'Waste Pickup Tomorrow',
        message: 'General & Recyclable Waste pickup scheduled for tomorrow at 8:00 AM',
        icon: 'schedule',
        read: false,
        timestamp: new Date(Date.now() - 30 * 60000), // 30 minutes ago
        link: '/user/schedule'
      },
      {
        id: 2,
        type: 'report',
        title: 'Report #803F9A Resolved',
        message: 'Your report about overflowing bin at Lakeside has been resolved',
        icon: 'resolved',
        read: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
        link: '/user/myreport'
      },
      {
        id: 3,
        type: 'report',
        title: 'Report #48168C In Progress',
        message: 'Missed pickup report is being handled by Collection Team B',
        icon: 'progress',
        read: false,
        timestamp: new Date(Date.now() - 5 * 60 * 60000), // 5 hours ago
        link: '/user/myreport'
      },
      {
        id: 4,
        type: 'reminder',
        title: 'Reminder: Set Your Schedule Alert',
        message: 'You have an upcoming waste pickup on July 1st. Set a reminder now?',
        icon: 'reminder',
        read: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60000), // 1 day ago
        link: '/user/schedule/reminder'
      },
      {
        id: 5,
        type: 'awareness',
        title: 'Eco Awareness Tip',
        message: 'Did you know? Composting at home can reduce waste by 30%!',
        icon: 'awareness',
        read: true,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
        link: '/user/awareness1'
      }
    ];

    setNotifications(initialNotifications);
    const unread = initialNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, []);

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
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
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
      case 'schedule':
        return <BsCalendarEvent className="text-blue-500 text-lg" />;
      case 'resolved':
        return <BsCheckCircle className="text-emerald-500 text-lg" />;
      case 'progress':
        return <BsClock className="text-amber-500 text-lg" />;
      case 'reminder':
        return <BsBell className="text-purple-500 text-lg" />;
      case 'pending':
        return <BsExclamationTriangle className="text-red-500 text-lg" />;
      case 'awareness':
        return <BsExclamationTriangle className="text-green-500 text-lg" />;
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
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-fadeInDown">
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
