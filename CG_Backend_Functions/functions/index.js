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

exports.getDeviceData = functions.https.onRequest(async (req, res) => {
  await getDeviceData(req, res);
});

exports.addSensorData = functions.https.onRequest(async (req, res) => {
  await addSensorData(req, res);
});

exports.changeDefault = functions.https.onRequest(async (req, res) => {
  await changeDefault(req, res);
});

exports.changeDeviceRange = functions.https.onRequest(async (req, res) => {
  await changeDeviceRange(req, res);
});

exports.getSettings = functions.https.onRequest(async (req, res) => {
  await getSettings(req, res);
});

exports.addDevice = functions.https.onRequest(async (req, res) => {
  await addDevice(req, res);
});

exports.sendAlert = functions.https.onRequest(async (req, res) => {
  await sendAlert(req, res);
});

exports.scheduledProcessDailyData = functions.pubsub.schedule('55 23 * * *').onRun((context) => {
    return processDailyData();
  });


const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Middleware for enabling CORS


app.get('/', (req, res)=>{
  res.send("Server is running");
});

// Start the Express server on the specified port
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the Express app
module.exports = app;
