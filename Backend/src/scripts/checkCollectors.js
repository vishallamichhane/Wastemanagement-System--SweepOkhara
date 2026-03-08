import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Collector from '../models/collector.js';

await connectDB();

const collectors = await Collector.find({}).select('name collectorId vehicleId assignedWards status phoneNumber');
console.log(`=== All Collectors (${collectors.length}) ===`);
for (const c of collectors) {
  console.log(JSON.stringify({
    name: c.name,
    collectorId: c.collectorId,
    vehicleId: c.vehicleId,
    assignedWards: c.assignedWards,
    status: c.status,
    phoneNumber: c.phoneNumber,
  }, null, 2));
  console.log('---');
}

await mongoose.disconnect();
