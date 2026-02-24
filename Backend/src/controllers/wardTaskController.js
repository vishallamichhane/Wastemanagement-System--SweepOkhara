import WardTask from '../models/wardTask.js';
import User from '../models/user.js';
import emailService from '../utils/email.js';

// Ward schedule data (mirrors frontend wardSchedules.js)
const WARD_SCHEDULES = {
  1:  { pickupDays: [0, 2, 4], timeSlot: '6:00 AM - 8:00 AM' },
  2:  { pickupDays: [1, 3, 5], timeSlot: '6:00 AM - 8:00 AM' },
  3:  { pickupDays: [0, 2, 4], timeSlot: '8:00 AM - 10:00 AM' },
  4:  { pickupDays: [1, 3, 5], timeSlot: '8:00 AM - 10:00 AM' },
  5:  { pickupDays: [0, 2, 4], timeSlot: '10:00 AM - 12:00 PM' },
  6:  { pickupDays: [1, 3, 5], timeSlot: '9:00 AM - 11:00 AM' },
  7:  { pickupDays: [0, 2, 4], timeSlot: '12:00 PM - 2:00 PM' },
  8:  { pickupDays: [1, 3, 5], timeSlot: '10:00 AM - 12:00 PM' },
  9:  { pickupDays: [0, 2, 4], timeSlot: '2:00 PM - 4:00 PM' },
  10: { pickupDays: [1, 3, 5], timeSlot: '12:00 PM - 2:00 PM' },
  11: { pickupDays: [0, 2, 4], timeSlot: '4:00 PM - 6:00 PM' },
  12: { pickupDays: [1, 3, 5], timeSlot: '2:00 PM - 4:00 PM' },
  13: { pickupDays: [0, 3, 5], timeSlot: '6:00 AM - 8:00 AM' },
  14: { pickupDays: [1, 4, 6], timeSlot: '4:00 PM - 6:00 PM' },
  15: { pickupDays: [2, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  16: { pickupDays: [0, 3, 6], timeSlot: '8:00 AM - 10:00 AM' },
  17: { pickupDays: [1, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  18: { pickupDays: [2, 5, 0], timeSlot: '9:00 AM - 11:00 AM' },
  19: { pickupDays: [1, 4, 6], timeSlot: '6:00 AM - 8:00 AM' },
  20: { pickupDays: [2, 5, 0], timeSlot: '2:00 PM - 4:00 PM' },
  21: { pickupDays: [0, 2, 5], timeSlot: '6:00 AM - 8:00 AM' },
  22: { pickupDays: [1, 3, 6], timeSlot: '10:00 AM - 12:00 PM' },
  23: { pickupDays: [2, 4, 0], timeSlot: '4:00 PM - 6:00 PM' },
  24: { pickupDays: [1, 3, 5], timeSlot: '12:00 PM - 2:00 PM' },
  25: { pickupDays: [0, 3, 5], timeSlot: '12:00 PM - 2:00 PM' },
  26: { pickupDays: [2, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  27: { pickupDays: [1, 4, 6], timeSlot: '2:00 PM - 4:00 PM' },
  28: { pickupDays: [0, 2, 5], timeSlot: '10:00 AM - 12:00 PM' },
  29: { pickupDays: [1, 3, 6], timeSlot: '4:00 PM - 6:00 PM' },
  30: { pickupDays: [2, 5, 0], timeSlot: '6:00 AM - 8:00 AM' },
  31: { pickupDays: [1, 4, 6], timeSlot: '8:00 AM - 10:00 AM' },
  32: { pickupDays: [0, 3, 5], timeSlot: '9:00 AM - 11:00 AM' },
  33: { pickupDays: [2, 4, 6], timeSlot: '10:00 AM - 12:00 PM' },
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Helper: get today's date as YYYY-MM-DD in local time
const getTodayString = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Helper: check if a ward has a pickup scheduled for a given date string
const isPickupDay = (wardNum, dateStr) => {
  const schedule = WARD_SCHEDULES[wardNum];
  if (!schedule) return false;
  const date = new Date(dateStr + 'T00:00:00');
  return schedule.pickupDays.includes(date.getDay());
};

// @desc    Get today's ward tasks for the logged-in collector
// @route   GET /api/ward-tasks/today
// @access  Private/Collector
export const getTodayTasks = async (req, res) => {
  try {
    const collector = req.collector;
    const assignedWards = collector.assignedWards || [];
    const today = getTodayString();
    const todayDayOfWeek = new Date().getDay();

    // Filter wards that have a pickup scheduled today
    const wardsWithPickupToday = assignedWards.filter(w => {
      const schedule = WARD_SCHEDULES[w];
      return schedule && schedule.pickupDays.includes(todayDayOfWeek);
    });

    // Ensure WardTask documents exist for each scheduled ward today (upsert)
    const tasks = [];
    for (const ward of wardsWithPickupToday) {
      let task = await WardTask.findOne({ ward, date: today });
      if (!task) {
        task = await WardTask.create({
          ward,
          date: today,
          timeSlot: WARD_SCHEDULES[ward].timeSlot,
          status: 'scheduled',
          collectorId: collector._id,
        });
      }
      tasks.push(task);
    }

    // Also return any tasks from today that are already in-progress/completed
    // (in case someone started a task that isn't in wardsWithPickupToday somehow)

    // Build response with schedule info
    const tasksWithSchedule = tasks.map(task => ({
      _id: task._id,
      ward: task.ward,
      date: task.date,
      timeSlot: task.timeSlot,
      status: task.status,
      completedAt: task.completedAt,
      notes: task.notes,
      dayName: DAY_NAMES[todayDayOfWeek],
      pickupDays: WARD_SCHEDULES[task.ward]?.pickupDays.map(d => DAY_NAMES[d]) || [],
    }));

    // Sort: in-progress first, then scheduled, then completed
    const statusOrder = { 'in-progress': 0, 'scheduled': 1, 'completed': 2 };
    tasksWithSchedule.sort((a, b) => (statusOrder[a.status] || 1) - (statusOrder[b.status] || 1));

    res.status(200).json({
      success: true,
      date: today,
      dayName: DAY_NAMES[todayDayOfWeek],
      count: tasksWithSchedule.length,
      data: tasksWithSchedule,
    });
  } catch (error) {
    console.error('Get today tasks error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get full week schedule for the logged-in collector's assigned wards
// @route   GET /api/ward-tasks/schedule
// @access  Private/Collector
export const getWeekSchedule = async (req, res) => {
  try {
    const collector = req.collector;
    const assignedWards = collector.assignedWards || [];

    const schedule = assignedWards.map(ward => {
      const s = WARD_SCHEDULES[ward];
      return {
        ward,
        pickupDays: s ? s.pickupDays.map(d => DAY_NAMES[d]) : [],
        pickupDayNumbers: s ? s.pickupDays : [],
        timeSlot: s ? s.timeSlot : 'N/A',
      };
    });

    // Sort by ward number
    schedule.sort((a, b) => a.ward - b.ward);

    res.status(200).json({
      success: true,
      collectorId: collector.collectorId,
      assignedWards,
      data: schedule,
    });
  } catch (error) {
    console.error('Get week schedule error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a ward task status (start or complete)
// @route   PUT /api/ward-tasks/:taskId/status
// @access  Private/Collector
export const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status, notes } = req.body;
    const collector = req.collector;

    const validStatuses = ['in-progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const task = await WardTask.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Make sure this collector is assigned to this ward
    if (!collector.assignedWards.includes(task.ward)) {
      return res.status(403).json({
        success: false,
        message: 'You are not assigned to this ward',
      });
    }

    // Validate status transitions
    if (status === 'in-progress' && task.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Can only start a scheduled task',
      });
    }

    if (status === 'completed' && task.status !== 'in-progress' && task.status !== 'scheduled') {
      return res.status(400).json({
        success: false,
        message: 'Can only complete a scheduled or in-progress task',
      });
    }

    task.status = status;
    if (notes) task.notes = notes;
    if (status === 'completed') {
      task.completedAt = new Date();

      // Increment collector's totalCollections
      collector.totalCollections = (collector.totalCollections || 0) + 1;
      await collector.save();
    }

    await task.save();

    console.log(`✅ Ward ${task.ward} task ${taskId} updated to '${status}' by collector ${collector.collectorId}`);

    // If completed, notify users of that ward via email (non-blocking)
    if (status === 'completed') {
      notifyWardUsers(task.ward, task.date, task.timeSlot).catch(err => {
        console.error('Error notifying ward users:', err);
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: task._id,
        ward: task.ward,
        date: task.date,
        timeSlot: task.timeSlot,
        status: task.status,
        completedAt: task.completedAt,
        notes: task.notes,
      },
      message: `Ward ${task.ward} task ${status === 'completed' ? 'completed' : 'started'} successfully`,
    });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task completion status for a specific ward and date (public, used by user Schedule page)
// @route   GET /api/ward-tasks/status/:ward/:date
// @access  Public
export const getWardTaskStatus = async (req, res) => {
  try {
    const ward = parseInt(req.params.ward);
    const date = req.params.date; // YYYY-MM-DD

    if (isNaN(ward) || ward < 1 || ward > 33) {
      return res.status(400).json({ success: false, message: 'Invalid ward number' });
    }

    const task = await WardTask.findOne({ ward, date });

    res.status(200).json({
      success: true,
      data: task ? {
        ward: task.ward,
        date: task.date,
        status: task.status,
        completedAt: task.completedAt,
        timeSlot: task.timeSlot,
      } : {
        ward,
        date,
        status: isPickupDay(ward, date) ? 'scheduled' : 'no-pickup',
        completedAt: null,
        timeSlot: WARD_SCHEDULES[ward]?.timeSlot || 'N/A',
      },
    });
  } catch (error) {
    console.error('Get ward task status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get task history for a collector (past 7 days)
// @route   GET /api/ward-tasks/history
// @access  Private/Collector
export const getTaskHistory = async (req, res) => {
  try {
    const collector = req.collector;
    const assignedWards = collector.assignedWards || [];

    // Get dates for past 7 days
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      dates.push(`${y}-${m}-${day}`);
    }

    const tasks = await WardTask.find({
      ward: { $in: assignedWards },
      date: { $in: dates },
    }).sort({ date: -1, ward: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    console.error('Get task history error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper: Send email notification to all users of a specific ward
async function notifyWardUsers(wardNumber, date, timeSlot) {
  try {
    // Find all users whose ward matches (stored as "Ward X" or just the number)
    const wardStrings = [`Ward ${wardNumber}`, `${wardNumber}`, `ward ${wardNumber}`];
    const users = await User.find({
      ward: { $in: wardStrings },
      isActive: true,
    });

    if (users.length === 0) {
      console.log(`📭 No users found for Ward ${wardNumber} to notify`);
      return;
    }

    console.log(`📧 Notifying ${users.length} users of Ward ${wardNumber} about completed pickup`);

    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    for (const user of users) {
      if (user.email) {
        try {
          await emailService.sendScheduleReminderEmail({
            to: user.email,
            name: user.fullName || user.username || 'Resident',
            ward: `Ward ${wardNumber}`,
            timeSlot,
            dayName: formattedDate,
            vehicle: '',
            driver: '',
          });
        } catch (emailErr) {
          console.error(`Failed to email ${user.email}:`, emailErr.message);
        }
      }
    }

    console.log(`✅ Ward ${wardNumber} users notified about completed pickup`);
  } catch (err) {
    console.error('notifyWardUsers error:', err);
  }
}
