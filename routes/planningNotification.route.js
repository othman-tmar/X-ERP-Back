const express = require('express');
const router = express.Router();
const PlanningNotification=require("../models/PlanningNotification")


// Get notifs planned maintenance.
router.get("/", async (req, res) => {
    try {
      const PlanningNotifications = await PlanningNotification.find({}, null, { sort: { notifDate: -1 } })
      .populate({path: "departmentID",
      model: "Department"})
      .populate({path: "machineID",
      model: "Machine"})
      .populate({path: "employeeID",
      model: "Employee"})
      .exec();
  
      res.status(200).json(PlanningNotifications);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });




// Add new notifs planned maintenance
router.post("/", async (req, res) => {
    const newPlanningNotifications = new PlanningNotification;
    const {
      doc,
      notifDate
      
    } = req.body;
    
    try {
      newPlanningNotifications.machineID=doc.machineID;
      newPlanningNotifications.departmentID=doc.departmentID;
      newPlanningNotifications.employeeID=doc.employeeID;
      newPlanningNotifications.preventivePlanificationID=doc._id;
      newPlanningNotifications.dateStart=doc.dateStart;
      newPlanningNotifications.dateEnd=doc.dateEnd;
      newPlanningNotifications.notifDate=notifDate;



      const response = await newPlanningNotifications.save();
      const PlanningNotifications = await PlanningNotification.findById(response._id)
      .populate({path: "departmentID",
      model: "Department"})
      .populate({path: "machineID",
      model: "Machine"})
      .populate({path: "employeeID",
      model: "Employee"})
      .exec();
      res.status(200).json(PlanningNotifications);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });


// Search notif planned maintenance
router.get('/:PlanningNotificationId',async(req, res)=>{
    try {
        const PM = await PlanningNotification.findById(req.params.PlanningNotificationId);
        
        res.status(200).json(PM);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
 

// Update notif planned maintenance
router.put("/:PlanningNotificationId", async (req, res) => {
    try {
      const PM = await PlanningNotification.findByIdAndUpdate(
        req.params.PlanningNotificationId,
        { $set: req.body },
        { new: true }
      );
      const planningNotification = await PlanningNotification.findById(PM._id)
      .populate({path: "departmentID",
      model: "Department"})
      .populate({path: "machineID",
      model: "Machine"})
      .populate({path: "employeeID",
      model: "Employee"})
      .exec();
      res.status(200).json(planningNotification);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });


// Delete notif maintenance
router.delete('/:PlanningNotificationId', async (req, res)=> {
    const  id  = req.params.PlanningNotificationId;
    await PlanningNotification.findByIdAndDelete(id);

    res.json({ message: "Planned maintenance deleted successfully." });

});


//update notifs of preven planifs
router.delete('/preventiveUpdate/:preventivePlanificationID', async (req, res) => {
  const preventivePlanificationID = req.params.preventivePlanificationID;
  await PlanningNotification.deleteMany({ preventivePlanificationID: preventivePlanificationID });

  res.json({ message: "Planned maintenance deleted successfully." });
});

module.exports = router;