const mongoose = require('mongoose')
const Department =require("./department.js");

const machineSchema = new mongoose.Schema({
    referenceMachine: {
        type: String,
        required: true,
        unique: true
    },
    nameMachine: {
        type: String,
        required: true,
    },
    departmentID: {type:mongoose.Schema.Types.ObjectId,
        ref:Department},

 
    productionTime: {
        type: Number,
        required: true,
    },
    nbPreMainInWeek: {
        type: Number,
        default: 1,
        required: true,
    },
    breakTime: {
        type: Number,
        default:0,
        required: true,
    },
    cost: {
        type: Number,
        default:0,
        required: true,
    },

    image: {
        type: String,
        default: "testimage",
        required: false
    },
    preventiveActions: [String],

       failureCause: [{
        failure: String,
        date: { type: Date, default: Date.now }
    }],
},
    {
        timestamps: true,
    },
    )

 

module.exports = mongoose.model('Machine', machineSchema)