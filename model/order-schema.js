const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const orderSchema = new Schema(
    {
        userId: {
            type: ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        phonenumber: {
            type: Number,
            required: true,
        },
        address:{
            type: String,
            required: true,
        },
        orderItems: [
            {
                productId: {
                    type: ObjectId,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        orderStatus: {
            type: String,
            default: "pending",
        },
        paymentMethod: {
            type: String,
            // required: true,
        },
        paymentStatus: {
            type: String,
            default: "not paid",
        },
        orderDate: {
            type: String,
        },
        deliveryDate: {
            type: String,
        },
    },
    {
        timestamps:true
    }
    
   
);

module.exports = mongoose.model("order", orderSchema);
