const user = require('../model/user-schema')
const products = require('../model/product-schema')
const categories = require('../model/category-schema')
const order = require('../model/order-schema')
const coupon= require('../model/coupon')
const banner= require('../model/banner')
const mongoose = require('mongoose')
const moment = require('moment')
moment().format();



module.exports={
   
    getAdminLogin:async(req,res)=>{
        try{
            let admin = req.session.admin
            if(admin){
                const orderData = await order.find({orderStatus: {$ne:"cancelled"}})

                const totalRevenue = orderData.reduce((accumulator, object) =>{
                    return accumulator + object.totalAmount
                },0)

                const startD = new Date();
                startD.setHours(0,0,0,0);

                const endD = new Date();
                endD.setHours(23,59,59,999);

                const todayOrder = await order.find({
                    createdAt: {$gte: startD, $lt: endD},
                    orderStatus: { $ne: "cancelled" }
                })
                const todayRevenue = todayOrder.reduce((accumulator, object)=>{
                    return accumulator + object.totalAmount
                },0)

                const start = moment().startOf("month")

                const end   = moment().endOf("month")

                const oneMonthOrder = await order.find({ orderStatus: {$ne:"cancelled"},createdAt: {$gte:start,$lte:end},})

                const monthlyRevenue = oneMonthOrder.reduce((accumulator, object)=>{
                    return accumulator + object.totalAmount
                },0)

                const allOrders = await order.find().count();

                const pending = await order.find({ orderStatus: "pending" }).count();

                const shipped = await order.find({ orderStatus: "shipped" }).count();

                const delivered = await order.find({ orderStatus: "delivered" }).count();

                const cancelled = await order.find({ orderStatus: "cancelled" }).count();

                const cod = await order.find({ paymentMethod: "COD" }).count();

                const online = await order.find({ paymentMethod: "Online" }).count();

                const activeUsers = await user.find({ isBlocked: false }).count();

                const product = await products.find({ delete: false }).count();


                res.render('admin/home',

                {
                    todayRevenue,
                    totalRevenue,
                    allOrders,
                    pending,
                    shipped,
                    delivered,
                    cancelled,
                    cod,
                    online,
                    monthlyRevenue,
                    activeUsers,
                    product

                }
            )
                   
            }else{
             res.render('admin/login')   
            }
        
        }catch(err){
            console.log(err);
           res.render('user/error')
        }
      
    },

    postAdminLogin:(req,res)=>{ 

        try{

            if(
                req.body.email ===  process.env.ADMIN_EMAIL 
             && req.body.password === process.env.ADMIN_PASSWORD){
                req.session.admin = process.env.ADMIN_EMAIL
                res.redirect('/admin')
                       
            }else{
                res.render('admin/login',{invalid:'Invali email or password!!!'})
            }
            
        }catch(err){
            console.log(err);
            res.render('user/error')
        }
     

    },
    adminLogout:(req,res)=>{
        req.session.destroy()
        res.redirect('/admin')
    },
    getAllUsers:async(req,res)=>{
        
            const users =await user.find()
            res.render('admin/userDetails',{users})
         
    },
    blockUser:async(req,res)=>{
     const id = req.params.id
     await user.updateOne({_id:id},{$set:{isBlocked:true}}).then(()=>{
        res.redirect('/admin/userDetails')
     })


    },
    unBlockUser:async(req,res)=>{
        const id = req.params.id
        await user.updateOne({_id:id},{$set:{isBlocked:false}}).then(()=>{
        res.redirect('/admin/userDetails')
        })

    },
    addProduct:async (req,res)=>{
        const category = await categories.find()

        res.render('admin/addProduct',{category})
    },
    productDetails:async(req,res)=>{

            let product = await products.find().populate('category')
            res.render("admin/productdetails", { product })
       
    },
   
    postProduct:async(req,res)=>{

        let categoryId = req.body.category

        const image = req?.files?.image
        const product = new products({ 
             name:req.body.name,
             price:req.body.price,
             category:categoryId,
             description:req.body.description, 
             stock:req.body.stock
        })
        const productDetails = await product.save()
      if(productDetails){
        let productId = productDetails._id;
        image.mv('./public/admin-images/'+productId+'.jpg',(err)=>{
            if(!err){
                res.redirect('/admin/productDetails')
            }else{ 
                console.log(err)
            }
        } )
      
      
    }else{
        res.redirect('/admin/addProduct')
    }
    },
    editProduct:async(req,res)=>{
        const id = req.params.id
        const category = await categories.find()
        const productData = await products.findOne({_id:id})
        res.render('admin/edit-product',{productData,category})
    },
    postEditProduct:async(req,res)=>{
        const id = req.params.id
        await products.updateOne({_id:id},{$set:{
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        stock: req.body.stock
        }})
        if(req?.files?.image){
            const image = req.files.image
            image.mv('./public/admin-images/'+id+'.jpg',(err)=>{
                if(!err){
                    res.redirect('/admin/productDetails')
                }else{
                    console.log(err)
                }
            })
        }else{
            res.redirect('/admin/productDetails')
        }
    },
    deleteProduct:async(req,res)=>{
        const id = req.params.id
       await products.updateOne({_id:id}, {$set: {delete:true}}).then(()=>{
        res.redirect('/admin/productDetails')

       })
    },
    restoreProduct:async (req,res)=>{

        const id = req.params.id;
        await products.updateOne({_id:id}, {$set: {delete:false } }).then(()=>{
            res.redirect('/admin/productdetails')
        })
       
    },
    getCategory:async(req,res)=>{
      
            const category = await categories.find()
           
            
            const categoryExist = req.session.categoryExist
            req.session.categoryExist = ""

            const  editCategoryExists = req.session.editCategoryExists
            req.session.editCategoryExists = ""
            res.render('admin/category',{category,categoryExist,editCategoryExists})  
        
    },
    addCategory:async (req,res)=>{
        if(req.body.name){
            const name = req.body.name
            const category = await categories.findOne({category_name:name})
            if(category){
                req.session.categoryExist = 'Category already Exist'
                res.redirect('/admin/category')
            }else{
                const category = new categories ({
                    category_name:req.body.name
                })
               
                    await category.save()
                    res.redirect('/admin/category')
            }
            }
            else{
            
            res.redirect( '/admin/category')
        }
                 
    },

    editCategory:async(req,res)=>{
        if(req.body.name){
            const name = req.body.name
            const findName = await categories.findOne({category_name:name})
            if(!findName){
            const id = req.params.id
            await categories.updateOne({_id:id},{$set:{
                 category_name:req.body.name
             }})
                 res.redirect('/admin/category')  
                }else{
                    req.session.editCategoryExists = 'Already Exist'
                    res.redirect('/admin/category')
                }     
        }else{
           
            res.redirect('/admin/category')
        }  
    },
    deleteCategory:async(req,res)=>{
        const id = req.params.id
        console.log(id);
        await categories.updateOne({_id:id},{$set: {delete:true}})
            res.redirect('/admin/category')    

    },

    restoreCategory:async(req,res)=>{
        const id = req.params.id
        await categories.updateOne({_id:id},{$set: {delete:false}})
        res.redirect('/admin/category');
    },

   getCouponPage :async (req,res)=>{
  
    const couponData = await coupon.find()
console.log(couponData);
    res.render('admin/coupon',{couponData})
   },

    addCoupon : (req,res)=>{
        try{

            const data = req.body
            const dis = parseInt(data.discount)
            const maxLimit = parseInt(data.maxLimit)
            const discount = dis/100
      
            coupon.create({
              couponName:data.couponName,
              discount  :discount,
              maxLimit  :maxLimit,
              expirationTime:data.expirationTime
      
            }).then((data)=>{
              console.log(data);
              res.redirect('/admin/coupon')

            })

        }catch{
            console.error()

        }
      
    },

    deleteCoupon :async (req,res)=>{
    
        const id = req.params.id
        await coupon.updateOne({_id:id}, {$set: { delete : true}})
        res.redirect('/admin/coupon')
    },

    restoreCoupon:async(req,res)=>{

        const id = req.params.id
        await coupon.updateOne({_id : id},{$set: {delete : false}})
        res.redirect('/admin/coupon')
    },

    editCoupon:(req,res)=>{

        try{

            const id = req.params.id
            const data = req.body

            coupon.updateOne({_id:id},
                {
                    couponName: data.couponName,
                    discount  : data.discount/100,
                    maxLimit  : data.maxLimit,
                    expirationTime: data.expirationTime
                })
                .then(()=>{
                    res.redirect('/admin/coupon')
                })

        }catch{
            console.error()
        }
       

    },




    getOrders :async (req,res)=>{

      const orderDetails = await  order.aggregate([

            {
                $lookup: {
                    from: "products",
                    localField: "orderItems.productId",
                    foreignField: "_id",
                    as: "product",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $sort: {
                    createdAt: -1
                }
            },

        ])
            
            res.render("admin/orders",{orderDetails});
       
    },

    getOrderedProduct :async (req,res)=>{
      console.log('its working getOrderd Product');
        const id = req.params.id
        const objId = mongoose.Types.ObjectId(id)

        const productData = await order.aggregate([
            {
                $match:{_id: objId}
            },
            {
                $unwind: "$orderItems",
            },
            {
                $project:{
                    productItem : "$orderItems.productId",
                    productQuantity : "$orderItems.quantity",
                    address:1,
                    name:1,
                    phonenumber:1
                }
            },
            {
                $lookup:{
                    from:"products",
                    localField:"productItem",
                    foreignField:"_id",
                    as:"productDetail"
                }
            },
            {
                $project: {
                    productItem: 1,
                    productQuantity: 1,
                    address: 1,
                    name: 1,
                    phonenumber: 1,
                    productDetail: { $arrayElemAt: ["$productDetail", 0] },
                }
            },

            {
                $lookup:{
                    from: "categories",
                    localField:"productDetail.category",
                    foreignField:"_id",
                    as: "category_name"
                }
            },
            {
                $unwind: "$category_name"
            }

        ])
                            
        res.render('admin/ordered-product',{productData}) 

    },

    orderStatusChange :async (req,res)=>{
         const id = req.params.id
         const data = req.body
         await order.updateOne(
            { _id:id},
            {
                $set:{
                    orderStatus: data.orderStatus,
                    paymentStatus:data.paymentStatus
                }
            }
         )
         res.redirect('/admin//orders')
    },

    salesReport :async(req,res)=>{
      try{

        const allOrderDetails = await order.find({
            paymentStatus:"paid",
            orderStatus:"delivered"
        })

        res.render('admin/sales-report',{allOrderDetails})

      }
      catch{
        res.render('user/error')
      }
       
    },

    dailyReport:async(req,res)=>{

        try{

            const start = new Date();
            start.setHours(0,0,0,0);
            
            const end = new Date();
            end.setHours(23,59,59,999);

            const allOrderDetails = await order.find({
                $and:
                [   
                    { paymentStatus:"paid", orderStatus:"delivered"},
                    {  
                        createdAt: {$gte: start, $lt: end}  } 

                ]
            });
            console.log(allOrderDetails);
            res.render('admin/sales-report',{allOrderDetails})
        
        

        }catch{
         res.render('user/error')
        }
    },
    monthlyReport:(req,res)=>{
        try{

            const start = moment().startOf('month');
            const end   = moment().endOf('month')

            order.
            find({
                $and:[
                    { paymentStatus:"paid",  orderStatus:"delivered" },
                    {
                        createdAt:{
                            $gte:start,
                            $lte:end,
                        },
                    },
                ],

            }).then((allOrderDetails)=>{
                console.log(allOrderDetails);
                res.render('admin/sales-report',{allOrderDetails})
            })

        }catch{
            res.render('user/error')
        }
    },

    getBanner:async(req,res)=>{
  try{
    const banners = await banner.find()

    res.render('admin/banner',{banners})

  }catch{

    res.render('user/error')
  }
        
    },

    addBanner :async(req,res)=>{

        try{
         const body = req.body

         await banner.create({
            offerType: body.offerType,
            bannerText: body.bannerText,
            couponName: body.couponName
         })
  
       res.redirect('/admin/getBanner')
         

        }catch(err){
         console.log(err)

         res.render('user/error')

        }
    },

    editBanner:async(req,res)=>{
       
   try{

      const bannerId = req.params.id
      await banner.updateOne(
        {  _id:bannerId },
        {
            $set:{
                offerType:req.body.offerType,
                bannerText:req.body.bannerText,
                couponName:req.body.couponName
            }
        }

      )
      res.redirect('/admin/getBanner')

   }catch(err){
    console.log(err);
    res.render('user/error')
   }
       
    },

    deleteBanner:async(req,res)=>{

        try{

            const bannerId = req.params.id
            await banner.updateOne(
                {_id:bannerId },
                {$set:{
                    isDeleted:true
                }}
               
            )
            res.redirect('/admin/getBanner')

            
        }catch(err){
            console.log(err)
            res.render('user/error')
        }
    },

    restoreBanner:async(req,res)=>{
        console.log('restore');
        try{
            const bannerId = req.params.id
            console.log( bannerId);
            await banner.updateOne(
                {_id:bannerId},
                {$set:{
                    isDeleted:false
                }}
            )

            res.redirect('/admin/getBanner')

        }catch(err){
            console.log(err);
            res.render('user/error')
        }

    }

   


}