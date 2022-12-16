const mongoose = require('mongoose')
const productSchema = new mongoose.Schema({

    name:{
     type:String,
     required:true   
    },
    price:{
        type:Number,
        required:true
    },
    category :{
        type: mongoose.Types.ObjectId,
        ref : 'categories'
    },
    description:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    delete: {
        type: Boolean,
        default: false
      }
})


module.exports = mongoose.model('products',productSchema)