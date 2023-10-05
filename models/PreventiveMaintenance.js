const mongoose = require('mongoose');
const Department =require("./department.js");
const Machine =require("./machine.js");
const Employee =require("./employee.js");


const PreventiveMaintenanceSchema = new mongoose.Schema(
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
        status:String,
        description:String,
        costPreventive:{
          type: Number,
          default:0,
      },
        storableSparePartCost:{
          type: Number,
          default:0,
      },
        nonStorableSparePartCost:{
          type: Number,
          default:0,
      },
        serviceCost:{
          type: Number,
          default:0,
      },
      localLaborCost:{
        type: Number,
        default:0,
    },
      

        breakTime:String,
        preventiveActions: [String],

   
   
   
  },
  { timestamps: true }
);




module.exports = mongoose.model('PreventiveMaintenance', PreventiveMaintenanceSchema);
