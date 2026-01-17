# Notification System - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Setup Provider (30 seconds)

Open your `main.jsx` or `App.jsx` and wrap your app:

```javascript
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <YourAppRoutes />
    </NotificationProvider>
  );
}
```

### Step 2: Start Using Notifications (Already done!)

The notification bell button is already in your navbar. No additional setup needed!

---

## 📢 Add Notifications Anywhere

### In Your Components

```javascript
import { useNotifications } from '../context/NotificationContext';

function YourComponent() {
  const { addNotification } = useNotifications();

  // Example 1: Report submitted
  const handleReportSubmit = () => {
    addNotification({
      type: 'report',
      title: 'Report Submitted',
      message: 'Your report has been submitted successfully',
      icon: 'pending',
      link: '/user/myreport'
    });
  };

  // Example 2: Pickup scheduled
  const handleSchedulePickup = () => {
    addNotification({
      type: 'schedule',
      title: 'Waste Pickup Tomorrow',
      message: 'Your waste pickup is scheduled for tomorrow at 8:00 AM',
      icon: 'schedule',
      link: '/user/schedule'
    });
  };

  // Example 3: Reminder set
  const handleSetReminder = () => {
    addNotification({
      type: 'reminder',
      title: 'Reminder Set',
      message: 'You will be reminded about your upcoming waste collection',
      icon: 'reminder',
      link: '/user/schedule'
    });
  };

  return (
    <div>
      <button onClick={handleReportSubmit}>Submit Report</button>
      <button onClick={handleSchedulePickup}>Schedule Pickup</button>
      <button onClick={handleSetReminder}>Set Reminder</button>
    </div>
  );
}
```

---

## 📋 Notification Template

Copy and paste this template:

```javascript
addNotification({
  type: 'schedule|report|reminder|awareness',  // Required
  title: 'Your Title Here',                     // Required
  message: 'Your message here',                 // Required
  icon: 'schedule|pending|progress|resolved|reminder|awareness', // Required
  link: '/path/to/page'                         // Optional
});
```

---

## 🎯 Common Use Cases

### When User Submits a Report
```javascript
// In Report.jsx
const handleSubmit = async (formData) => {
  try {
    const response = await submitReport(formData);
    addNotification({
      type: 'report',
      title: 'Report Submitted',
      message: `Report #${response.id} has been submitted`,
      icon: 'pending',
      link: '/user/myreport'
    });
  } catch (error) {
    addNotification({
      type: 'report',
      title: 'Error',
      message: 'Failed to submit report',
      icon: 'pending',
      link: '/user/report'
    });
  }
};
```

### When Schedule is Updated
```javascript
// In Schedule.jsx
const handlePickupScheduled = (date, wasteType) => {
  addNotification({
    type: 'schedule',
    title: `${wasteType} Pickup Scheduled`,
    message: `Pickup scheduled for ${date}`,
    icon: 'schedule',
    link: '/user/schedule'
  });
};
```

### When Report Status Changes (Admin/Collector)
```javascript
// In Admin Report Management
const updateReportStatus = (reportId, newStatus) => {
  const statusMessages = {
    'received': { title: 'Report Received', icon: 'pending' },
    'in-progress': { title: 'Report In Progress', icon: 'progress' },
    'resolved': { title: 'Report Resolved', icon: 'resolved' }
  };

  const msg = statusMessages[newStatus];
  addNotification({
    type: 'report',
    title: msg.title,
    message: `Report #${reportId} status updated to ${newStatus}`,
    icon: msg.icon,
    link: '/user/myreport'
  });
};
```

### When Reminder is Set
```javascript
// In Schedule.jsx or Reminder.jsx
const handleReminderSet = (date, description) => {
  addNotification({
    type: 'reminder',
    title: 'Reminder Set',
    message: `Reminder set for ${date}: ${description}`,
    icon: 'reminder',
    link: '/user/schedule/reminder'
  });
};
```

### Daily Eco Tip
```javascript
// In App.js or useEffect hook
const sendDailyTip = () => {
  const tips = [
    {
      title: 'Composting Benefits',
      message: 'Home composting can reduce waste by 30%!',
      link: '/user/awareness2'
    },
    {
      title: 'Waste Segregation',
      message: 'Proper segregation increases recycling efficiency by 40%',
      link: '/user/awareness3'
    }
  ];

  const tip = tips[Math.floor(Math.random() * tips.length)];
  addNotification({
    type: 'awareness',
    title: tip.title,
    message: tip.message,
    icon: 'awareness',
    link: tip.link
  });
};
```

---

## 🔗 Files to Modify

### Schedule.jsx
Add notifications when:
- [ ] User sets a reminder
- [ ] Calendar date is selected for pickup
- [ ] Reminder is confirmed

### Report.jsx (Report Creation Page)
Add notification when:
- [ ] Report is submitted successfully
- [ ] Report submission fails

### MyReports.jsx (Report List Page)
Add notifications for:
- [ ] Report status changes (handled by admin)
- [ ] User views report details

### Admin Report Management (In admin pages)
Add notifications when:
- [ ] Report status changes to "received"
- [ ] Report status changes to "in-progress"
- [ ] Report status changes to "resolved"
- [ ] Report is assigned to a team

### CollectorAssignment.jsx (Collector pages)
Add notification when:
- [ ] Collector is assigned a task
- [ ] Route is updated

---

## ✅ Checklist

- [ ] Step 1: NotificationProvider wraps app in main.jsx
- [ ] Step 2: Test by clicking bell icon in navbar
- [ ] Step 3: Add notifications to Schedule.jsx
- [ ] Step 4: Add notifications to Report.jsx
- [ ] Step 5: Add notifications to MyReports.jsx
- [ ] Step 6: Test with actual actions
- [ ] Step 7: Add admin notifications (optional)
- [ ] Step 8: Add collector notifications (optional)

---

## 🎨 Notification Types Quick Reference

| Type | Icon | Color | Use Case |
|------|------|-------|----------|
| schedule | 📅 | Blue | Waste pickup schedules |
| report (pending) | ⚠️ | Red | Report received/pending |
| report (progress) | ⏳ | Amber | Report in progress |
| report (resolved) | ✅ | Green | Report resolved |
| reminder | 🔔 | Purple | User reminders |
| awareness | 💡 | Green | Eco tips |

---

## 🐛 Quick Troubleshooting

**Q: Bell icon not showing?**
A: Make sure Header.jsx imports NotificationCenter

**Q: Notifications not appearing?**
A: Make sure NotificationProvider wraps your app

**Q: "useNotifications is not defined" error?**
A: Import it: `import { useNotifications } from '../context/NotificationContext'`

**Q: Styling looks weird?**
A: Check Tailwind CSS is properly configured in your project

---

## 📚 Learn More

- Full documentation: `NOTIFICATION_SYSTEM.md`
- Setup guide: `NOTIFICATION_INTEGRATION_GUIDE.md`
- Code examples: `NotificationExamples.jsx`
- Visual guide: `NOTIFICATION_VISUAL_GUIDE.md`

---

## 🎉 You're Ready!

The notification system is ready to use. Start adding notifications to your components and give your users real-time updates about their waste management activities!

**Questions?** Check the documentation files or look at `NotificationExamples.jsx` for more examples.

Happy coding! 🚀
