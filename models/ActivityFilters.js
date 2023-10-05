const mongoose = require('mongoose');

const ActivityFiltersSchema = new mongoose.Schema(
  {
   
        parameter: String,
        data:[{
            year: String,
            month: String,
            "Preventives Downtime (H)": Number,
            "Corretives Downtime (H)": Number,
            "Correctives Number": Number,
            "Preventives Number": Number,
            "Preventives Planned Number": Number,
            "Preventives Achievement Percentage(%)": Number
        }]
       
      

  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityFilters', ActivityFiltersSchema);