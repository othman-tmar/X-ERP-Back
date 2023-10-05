const mongoose = require('mongoose')


const MaintenanceCostSchema = new mongoose.Schema({
    year: String,
    month: String,
    "Total Maintenance cost (TND)": Number,
    "Storable Spare Part Cost (TND)": Number,
    "Non Storable Spare Part Cost (TND)": Number,
    "Service Cost (TND)": Number,
    "Local Labor Cost (TND)": Number
});


 

module.exports = mongoose.model('MaintenanceCost', MaintenanceCostSchema)