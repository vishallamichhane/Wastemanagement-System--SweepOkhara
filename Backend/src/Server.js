import 'dotenv/config';
import connectDB from './config/db.js';
import app from './app.js';





connectDB().then(async () => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`The app is listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log('Connection to Mongodb failed ::', error);
  });