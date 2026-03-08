import { uploadToCloudinary } from "../utils/cloudinary.js";
import Report from "../models/reports.js";
import Collector from "../models/collector.js";

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
      ward,
    } = req.body;

    console.log("Request body:", req.body);
    console.log("Request user:", req.user);

    // Validate input
    if (!reportType || !reportLabel || !description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate ward
    const wardNumber = parseInt(ward);
    if (!ward || isNaN(wardNumber) || wardNumber < 1 || wardNumber > 33) {
      return res.status(400).json({ message: "Valid ward number (1-33) is required" });
    }

    // Validate coordinates
    if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
      return res.status(400).json({ 
        message: "Valid GPS coordinates are required. Please use the location button or pick a spot on the map." 
      });
    }
    const parsedLat = parseFloat(latitude);
    const parsedLng = parseFloat(longitude);

    const userId = req.user.id;
    const userName = req.user.name || '';
    const userEmail = req.user.email || '';

    console.log("Files received:", req.files);
    const imageFiles = req.files || [];
    let images = [];

    for (const img of imageFiles) {
      try {
        const imgUrl = await uploadToCloudinary(img.path);
        images.push(imgUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
    }

    // Find and assign collector based on ward
    let assignedCollector = null;
    try {
      console.log('🔍 Searching for collector for ward:', wardNumber);
      
      // First, log all collectors in the database for debugging
      const allCollectors = await Collector.find({});
      console.log('📊 All collectors in database:', allCollectors.length);
      allCollectors.forEach(c => {
        console.log(`Collector: ${c.collectorId} (${c.name}) - Wards: ${c.assignedWards} - Status: ${c.status}`);
      });

      // Search for collector with this ward
      const collector = await Collector.findOne({
        assignedWards: wardNumber,
        status: 'active'
      }).select('collectorId name vehicleId');

      if (collector) {
        assignedCollector = {
          collectorId: collector.collectorId,
          collectorName: collector.name,
          vehicleId: collector.vehicleId
        };
        console.log('✅ Collector auto-assigned:', assignedCollector);
      } else {
        console.log('⚠️ No collector found for ward', wardNumber, 'with active status');
        
        // Try without status filter to diagnose
        const allWithWard = await Collector.find({ assignedWards: wardNumber });
        console.log(`Collectors with ward ${wardNumber} (all statuses):`, allWithWard.length);
        allWithWard.forEach(c => console.log(`  - ${c.collectorId} (status: ${c.status})`));
      }
    } catch (collectorError) {
      console.error('Error finding collector:', collectorError.message);
      console.error('Stack:', collectorError.stack);
      // Don't fail the report submission if collector assignment fails
    }

    console.log("Creating report with data:", {
      userId,
      userName,
      userEmail,
      reportLabel,
      images,
      reportType,
      description,
      location,
      ward: wardNumber,
      latitude: parsedLat,
      longitude: parsedLng,
      assignedCollector,
    });

    const reportData = {
      userId,
      userName,
      userEmail,
      reportLabel,
      images,
      reportType,
      description,
      location,
      ward: wardNumber,
      latitude: parsedLat,
      longitude: parsedLng,
      assignedCollectorId: assignedCollector?.collectorId || null,
      assignedCollectorName: assignedCollector?.collectorName || null,
      assignedVehicleId: assignedCollector?.vehicleId || null,
    };

    const report = await Report.create(reportData);

    console.log("Report created successfully:", report);

    return res
      .status(201)
      .json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Error in submitReport:", error.message);
    console.error("Error stack:", error.stack);
    return res.status(500).json({ message: error.message });
  }
}

async function getReports(req, res) {
  try {
    const reports = await Report.find({});
    
    // Always verify and fix collector assignment based on ward
    const updatedReports = [];
    for (const report of reports) {
      if (report.ward) {
        try {
          const collector = await Collector.findOne({
            assignedWards: report.ward,
            status: 'active'
          }).select('collectorId name vehicleId');

          if (collector) {
            // Fix assignment if missing or incorrect
            if (report.assignedCollectorId !== collector.collectorId) {
              const oldCollector = report.assignedCollectorName || 'None';
              report.assignedCollectorId = collector.collectorId;
              report.assignedCollectorName = collector.name;
              report.assignedVehicleId = collector.vehicleId;
              await report.save();
              console.log(`✅ Fixed collector assignment for report ${report._id} (ward ${report.ward}): ${oldCollector} → ${collector.name}`);
            }
          }
        } catch (collectorErr) {
          console.error('Error verifying collector assignment:', collectorErr.message);
        }
      }
      updatedReports.push(report);
    }

    return res.status(200).json(updatedReports);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


async function getUserReports(req, res){
  try{
    const userId = req.user.id;
    const reports = await Report.find({userId});
    
    // Always verify and fix collector assignment based on ward
    for (const report of reports) {
      if (report.ward) {
        try {
          const collector = await Collector.findOne({
            assignedWards: report.ward,
            status: 'active'
          }).select('collectorId name vehicleId');

          if (collector && report.assignedCollectorId !== collector.collectorId) {
            const oldCollector = report.assignedCollectorName || 'None';
            report.assignedCollectorId = collector.collectorId;
            report.assignedCollectorName = collector.name;
            report.assignedVehicleId = collector.vehicleId;
            await report.save();
            console.log(`✅ Fixed collector for user report ${report._id} (ward ${report.ward}): ${oldCollector} → ${collector.name}`);
          }
        } catch (collectorErr) {
          console.error('Error verifying collector assignment:', collectorErr.message);
        }
      }
    }

    return res.status(200).json(reports);
  } catch(error){
    console.log(error)
    return res.status(500).json({message: error.message});
  }
}


export { submitReport, getReports, getUserReports };
