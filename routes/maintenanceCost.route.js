const express = require("express");
const router = express.Router();
const MaintenanceCost = require("../models/MaintenanceCost");
const CostFilters = require("../models/CostFilters");


// add MaintenanceCost
router.put("/add", async (req, res) => {
  const {
    year,
    month,
    storableSparePartCost,
    nonStorableSparePartCost,
    serviceCost,
    laborCost,
  } = req.body;

  let maintenanceCost = await MaintenanceCost.findOne({
    year: year,
    month: month,
  });
  if (!maintenanceCost) {
    // If it doesn't exist, create it
    maintenanceCost = new MaintenanceCost({
      year: year,
      month: month,
      "Total Maintenance cost (TND)": 0,
      "Storable Spare Part Cost (TND)": 0,
      "Non Storable Spare Part Cost (TND)": 0,
      "Service Cost (TND)": 0,
      "Local Labor Cost (TND)": 0,
    });
  }

  // Update the costs
  maintenanceCost["Storable Spare Part Cost (TND)"] += storableSparePartCost;
  maintenanceCost["Non Storable Spare Part Cost (TND)"] +=
    nonStorableSparePartCost;
  maintenanceCost["Service Cost (TND)"] += serviceCost;
  maintenanceCost["Local Labor Cost (TND)"] += laborCost || 0;
    maintenanceCost["Total Maintenance cost (TND)"] = maintenanceCost["Storable Spare Part Cost (TND)"]+maintenanceCost["Non Storable Spare Part Cost (TND)"]+maintenanceCost["Service Cost (TND)"]+maintenanceCost["Local Labor Cost (TND)"];
  // Save the document
  await maintenanceCost.save();

  res.status(200).json(maintenanceCost);
});




// Update MaintenanceCost
router.put("/update", async (req, res) => {
  const { newYear, newMonth, oldYear, oldMonth, oldCosts, newCosts } = req.body;

  // Find the old document and subtract the old costs
  let oldMaintenanceCost = await MaintenanceCost.findOne({
    year: oldYear,
    month: oldMonth,
  });

  if (oldMaintenanceCost) {
    oldMaintenanceCost["Total Maintenance cost (TND)"] -= (oldCosts.storableSparePartCost + oldCosts.nonStorableSparePartCost + oldCosts.serviceCost);
    oldMaintenanceCost["Storable Spare Part Cost (TND)"] -= oldCosts.storableSparePartCost;
    oldMaintenanceCost["Non Storable Spare Part Cost (TND)"] -= oldCosts.nonStorableSparePartCost;
    oldMaintenanceCost["Service Cost (TND)"] -= oldCosts.serviceCost;

    await oldMaintenanceCost.save();
  }

  // Find or create the new document and add the new costs
  let newMaintenanceCost = await MaintenanceCost.findOne({
    year: newYear,
    month: newMonth,
  });

  if (!newMaintenanceCost) {
    newMaintenanceCost = new MaintenanceCost({
      year: newYear,
      month: newMonth,
      "Total Maintenance cost (TND)": 0,
      "Storable Spare Part Cost (TND)": 0,
      "Non Storable Spare Part Cost (TND)": 0,
      "Service Cost (TND)": 0,
      "Local Labor Cost (TND)": 0,
    });
  }

  newMaintenanceCost["Total Maintenance cost (TND)"] += (newCosts.storableSparePartCost + newCosts.nonStorableSparePartCost + newCosts.serviceCost);
  newMaintenanceCost["Storable Spare Part Cost (TND)"] += newCosts.storableSparePartCost;
  newMaintenanceCost["Non Storable Spare Part Cost (TND)"] += newCosts.nonStorableSparePartCost;
  newMaintenanceCost["Service Cost (TND)"] += newCosts.serviceCost;

  await newMaintenanceCost.save();

  res.status(200).json(newMaintenanceCost);
});




// Update MaintenanceCost Labor cost Salary
router.put("/updateSalary", async (req, res) => {
  const { year, month, oldCosts, newCosts } = req.body;

  let maintenanceCost = await MaintenanceCost.findOne({
    year: year,
    month: month,
  });

  if (!maintenanceCost) {
    // If it doesn't exist, create it
    maintenanceCost = new MaintenanceCost({
      year: year,
      month: month,
      "Total Maintenance cost (TND)": 0,
      "Storable Spare Part Cost (TND)": 0,
      "Non Storable Spare Part Cost (TND)": 0,
      "Service Cost (TND)": 0,
      "Local Labor Cost (TND)": 0,
    });
  }

  // Subtract the old costs
  maintenanceCost["Total Maintenance cost (TND)"] -= Number(oldCosts.salary);
  maintenanceCost["Local Labor Cost (TND)"] -= Number(oldCosts.salary);

  // Add the new costs
  maintenanceCost["Total Maintenance cost (TND)"] += Number(newCosts.salary);
  maintenanceCost["Local Labor Cost (TND)"] += Number(newCosts.salary);

  // Save the document
  await maintenanceCost.save();

  res.status(200).json(maintenanceCost);
});



// Subtract costs
router.put("/subtract", async (req, res) => {
  const { year, month, costs } = req.body;

  let maintenanceCost = await MaintenanceCost.findOne({
    year: year,
    month: month,
  });

  // Subtract the costs
  maintenanceCost["Total Maintenance cost (TND)"] -= (costs.storableSparePartCost+costs.nonStorableSparePartCost+costs.serviceCost);
  maintenanceCost["Storable Spare Part Cost (TND)"] -=
    costs.storableSparePartCost;
  maintenanceCost["Non Storable Spare Part Cost (TND)"] -=
    costs.nonStorableSparePartCost;
  maintenanceCost["Service Cost (TND)"] -= costs.serviceCost;
  /* maintenanceCost["Local Labor Cost (TND)"] -= Number(costs.localLaborCost); */

  // Save the document
  await maintenanceCost.save();

  res.status(200).json(maintenanceCost);
});


//filter-------------------------------------------------------------

router.put("/filter/add", async (req, res) => {
  const {
    parameter,
    year,
    month,
    cost,
    storableSparePartCost,
    nonStorableSparePartCost,
    serviceCost,
    laborCost,
    
  } = req.body;

  let x = await CostFilters.findOne({ parameter: parameter });
  if (!x) {
    x = new CostFilters({
      parameter: parameter,
      data: [
        {
          year: year,
          month: month,
          "Total Maintenance cost (TND)": cost,
          "Storable Spare Part Cost (TND)": storableSparePartCost,
          "Non Storable Spare Part Cost (TND)": nonStorableSparePartCost,
          "Service Cost (TND)": serviceCost,
          "Local Labor Cost (TND)": laborCost,
        },
      ],
    });
  } else {
    let costFiltersIndex = x.data.findIndex(
      (item) =>
        item.year.toString() === year.toString() &&
        item.month.toString() === month.toString()
    );
    if (costFiltersIndex === -1) {
      // If it doesn't exist, create it
      let costFilters = {
        year: year,
        month: month,
        "Total Maintenance cost (TND)": cost,
        "Storable Spare Part Cost (TND)": storableSparePartCost,
        "Non Storable Spare Part Cost (TND)": nonStorableSparePartCost,
        "Service Cost (TND)": serviceCost,
        "Local Labor Cost (TND)": laborCost,
      };

      x.data.push(costFilters); // Push the new object to data array
    } else {
      // Update the costs
      x.data[costFiltersIndex]["Total Maintenance cost (TND)"] += cost;
      x.data[costFiltersIndex]["Storable Spare Part Cost (TND)"] +=
        storableSparePartCost;
      x.data[costFiltersIndex]["Non Storable Spare Part Cost (TND)"] +=
        nonStorableSparePartCost;
      x.data[costFiltersIndex]["Service Cost (TND)"] += serviceCost;
      x.data[costFiltersIndex]["Local Labor Cost (TND)"] += laborCost;
    }
  }
  /* x.markModified('data'); */
  await x.save();
  res.status(200).json(x);
});


//update 
router.put("/filter/update", async (req, res) => {
  const { parameter, newYear, newMonth, oldYear, oldMonth, oldCosts, newCosts } = req.body;

  
  let x = await CostFilters.findOne({ parameter: parameter });

  if (!x) {
    x = new CostFilters({
      parameter: parameter,
      data: [
        {
          year: newYear,
          month: newMonth,
          "Total Maintenance cost (TND)":
            oldCosts.cost + oldCosts.laborCost || 0,
          "Storable Spare Part Cost (TND)": oldCosts.storableSparePartCost || 0,
          "Non Storable Spare Part Cost (TND)":
            oldCosts.nonStorableSparePartCost || 0,
          "Service Cost (TND)": oldCosts.serviceCost || 0,
          "Local Labor Cost (TND)": oldCosts.laborCost || 0,
        },
      ],
    });
  }


  let costFiltersIndexOld = x.data.findIndex(
    (item) =>
      item.year.toString() === oldYear.toString() &&
      item.month.toString() === oldMonth.toString()
  );

  let costFiltersIndexNew = x.data.findIndex(
    (item) =>
      item.year.toString() === newYear.toString() &&
      item.month.toString() === newMonth.toString()
  );

  if (costFiltersIndexNew === -1) {
    // If it doesn't exist, create it
    let costFilters = {
      year: newYear,
      month: newMonth,
      "Total Maintenance cost (TND)": 0,
      "Storable Spare Part Cost (TND)": 0,
      "Non Storable Spare Part Cost (TND)": 0,
      "Service Cost (TND)": 0,
      "Local Labor Cost (TND)": 0,
    };

    x.data.push(costFilters);
    // Update costFiltersIndexNew to point to the newly added item
  costFiltersIndexNew = x.data.length - 1;
  }
   
  x.data[costFiltersIndexOld]["Total Maintenance cost (TND)"] -= oldCosts.cost;
  x.data[costFiltersIndexOld]["Storable Spare Part Cost (TND)"] -=
    oldCosts.storableSparePartCost;
  x.data[costFiltersIndexOld]["Non Storable Spare Part Cost (TND)"] -=
    oldCosts.nonStorableSparePartCost;
  x.data[costFiltersIndexOld]["Service Cost (TND)"] -= oldCosts.serviceCost;
  x.data[costFiltersIndexOld]["Local Labor Cost (TND)"] -= oldCosts.laborCost;


  x.data[costFiltersIndexNew]["Total Maintenance cost (TND)"] += newCosts.cost;
  x.data[costFiltersIndexNew]["Storable Spare Part Cost (TND)"] +=
    newCosts.storableSparePartCost;
  x.data[costFiltersIndexNew]["Non Storable Spare Part Cost (TND)"] +=
    newCosts.nonStorableSparePartCost;
  x.data[costFiltersIndexNew]["Service Cost (TND)"] += newCosts.serviceCost;
  x.data[costFiltersIndexNew]["Local Labor Cost (TND)"] += newCosts.laborCost;

  


  await x.save();
  res.status(200).json(x);
});




//delete
router.put("/filter/subtract", async (req, res) => {
  const { year, month, costs, parameter } = req.body;
  let x = await CostFilters.findOne({ parameter: parameter });
  let costFiltersIndex = x.data.findIndex(
    (item) =>
      item.year.toString() === year.toString() &&
      item.month.toString() === month.toString()
  );

  
  // Subtract the costs
  x.data[costFiltersIndex]["Total Maintenance cost (TND)"] -= costs.cost;
  x.data[costFiltersIndex]["Storable Spare Part Cost (TND)"] -=costs.storableSparePartCost;
  x.data[costFiltersIndex]["Non Storable Spare Part Cost (TND)"] -=costs.nonStorableSparePartCost;
  x.data[costFiltersIndex]["Service Cost (TND)"] -= costs.serviceCost;
  x.data[costFiltersIndex]["Local Labor Cost (TND)"] -= costs.laborCost;

  // Save the document
  await x.save();

  res.status(200).json(x);
});


module.exports = router;
