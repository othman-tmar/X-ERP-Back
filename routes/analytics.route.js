const express = require('express');
const router = express.Router();
const MaintenanceCost = require('../models/MaintenanceCost');
const CostFilters = require('../models/CostFilters');
const ActivityFilters = require('../models/ActivityFilters');
const MaintenanceActivity = require('../models/MaintenanceActivity');
const monthOrder = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// get maintenance_cost_chart Data Filtred 
router.get("/maintenance_cost_chart/filter", async (req, res) => {
  try {
    const costs = await CostFilters.find({}, null, {
      sort: { _id: -1 }});
 
    // Sort data by month
    const sortedCosts = costs.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    
    res.status(200).json(sortedCosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// get maintenance_activity_chart Data Filtred 
router.get("/maintenance_activity_chart/filter", async (req, res) => {
  try {
    const costs = await ActivityFilters.find({}, null, {
      sort: { _id: -1 }});
 
    // Sort data by month
    const sortedCosts = costs.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    
    res.status(200).json(sortedCosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// get maintenance_activity_chart Data 
router.get("/maintenance_activity_chart", async (req, res) => {
  try {
    const activity = await MaintenanceActivity.find({}, null, {
      sort: { _id: -1 }});
 
    // Sort data by month
    const sortedActivity = activity.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    
    res.status(200).json(sortedActivity);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});


// get maintenance_cost_chart Data 
router.get("/maintenance_cost_chart", async (req, res) => {
  try {
    const costs = await MaintenanceCost.find({}, null, {
      sort: { _id: -1 }});

    // Sort data by month
    const sortedCosts = costs.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    
    res.status(200).json(sortedCosts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});




module.exports = router;
