const user = require('../model/user-schema')          
const bcrypt = require('bcrypt')
const products = require('../model/product-schema')
const mailer = require('../middleware/otpValidation')
const cart = require('../model/cart-schema')
const order = require('../model/order-schema')
const categories = require('../model/category-schema')
const wishlist = require('../model/wishlist')
const coupon = require('../model/coupon')
const banner = require('../model/banner')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 
const otp    = require('../model/otp')
const mongoose = require('mongoose')
const moment = require('moment')
const { json } = require('body-parser')
moment().format();


let countInCart;
let countWishlist;



function checkCoupon(data,id){
  return new Promise((resolve)=>{
    if(data.coupon){
      coupon.find(
        {couponName: data.coupon},
        {users: { $elemMatch : { userId:id}}}
      )
      .then((exist)=>{
    
        if(exist[0].users.length){
       
          resolve(true)

        }else{
          coupon.find({ couponName: data.coupon}).then((discount)=>{
            resolve(discount)
          })
        }
      })
    }else{
      resolve(false)
    }
  })
}

 
module.exports={ 


gethome:async(req,res)=>{ 

  try{
    const session = req.session.user
    const product = await products.find({delete:false}).populate('category')
 if(session){
  customer = true
 }else{
    customer = false
 }  
  const bannerData = await banner.find({ isDeleted:false }).sort({createdAt: -1}).limit(1)
 
  res.render('user/home',{customer,product,countInCart,countWishlist,bannerData})


  }catch(err){
    console.log(err);
    res.render('user/error')
  }
   
},

 getlogin:(req,res)=>{
    res.render('user/login')
},

 getsignup:(req,res)=>{
    res.render('user/signup')
},


 postsignup: async(req,res)=>{

  try{

    const hash = await bcrypt.hash(req.body.password,10)

   const name =req.body.name
   const email =req.body.email
   const phone =req.body.phone
   const password =hash

    const OTP = `${Math.floor(1000 + Math.random() * 9000)}`
    const mailDetails = {
        from : 'rifaeeckm@gmail.com',
        to : email,
        subject : 'Otp for cadbury',
        html: `<p>Your OTP for registering in Cadbury is ${OTP}</p>`,
    }
    const userData = await user.findOne({email : email})

    if(userData){
        res.render('user/signup',{err_message: 'User already exists'})
    }else{

      const User = {
        name :name,
        email:email,
        phone:phone,
        password:password
      }
        mailer.mailTransporter.sendMail(mailDetails, async function(err){
            if(err){
                console.log(err);
            }else{

           const userFound = await otp.findOne({email:email})

           if(userFound){

            otp.deleteOne({email:email}).then(()=>{

              otp.create({
                email:email,
                otp:OTP
              }).then(()=>{
               
                res.redirect(`/otpPage?name=${User.name}&email=${User.email}&phone=${User.phone}&password=${User.password}`);

              })

            })
           }else{

            otp.create({
              email:email,
              otp:OTP
            }).then(()=>{
             
              res.redirect(`/otpPage?name=${User.name}&email=${User.email}&phone=${User.phone}&password=${User.password}`);

            })

           }

             
               
            }
        })
    }

  }catch{
    res.render('user/error')
  }
 
   
 
},
  getOtpPage : (req,res)=>{
    let userData = req.query
        res.render('user/otp',{userData})
  },

  postOtp:async(req,res)=>{

    try{

      const body = req.body
      const userData = {
        name:body.name,
        email:body.email,
        phone:body.phone,
        password:body.password
      }
      console.log(body);
       otp.findOne({email:body.email.trim() }).then(async(sendOtp)=>{
    
        if(req.body.otp == sendOtp.otp){

          res.redirect('/login')
     
          await user.create({
            name:body.name,
            phone:body.phone,
            email:body.email,
            password:body.password
          })

      
         }else{
          res.render('user/otp',{invalid:'invalid otp',userData})
         }
       })

   

    }catch{
      res.render('user/error')
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

 forgotPassword:(req,res)=>{  

  res.render('user/forgot-password')
    
 }, 
 
 postForgotPassword:async(req,res)=>{

  try{
    const email = req.body.email
    const OTP = `${Math.floor(1000 + Math.random() * 9000)}`
      const mailDetails = {
          from : 'rifaeeckm@gmail.com',
          to : email,
          subject : 'Otp for cadbury',
          html: `<p>Your OTP for reset password in Cadbury is ${OTP}</p>`,
      }

    const userData = await user.findOne( {email: email} )
    if(userData){
     
      mailer.mailTransporter.sendMail(mailDetails,async function(err){
        if(err){
            console.log(err);
        }else{

            otp.findOne({email: email}).then(async(userFound)=>{

              if(userFound){

                await otp.deleteOne({email:email})
              }

            })
         

   
   

           otp.create({
            email:email,
            otp:OTP
          }).then(()=>{
            res.render('user/forgot-otp-page',{email})
          })

        }
      })

    }else{
      res.render('user/forgot-password',{invalid : 'Email not exists' })  
    }

  }catch(err){
    console.log(err);
    res.render('user/error')
  }

 },
 
 forgotOtpPage:(req,res)=>{
    res.render('user/forgot-otp-page')
 },

 postForgetOtp:async(req,res)=>{
   try{
    
    const body = req.body
    const email = req.body.email
    const userOtp = await otp.findOne({email: body.email})
   
      if(body.otp == userOtp.otp){
          
        res.render('user/forgot-new-password',{email})

      }else{
        res.render('user/forgot-otp-page',{email,invalid:'Incorrect otp'})
      }
    

   } catch(err){
    console.log(err);
    res.render('user/error')
   }

   
 },


 forgotNewPassword:async(req,res)=>{

  try{

    const email = req.body.email
    const password   = req.body.password
    const hash = await bcrypt.hash(password,10)
    if(password === req.body.conPassword){

       await user.findOneAndUpdate(
        { email: email },
        { $set:{ password:hash }})

     res.render('user/login')

    }else{
     
      res.render('user/forgot-new-password',{email,invalid:'Password must be same'})
    }
    

  }catch(err){
    console.log(err);
    res.render('user/error')
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

 getCategoryWisePage:async(req,res)=>{
     
  const id = req.params.id
  const category = await categories.find()
  const product = await products.find({category : id}).populate('category')
  console.log(product);
  res.render('user/shop',{product,category,countInCart,countWishlist})
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
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'productDetail.category',
          foreignField: "_id",
          as: "category_name"
        }
      },
      {
        $unwind: "$category_name"
      },
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
   res.render('user/profile',{userData,countInCart,customer,countWishlist})
 },

  editProfile:async (req,res)=>{

    const session = req.session.user
    let userData = await user.findOne({ email : session})
    res.render('user/edit-profile',{userData,countInCart,countWishlist})
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

  getChangePassword:(req,res)=>{
      
  res.render('user/changePassword',{countWishlist,countInCart})

  },

  postChangePassword:async(req,res)=>{
     try{

    const data = req.body
    const session = req.session.user

    if(data.newPassword === data.conNewPassword){

      const userData = await user.findOne({email:session})
      const passwordMatch = await bcrypt.compare(data.currentPassword,userData.password)

    if(passwordMatch){ 
       
      const hashPassword = await bcrypt.hash(data.newPassword,10)
      
      user.updateOne({ email: session }, { $set: { password: hashPassword }}).then(()=>{

        req.session.destroy();
        res.redirect('/')
      })

      }else{
        res.render('user/changePassword',{invalid: "Incorrect password"})
      }

    }else{
      res.render('user/changePassword',{ invalid: "Password must be same"})
    }



     }catch(err){
      console.log(err);
      res.render('user/error')
     }
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


    res.render("user/checkout", { productData, sum, countInCart, userData,countWishlist });


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
     
try{

    let invalid;
    let couponDeleted;
    const data = req.body

    const session = req.session.user;
    const userData = await user.findOne({ email: session })
    const cartData = await cart.findOne({ userId: userData._id });
    const objId = mongoose.Types.ObjectId(userData._id)

  if(data.coupon){
   
    invalid = await coupon.findOne({ couponName:data.coupon })
   
    if(invalid?.delete == true){

      couponDeleted =true
    }  
  }else{
    invalid = 0;
  }

  if(invalid == null){

    res.json({ invalid: true });
  }
  else if(couponDeleted){

    res.json({couponDeleted:true})
  }
  else{

    const discount = await checkCoupon(data,objId)

    if(discount == true){
      res.json({ coupon : true})
    }
    else{

      if (cartData) {
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

        if (discount == false){
           var total = sum;
        }
        else{
          var dis = sum * discount[0].discount
          if(dis > discount[0].maxLimit){
            total = sum-discount[0].maxLimit;

          }else{
            total = sum-dis;
          }
        }

        const orderData = await order.create({
          userId: userData._id,
          name: userData.name,
          phonenumber: userData.phone,
          address: req.body.address,
          orderItems: cartData.product,
          totalAmount: total,
          paymentMethod: req.body.paymentMethod,
          orderDate: moment().format("MMM Do YY"),
          deliveryDate: moment().add(3, "days").format("MMM Do YY")
        })
      
        const orderId = orderData._id
         
        if (req.body.paymentMethod === "COD") {
         await order.updateOne({_id:orderId},{$set:{orderStatus:'placed'}})
         
         
         await cart.deleteOne({ userId: userData._id });

         res.json({ success: true})
          await coupon.updateOne(
          {couponName:data.coupon},
          {$push:{users: {userId : objId}}}
         )
        
        }else{
          const session = await stripe.checkout.sessions.create({ 
            payment_method_types: ["card"], 
            line_items:
              productData.map((ele) => {
                return { 
                  price_data: { 
                    currency: "inr", 
                    product_data: { 
                      name: ele.productDetail.name, 
                    }, 
                    unit_amount:ele.productDetail.price * 100, 
                  }, 
                  quantity: ele.productQuantity, 
                }
              }), 
            mode: "payment", 
            success_url: `${process.env.SERVER_URL}/orderSuccess`,
            cancel_url: `${process.env.SERVER_URL}/checkout` 
          }); 
        
         
          console.log(session);
          res.json({ url: session.url}) 

        }
      }
    } 
  }

}catch(err){
  console.log(err);
  res.render('user/error')
}

  

  },
  orderSuccess :(req,res)=>{
    res.render('user/order-success',{countInCart,countWishlist})
  },

  orderDetails: async (req, res) => {

    const session = req.session.user
    const userData = await user.findOne({ email: session });
    order.find({ userId: userData._id }).sort({ createdAt: -1 }).then((orderDetails) => {
      const orderLength = orderDetails.length
      res.render('user/order-details', { orderLength,orderDetails, countInCart,countWishlist })
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
          {
            $lookup: {
              from: 'categories',
              localField: 'productDetail.category',
              foreignField: "_id",
              as: "category_name"
            }
          },
          {
            $unwind: "$category_name"
          },
           
    ])
 
    res.render('user/orderd-product',{productData,countInCart,countWishlist})
  },

  cancelOrder:async (req,res)=>{  
    const data = req.params.id
    await order.updateOne({ _id : data},{$set:{ orderStatus :"cancelled"}})
    res.redirect('/orderDetails')
  }


}
