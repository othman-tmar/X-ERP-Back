const express = require("express");
const router = express.Router();
const Machine = require("../models/machine");
/* const { verifyToken } = require("../middleware/verifyToken");
const { authorizeRoles } = require("../middleware/authorizeRoles"); */

//  Get machines.
router.get("/", async (req, res) => {
  try {
    const machines = await Machine.find({}, null, { sort: { _id: -1 } })
      .populate({path: "departmentID",
                model: "Department"}).exec();

    res.status(200).json(machines);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Add new machine
router.post("/", async (req, res) => {
  const newMachine = new Machine(req.body);
  try {
    const response = await newMachine.save();
    const machines = await Machine.findById(response._id)
    .populate({path: "departmentID",
    model: "Department"}).exec();
    res.status(200).json(machines);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Search machine
router.get("/:machineId", async (req, res) => {
  try {
    const mach = await Machine.findById(req.params.machineId);

    res.status(200).json(mach);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Update machine
router.put("/:machineId", async (req, res) => {
  try {
    const mach = await Machine.findByIdAndUpdate(
      req.params.machineId,
      { $set: req.body },
      { new: true }
    );
    const machines = await Machine.findById(mach._id)
    .populate({path: "departmentID",
    model: "Department"}).exec();
    res.status(200).json(machines);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// Delete machine
router.delete("/:machineId", async (req, res) => {
  const id = req.params.machineId;
  await Machine.findByIdAndDelete(id);

  res.json({ message: "machine deleted successfully." });
});

module.exports = router;
