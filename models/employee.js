const mongoose = require('mongoose');
const bcrypt = require('bcrypt') // crypte psw


const employeeSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
  },
  lastname: {
      type: String,
      required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
},

    avatar: {
      type: String,
      required: false
  },

    phone: Number,

    password: {
      type: String,
      required: true,
  },
  laborCost: [{
    workSchedule:Number,
    salary:Number,
    month: String
  }],

      role: {
        type: String,
        enum: [ "Admin","Manager","User"],
        required: true,
    }, 

    isActive: {

        type: Boolean,
        default: true,
        required: false
    }, 
    
    
  },
  { timestamps: true }
);



employeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  next()
})

module.exports = mongoose.model('Employee', employeeSchema);