import { Router } from "express";
import { getReports, submitReport } from "../controllers/reportController.js";
import { upload } from "../middleware/multer.js";
import { verifyAuth } from "../middleware/auth.js";

const router = Router()


router.route("/").post(upload.single("reportImage"), verifyAuth, submitReport);
router.route("/").get(verifyAuth, getReports)


export default router;