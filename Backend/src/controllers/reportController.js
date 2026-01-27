import { uploadToCloudinary } from "../utils/cloudinary.js";
import Report from "../models/reports.js";

async function submitReport(req, res) {
  try {
    console.log("Inside submitReport controller");
    const {
      latitude,
      longitude,
      description,
      location,
      reportType,
      reportLabel,
    } = req.body;

    // Validate input
    if (!reportType || !reportLabel || !description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userId = req.user.id;

    const imageFile = req.file
    console.log(imageFile)

    const imageUrl = await uploadToCloudinary(imageFile.path);

    // Create new report
    const report = await Report.create({
      userId,
      reportLabel,
      imageUrl: [imageUrl],
      reportType,
      description,
      location,
      latitude,
      longitude,
    });

    return res
      .status(201)
      .json({ message: "Report submitted successfully", report });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getReports(req, res) {
  try {
    const reports = await Report.find({});
    console.log(reports)
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export { submitReport, getReports };
