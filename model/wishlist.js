const mongoose = require ('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const wishlistschema = new Schema(
    {
        userId : {
            type:ObjectId,
            required:true
        },
        product : [
            {
                productId: {
                    type :ObjectId,
                    required:true
                }
            }
        ]
    }
)

module.exports =  mongoose.model('wishlist',wishlistschema)