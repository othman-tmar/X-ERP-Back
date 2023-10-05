const mongoose = require('mongoose');

const CostFiltersSchema = new mongoose.Schema(
  {
   
        parameter: String,
        data:[{
            year: String,
            month: String,
            "Total Maintenance cost (TND)": Number,
            "Storable Spare Part Cost (TND)": Number,
            "Non Storable Spare Part Cost (TND)": Number,
            "Service Cost (TND)": Number,
            "Local Labor Cost (TND)": Number
        }]
       
      

  },
  { timestamps: true }
);

module.exports = mongoose.model('CostFilters', CostFiltersSchema);