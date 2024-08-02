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
  addDevice 
} = require('../controllers/serverController');
const { sendAlert } = require('../controllers/notificationController');

const router = express.Router(); // Create a new router

// Health check route
router.get('/', (req, res) => { res.send('Server is running'); });

// Route to get device settings
router.post('/getSettings', getSettings);

// Route to get device data
router.post('/deviceData', getDeviceData);

// Route to add a new device
router.post('/addDevice', addDevice);

// Route to add sensor data
router.post('/addSensorData', addSensorData);

// Route to send alerts
router.get('/sendAlert', sendAlert);

// Route to change the default range settings
router.post('/changeDefaultRange', changeDefault);

// Route to change the range settings for a specific device
router.post('/changeRange', changeDeviceRange);

module.exports = router; // Export the router
