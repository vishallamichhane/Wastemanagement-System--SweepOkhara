import express from 'express';
import {
  getTodayTasks,
  getWeekSchedule,
  updateTaskStatus,
  getWardTaskStatus,
  getTaskHistory,
} from '../controllers/wardTaskController.js';
import { protectCollector } from '../middleware/auth.js';

const router = express.Router();

// Public route — users can check if their ward pickup is done
router.get('/status/:ward/:date', getWardTaskStatus);

// Collector protected routes
router.get('/today', protectCollector, getTodayTasks);
router.get('/schedule', protectCollector, getWeekSchedule);
router.get('/history', protectCollector, getTaskHistory);
router.put('/:taskId/status', protectCollector, updateTaskStatus);

export default router;
