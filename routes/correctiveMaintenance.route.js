const express = require('express');
const router = express.Router();
const CorrectiveMain=require("../models/CorrectiveMaintenance")
const { getDifference,parseDate,parseBreakTimeString  } = require("../util/Functions");
const moment = require("moment");
const employee = require('../models/employee');
const { costAddCorrective, costUpdateCorrective, costDeleteCorrective, activityAddCorrective, activityUpdateCorrective, activityDeleteCorrective } = require('../util/analytics');
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


// calcul break time if i dont have date end and change status 

async function updateBreakTimes() {
  try {
    const maintenances = await CorrectiveMain.find({});
    for (const maintenance of maintenances) {
      // Calculate the difference between dateStart and dateEnd in milliseconds

      if (maintenance.dateEnd == "") {
        const dateNow = moment().format("DD/MM/YY HH:mm");
        const breakTime =  getDifference(maintenance.dateCall, dateNow);
        const occupationTime =  getDifference(maintenance.dateStart, dateNow);
        // Update the value of breakTime
        await CorrectiveMain.updateOne(
          { _id: maintenance._id },
          { $set: { breakTime: breakTime,
                    occupationTime : occupationTime } }
        );
      } else {
        if ((maintenance.status = "Not completed")) {
          const dateNow = moment().format("DD/MM/YY HH:mm");
          const verifStatus = getDifference(dateNow, maintenance.dateEnd);
          if (verifStatus.includes("-")) {
            await CorrectiveMain.updateOne(
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




// Get corrective maintenance.
router.get("/", async (req, res) => {
    try {
      const Correctives = await CorrectiveMain.find({}, null, { sort: { _id: -1 } })
        .populate({path: "departmentID",
        model: "Department"})
        .populate({path: "machineID",
        model: "Machine"})
        .populate({path: "employeeID",
        model: "Employee"})
        .exec();
  
      res.status(200).json(Correctives);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
    updateBreakTimes()
  });

// Search corrective maintenance
router.get('/:correMainId',async(req, res)=>{
  try {
      const CM = await CorrectiveMain.findById(req.params.correMainId);
      
      res.status(200).json(CM);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }
});

  // Delete corrective maintenance
router.delete("/:correMainId", async (req, res) => {
  const id = req.params.correMainId;
  const originalDoc = await CorrectiveMain.findById(id);
  await CorrectiveMain.findByIdAndDelete(id);

  res.json({ message: "Preventive maintenance deleted successfully." });

  setImmediate(async () => {    
    //console.log('originalDoc',originalDoc );
     //delete  cost
   costDeleteCorrective(originalDoc);
   activityDeleteCorrective(originalDoc);
 });
});


// Add new corrective maintenance
router.post("/", async (req, res) => {
  const newCorrectiveMain = new CorrectiveMain(req.body);
  
  try {

    const Time =parseBreakTimeString(newCorrectiveMain.occupationTime);
    let laborCost=0;
    const date = parseDate(newCorrectiveMain.dateEnd);
    const month = monthNames[date.getMonth()];
    const monthINT = monthNames.indexOf(month) ;
    const year = date.getFullYear();
    const employees = await employee.find({}, null, { sort: { _id: -1 },});
   
    newCorrectiveMain.employeeID.map((employee) => {

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
   
    newCorrectiveMain.localLaborCost=laborCost;
    newCorrectiveMain.costCorrective=laborCost+newCorrectiveMain.storableSparePartCost+newCorrectiveMain.nonStorableSparePartCost+newCorrectiveMain.serviceCost;
  
    const response = await newCorrectiveMain.save();

    const Correctives = await CorrectiveMain.findById(response._id)
      .populate({ path: "departmentID", model: "Department" })
      .populate({ path: "machineID", model: "Machine" })
      .populate({ path: "employeeID", model: "Employee" })
      .exec();
    res.status(200).json(Correctives);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  setImmediate(async () => {  
    const doc = newCorrectiveMain;
   // console.log('doc',doc );
//update  cost
costAddCorrective(doc);
activityAddCorrective(doc);
});
});



// Update corrective maintenance
router.put("/:correMainId", async (req, res) => {
  const newCorrectiveMain = new CorrectiveMain(req.body);
  const oldDoc = await CorrectiveMain.findById(req.params.correMainId);
  try {
    const Time = parseBreakTimeString(newCorrectiveMain.occupationTime);
    let laborCost=0;
    const date = parseDate(newCorrectiveMain.dateEnd);
    const month = monthNames[date.getMonth()];
    const monthINT = monthNames.indexOf(month) ;
    const year = date.getFullYear();
    const employees = await employee.find({}, null, { sort: { _id: -1 },});
   
    newCorrectiveMain.employeeID.map((employee) => {
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
   
    newCorrectiveMain.localLaborCost=laborCost;
    newCorrectiveMain.costCorrective=laborCost+newCorrectiveMain.storableSparePartCost+newCorrectiveMain.nonStorableSparePartCost+newCorrectiveMain.serviceCost;
  
    // Update the document
    const updatedDoc = await CorrectiveMain.findByIdAndUpdate(
      req.params.correMainId,
      { $set: newCorrectiveMain },
      { new: true }
    );

    const Correctives = await CorrectiveMain.findById(updatedDoc._id)
      .populate({ path: "departmentID", model: "Department" })
      .populate({ path: "machineID", model: "Machine" })
      .populate({ path: "employeeID", model: "Employee" })
      .exec();
      
    res.status(200).json(Correctives);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
  setImmediate(async () => {
    
    const updatedDoc = await CorrectiveMain.findByIdAndUpdate(req.params.correMainId, { $set: newCorrectiveMain }, { new: true });

    //console.log('Old doc:', oldDoc);
    //console.log('Updated doc:', updatedDoc);

//update  cost
costUpdateCorrective(oldDoc,updatedDoc);
activityUpdateCorrective(oldDoc,updatedDoc);

});
});





router.put("/updatelabrocost/:id", async (req, res) => {
  const { doc } = req.body;
  const docId = req.params.id; // get _id from route parameters

  if (doc && doc.laborCost) { // Only proceed if laborCost is present
  
    const correctives = await CorrectiveMain.find({ 'employeeID': docId })
    .populate({ path: "departmentID", model: "Department" })
    .populate({ path: "machineID", model: "Machine" })
    .populate({ path: "employeeID", model: "Employee" })
    .exec();

    let results = [];
    for (let corrective of correctives) {
      const Time = parseBreakTimeString(corrective.occupationTime);
      let laborCost=0;
      const date = parseDate(corrective.dateEnd);
      const month = monthNames[date.getMonth()];
      const monthINT = monthNames.indexOf(month) ;
      const year = date.getFullYear();
      
      corrective.employeeID = corrective.employeeID.map((employee) => {
        
        if (employee._id.toString() == docId) { // convert to ObjectId before comparing
          employee.laborCost = doc.laborCost; // update laborCost
         
          corrective.employeeID.forEach((item)=>{
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
       
      corrective.localLaborCost=laborCost;
      corrective.costCorrective=laborCost+corrective.storableSparePartCost+corrective.nonStorableSparePartCost+corrective.serviceCost;

      
      try {
        // Update the document
        const oldDoc = await CorrectiveMain.findById(corrective._id);
        const updatedDoc = await CorrectiveMain.findByIdAndUpdate(
          corrective._id,
          { $set: corrective },
          { new: true } // returns the updated document
        );
        
        const correctiveMains = await CorrectiveMain.findById(updatedDoc._id)
          .populate({ path: "departmentID", model: "Department" })
          .populate({ path: "machineID", model: "Machine" })
          .populate({ path: "employeeID", model: "Employee" })
          .exec();
    
        results.push(correctiveMains);
        setImmediate(async () => {
          costUpdateCorrective(oldDoc,updatedDoc);
  });
      } catch (error) {
        console.error(error);
      }
    }

    res.status(200).json(results);
  }
});



module.exports = router;