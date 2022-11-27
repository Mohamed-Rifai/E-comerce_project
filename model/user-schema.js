const mongoose = require('mongoose')
const validator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
   name:{
      type: String,
      required: true,
      trim: true
   },
   phone:{
      type: Number,
      required:true,
      trim: true,
   },
   email: {
      type:String,
      unique:true,
      trim: true
   },
   password:{
      type: String,
      required: true,
      trim:true
   } ,
   isBlocked:{
      type:Boolean,
      default:false
   }
  
})


module.exports = mongoose.model('User',userSchema)
