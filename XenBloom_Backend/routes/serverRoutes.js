/**
 * Server routes
 * Defines the routes for the API related to device and sensor operations.
 */

const express = require('express');
const { 
  getDeviceData, 
  addSensorData, 
  changeDefault, 
  changeDeviceRange, 
  getSettings, 
  addDevice,
  addSchedule,
  addUser
} = require('../controllers/serverController');
const { sendAlert } = require('../controllers/notificationController');

const { processDailyData } = require('../controllers/aggregatorController');

const router = express.Router(); // Create a new router

// Health check route
router.get('/', (req, res) => { res.send('Server is running'); });

// Route to get device settings
router.get('/getSettings', getSettings);

router.post('/processDailyData', processDailyData)

// Route to get device data
router.get('/deviceData', getDeviceData);

// Route to add a schedule
router.post('/addSchedules', addSchedule);

// Route to add a user
router.post("/addUser", addUser)

// Route to add a new device
router.post('/addDevice', addDevice);

// Route to add sensor data
router.post('/addSensorData', addSensorData);

// Route to send alerts
router.post('/sendAlert', sendAlert);

// Route to change the default range settings
router.put('/changeDefaultRange', changeDefault);

// Route to change the range settings for a specific device
router.put('/changeRange', changeDeviceRange);

module.exports = router; // Export the router
