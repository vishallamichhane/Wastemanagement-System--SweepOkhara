import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';
import { initializeScheduleReminderService } from './services/scheduleReminderService.js';





connectDB().then(async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`The app is listening on http://localhost:${port}`);
      
      // Initialize the schedule reminder cron job
      initializeScheduleReminderService();
    });
  })
  .catch((error) => {
    console.log('Connection to Mongodb failed ::', error);
  });