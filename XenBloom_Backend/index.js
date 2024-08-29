/**
 * Main server file
 * Sets up Express server and schedules a cron job for processing daily data.
 */

const express = require('express');
const serverRoutes = require('./routes/serverRoutes');
const cors = require('cors');
const cron = require('node-cron');
const { processSchedules } = require('./utils/processSchedules');

const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware for enabling CORS

// Use the server routes defined in serverRoutes
app.use('/', serverRoutes);
setInterval(processSchedules, 60000); // Run every minute

// Start the Express server on the specified port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express app
module.exports = app;
