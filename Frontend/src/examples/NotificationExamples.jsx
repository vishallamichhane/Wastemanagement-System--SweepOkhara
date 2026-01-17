import React, { useState, useEffect, useRef } from 'react';
import { BsBell, BsTrash2, BsCheckCircle, BsClock, BsExclamationTriangle, BsCalendarEvent } from 'react-icons/bs';
import { useNotifications } from '../../context/NotificationContext';

/**
 * EXAMPLE: How to use the Notification System in Different Pages
 * 
 * This file demonstrates practical implementations of the notification system
 * across different pages of your waste management application.
 */

// ============================================
// EXAMPLE 1: Schedule Page with Notifications
// ============================================
export const SchedulePageExample = () => {
  const { addNotification } = useNotifications();

  const handleSetReminder = (date, wasteType) => {
    addNotification({
      type: 'reminder',
      title: `Reminder Set for ${wasteType}`,
      message: `You will be reminded on ${date} about ${wasteType} collection`,
      icon: 'reminder',
      link: '/user/schedule'
    });
  };

  const handleSchedulePickup = (date, wasteType) => {
    addNotification({
      type: 'schedule',
      title: `${wasteType} Pickup Scheduled`,
      message: `Waste pickup scheduled for ${date}. Please ensure bins are ready by 8:00 AM`,
      icon: 'schedule',
      link: '/user/schedule'
    });
  };

  return (
    <div>
      <button onClick={() => handleSetReminder('Tomorrow', 'General Waste')}>
        Set Reminder
      </button>
      <button onClick={() => handleSchedulePickup('July 1st, 2024', 'Organic Waste')}>
        Schedule Pickup
      </button>
    </div>
  );
};

// ============================================
// EXAMPLE 2: Report Page with Status Updates
// ============================================
export const ReportPageExample = () => {
  const { addNotification } = useNotifications();
  const [reportId] = useState('803F9A');

  const submitReport = async (reportData) => {
    try {
      // API call to submit report
      // const response = await submitReportAPI(reportData);

      addNotification({
        type: 'report',
        title: 'Report Submitted Successfully',
        message: `Your report #${reportId} has been submitted. We'll review and take action shortly.`,
        icon: 'pending',
        link: '/user/myreport'
      });
    } catch (error) {
      addNotification({
        type: 'report',
        title: 'Report Submission Failed',
        message: 'There was an error submitting your report. Please try again.',
        icon: 'pending',
        link: '/user/report'
      });
    }
  };

  return (
    <button onClick={() => submitReport({})}>
      Submit Report
    </button>
  );
};

// ============================================
// EXAMPLE 3: Admin/Collector - Report Status Updates
// ============================================
export const ReportStatusUpdateExample = () => {
  const { addNotification } = useNotifications();

  // This would typically be called when admin updates report status
  const updateReportStatus = (reportId, userId, newStatus, team) => {
    const statusMessages = {
      'received': {
        title: `Report #${reportId} Received`,
        message: `Your waste management report has been received and will be processed within 24 hours.`,
        icon: 'pending'
      },
      'in-progress': {
        title: `Report #${reportId} In Progress`,
        message: `Your report is being handled by ${team}. We'll notify you once it's resolved.`,
        icon: 'progress'
      },
      'resolved': {
        title: `Report #${reportId} Resolved`,
        message: `Good news! Your report has been successfully resolved. Thank you for helping keep Pokhara clean!`,
        icon: 'resolved'
      }
    };

    const message = statusMessages[newStatus];
    
    if (message) {
      addNotification({
        type: 'report',
        title: message.title,
        message: message.message,
        icon: message.icon,
        link: '/user/myreport'
      });
    }
  };

  return (
    <div>
      <button onClick={() => updateReportStatus('803F9A', 'user123', 'received', 'Cleanup Team A')}>
        Mark as Received
      </button>
      <button onClick={() => updateReportStatus('803F9A', 'user123', 'in-progress', 'Cleanup Team A')}>
        Mark as In Progress
      </button>
      <button onClick={() => updateReportStatus('803F9A', 'user123', 'resolved', 'Cleanup Team A')}>
        Mark as Resolved
      </button>
    </div>
  );
};

// ============================================
// EXAMPLE 4: Awareness Section
// ============================================
export const AwarenessNotificationExample = () => {
  const { addNotification } = useNotifications();

  const sendAwarenessNotification = () => {
    const tips = [
      {
        title: 'Composting Benefits',
        message: 'Did you know? Home composting can reduce household waste by up to 30% and create nutrient-rich soil for your garden!',
        link: '/user/awareness2'
      },
      {
        title: 'Waste Segregation Tips',
        message: 'Proper waste segregation increases recycling efficiency by 40%. Learn how to segregate waste correctly!',
        link: '/user/awareness3'
      },
      {
        title: '3 R\'s of Sustainability',
        message: 'Reduce, Reuse, Recycle - Master these three principles to minimize your environmental impact.',
        link: '/user/awareness1'
      }
    ];

    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    addNotification({
      type: 'awareness',
      title: randomTip.title,
      message: randomTip.message,
      icon: 'awareness',
      link: randomTip.link
    });
  };

  return (
    <button onClick={sendAwarenessNotification}>
      Send Daily Eco Tip
    </button>
  );
};

// ============================================
// EXAMPLE 5: Collector Assignment Notification
// ============================================
export const CollectorAssignmentExample = () => {
  const { addNotification } = useNotifications();

  const assignCollectorToTask = (taskId, collectorName, pickupArea, date) => {
    addNotification({
      type: 'schedule',
      title: `Task Assigned to ${collectorName}`,
      message: `Waste pickup task in ${pickupArea} assigned for ${date}. Please prepare accordingly.`,
      icon: 'schedule',
      link: '/collector/assigned-tasks'
    });
  };

  return (
    <button onClick={() => assignCollectorToTask('TASK001', 'John Doe', 'Lakeside Area', 'Tomorrow at 8:00 AM')}>
      Assign Collector Task
    </button>
  );
};

// ============================================
// EXAMPLE 6: Batch Notification System (Daily Digest)
// ============================================
export const DailyDigestExample = () => {
  const { addNotification } = useNotifications();

  const sendDailyDigest = (userStats) => {
    const { reportsSubmitted, pickupsScheduled, tasksCompleted } = userStats;

    addNotification({
      type: 'awareness',
      title: '📊 Your Waste Management Daily Summary',
      message: `Reports: ${reportsSubmitted} | Pickups Scheduled: ${pickupsScheduled} | Tasks Completed: ${tasksCompleted}. Keep up the great work!`,
      icon: 'awareness',
      link: '/user'
    });
  };

  return (
    <button onClick={() => sendDailyDigest({ reportsSubmitted: 2, pickupsScheduled: 3, tasksCompleted: 5 })}>
      Send Daily Digest
    </button>
  );
};

// ============================================
// EXAMPLE 7: Emergency/Urgent Notifications
// ============================================
export const EmergencyNotificationExample = () => {
  const { addNotification } = useNotifications();

  const sendEmergencyAlert = (issue, location) => {
    addNotification({
      type: 'report',
      title: `⚠️ URGENT: ${issue}`,
      message: `Critical waste management issue detected at ${location}. Immediate action required!`,
      icon: 'pending',
      link: '/user/myreport'
    });
  };

  return (
    <button onClick={() => sendEmergencyAlert('Illegal Dumping', 'Seti River Bank')}>
      Report Emergency
    </button>
  );
};

// ============================================
// EXAMPLE 8: Multi-User Scenario (Admin Dashboard)
// ============================================
export const AdminDashboardExample = () => {
  const { addNotification } = useNotifications();

  const notifyAllUsers = (title, message, type = 'awareness') => {
    // In real implementation, this would target specific users
    addNotification({
      type: type,
      title: title,
      message: message,
      icon: 'awareness',
      link: '/user'
    });
  };

  return (
    <div>
      <button onClick={() => notifyAllUsers('System Maintenance', 'The system will be under maintenance on July 20th from 2-4 PM')}>
        Send System Notification
      </button>
      <button onClick={() => notifyAllUsers('New Feature Available', 'Check out our new map view to see waste bins in your area!', 'schedule')}>
        Announce Feature
      </button>
    </div>
  );
};

// ============================================
// EXAMPLE 9: Reminder Scheduling
// ============================================
export const ReminderSchedulingExample = () => {
  const { addNotification } = useNotifications();

  const scheduleReminder = (reminderText, days, time) => {
    const reminderDate = new Date();
    reminderDate.setDate(reminderDate.getDate() + days);

    addNotification({
      type: 'reminder',
      title: 'Scheduled Reminder',
      message: `${reminderText} - Reminder set for ${reminderDate.toLocaleDateString()} at ${time}`,
      icon: 'reminder',
      link: '/user/schedule/reminder'
    });
  };

  return (
    <button onClick={() => scheduleReminder('Organic waste collection', 3, '08:00 AM')}>
      Schedule Reminder for 3 Days
    </button>
  );
};

// ============================================
// EXPORT SUMMARY
// ============================================
/*
  KEY INTEGRATION POINTS:

  1. SCHEDULE PAGE
     - Notify when reminder is set
     - Notify about upcoming pickups
     - Use when calendar dates are selected

  2. REPORT PAGE
     - Notify on successful report submission
     - Show pending status

  3. ADMIN/REPORT MANAGEMENT
     - Update users when report status changes
     - Send to collector when assigned
     - Notify on priority issues

  4. AWARENESS SECTION
     - Daily eco tips
     - Educational notifications

  5. COLLECTOR DASHBOARD
     - Task assignments
     - Route updates

  6. GENERAL SYSTEM
     - Emergency alerts
     - System maintenance notices
     - Feature announcements

  NOTIFICATION LIFECYCLE:
  User Action → Validation → Backend Update → Notification Sent → User Sees Badge → Opens Dropdown → Reads/Clears

  BEST PRACTICES:
  ✓ Send notifications immediately after user actions
  ✓ Use appropriate icons for different types
  ✓ Keep messages concise but informative
  ✓ Include relevant links for easy navigation
  ✓ Allow users to manage notification preferences
  ✓ Don't spam users with too many notifications
  ✓ Timestamp all notifications for context
*/

export default SchedulePageExample;
