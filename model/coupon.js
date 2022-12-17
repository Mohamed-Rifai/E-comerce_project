const mongoose = require('mongoose');
const Schema   = mongoose.Schema;
const moment   =require('moment')
const ObjectId = Schema.ObjectId;
const couponScema = new Schema(
    {
        couponName: {
            type:String,
            required:true,
        },
        discount: {
            type:Number,
            required:true,
        },
        maxLimit:{
            type:Number,
            required:true,
        },
        startDate:{
            type:String,
            default:
                moment().format("DD/MM/YYYY") + ";" + moment().format("hh:mm:ss"),
        },
        expirationTime: {
            type: String,
            required: true,
          },
          delete: {
            type: Boolean,
            default: false,
          },
          users: [
            {
              userId: {
                type: ObjectId,
              },
            },
          ],
        },
        {
          timestamps: true,
        }
    
)

module.exports = mongoose.model('coupon',couponScema)