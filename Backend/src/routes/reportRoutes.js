import { Router } from "express";
import { getReports, getUserReports, submitReport } from "../controllers/reportController.js";
import { upload } from "../middleware/multer.js";
import { verifyAuth } from "../middleware/auth.js";

const router = Router()


router.route("/").post(upload.array("images", 5), verifyAuth, submitReport);
router.route("/").get(verifyAuth, getReports)

router.route("/my-reports").get(verifyAuth, getUserReports);


export default router;