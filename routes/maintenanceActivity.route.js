const express = require('express');
const router = express.Router();
const MaintenanceActivity = require('../models/MaintenanceActivity');
const ActivityFilters = require('../models/ActivityFilters')

//maintenance activity total-------------------------------------------------------------

// Add MaintenanceActivity
router.put('/add', async (req, res) => {
  const { year, month, preventiveDowntime, correctiveDowntime, preventivesNumber, correctivesNumber,preventivesPlannedNumber} = req.body;
  let maintenanceActivity = await MaintenanceActivity.findOne({ year: year, month: month });
  if (!maintenanceActivity) {
    // If it doesn't exist, create it
    maintenanceActivity = new MaintenanceActivity({
      year: year,
      month: month,
      "Preventives Downtime (H)": 0,
      "Corretives Downtime (H)": 0,
      "Preventives Number": 0,
      "Correctives Number": 0,
      "Preventives Planned Number": 0,
      "Preventives Achievement Percentage(%)": 0,
    });
  }

  maintenanceActivity["Preventives Downtime (H)"] += preventiveDowntime;
  maintenanceActivity["Corretives Downtime (H)"] += correctiveDowntime;
  maintenanceActivity["Preventives Number"] += preventivesNumber;
  maintenanceActivity["Correctives Number"] += correctivesNumber;
  maintenanceActivity["Preventives Planned Number"] += preventivesPlannedNumber;
  if(maintenanceActivity["Preventives Planned Number"] !== 0) {
    maintenanceActivity["Preventives Achievement Percentage(%)"] = (maintenanceActivity["Preventives Number"] /maintenanceActivity["Preventives Planned Number"]).toFixed(1)*100;
} else {
    maintenanceActivity["Preventives Achievement Percentage(%)"] = 0;
}
  // Save the document
  await maintenanceActivity.save();

  res.status(200).json(maintenanceActivity);
});



// Update MaintenanceActivity
router.put('/update', async (req, res) => {
  const { newYear, newMonth, oldYear, oldMonth, oldActivity, newActivity} = req.body;
  
  // Find the old document and subtract the old activity
  let oldMaintenanceActivity = await MaintenanceActivity.findOne({ year: oldYear, month: oldMonth });

  if (oldMaintenanceActivity) {
    oldMaintenanceActivity["Preventives Downtime (H)"] -= oldActivity.preventiveDowntime;
    oldMaintenanceActivity["Corretives Downtime (H)"] -= oldActivity.correctiveDowntime;
    oldMaintenanceActivity["Preventives Number"] -= oldActivity.preventivesNumber;
    oldMaintenanceActivity["Correctives Number"] -= oldActivity.correctivesNumber;
    oldMaintenanceActivity["Preventives Planned Number"] -= oldActivity.preventivesPlannedNumber;

    await oldMaintenanceActivity.save();
  }

  // Find or create the new document and add the new activity
  let maintenanceActivity = await MaintenanceActivity.findOne({ year: newYear, month: newMonth });

  if (!maintenanceActivity) {
    maintenanceActivity = new MaintenanceActivity({
      year: newYear,
      month: newMonth,
      "Preventives Downtime (H)": 0,
      "Corretives Downtime (H)": 0,
      "Preventives Number": 0,
      "Correctives Number": 0,
      "Preventives Planned Number": 0,
      "Preventives Achievement Percentage(%)": 0,
    });
  }

  maintenanceActivity["Preventives Downtime (H)"] += newActivity.preventiveDowntime;
  maintenanceActivity["Corretives Downtime (H)"] += newActivity.correctiveDowntime;
  maintenanceActivity["Preventives Number"] += newActivity.preventivesNumber;
  maintenanceActivity["Correctives Number"] += newActivity.correctivesNumber;
  maintenanceActivity["Preventives Planned Number"] += newActivity.preventivesPlannedNumber;

  if(maintenanceActivity["Preventives Planned Number"] !== 0) {
    maintenanceActivity["Preventives Achievement Percentage(%)"] = (maintenanceActivity["Preventives Number"] /maintenanceActivity["Preventives Planned Number"]).toFixed(1)*100;
} else {
    maintenanceActivity["Preventives Achievement Percentage(%)"] = 0;
}

  await maintenanceActivity.save();

  res.status(200).json(maintenanceActivity);
});
 
//maintenance activity filter-------------------------------------------------------------

//add
router.put("/filter/add", async (req, res) => {
  const { parameter,year, month, preventiveDowntime, correctiveDowntime, preventivesNumber, correctivesNumber,preventivesPlannedNumber} = req.body;
  let x = await ActivityFilters.findOne({ parameter: parameter });
  if (!x) {
    x = new ActivityFilters({
      parameter: parameter,
      data: [
        {
          year: year,
          month: month,
          "Preventives Downtime (H)": preventiveDowntime,
          "Corretives Downtime (H)": correctiveDowntime,
          "Preventives Number": preventivesNumber,
          "Correctives Number": correctivesNumber,
          "Preventives Planned Number": preventivesPlannedNumber,
          "Preventives Achievement Percentage(%)": 0,
        },
      ],
    });
  } else {
    let activityFiltersIndex = x.data.findIndex(
      (item) =>
        item.year.toString() === year.toString() &&
        item.month.toString() === month.toString()
    );
    if (activityFiltersIndex === -1) {
      // If it doesn't exist, create it
      let activityFilters = {
        year: year,
        month: month,
        "Preventives Downtime (H)": preventiveDowntime,
        "Corretives Downtime (H)": correctiveDowntime,
        "Preventives Number": preventivesNumber,
        "Correctives Number": correctivesNumber,
        "Preventives Planned Number": preventivesPlannedNumber,
        "Preventives Achievement Percentage(%)": 0,
      };

      x.data.push(activityFilters); // Push the new object to data array
    } else {
      // Update the costs
      x.data[activityFiltersIndex]["Preventives Downtime (H)"] += preventiveDowntime;
      x.data[activityFiltersIndex]["Corretives Downtime (H)"] +=correctiveDowntime;
      x.data[activityFiltersIndex]["Preventives Number"] +=preventivesNumber;
      x.data[activityFiltersIndex]["Correctives Number"] += correctivesNumber;
      x.data[activityFiltersIndex]["Preventives Planned Number"] += preventivesPlannedNumber;
      x.data[activityFiltersIndex]["Preventives Achievement Percentage(%)"] += 0;
      if(x.data[activityFiltersIndex]["Preventives Planned Number"] !== 0) {
        x.data[activityFiltersIndex]["Preventives Achievement Percentage(%)"] = (x.data[activityFiltersIndex]["Preventives Number"] /x.data[activityFiltersIndex]["Preventives Planned Number"]).toFixed(1)*100;
    } else {
      x.data[activityFiltersIndex]["Preventives Achievement Percentage(%)"] = 0;
    }
    }
  }
  /* x.markModified('data'); */
  await x.save();
  res.status(200).json(x);
});


//update 
router.put("/filter/update", async (req, res) => {
  const { parameter, newYear, newMonth, oldYear, oldMonth, oldActivity, newActivity } = req.body;


  let x = await ActivityFilters.findOne({ parameter: parameter });

  if (!x) {
    x = new ActivityFilters({
      parameter: parameter,
      data: [
        {
          year: newYear,
          month: newMonth,
          "Preventives Downtime (H)":
          preventiveDowntime || 0,
          "Corretives Downtime (H)": correctiveDowntime || 0,
          "Preventives Number":
          preventivesNumber || 0,
          "Correctives Number": correctivesNumber || 0,
          "Preventives Planned Number": preventivesPlannedNumber || 0,
          "Preventives Achievement Percentage(%)": 0,
        },
      ],
    });
  }


  let activityFiltersIndexOld = x.data.findIndex(
    (item) =>
      item.year.toString() === oldYear.toString() &&
      item.month.toString() === oldMonth.toString()
  );
  let activityFiltersIndexNew = x.data.findIndex(
    (item) =>
      item.year.toString() === newYear.toString() &&
      item.month.toString() === newMonth.toString()
  );

  if (activityFiltersIndexNew === -1) {
    // If it doesn't exist, create it
    let activityFilters = {
      year: newYear,
      month: newMonth,
      "Preventives Downtime (H)": 0,
          "Corretives Downtime (H)": 0,
          "Preventives Number": 0,
          "Correctives Number": 0,
          "Preventives Planned Number": 0,
          "Preventives Achievement Percentage(%)": 0,
    };
    x.data.push(activityFilters);
    // Update activityFiltersIndexNew to point to the newly added item
    activityFiltersIndexNew = x.data.length - 1;
  }

  x.data[activityFiltersIndexOld]["Preventives Downtime (H)"] -= oldActivity.preventiveDowntime;
  x.data[activityFiltersIndexOld]["Corretives Downtime (H)"] -=oldActivity.correctiveDowntime;
  x.data[activityFiltersIndexOld]["Preventives Number"] -=oldActivity.preventivesNumber;
  x.data[activityFiltersIndexOld]["Correctives Number"] -= oldActivity.correctivesNumber;
  x.data[activityFiltersIndexOld]["Preventives Planned Number"] -= oldActivity.preventivesPlannedNumber;


  x.data[activityFiltersIndexNew]["Preventives Downtime (H)"] += newActivity.preventiveDowntime;
  x.data[activityFiltersIndexNew]["Corretives Downtime (H)"] +=newActivity.correctiveDowntime
  x.data[activityFiltersIndexNew]["Preventives Number"] +=newActivity.preventivesNumber;
  x.data[activityFiltersIndexNew]["Correctives Number"] += newActivity.correctivesNumber;
  x.data[activityFiltersIndexNew]["Preventives Planned Number"] += newActivity.preventivesPlannedNumber;

  if(x.data[activityFiltersIndexNew]["Preventives Planned Number"] !== 0) {
    x.data[activityFiltersIndexNew]["Preventives Achievement Percentage(%)"] = (x.data[activityFiltersIndexNew]["Preventives Number"] /x.data[activityFiltersIndexNew]["Preventives Planned Number"]).toFixed(1)*100;
} else {
  x.data[activityFiltersIndexNew]["Preventives Achievement Percentage(%)"] = 0;
}


  await x.save();
  res.status(200).json(x);
});


//delete
router.put("/filter/subtract", async (req, res) => {
  const { year, month, activity, parameter } = req.body;
  let x = await ActivityFilters.findOne({ parameter: parameter });
  let activityFiltersIndex = x.data.findIndex(
    (item) =>
      item.year.toString() === year.toString() &&
      item.month.toString() === month.toString()
  );

  
  // Subtract the activity
      x.data[activityFiltersIndex]["Preventives Downtime (H)"] -= activity.preventiveDowntime;
      x.data[activityFiltersIndex]["Corretives Downtime (H)"] -=activity.correctiveDowntime;
      x.data[activityFiltersIndex]["Preventives Number"] -=activity.preventivesNumber;
      x.data[activityFiltersIndex]["Correctives Number"] -= activity.correctivesNumber;
      x.data[activityFiltersIndex]["Preventives Planned Number"] -= activity.preventivesPlannedNumber;

      if(x.data[activityFiltersIndex]["Preventives Planned Number"] !== 0) {
        x.data[activityFiltersIndex]["Preventives Achievement Percentage(%)"] = (x.data[activityFiltersIndex]["Preventives Number"] /x.data[activityFiltersIndex]["Preventives Planned Number"]).toFixed(1)*100;
    } else {
      x.data[activityFiltersIndex]["Preventives Achievement Percentage(%)"] = 0;
    }

  // Save the document
  await x.save();

  res.status(200).json(x);
});





  

module.exports = router;
