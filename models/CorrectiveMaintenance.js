const mongoose = require("mongoose");
const Department = require("./department.js");
const Machine = require("./machine.js");
const Employee = require("./employee.js");


const CorrectiveMaintenanceSchema = new mongoose.Schema(
  {
    machineID: {
      type: mongoose.Schema.ObjectId,
      ref: Machine,
    },
    departmentID: {
      type: mongoose.Schema.ObjectId,
      ref: Department,
    },
    employeeID: [
      {
        type: mongoose.Schema.ObjectId,
        ref: Employee,
      },
    ],
    dateStart: String,
    dateEnd: String,
    status: String,
    description: String,
    costCorrective: {
      type: Number,
      default: 0,
    },
    breakTime: String,
    failureCause: String,
    dateCall: String,
    callOffBy: String,
    occupationTime: String,
    storableSparePartCost: {
      type: Number,
      default: 0,
    },
    nonStorableSparePartCost: {
      type: Number,
      default: 0,
    },
    serviceCost: {
      type: Number,
      default: 0,
    },
    localLaborCost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model( "CorrectiveMaintenance", CorrectiveMaintenanceSchema);
