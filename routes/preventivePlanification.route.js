const express = require('express');
const router = express.Router();
const PreventivePlanification=require("../models/PreventivePlanification")
/* const { verifyToken } = require('../middleware/verifyToken');
const { authorizeRoles } = require('../middleware/authorizeRoles'); */
const { parseDate } = require("../util/Functions");
const { activityAddPreventivePlanifications, activityDeletePreventivePlanifications, notificationsDelete, notificationsAdd } = require('../util/analytics');

// Get preventive planned maintenance.
router.get("/", async (req, res) => {
    try {
      const Preventives = await PreventivePlanification.find({}, null, { sort: { _id: -1 } })
      .populate({path: "departmentID",
      model: "Department"})
      .populate({path: "machineID",
      model: "Machine"})
      .populate({path: "employeeID",
      model: "Employee"})
      .exec();
  
      res.status(200).json(Preventives);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });

// Get filtred preventivesPlanified maintenance by dateEnd.
router.get("/filteredPreventivePlanifiedByDate", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const Preventives = await PreventivePlanification.find({}, null, { sort: { _id: -1 } })
      .populate({ path: "departmentID", model: "Department" })
      .populate({ path: "machineID", model: "Machine" })
      .populate({ path: "employeeID", model: "Employee" })
      .exec();

    const filteredPreventives = Preventives.filter((preventive) => {
      if (preventive.dateEnd) {
        const dateEnd = parseDate(preventive.dateEnd);
        return (
          dateEnd.getMonth() === currentMonth &&
          dateEnd.getFullYear() === currentYear
        );
      } else return undefined;
    });

    res.status(200).json(filteredPreventives);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Add new preventive planned maintenance
router.post("/", async (req, res) => {
    const newPreventivePlanification = new PreventivePlanification(req.body);
    try {
      const response = await newPreventivePlanification.save();
      const Preventives = await PreventivePlanification.findById(response._id)
      .populate({path: "departmentID",
      model: "Department"})
      .populate({path: "machineID",
      model: "Machine"})
      .populate({path: "employeeID",
      model: "Employee"})
      .exec();
      res.status(200).json(Preventives);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }

    setImmediate(async () => {  
      const doc = newPreventivePlanification;
  activityAddPreventivePlanifications(doc);
  notificationsAdd(doc);
  });
  });


// Search preventive planned maintenance
router.get('/:PreventivePlanificationId',async(req, res)=>{
    try {
        const PM = await PreventivePlanification.findById(req.params.PreventivePlanificationId);
        
        res.status(200).json(PM);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});
 

// Update preventive planned maintenance
router.put("/:PreventivePlanificationId", async (req, res) => {
    try {
      const PM = await PreventivePlanification.findByIdAndUpdate(
        req.params.prevMainId,
        { $set: req.body },
        { new: true }
      );
      const preventivePlan = await PreventivePlanification.findById(PM._id)
      .populate({path: "departmentID",
      model: "Department"})
      .populate({path: "machineID",
      model: "Machine"})
      .populate({path: "employeeID",
      model: "Employee"})
      .exec();
      res.status(200).json(preventivePlan);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  });


// Delete preventive maintenance
router.delete('/:PreventivePlanificationId', async (req, res)=> {
    const  id  = req.params.PreventivePlanificationId;
    const originalDoc = await PreventivePlanification.findById(id);
    await PreventivePlanification.findByIdAndDelete(id);

    res.json({ message: "Planned maintenance deleted successfully." });

    setImmediate(async () => {    
      activityDeletePreventivePlanifications(originalDoc);
      notificationsDelete(originalDoc);
   });
});

module.exports = router;