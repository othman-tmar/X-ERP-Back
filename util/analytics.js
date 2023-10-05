const  axios  =require('../axiosConfig');
const { parseDate, parseBreakTimeString } = require("./Functions");
const MaintenanceActivity = require("../models/MaintenanceActivity");



const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const costUpdate=async(oldDoc,updatedDoc)=>{
    try {
        const newDate = parseDate(updatedDoc.dateEnd);
        const newMonth = monthNames[newDate.getMonth()];
        const newYear = newDate.getFullYear();
        const oldDate = parseDate(oldDoc.dateEnd);
        const oldMonth = monthNames[oldDate.getMonth()];
        const oldYear = oldDate.getFullYear();


        await axios.put('/api/maintenance-cost/update', {
          newYear: newYear,
          newMonth: newMonth,
          oldYear: oldYear,
          oldMonth: oldMonth,
          oldCosts: {
            cost: oldDoc.costPreventive,
            storableSparePartCost: oldDoc.storableSparePartCost,
            nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
            serviceCost: oldDoc.serviceCost,
          },
          newCosts: {
            cost: updatedDoc.costPreventive,
            storableSparePartCost: updatedDoc.storableSparePartCost,
            nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
            serviceCost: updatedDoc.serviceCost,
          }
        });


        await axios.put('/api/maintenance-cost/filter/update', {
            parameter: oldDoc.departmentID,
            newYear: newYear,
            newMonth: newMonth,
            oldYear: oldYear,
            oldMonth: oldMonth,
             oldCosts: {
               cost: oldDoc.costPreventive,
               storableSparePartCost: oldDoc.storableSparePartCost,
               nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
               serviceCost: oldDoc.serviceCost,
               laborCost:oldDoc.localLaborCost
             },
             newCosts: {
               cost: updatedDoc.costPreventive,
               storableSparePartCost: updatedDoc.storableSparePartCost,
               nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
               serviceCost: updatedDoc.serviceCost,
               laborCost:updatedDoc.localLaborCost
             },      
            });
          
            await axios.put('/api/maintenance-cost/filter/update', {
            parameter: "preventive",
            newYear: newYear,
            newMonth: newMonth,
            oldYear: oldYear,
            oldMonth: oldMonth,
             oldCosts: {
               cost: oldDoc.costPreventive,
               storableSparePartCost: oldDoc.storableSparePartCost,
               nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
               serviceCost: oldDoc.serviceCost,
               laborCost:oldDoc.localLaborCost
               
             },
             newCosts: {
               cost: updatedDoc.costPreventive,
               storableSparePartCost: updatedDoc.storableSparePartCost,
               nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
               serviceCost: updatedDoc.serviceCost,
               laborCost:updatedDoc.localLaborCost
             },  
            });
          
            await axios.put('/api/maintenance-cost/filter/update', {
            parameter: oldDoc.machineID,
            newYear: newYear,
            newMonth: newMonth,
            oldYear: oldYear,
            oldMonth: oldMonth,
             oldCosts: {
               cost: oldDoc.costPreventive,
               storableSparePartCost: oldDoc.storableSparePartCost,
               nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
               serviceCost: oldDoc.serviceCost,
               laborCost:oldDoc.localLaborCost
             },
             newCosts: {
               cost: updatedDoc.costPreventive,
               storableSparePartCost: updatedDoc.storableSparePartCost,
               nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
               serviceCost: updatedDoc.serviceCost,
               laborCost:updatedDoc.localLaborCost
             },
             
            
            });
      
      
      } catch (error) {
        console.error(error);
        
      }
      
}


const costAdd=async(doc)=>{


    try {
        // doc is the document that was saved
        const date = parseDate(doc.dateEnd);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
      
    
        await axios.put('/api/maintenance-cost/add', {
          year: year,
          month: month,
          cost: doc.costPreventive,
          storableSparePartCost: doc.storableSparePartCost,
          nonStorableSparePartCost: doc.nonStorableSparePartCost,
          serviceCost: doc.serviceCost,
         
        });
      
     
        await axios.put('/api/maintenance-cost/filter/add', {
          parameter:doc.departmentID._id.toString(), 
          year: year,
            month: month,
            cost: doc.costPreventive,
            storableSparePartCost: doc.storableSparePartCost,
            nonStorableSparePartCost: doc.nonStorableSparePartCost,
            serviceCost: doc.serviceCost,
            laborCost:doc.localLaborCost,
           
          });
    
          await axios.put('/api/maintenance-cost/filter/add', {
          parameter:doc.machineID._id.toString(), 
          year: year,
            month: month,
            cost: doc.costPreventive,
            storableSparePartCost: doc.storableSparePartCost,
            nonStorableSparePartCost: doc.nonStorableSparePartCost,
            serviceCost: doc.serviceCost,
            laborCost:doc.localLaborCost,
            
          });
    
          await axios.put('/api/maintenance-cost/filter/add', {
          parameter:"preventive", 
          year: year,
            month: month,
            cost: doc.costPreventive,
            storableSparePartCost: doc.storableSparePartCost,
            nonStorableSparePartCost: doc.nonStorableSparePartCost,
            serviceCost: doc.serviceCost,
            laborCost:doc.localLaborCost,
         
          });

        } catch (error) {
            console.error(error);
          
        }
       
}

const costDelete=async(originalDoc)=>{
    try {
        // 'this' is the query
    
        const date = parseDate(originalDoc.dateEnd);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        await axios.put('/api/maintenance-cost/subtract', {
            year: year,
            month: month,
            costs: {
              cost: originalDoc.costPreventive,
              storableSparePartCost: originalDoc.storableSparePartCost,
              nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
              serviceCost: originalDoc.serviceCost,
              localLaborCost:originalDoc.localLaborCost,
            }
          });
      
        await axios.put('/api/maintenance-cost/filter/subtract', {
          parameter:originalDoc.machineID._id.toString(), 
          year: year,
            month: month,
            costs: {
              cost: originalDoc.costPreventive,
              storableSparePartCost: originalDoc.storableSparePartCost,
              nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
              serviceCost: originalDoc.serviceCost,
              laborCost:originalDoc.localLaborCost
            }
          });
          await axios.put('/api/maintenance-cost/filter/subtract', {
            parameter:originalDoc.departmentID._id.toString(), 
            year: year,
              month: month,
              costs: {
                cost: originalDoc.costPreventive,
                storableSparePartCost: originalDoc.storableSparePartCost,
                nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
                serviceCost: originalDoc.serviceCost,
                laborCost:originalDoc.localLaborCost
              }
            });
            await axios.put('/api/maintenance-cost/filter/subtract', {
          parameter:"preventive", 
          year: year,
            month: month,
            costs: {
              cost: originalDoc.costPreventive,
              storableSparePartCost: originalDoc.storableSparePartCost,
              nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
              serviceCost: originalDoc.serviceCost,
              laborCost:originalDoc.localLaborCost
            }
          });

      } catch (error) {
        console.error(error);
       
    }
}

const activityAdd=async(doc)=>{
    try {
        const date = parseDate(doc.dateEnd);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const preventiveBreakTime = parseBreakTimeString(doc.breakTime);
          await axios.put('/api/maintenance-activity/add', {
            year: year,
            month: month,
            preventiveDowntime: preventiveBreakTime,
            correctiveDowntime: 0,
            preventivesNumber: 1,
            correctivesNumber: 0,
            preventivesPlannedNumber:0
           
          });

          await axios.put("/api/maintenance-activity/filter/add", {
            parameter: doc.departmentID._id.toString(),
            year: year,
            month: month,
            preventiveDowntime: preventiveBreakTime,
            correctiveDowntime: 0,
            preventivesNumber: 1,
            correctivesNumber: 0,
            preventivesPlannedNumber: 0,
          });
          await axios.put("/api/maintenance-activity/filter/add", {
            parameter: doc.machineID._id.toString(),
            year: year,
            month: month,
            preventiveDowntime: preventiveBreakTime,
            correctiveDowntime: 0,
            preventivesNumber: 1,
            correctivesNumber: 0,
            preventivesPlannedNumber: 0,
          });
        } catch (error) {
          console.error(error);
          
      }

}
const activityUpdate=async(oldDoc,updatedDoc)=>{
    try {
        const newDate = parseDate(updatedDoc.dateEnd);
        const newMonth = monthNames[newDate.getMonth()];
        const newYear = newDate.getFullYear();
        const oldDate = parseDate(oldDoc.dateEnd);
        const oldMonth = monthNames[oldDate.getMonth()];
        const oldYear = oldDate.getFullYear();
        const preventiveOldBreakTime = parseBreakTimeString(oldDoc.breakTime);
        const preventiveNewBreakTime = parseBreakTimeString(updatedDoc.breakTime);
        let MaintenanceActivityOld = await MaintenanceActivity.findOne({year:oldYear,month:oldMonth });
         await axios.put('/api/maintenance-activity/update', {
          newYear: newYear,
          newMonth: newMonth,
          oldYear: oldYear,
          oldMonth: oldMonth,
            oldActivity: {
              preventiveDowntime: preventiveOldBreakTime,
              correctiveDowntime: MaintenanceActivityOld["Corretives Downtime (H)"],
              preventivesNumber:  MaintenanceActivityOld["Preventives Number"],
              correctivesNumber:  MaintenanceActivityOld["Correctives Number"],
              preventivesPlannedNumber:MaintenanceActivityOld["Preventives Planned Number"]
            },
            newActivity: {
              preventiveDowntime: preventiveNewBreakTime,
              correctiveDowntime: MaintenanceActivityOld["Corretives Downtime (H)"],
              preventivesNumber:  MaintenanceActivityOld["Preventives Number"],
              correctivesNumber:  MaintenanceActivityOld["Correctives Number"],
              preventivesPlannedNumber:MaintenanceActivityOld["Preventives Planned Number"]
            }
          }); 

          await axios.put('/api/maintenance-activity/filter/update', {
            parameter: oldDoc.departmentID,
            newYear: newYear,
            newMonth: newMonth,
            oldYear: oldYear,
            oldMonth: oldMonth,
             oldActivity: {
              preventiveDowntime: preventiveOldBreakTime,
              correctiveDowntime: 0,
              preventivesNumber: 1,
              correctivesNumber: 0,
              preventivesPlannedNumber: 0,
             },
             newActivity: {
              preventiveDowntime: preventiveNewBreakTime,
              correctiveDowntime: 0,
              preventivesNumber: 1,
              correctivesNumber: 0,
              preventivesPlannedNumber: 0,
             },
             
            
            });
         
            await axios.put('/api/maintenance-activity/filter/update', {
            parameter: oldDoc.machineID,
            newYear: newYear,
            newMonth: newMonth,
            oldYear: oldYear,
            oldMonth: oldMonth,
             oldActivity: {
              preventiveDowntime: preventiveOldBreakTime,
              correctiveDowntime: 0,
              preventivesNumber: 1,
              correctivesNumber: 0,
              preventivesPlannedNumber: 0,
             },
             newActivity: {
              preventiveDowntime: preventiveNewBreakTime,
              correctiveDowntime: 0,
              preventivesNumber: 1,
              correctivesNumber: 0,
              preventivesPlannedNumber: 0,
             },
             
             
            });
         
        
      } catch (error) {
        console.error(error);
        
      }
}

const activityDelete=async(originalDoc)=>{
    try {
        
        const date = parseDate(originalDoc.dateEnd);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const preventiveBreakTime = parseBreakTimeString(originalDoc.breakTime);
        
        await axios.put('/api/maintenance-activity/add', {
            year: year,
            month: month,
            preventiveDowntime: -preventiveBreakTime,
            correctiveDowntime: 0,
            preventivesNumber: -1,
            correctivesNumber: 0,
            preventivesPlannedNumber:0
           
          });
  
          await axios.put(
            "/api/maintenance-activity/filter/subtract",
            {
              parameter: doc.machineID._id.toString(),
              year: year,
              month: month,
              activity: {
                preventiveDowntime: preventiveBreakTime,
                correctiveDowntime: 0,
                preventivesNumber: 1,
                correctivesNumber: 0,
                preventivesPlannedNumber: 0,
              },
            }
          );
        
          await axios.put(
            "/api/maintenance-activity/filter/subtract",
            {
              parameter: originalDoc.departmentID._id.toString(),
              year: year,
              month: month,
              activity: {
                preventiveDowntime: preventiveBreakTime,
                correctiveDowntime: 0,
                preventivesNumber: 1,
                correctivesNumber: 0,
                preventivesPlannedNumber: 0,
              },
            }
          );
      } catch (error) {
        console.error(error);
      
      }
}



const costAddCorrective = async (doc) => {
  try {
    // doc is the document that was saved
    const date = parseDate(doc.dateEnd);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    //total cost
    await axios.put("/api/maintenance-cost/add", {
      year: year,
      month: month,
      cost: doc.costCorrective,
      storableSparePartCost: doc.storableSparePartCost,
      nonStorableSparePartCost: doc.nonStorableSparePartCost,
      serviceCost: doc.serviceCost,
    });
    // cost filtres
    await axios.put("/api/maintenance-cost/filter/add", {
      parameter: doc.departmentID._id.toString(),
      year: year,
      month: month,
      cost: doc.costCorrective,
      storableSparePartCost: doc.storableSparePartCost,
      nonStorableSparePartCost: doc.nonStorableSparePartCost,
      serviceCost: doc.serviceCost,
      laborCost: doc.localLaborCost,
    });
    await axios.put("/api/maintenance-cost/filter/add", {
      parameter: doc.machineID._id.toString(),
      year: year,
      month: month,
      cost: doc.costCorrective,
      storableSparePartCost: doc.storableSparePartCost,
      nonStorableSparePartCost: doc.nonStorableSparePartCost,
      serviceCost: doc.serviceCost,
      laborCost: doc.localLaborCost,
    });
    await axios.put("/api/maintenance-cost/filter/add", {
      parameter: "corrective",
      year: year,
      month: month,
      cost: doc.costCorrective,
      storableSparePartCost: doc.storableSparePartCost,
      nonStorableSparePartCost: doc.nonStorableSparePartCost,
      serviceCost: doc.serviceCost,
      laborCost: doc.localLaborCost,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
const costUpdateCorrective = async (oldDoc, updatedDoc) => {
  try {
    const newDate = parseDate(updatedDoc.dateEnd);
    const newMonth = monthNames[newDate.getMonth()];
    const newYear = newDate.getFullYear();
    const oldDate = parseDate(oldDoc.dateEnd);
    const oldMonth = monthNames[oldDate.getMonth()];
    const oldYear = oldDate.getFullYear();
    //total cost
    await axios.put("/api/maintenance-cost/update", {
      newYear: newYear,
      newMonth: newMonth,
      oldYear: oldYear,
      oldMonth: oldMonth,
      oldCosts: {
        cost: oldDoc.costCorrective,
        storableSparePartCost: oldDoc.storableSparePartCost,
        nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
        serviceCost: oldDoc.serviceCost,
      },
      newCosts: {
        cost: updatedDoc.costCorrective,
        storableSparePartCost: updatedDoc.storableSparePartCost,
        nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
        serviceCost: updatedDoc.serviceCost,
      },
    });
    //cost filters
    await axios.put("/api/maintenance-cost/filter/update", {
      parameter: oldDoc.departmentID,
      newYear: newYear,
      newMonth: newMonth,
      oldYear: oldYear,
      oldMonth: oldMonth,
      oldCosts: {
        cost: oldDoc.costCorrective,
        storableSparePartCost: oldDoc.storableSparePartCost,
        nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
        serviceCost: oldDoc.serviceCost,
        laborCost: oldDoc.localLaborCost,
      },
      newCosts: {
        cost: updatedDoc.costCorrective,
        storableSparePartCost: updatedDoc.storableSparePartCost,
        nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
        serviceCost: updatedDoc.serviceCost,
        laborCost: updatedDoc.localLaborCost,
      },
    });
    await axios.put("/api/maintenance-cost/filter/update", {
      parameter: "corrective",
      newYear: newYear,
      newMonth: newMonth,
      oldYear: oldYear,
      oldMonth: oldMonth,
      oldCosts: {
        cost: oldDoc.costCorrective,
        storableSparePartCost: oldDoc.storableSparePartCost,
        nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
        serviceCost: oldDoc.serviceCost,
        laborCost: oldDoc.localLaborCost,
      },
      newCosts: {
        cost: updatedDoc.costCorrective,
        storableSparePartCost: updatedDoc.storableSparePartCost,
        nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
        serviceCost: updatedDoc.serviceCost,
        laborCost: updatedDoc.localLaborCost,
      },
    });
    await axios.put("/api/maintenance-cost/filter/update", {
      parameter: oldDoc.machineID,
      newYear: newYear,
      newMonth: newMonth,
      oldYear: oldYear,
      oldMonth: oldMonth,
      oldCosts: {
        cost: oldDoc.costCorrective,
        storableSparePartCost: oldDoc.storableSparePartCost,
        nonStorableSparePartCost: oldDoc.nonStorableSparePartCost,
        serviceCost: oldDoc.serviceCost,
        laborCost: oldDoc.localLaborCost,
      },
      newCosts: {
        cost: updatedDoc.costCorrective,
        storableSparePartCost: updatedDoc.storableSparePartCost,
        nonStorableSparePartCost: updatedDoc.nonStorableSparePartCost,
        serviceCost: updatedDoc.serviceCost,
        laborCost: updatedDoc.localLaborCost,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
const costDeleteCorrective = async (originalDoc) => {
  try {
    // 'this' is the query
    const date = parseDate(originalDoc.dateEnd);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    // total cost
    await axios.put("/api/maintenance-cost/subtract", {
      year: year,
      month: month,
      costs: {
        cost: originalDoc.costCorrective,
        storableSparePartCost: originalDoc.storableSparePartCost,
        nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
        serviceCost: originalDoc.serviceCost,
        localLaborCost: originalDoc.localLaborCost,
      },
    });
    // cost filters
    await axios.put("/api/maintenance-cost/filter/subtract", {
      parameter: originalDoc.machineID._id.toString(),
      year: year,
      month: month,
      costs: {
        cost: originalDoc.costCorrective,
        storableSparePartCost: originalDoc.storableSparePartCost,
        nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
        serviceCost: originalDoc.serviceCost,
        laborCost: originalDoc.localLaborCost,
      },
    });

    await axios.put("/api/maintenance-cost/filter/subtract", {
      parameter: originalDoc.departmentID._id.toString(),
      year: year,
      month: month,
      costs: {
        cost: originalDoc.costCorrective,
        storableSparePartCost: originalDoc.storableSparePartCost,
        nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
        serviceCost: originalDoc.serviceCost,
        laborCost: originalDoc.localLaborCost,
      },
    });

    await axios.put("/api/maintenance-cost/filter/subtract", {
      parameter: "corrective",
      year: year,
      month: month,
      costs: {
        cost: originalDoc.costCorrective,
        storableSparePartCost: originalDoc.storableSparePartCost,
        nonStorableSparePartCost: originalDoc.nonStorableSparePartCost,
        serviceCost: originalDoc.serviceCost,
        laborCost: originalDoc.localLaborCost,
      },
    });

  } catch (error) {
    console.error(error);
  }
};

const activityAddCorrective = async (doc) => {

  try {
    const date = parseDate(doc.dateEnd);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const correctiveBreakTime = parseBreakTimeString(doc.breakTime);
    //  activity total
    await axios.put("/api/maintenance-activity/add", {
      year: year,
      month: month,
      preventiveDowntime: 0,
      correctiveDowntime: correctiveBreakTime,
      preventivesNumber: 0,
      correctivesNumber: 1,
      preventivesPlannedNumber: 0,
    });
    //  activity filters
    await axios.put("/api/maintenance-activity/filter/add", {
      parameter: doc.departmentID._id.toString(),
      year: year,
      month: month,
      preventiveDowntime: 0,
      correctiveDowntime: correctiveBreakTime,
      preventivesNumber: 0,
      correctivesNumber: 1,
      preventivesPlannedNumber: 0,
    });
    await axios.put("/api/maintenance-activity/filter/add", {
      parameter: doc.machineID._id.toString(),
      year: year,
      month: month,
      preventiveDowntime: 0,
      correctiveDowntime: correctiveBreakTime,
      preventivesNumber: 0,
      correctivesNumber: 1,
      preventivesPlannedNumber: 0,
    });
  } catch (error) {
    console.error(error);
  }
}
const activityUpdateCorrective = async (oldDoc, updatedDoc) =>{
  try {
    const newDate = parseDate(updatedDoc.dateEnd);
    const newMonth = monthNames[newDate.getMonth()];
    const newYear = newDate.getFullYear();
    const oldDate = parseDate(oldDoc.dateEnd);
    const oldMonth = monthNames[oldDate.getMonth()];
    const oldYear = oldDate.getFullYear();
    const correctiveOldBreakTime = parseBreakTimeString(oldDoc.breakTime);
    const correctiveNewBreakTime = parseBreakTimeString(updatedDoc.breakTime);
    let MaintenanceActivityOld = await MaintenanceActivity.findOne({ year:oldYear,month:oldMonth});
    //activity total
    await axios.put("/api/maintenance-activity/update", {
      newYear: newYear,
      newMonth: newMonth,
      oldYear: oldYear,
      oldMonth: oldMonth,
      oldActivity: {
        preventiveDowntime: MaintenanceActivityOld["Preventives Downtime (H)"],
        correctiveDowntime: correctiveOldBreakTime,
        preventivesNumber: MaintenanceActivityOld["Preventives Number"],
        correctivesNumber: MaintenanceActivityOld["Correctives Number"],
        preventivesPlannedNumber:
          MaintenanceActivityOld["Preventives Planned Number"],
      },
      newActivity: {
        preventiveDowntime: MaintenanceActivityOld["Preventives Downtime (H)"],
        correctiveDowntime: correctiveNewBreakTime,
        preventivesNumber: MaintenanceActivityOld["Preventives Number"],
        correctivesNumber: MaintenanceActivityOld["Correctives Number"],
        preventivesPlannedNumber:
          MaintenanceActivityOld["Preventives Planned Number"],
      },
    });
      //activity filters
      await axios.put('/api/maintenance-activity/filter/update', {
        parameter: oldDoc.departmentID,
        newYear: newYear,
        newMonth: newMonth,
        oldYear: oldYear,
        oldMonth: oldMonth,
         oldActivity: {
          preventiveDowntime: 0,
          correctiveDowntime: correctiveOldBreakTime,
          preventivesNumber: 0,
          correctivesNumber: 1,
          preventivesPlannedNumber: 0,
         },
         newActivity: {
          preventiveDowntime: 0,
          correctiveDowntime: correctiveNewBreakTime,
          preventivesNumber: 0,
          correctivesNumber: 1,
          preventivesPlannedNumber: 0,
         },
         
        
        });
     
        await axios.put('/api/maintenance-activity/filter/update', {
        parameter: oldDoc.machineID,
        newYear: newYear,
        newMonth: newMonth,
        oldYear: oldYear,
        oldMonth: oldMonth,
         oldActivity: {
          preventiveDowntime: 0,
          correctiveDowntime: correctiveOldBreakTime,
          preventivesNumber: 0,
          correctivesNumber: 1,
          preventivesPlannedNumber: 0,
         },
         newActivity: {
          preventiveDowntime: 0,
          correctiveDowntime: correctiveNewBreakTime,
          preventivesNumber: 0,
          correctivesNumber: 1,
          preventivesPlannedNumber: 0,
         },
         
         
        });
  } catch (error) {
    console.error(error);
  }
}
const activityDeleteCorrective = async (originalDoc) =>{
  try {
    const date = parseDate(originalDoc.dateEnd);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const correctiveBreakTime = parseBreakTimeString(originalDoc.breakTime);
    // activity totale 
    await axios.put("/api/maintenance-activity/add", {
      year: year,
      month: month,
      preventiveDowntime: 0,
      correctiveDowntime: -correctiveBreakTime,
      preventivesNumber: 0,
      correctivesNumber: -1,
      preventivesPlannedNumber: 0,
    });
    // activity totale 
    await axios.put(
      "/api/maintenance-activity/filter/subtract",
      {
        parameter: originalDoc.machineID._id.toString(),
        year: year,
        month: month,
        activity: {
          preventiveDowntime: 0,
          correctiveDowntime: correctiveBreakTime,
          preventivesNumber: 0,
          correctivesNumber: 1,
          preventivesPlannedNumber: 0,
        },
      }
    );
  
    await axios.put(
      "/api/maintenance-activity/filter/subtract",
      {
        parameter: originalDoc.departmentID._id.toString(),
        year: year,
        month: month,
        activity: {
          preventiveDowntime: 0,
          correctiveDowntime: correctiveBreakTime,
          preventivesNumber: 0,
          correctivesNumber: 1,
          preventivesPlannedNumber: 0,
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
}
const salaryUpdateCost= async (oldDoc, updatedDoc) => {
 // Call the updateSalary route of MaintenanceCost for each laborCost
 for (let i = 0; i < updatedDoc.laborCost.length; i++) {
  const laborCost = updatedDoc.laborCost[i];
  const date = new Date(laborCost.month);
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  // Find the corresponding laborCost in the original document
  const oldLaborCost = oldDoc.laborCost.find(lc => lc.month === laborCost.month && lc.year === laborCost.year);
// update salary maintenance cost total
  await axios.put('/api/maintenance-cost/updateSalary', {
    year: year,
    month: month,
    oldCosts: {
      salary: oldLaborCost ? oldLaborCost.salary : 0
    },
    newCosts: {
      salary: laborCost.salary
    }
  });
}
// update salary maintenance cost fiters

if (updatedDoc.laborCost) { // Only make the request if laborCost is being updated
  const docId = updatedDoc._id; // get _id from the document
  
  await axios.put(`/api/preventives/updatelabrocost/${docId}`, { doc: updatedDoc });
  await axios.put(`/api/correctives/updatelabrocost/${docId}`, { doc: updatedDoc });
}
}


const activityAddPreventivePlanifications=async(doc)=>{
    const date = parseDate(doc.dateEnd);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
      await axios.put('/api/maintenance-activity/add', {
        year: year,
        month: month,
        preventiveDowntime: 0,
        correctiveDowntime: 0,
        preventivesNumber: 0,
        correctivesNumber: 0,
        preventivesPlannedNumber:1
       
      });
      await axios.put("/api/maintenance-activity/filter/add", {
        parameter: doc.departmentID._id.toString(),
        year: year,
        month: month,
        preventiveDowntime: 0,
        correctiveDowntime: 0,
        preventivesNumber: 0,
        correctivesNumber: 0,
        preventivesPlannedNumber: 1,
      });
      await axios.put("/api/maintenance-activity/filter/add", {
        parameter: doc.machineID._id.toString(),
        year: year,
        month: month,
        preventiveDowntime: 0,
        correctiveDowntime: 0,
        preventivesNumber: 0,
        correctivesNumber: 0,
        preventivesPlannedNumber: 1,
      });
}

const activityDeletePreventivePlanifications=async(originalDoc)=>{
 
    const date = parseDate(originalDoc.dateEnd);
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
      await axios.put('/api/maintenance-activity/add', {
        year: year,
        month: month,
        preventiveDowntime: 0,
        correctiveDowntime: 0,
        preventivesNumber: 0,
        correctivesNumber: 0,
        preventivesPlannedNumber:-1
       
      });
      await axios.put(
        "/api/maintenance-activity/filter/subtract",
        {
          parameter: originalDoc.machineID._id.toString(),
          year: year,
          month: month,
          activity: {
            preventiveDowntime: 0,
            correctiveDowntime: 0,
            preventivesNumber: 0,
            correctivesNumber: 0,
            preventivesPlannedNumber: 1,
          },
        }
      );
    
      await axios.put(
        "/api/maintenance-activity/filter/subtract",
        {
          parameter: originalDoc.departmentID._id.toString(),
          year: year,
          month: month,
          activity: {
            preventiveDowntime: 0,
            correctiveDowntime: 0,
            preventivesNumber: 0,
            correctivesNumber: 0,
            preventivesPlannedNumber: 1,
          },
        }
      );
}

const notificationsAdd=async(doc)=>{
    const date = parseDate(doc.dateStart);

    let notifDates = {
      interventionDate: null,
      day: null,
      week: null,
      month: null
    }
    
    if(doc.notifBefore.interventionDate){
      notifDates.interventionDate = new Date(date.setHours(9, 0, 0, 0));
      await axios.post('/api/planningNotifications/', {
       doc:doc,
       notifDate:notifDates.interventionDate,
      });
    }
    
    if(doc.notifBefore.day){
      let dayBefore = new Date(date);
      dayBefore.setDate(dayBefore.getDate() - 1);
      notifDates.day = new Date(dayBefore.setHours(9, 0, 0, 0));
      await axios.post('/api/planningNotifications/', {
       doc:doc,
       notifDate:notifDates.day,
      });
    }
    
    if(doc.notifBefore.week){
      let weekBefore = new Date(date);
      weekBefore.setDate(weekBefore.getDate() - 7);
      notifDates.week = new Date(weekBefore.setHours(9, 0, 0, 0));
      await axios.post('/api/planningNotifications/', {
       doc:doc,
       notifDate:notifDates.week,
      });
    }
    
    if(doc.notifBefore.month){
      let monthBefore = new Date(date);
      monthBefore.setMonth(monthBefore.getMonth() - 1);
      notifDates.month = new Date(monthBefore.setHours(9, 0, 0, 0));
      await axios.post('/api/planningNotifications/', {
       doc:doc,
       notifDate:notifDates.month,
      });
    }
}

const notificationsDelete=async(originalDoc)=>{
   
    await axios.delete(`/api/planningNotifications/preventiveUpdate/${originalDoc._id}`);
  
}

module.exports = { costUpdate,costAdd,costDelete,activityAdd,activityUpdate,activityDelete,activityDeletePreventivePlanifications,activityAddPreventivePlanifications,notificationsAdd,notificationsDelete,costAddCorrective,
  costUpdateCorrective,
  costDeleteCorrective,
  activityAddCorrective,
  activityUpdateCorrective,
  activityDeleteCorrective,
  salaryUpdateCost,  };