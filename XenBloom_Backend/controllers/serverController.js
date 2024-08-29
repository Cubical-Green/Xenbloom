/**
 * Server Controller
 * Handles the logic for server routes related to device management.
 */

const { FieldValue } = require('firebase-admin/firestore');
const { firestore } = require('../firebase/firebaseConfig');
const { addDevice, addUser, addSchedule, addSettings } = require('../firebase/firebaseServices');

/**
 * Gets device data
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.getDeviceData = async (req, res) => {
  try {
    const deviceId = req.body.deviceId; // Extract device ID from request body
    if (!deviceId) {
      return res.status(400).json({ Error: 'Invalid request' });
    }
    const deviceDoc = await firestore.collection('devices').doc(deviceId).get(); // Fetch device document
    const deviceData = deviceDoc.data(); // Get device data
    if (deviceDoc.exists) {
      // Check if device is offline
      if (deviceData.status == false) {
        return res.status(400).json({ Error: 'System is Offline. Please check your connection.', deviceData });
      }
      return res.status(200).json(deviceData); // Return device data
    } else {
      console.log('No such device!');
      return res.status(400).json({ Error: 'Device Not Found' });
    }
  } catch (error) {
    console.error('Error fetching device:', error);
    return res.status(500).json({ Error: `Internal Server Error, ${error.message}` });
  }
};

/**
 * Adds sensor data to a device
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.addSensorData = async (req, res) => {
  try {
    const deviceId = req.body.deviceid; // Extract device ID from request body
    const newSensorData = req.body.sensorData; // Extract sensor data from request body
    if (!deviceId || !newSensorData) {
      return res.status(400).json({ Error: 'Invalid request' });
    }
    newSensorData.timestamp = new Date(); // Add timestamp to sensor data
    const deviceDoc = firestore.collection("devices").doc(deviceId); // Reference to device document
    const deviceData = await deviceDoc.get(); // Fetch device document

    if (deviceData.exists) {
      // Update device sensor data
      await deviceDoc.update({
        sensorData: FieldValue.arrayUnion(newSensorData)
      });
      return res.status(200).json({ message: "New Data Added Successfully" });
    } else {
      console.log("No such device!");
      return res.status(400).json({ Error: "Device Not Found" });
    }
  } catch (error) {
    console.error("Error fetching device:", error);
    return res.status(500).json({ Error: `Internal Server Error, ${error.message}` });
  }
};

/**
 * Changes the default range settings
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.changeDefault = async (req, res) => {
  const newDefault = req.body; // New default settings from request body
  try {
    const docRef = firestore.collection("settings").doc("default"); // Reference to settings document
    await docRef.update(newDefault); // Update settings

    res.status(200).json({ message: "Default Range updated successfully" });
  } catch (error) {
    console.error("Error updating Ranges:", error);
    res.status(500).json({ error: "Error updating Ranges:" });
  }
};

/**
 * Changes the range settings for a specific device
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.changeDeviceRange = async (req, res) => {
  const { newRange, deviceId } = req.body; // Extract new range and device ID from request body
  if (!newRange || !deviceId) {
    return res.status(400).json({ Error: "Invalid Request" });
  }
  try {
    const docRef = firestore.collection("devices").doc(deviceId); // Reference to device document
    const deviceData = await docRef.get(); // Fetch device document

    if (deviceData.exists) {
      const settings = firestore.collection("devices").doc(deviceData.data().settings); // Reference to device settings
      await settings.update(newRange); // Update settings
      return res.status(200).json({ message: "Range updated successfully" });
    } else {
      return res.status(400).json({ Error: "Device Not Found" });
    }
  } catch (error) {
    console.error("Error updating Ranges:", error);
    res.status(500).json({ error: "Error updating Ranges:" });
  }
};

/**
 * Adds a new device to the system
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.addDevice = async (req, res) => {
  try {
    const { deviceId, device, uid } = req.body; // Destructure new device data and user's uid from request body
    if (!deviceId || !device || !uid) {
      return res.status(400).json({ Error: "Invalid Request" });
    }
    device.lights="false" //lights off by default
    device.sensorData = []; // empty sensor data list by default
    device.status = true; // default online status
    if (device.settings !== "default") {
      const setting = await addSettings(device.settings); // if not default settings, add settings to firestore
      device.settings = setting.id;
    }
    // Check if the device name is already taken by the same user
    const userRef = firestore.collection("users").where('uid', '==', uid);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      const userData = userDoc.data();
      const deviceExists = userData.devices.some(d => d.name === device.name);
      if (deviceExists) {
        return res.status(400).json({ Error: "Device name already taken by another device of the same user" });
      }
      const addedDevice = await addDevice(device, deviceId); // Add device to database
      // Update user data
      await userDoc.ref.update({
        devices: FieldValue.arrayUnion({ id: deviceId, name: device.name })
      });
      return res.status(200).json({ message: "Device Added Successfully" });
    } else {
      return res.status(404).json({ Error: "User not found" });
    }
  } catch (error) {
    console.error("Error adding device:", error);
    return res.status(500).json({ Error: "Internal Server Error" });
  }
};




/**
 * Gets settings for a specific device
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
exports.getSettings = async (req, res) => {
  const deviceId = req.query.deviceId; // Extract settings ID from request body
  if (!deviceId) {
    return res.status(400).json({ Error: "Invalid Request" });
  }
  try {
    const deviceDoc = await firestore.collection('devices').doc(deviceId).get(); // Fetch device document
    const deviceData = deviceDoc.data(); // Get device data
    if (deviceDoc.exists) {
      const settingsDoc = await firestore.collection("settings").doc(deviceData.settings).get(); // Fetch settings document
   if (settingsDoc.exists) {
      const data = settingsDoc.data(); // Get settings data
      res.status(200).json({ data }); // Return settings data
    } else {
      return res.status(400).json({ Error: "Device Not Found" });
    }
  }}catch (error) {
    console.error("Error Getting Settings", error);
    res.status(500).json({ error: "Internal Server" });
  }
};

exports.addSchedule = async (req, res) => {
  const schedule = req.body; // New schedule data from request body
  if (!schedule) {
    return res.status(400).json({ Error: "Invalid Request" });
  }
  schedule.status = false; // Initialize stats as false
  schedule.time=new Date(schedule.time)
  await addSchedule(schedule); // Add schedule to database
  return res.status(200).json({ message: "Scheduled Successfully" });
};

exports.addUser = async (req, res) => {
  const user = req.body; // New user data from request body
  if (!user) {
    return res.status(400).json({ Error: "Invalid Request" });
  }
  user.status = true; // Initialize stats as false
  user.devices=[]
  await addUser(user); // Add schedule to database
  return res.status(200).json({ message: "User Added Successfully" });
};
