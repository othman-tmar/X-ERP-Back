const mongoose = require('mongoose')


const MaintenanceActivitySchema = new mongoose.Schema({
    year: String,
    month: String,
    "Preventives Downtime (H)": Number,
    "Corretives Downtime (H)": Number,
    "Correctives Number": Number,
    "Preventives Number": Number,
    "Preventives Planned Number": Number,
    "Preventives Achievement Percentage(%)": Number
});


 

module.exports = mongoose.model('MaintenanceActivity', MaintenanceActivitySchema)