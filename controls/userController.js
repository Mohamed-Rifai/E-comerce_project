const user = require('../model/user-schema')
const bcrypt = require('bcrypt')
const products = require('../model/product-schema')
const mailer = require('../middleware/otpValidation')
const cart = require('../model/cart-schema')
const mongoose = require('mongoose')

let name;
let email;
let phone;
let password;
let countInCart;


 
module.exports={ 

// render home page
gethome:async(req,res)=>{ 
const session = req.session.user
const product = await products.find({delete:false})
if(session){
  customer = true
}else{
    customer = false
}  
  res.render('user/home',{customer,product,countInCart,session})
},
// render login 
 getlogin:(req,res)=>{
    res.render('user/login')
},
// render signup
 getsignup:(req,res)=>{
    res.render('user/signup')
},
// user signup/send data to database

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
    let product = await products.find({delete: false})
      res.render('user/shop',{product,countInCart})
 },
 productView:async(req,res)=>{
    const id = req.params.id
    const product = await products.findOne({_id:id})
    res.render('user/product-view',{product})
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
        await cart.aggregate([
            { 
                $unwind: "$product"
            },
        ]);
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


res.render('user/cart',{productData,sum,countInCart})
 
},

//    changeQuantity:(req,res)=>{
//      const data = req.body
//      const objId = mongoose.Types.ObjectId(data.product)
//  },

removeProduct: async (req, res) => {
    const data = req.body;
    console.log(data);
    // const objId = mongoose.Types.ObjectId(data.product);
    // console.log(objId);
    await cart.aggregate([
      {
        $unwind: "$product"
      }
    ])
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
    cart.aggregate([
        {
            $unwind : "$product"
        }
    ]).then((data)=>{
        console.log(data);
     })
   cart.updateOne(
    { _id: data.cart, "product.productId":objId},
    { $inc:{"product.$.quantity": data.count }}
   ).then(()=>{
    next()
   })
    
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
   res.render('user/profile',{userData,countInCart})
 },

  editProfile:async (req,res)=>{

    const session = req.session.user
    let userData = await user.findOne({ email : session})
    res.render('user/edit-profile',{userData,countInCart})
  },

  postEditProfile: (req,res)=>{

    const session = req.session.user
    user.updateOne(
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
              pin:req.body.pin
            }
          ]
        }
      }
      )
      res.redirect('/viewProfile')
  },

  

}
