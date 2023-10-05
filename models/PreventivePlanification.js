const mongoose = require('mongoose');
const Department =require("./department.js");
const Machine =require("./machine.js");
const Employee =require("./employee.js");

const PreventivePlanificationSchema = new mongoose.Schema(
  {
   
   
        machineID: {
          type: mongoose.Schema.ObjectId,
          ref: Machine,
        },
        departmentID: {
          type: mongoose.Schema.ObjectId,
          ref: Department,
        },
        employeeID:[{
          type: mongoose.Schema.ObjectId,
          ref: Employee,
        }],
        dateStart: String,
        dateEnd: String,
        
        notifBefore:{
          type: Object,
          default:{
            interventionDate:false,
            day:false,
            week:false,
            month:false,
          },
      },
   
   
  },
  { timestamps: true }
);






module.exports = mongoose.model('PreventivePlanification', PreventivePlanificationSchema);