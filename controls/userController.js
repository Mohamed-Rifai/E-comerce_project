const user = require('../model/user-schema')          
const bcrypt = require('bcrypt')
const products = require('../model/product-schema')
const mailer = require('../middleware/otpValidation')
const cart = require('../model/cart-schema')
const order = require('../model/order-schema')
const categories = require('../model/category-schema')
const wishlist = require('../model/wishlist')
const mongoose = require('mongoose')
const moment = require('moment')
moment().format();

let name;
let email;
let phone;
let password;
let countInCart;
let countWishlist;


 
module.exports={ 


gethome:async(req,res)=>{ 
    const session = req.session.user
    const product = await products.find({delete:false}).populate('category')
if(session){
  customer = true
}else{
    customer = false
}  
  res.render('user/home',{customer,product,countInCart,session,countWishlist})
},

 getlogin:(req,res)=>{
    res.render('user/login')
},

 getsignup:(req,res)=>{
    res.render('user/signup')
},


 postsignup: async(req,res)=>{
 
    const hash = await bcrypt.hash(req.body.password,10)

    name = req.body.name
    email = req.body.email
    phone = req.body.phone
    password = hash

    const mailDetails = {
        from : 'rifaeeckm@gmail.com',
        to : email,
        subject : 'Otp for cadbury',
        html: `<p>Your OTP for registering in Cadbury is ${mailer.OTP}</p>`,
    }
    const userData = await user.findOne({email : email})

    if(userData){
        res.render('user/signup',{err_message: 'User already exists'})
    }else{
        mailer.mailTransporter.sendMail(mailDetails,function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect('/otpPage')
            }
        })
    }
 
},
  getOtpPage : (req,res)=>{
        res.render('user/otp')
  },

  postOtp: (req,res)=>{
 const otp = req.body.otp
   if(mailer.OTP === otp){
     user.create({
        name: name,
        phone: phone,
        email: email,
        password: password
     }).then(()=>{
        res.redirect('/login')
     })
   }else{
    res.render('user/otp',{invalid:'invalid otp'})
   }

  },

 postlogin: async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
   const userData = await user.findOne({ email: email })

    try{
        if(userData){
            if(userData.isBlocked ===false){
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                req.session.user = req.body.email
                res.redirect('/')
            }else{
                res.render('user/login',{invalid:'Invalid password or email'})
            }
        }else{
            res.render('user/login',{blocked:"You can't login!!! "})
        }
        }else{
            res.render('user/login',{invalid:'Invalid password or email'})
        }
    }catch(error){
        console.log(error);
    }
 },
 userLogout: (req,res)=>{
    req.session.destroy()
    res.redirect('/')
 },
  
 getShopPage:async(req,res)=>{
    let category = await categories.find()
    let product = await products.find({delete: false}).populate('category')

      res.render('user/shop',{product,countInCart,category,countWishlist})
 },
 productView:async(req,res)=>{
    const id = req.params.id
    const product = await products.findOne({_id:id}).populate('category')
    res.render('user/product-view',{product,countInCart,countWishlist})
 },
 addToWishList:async(req,res)=>{

    const id = req.params.id
    const objId = mongoose.Types.ObjectId(id)
    const session = req.session.user

  let proObj = {
  productId :objId
  }
   const userData = await user.findOne({ email : session })
   const userWishlist = await wishlist.findOne({ userId : userData._id})
   console.log(userData);
  console.log(userWishlist);
  if(userWishlist){

      let proExist = userWishlist.product.findIndex(
        (product)=> product.productId == id 
        );
       if(proExist !== -1){
       res.redirect('/viewWishList')
       }else{
        
        wishlist.updateOne(
          { userId : userData._id},{ $push:{ product : proObj }}
        ).then(()=>{
          res.redirect('/viewWishList')
        })
       }

 }else{
console.log('create collection');
  const newWishlist = new wishlist({
    userId : userData._id,
    product : [
      {
        productId:objId
      },
    ]
  });
  newWishlist.save().then(()=>{
    console.log('whishlist created');
    res.redirect('/viewWishList')
  })
 }

 },
 viewWishList :async(req,res)=>{
   const session = req.session.user
   const userData = await user.findOne({email : session})
   const userId = userData._id
  
   const wishlistData = await wishlist
   .aggregate([
    {
      $match: { userId : userId}
    },
    {
      $unwind: "$product"
    },
    {
      $project : {
        productItem : "$product.productId",
      }
    },
    {
      $lookup : {
        from:"products",
        localField:"productItem",
        foreignField:"_id",
        as:"productDetail"
      }
    },
    {
      $project:{
        productItem:1,
        productDetail: { $arrayElemAt:["$productDetail",0]}
      }
    }
   ]);
    countWishlist = wishlistData.length
    res.render('user/wishlistpage', {wishlistData,countWishlist,countInCart})
 },

 removeFromWishlist:async(req,res)=>{
      const data = req.body
      const objId = mongoose.Types.ObjectId(data.productId)
     await wishlist.aggregate([
           {
            $unwind : "$product"
           },
     ]);
     await wishlist.updateOne(
      {_id : data.wishlistId,"product.productId" : objId},
      {$pull: { product: { productId : objId}}}
     )
     .then(()=>{
      res.json({ status : true})
     })

 },


 addToCart:async(req,res)=>{
  console.log('its working addto cart');
    const id = req.params.id
    const objId = mongoose.Types.ObjectId(id)
    const session = req.session.user;
    let proObj = {
        productId : objId,
        quantity : 1,
    };
   const userData = await user.findOne({email : session})
   const userCart = await cart.findOne({userId : userData._id})

   if(userCart) {
  
    let proExist = userCart.product.findIndex(
        (product) => product.productId == id
    ); 
    
    if(proExist != -1){
        // await cart.aggregate([
        //     { 
        //         $unwind: "$product"
        //     },
        // ]);
        await cart.updateOne(
            {userId : userData._id, "product.productId":objId},
            {$inc : { "product.$.quantity": 1 } }  
        );
        res.redirect('/viewCart')  
    }else{
        cart
           .updateOne({ userId: userData._id }, { $push: { product: proObj } })
           .then(() => {
 
             res.redirect("/viewcart");
 
           });
    }

   }else{
    const newCart = new cart ({
        userId: userData._id,
        product: [
            {
                productId:objId,
                quantity: 1
            }
        ]
    });
    newCart.save().then(()=>{
        res.redirect('/viewCart')
    })
   }
 },
 viewCart :async(req,res)=>{
    const session = req.session.user
    const userData = await user.findOne({ email : session })
    const productData = await cart
    .aggregate([
      {
          $match: { userId : userData.id}
      },
      {
          $unwind: "$product"
      },
      {
          $project: {
              productItem: "$product.productId",
              productQuantity: "$product.quantity"
            }
      },
      {
          $lookup: {
              from: "products",
              localField: "productItem",
              foreignField: "_id",
              as: "productDetail",
            },
      },
      {
          $project: {
              productItem: 1,
              productQuantity: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            },
      },
      {
          $addFields: {
              productPrice: {
                $multiply: ["$productQuantity", "$productDetail.price"]
              }
            }
      }
    ])
    .exec();
    const sum = productData.reduce((accumulator, object )=>{
      return accumulator + object.productPrice;
    },0)

countInCart = productData.length

console.log(productData);
res.render('user/cart',{productData,sum,countInCart,countWishlist})
 
},



removeProduct: async (req, res) => {
    const data = req.body;
    // const objId = mongoose.Types.ObjectId(data.product);
    // console.log(objId);
    // await cart.aggregate([
    //   {
    //     $unwind: "$product"
    //   }
    // ])
    await cart
      .updateOne(
        { _id: data.cart, "product.productId": data.product },
        { $pull: { product: { productId: data.product } } }
      )
      .then(() => {
        res.json({ status: true });
      });
  },
  changeQuantity : (req,res,next)=>{   
    const data = req.body
    const objId = mongoose.Types.ObjectId(data.product)

    if(data.count == -1 && data.quantity == 1){
         cart.updateOne(
          {_id : data.cart, "product.productId":objId},
          {$pull : { product : { productId:objId }}}
         )
         .then(()=>{
         res.json({quantity:true})
         })
    }else{
      cart.updateOne(
        { _id: data.cart, "product.productId":objId},
        { $inc:{"product.$.quantity": data.count }}
       ).then(()=>{
        next()
       })
    }
    
   
    
  },
  totalAmount: async (req, res) => {


    let session = req.session.user;
    const userData = await user.findOne({ email: session });
    const productData = await cart.aggregate([
      {
        $match: { userId: userData.id },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          productItem: "$product.productId",
          productQuantity: "$product.quantity",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productItem",
          foreignField: "_id",
          as: "productDetail",
        },
      },
      {
        $project: {
          productItem: 1,
          productQuantity: 1,
          productDetail: { $arrayElemAt: ["$productDetail", 0] },
        },
      },
      {
        $addFields: {
          productPrice: {
            $multiply: ["$productQuantity", "$productDetail.price"],
          },
        },
      },
      {
        $group: {
          _id: userData.id,
          total: {
            $sum: { $multiply: ["$productQuantity", "$productDetail.price"] },
          },
        },
      },
    ]).exec();
    res.json({ status: true, productData });
  },


  

  viewProfile:async (req,res)=>{

    const session = req.session.user
    let userData = await user.findOne({ email : session})
   res.render('user/profile',{userData,countInCart,customer})
 },

  editProfile:async (req,res)=>{

    const session = req.session.user
    let userData = await user.findOne({ email : session})
    res.render('user/edit-profile',{userData,countInCart})
  },

  postEditProfile:async (req,res)=>{

    const session = req.session.user
     await user.updateOne(
      {email : session},
      {
        $set: {

          name: req.body.name,
          phone:req.body.phone,
          addressDetails:[
            {
              housename:req.body.housename,
              area:req.body.area,
              landmark:req.body.landmark,
              district:req.body.district,
              state:req.body.state,
              postoffice:req.body.postoffice,
              pin:req.body.pin,
            },
          ],
        },
      },
      ) 
      res.redirect('/viewProfile')
  },

   getCheckOutPage:async(req,res)=>{
    let session = req.session.user;
    const userData = await user.findOne({ email: session });
    const productData = await cart
      .aggregate([
        {
          $match: { userId: userData.id }, 
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
            productQuantity: "$product.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetail",
          },
        },
        {
          $project: {
            productItem: 1,
            productQuantity: 1,
            productDetail: { $arrayElemAt: ["$productDetail", 0] },
          },
        },
        {
          $addFields: {
            productPrice: {
              $multiply: ["$productQuantity", "$productDetail.price"]
            }
          }
        }
      ])
      .exec();
    const sum = productData.reduce((accumulator, object) => {
      return accumulator + object.productPrice;
    }, 0);


    res.render("user/checkout", { productData, sum, countInCart, userData });


   },

   addNewAddress: async (req, res) => {
    const session = req.session.user
    const addObj = {

      housename: req.body.housename,
      area: req.body.area,
      landmark: req.body.landmark,
      district: req.body.district,
      state: req.body.state,
      postoffice: req.body.postoffice,
      pin: req.body.pin

    }

    await user.updateOne({ email: session }, { $push: { addressDetails: addObj } })
    res.redirect('/checkout')
  },


   placeOrder :async (req,res)=>{
      
    const session = req.session.user;
    const userData = await user.findOne({ email: session })
    const cartData = await cart.findOne({ userId: userData._id });
    const userId = userData._id.toString()
    const status = req.body.paymentMethod === "COD" ? "placed" : "pending";

    if (cartData) {
      const productData = await cart
        .aggregate([
          {
            $match: { userId: userId },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              productItem: "$product.productId",
              productQuantity: "$product.quantity",
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "productItem",
              foreignField: "_id",
              as: "productDetail",
            },
          },
          {
            $project: {
              productItem: 1,
              productQuantity: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            },
          },
          {
            $addFields: {
              productPrice: {
                $multiply: ["$productQuantity", "$productDetail.price"]
              }
            }
          }
        ])
        .exec();
      const sum = productData.reduce((accumulator, object) => {
        return accumulator + object.productPrice;
      }, 0);

      const orderData = await order.create({
        userId: userData._id,
        name: userData.name,
        phonenumber: userData.phone,
        address: req.body.address,
        orderItems: cartData.product,
        totalAmount: sum,
        paymentMethod: req.body.paymentMethod,
        orderStatus: status,
        orderDate: moment().format("MMM Do YY"),
        deliveryDate: moment().add(3, "days").format("MMM Do YY")
      })


      await cart.deleteOne({ userId: userData._id });
      if (req.body.paymentMethod === "COD") {
        res.json({ success: true });
      }

    } else {

      res.redirect("/viewCart");
    }


  },
  orderSuccess :(req,res)=>{
    res.render('user/order-success',{countInCart})
  },

  orderDetails: async (req, res) => {

    const session = req.session.user
    const userData = await user.findOne({ email: session });
    order.find({ userId: userData._id }).sort({ createdAt: -1 }).then((orderDetails) => {
      const orderLength = orderDetails.length
      res.render('user/order-details', { orderLength,orderDetails, countInCart })
    })


  },

  orderedProduct:async (req,res) =>{
    const id = req.params.id
    const objId = mongoose.Types.ObjectId(id)
    console.log(objId);
    const productData = await order.aggregate([
           {
            $match:{_id : objId}
           },
           {
           $unwind: "$orderItems"
           },
           {
            $project:{
              productItem: "$orderItems.productId",
              productQuantity: "$orderItems.quantity",
              address: 1,
              name : 1,
              phonenumber: 1
            }
           },
           {
            $lookup: {
              from: "products",
              localField: "productItem",
              foreignField: "_id",
              as: "productDetail",
            },
           },

           {
            $project: {
              productItem: 1,
              productQuantity: 1,
              name: 1,
              phonenumber: 1,
              address: 1,
              productDetail: { $arrayElemAt: ["$productDetail", 0] },
            }
          },
          // {
          //   $lookup: {
          //     from: 'categories',
          //     localField: 'productDetail.category',
          //     foreignField: "_id",
          //     as: "category_name"
          //   }
          // },
          // {
          //   $unwind: "$category_name"
          // },
           
    ])
    console.log(productData);
    res.render('user/orderd-product',{productData,countInCart})
  },

  cancelOrder:async (req,res)=>{  
    const data = req.params.id
    await order.updateOne({ _id : data},{$set:{ orderStatus :"cancelled"}})
    res.redirect('/orderDetails')
  }



   

  

}
