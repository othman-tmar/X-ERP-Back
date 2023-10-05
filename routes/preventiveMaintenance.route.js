const express = require("express");
const router = express.Router();
const PreventiveMain = require("../models/PreventiveMaintenance");
const { getDifference, parseDate,parseBreakTimeString } = require("../util/Functions");
const moment = require("moment");
const employee = require("../models/employee");
const { costUpdate, costAdd, costDelete,activityAdd,activityUpdate,activityDelete  } = require("../util/analytics");
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


// calcul break time if i dont have date end and change status
async function updateBreakTimes() {
  try {
    const maintenances = await PreventiveMain.find({});
    for (const maintenance of maintenances) {
      // Calculate the difference between dateStart and dateEnd in milliseconds

      if (maintenance.dateEnd == "") {
        const dateNow = moment().format("DD/MM/YY HH:mm");
        const breakTime = getDifference(maintenance.dateStart, dateNow);

        // Update the value of breakTime
        await PreventiveMain.updateOne(
          { _id: maintenance._id },
          { $set: { breakTime: breakTime } }
        );
      } else {
        if ((maintenance.status = "Not completed")) {
          const dateNow = moment().format("DD/MM/YY HH:mm");
          const verifStatus = getDifference(dateNow, maintenance.dateEnd);
          if (verifStatus.includes("-")) {
            await PreventiveMain.updateOne(
              { _id: maintenance._id },
              { $set: { status: "Completed" } }
            );
          }
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}


// Get preventive maintenance.
router.get("/", async (req, res) => {
  try {
    const Preventives = await PreventiveMain.find({}, null, {
      sort: { _id: -1 },
    })
      .populate({ path: "departmentID", model: "Department" })
      .populate({ path: "machineID", model: "Machine" })
      .populate({ path: "employeeID", model: "Employee" })
      .exec();

    res.status(200).json(Preventives);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  updateBreakTimes();
});


// Get filtred preventives maintenance by dateEnd && Completed status.
router.get("/filteredPreventiveByDate", async (req, res) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const Preventives = await PreventiveMain.find({}, null, {
      sort: { _id: -1 },
    })
      .populate({ path: "departmentID", model: "Department" })
      .populate({ path: "machineID", model: "Machine" })
      .populate({ path: "employeeID", model: "Employee" })
      .exec();

    const filteredPreventives = Preventives.filter((preventive) => {
      if (preventive.dateEnd && preventive.status === "Completed") {
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


// Add new preventive maintenance
router.post("/", async (req, res) => {
  const newPreventiveMain = new PreventiveMain(req.body);
  try {

    const Time =parseBreakTimeString(newPreventiveMain.breakTime);
    let laborCost=0;
    const date = parseDate(newPreventiveMain.dateEnd);
    const month = monthNames[date.getMonth()];
    const monthINT = monthNames.indexOf(month) ;
    const year = date.getFullYear();
    const employees = await employee.find({}, null, { sort: { _id: -1 },});

   
    newPreventiveMain.employeeID.map((employee) => {
      
     employees.forEach((emp)=>{

      if (employee._id.toString() == emp._id.toString()) { // convert to ObjectId before comparing

    
          emp.laborCost.forEach((cost)=>{
            const [costYear, costMonth] = cost.month?.split('-').map(Number);
            if(costMonth==monthINT+1 && costYear==year){ 
            laborCost+=parseFloat(((cost.salary/cost.workSchedule)*Time).toFixed(1));
         } 
        });
          
      }
      
      return employee;
    
    })
    });
   
    newPreventiveMain.localLaborCost=laborCost;
    newPreventiveMain.costPreventive=laborCost+newPreventiveMain.storableSparePartCost+newPreventiveMain.nonStorableSparePartCost+newPreventiveMain.serviceCost;


    const response = await newPreventiveMain.save();

   
    const Preventives = await PreventiveMain.findById(response._id)
      .populate({ path: "departmentID", model: "Department" })
      .populate({ path: "machineID", model: "Machine" })
      .populate({ path: "employeeID", model: "Employee" })
      .exec();
    res.status(200).json(Preventives);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }


  setImmediate(async () => {  
    const doc = newPreventiveMain;
  costAdd(doc);
  activityAdd(doc);
});

});


// Search preventive maintenance
router.get("/:prevMainId", async (req, res) => {
  try {
    const PM = await PreventiveMain.findById(req.params.prevMainId);

    res.status(200).json(PM);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Update preventive maintenance
router.put("/:prevMainId", async (req, res) => {
  const newPreventiveMain = new PreventiveMain(req.body);
  const oldDoc = await PreventiveMain.findById(req.params.prevMainId);
  
  try {
    const Time = parseBreakTimeString(newPreventiveMain.breakTime);
    let laborCost=0;
    const date = parseDate(newPreventiveMain.dateEnd);
    const month = monthNames[date.getMonth()];
    const monthINT = monthNames.indexOf(month) ;
    const year = date.getFullYear();
    const employees = await employee.find({}, null, { sort: { _id: -1 },});
   
    newPreventiveMain.employeeID.map((employee) => {
      employees.forEach((emp)=>{
        if (employee._id.toString() == emp._id.toString()) { 
          emp.laborCost.forEach((cost)=>{
            const [costYear, costMonth] = cost.month?.split('-').map(Number);
            if(costMonth==monthINT+1 && costYear==year){ 
              laborCost+=parseFloat(((cost.salary/cost.workSchedule)*Time).toFixed(1));
            } 
          });
        }
        return employee;
      })
    });
   
    newPreventiveMain.localLaborCost=laborCost;
    newPreventiveMain.costPreventive=laborCost+newPreventiveMain.storableSparePartCost+newPreventiveMain.nonStorableSparePartCost+newPreventiveMain.serviceCost;
  
    // Update the document
    const updatedDoc = await PreventiveMain.findByIdAndUpdate(
      req.params.prevMainId,
      { $set: newPreventiveMain },
      { new: true }
    );

    const Preventives = await PreventiveMain.findById(updatedDoc._id)
      .populate({ path: "departmentID", model: "Department" })
      .populate({ path: "machineID", model: "Machine" })
      .populate({ path: "employeeID", model: "Employee" })
      .exec();
      
    res.status(200).json(Preventives);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }

  setImmediate(async () => {
    
    const updatedDoc = await PreventiveMain.findByIdAndUpdate(req.params.prevMainId, { $set: newPreventiveMain }, { new: true });

    //console.log('Old doc:', oldDoc);
    //console.log('Updated doc:', updatedDoc);

//update  cost
costUpdate(oldDoc,updatedDoc);
activityUpdate(oldDoc,updatedDoc)

});

});

// Delete preventive maintenance
router.delete("/:prevMainId", async (req, res) => {
  const id = req.params.prevMainId;
  const originalDoc = await PreventiveMain.findById(id);
  // Delete the document
  await PreventiveMain.findByIdAndDelete(id);

  res.json({ message: "Preventive maintenance deleted successfully." });

;
  setImmediate(async () => {    
   //console.log('originalDoc',originalDoc );
    
  costDelete(originalDoc)
  activityDelete(originalDoc)
});

});


// update preventive maintenance by employee when update salary
router.put("/updatelabrocost/:id", async (req, res) => {
  const { doc } = req.body;
  const docId = req.params.id; // get _id from route parameters

  if (doc && doc.laborCost) { // Only proceed if laborCost is present
  
    const preventives = await PreventiveMain.find({ 'employeeID': docId })
    .populate({ path: "departmentID", model: "Department" })
    .populate({ path: "machineID", model: "Machine" })
    .populate({ path: "employeeID", model: "Employee" })
    .exec();

    let results = [];
    for (let preventive of preventives) {
      const Time = parseBreakTimeString(preventive.breakTime);
      let laborCost=0;
      const date = parseDate(preventive.dateEnd);
      const month = monthNames[date.getMonth()];
      const monthINT = monthNames.indexOf(month) ;
      const year = date.getFullYear();
      
      preventive.employeeID = preventive.employeeID.map((employee) => {
        
        if (employee._id.toString() == docId) { // convert to ObjectId before comparing
          employee.laborCost = doc.laborCost; // update laborCost
          preventive.employeeID.forEach((item)=>{
            item.laborCost.forEach((cost)=>{
              
              const [costYear, costMonth] = cost.month?.split('-').map(Number);
              if(costMonth==monthINT+1 && costYear==year){ 
              laborCost+=parseFloat(((cost.salary/cost.workSchedule)*Time).toFixed(1));
           } 
          });
            
           
          })
        }
       
        return employee;
      });
        
 preventive.localLaborCost=laborCost;
 preventive.costPreventive=laborCost+preventive.storableSparePartCost+preventive.nonStorableSparePartCost+preventive.serviceCost;
 
      try {
        const oldDoc = await PreventiveMain.findById(preventive._id);
        // Update the document
        const updatedDoc = await PreventiveMain.findByIdAndUpdate(
          preventive._id,
          { $set: preventive },
          { new: true } // returns the updated document
        );
        
        const preventiveMains = await PreventiveMain.findById(updatedDoc._id)
          .populate({ path: "departmentID", model: "Department" })
          .populate({ path: "machineID", model: "Machine" })
          .populate({ path: "employeeID", model: "Employee" })
          .exec();
    
        results.push(preventiveMains);

        setImmediate(async () => {
          /* const updatedDoc = await PreventiveMain.findByIdAndUpdate(preventive._id, { $set: updatedDoc }, { new: true }); */
          costUpdate(oldDoc,updatedDoc);
  });

      } catch (error) {
        console.error(error);
      }

   

    }

    res.status(200).json(results);
  }
});




module.exports = router;
