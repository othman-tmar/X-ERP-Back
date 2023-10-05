const mongoose = require('mongoose')

const departmentSchema = new mongoose.Schema({
 
    nameDepartment: {
        type: String,
        required: true,
    },

    responsible: {
        type: String,
        required: true,
    },
    nbMachine: {
        type: Number,
        default: 1,
        required: true,
    },
    cost: {
        type: Number,
        required: false,
    },
    
    imageDepartment: {
        type: String,
        required: false
    },

},
    {
        timestamps: true,
    },
    )


 

module.exports = mongoose.model('Department', departmentSchema)