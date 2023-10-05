const mongoose = require('mongoose');
const Department =require("./department.js");
const Machine =require("./machine.js");
const Employee =require("./employee.js");
const PreventivePlanification = require('./PreventivePlanification.js');


const PlanningNotificationSchema = new mongoose.Schema(
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

        notifCheck:{
          type: Boolean,
          default:false
        },
        
        notifDate:String,
      
        preventivePlanificationID:{
          type: mongoose.Schema.ObjectId,
          ref: PreventivePlanification,
        },



   
   
  },
  { timestamps: true }
);




module.exports = mongoose.model('PlanningNotification', PlanningNotificationSchema);