const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({

    otp:{
        type:Number,
        required:true

    },
    email:{
        type:String
    }
})

module.exports = mongoose.model('otp',otpSchema)
