const functions = require("firebase-functions");
const {
  getDeviceData,
  addSensorData,
  changeDefault,
  changeDeviceRange,
  getSettings,
  addDevice,
} = require("./controllers/serverController");
const { sendAlert } = require("./controllers/notificationController");
const express = require('express');
const cors = require('cors');

const getDeviceData = functions.https.onRequest(async (req, res) => {
  await getDeviceData(req, res);
});

const addSensorData = functions.https.onRequest(async (req, res) => {
  await addSensorData(req, res);
});

const changeDefault = functions.https.onRequest(async (req, res) => {
  await changeDefault(req, res);
});

const changeDeviceRange = functions.https.onRequest(async (req, res) => {
  await changeDeviceRange(req, res);
});

const getSettings = functions.https.onRequest(async (req, res) => {
  await getSettings(req, res);
});

const addDevice = functions.https.onRequest(async (req, res) => {
  await addDevice(req, res);
});

const sendAlert = functions.https.onRequest(async (req, res) => {
  await sendAlert(req, res);
});

const scheduledProcessDailyData = functions.pubsub.schedule('55 23 * * *').onRun((context) => {
    return processDailyData();
  });


const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware for enabling CORS


// Health check route
app.get('/', (req, res) => { res.send('Server is running'); });

// Start the Express server on the specified port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express app
module.exports = {getDeviceData, addSensorData, changeDefault, changeDeviceRange, getSettings, addDevice, sendAlert, scheduledProcessDailyData, app};
