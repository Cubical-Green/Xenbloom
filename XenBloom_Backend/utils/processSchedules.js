const { firestore } = require("../firebase/firebaseConfig");

exports.processSchedules= async () => {
    const snapshot = await firestore.collection('schedules').where('status', '==', false).get();
    const currentTime = new Date();
    snapshot.forEach(async (doc) => {
        const schedule = doc.data();
        const scheduleRef = doc.ref;
        const scheduledTime = schedule.time.toDate();
        if (schedule.frequency === 'daily') {
            // Check if current time matches the scheduled time
            if (currentTime.getHours() >= scheduledTime.getHours() && currentTime.getMinutes() >= scheduledTime.getMinutes()) {
                // Perform the action
                await executeAction(schedule.deviceId, schedule.taskType, schedule.action);
                await scheduleRef.update({status:true}) //performed
            }
        } else {
            // Check if current date matches the specific date
            const scheduledDate = new Date(schedule.time);
            if (currentTime.toDateString() === scheduledDate.toDateString() && currentTime.getHours() === scheduledDate.getHours() && currentTime.getMinutes() === scheduledDate.getMinutes()) {
                // Perform the action
                await executeAction(schedule.deviceId, schedule.taskType, schedule.action);
                await scheduleRef.update({status:true}) //performed
            }
        }
    });
}

async function executeAction(deviceId, taskType, action) {
    const deviceRef = firestore.collection('devices').doc(deviceId);
    const device = await deviceRef.get();
    if (!device.exists) {
        console.log(`No device found with ID: ${deviceId}`);
        return;
    }
    const updateData = {};
    if (taskType === 'lights') {
        updateData.lights = action;
    }
    // Update the device data with the action
    await deviceRef.update(updateData);
    console.log(`Executed action ${action} for task ${taskType} on device ${deviceId}`);
}
