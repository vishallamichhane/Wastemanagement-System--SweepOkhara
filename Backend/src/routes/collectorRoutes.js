import express from 'express';
import {
  createCollector,
  collectorLogin,
  getAllCollectors,
  getCollector,
  updateCollector,
  deleteCollector,
  getCollectorStats,
  getCollectorProfile,
  updateCollectorProfile,
  getCollectorByWard,
  getCollectorReports,
  updateReportStatus,
} from '../controllers/collectorController.js';
import { protectCollector } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', collectorLogin);

// Collector protected routes (require collector authentication)
router.get('/profile', protectCollector, getCollectorProfile);
router.put('/profile', protectCollector, updateCollectorProfile);
router.get('/my-reports', protectCollector, getCollectorReports);
router.put('/reports/:reportId/status', protectCollector, updateReportStatus);

// Protected routes (would need authentication middleware in production)
// For now, these are open but should be protected with admin middleware
router.route('/')
  .get(getAllCollectors)
  .post(createCollector);

router.get('/stats/summary', getCollectorStats);
router.get('/ward/:wardNumber', getCollectorByWard);

router.route('/:id')
  .get(getCollector)
  .put(updateCollector)
  .delete(deleteCollector);

export default router;
