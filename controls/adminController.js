const user = require('../model/user-schema')
const products = require('../model/product-schema')
const categories = require('../model/category-schema')
const order = require('../model/order-schema')
const coupon= require('../model/coupon')
const mongoose = require('mongoose')
const moment = require('moment')
moment().format();



module.exports={
   
    getAdminLogin:(req,res)=>{
       const admin = req.session.admin
       if(admin){
        res.render('admin/home')
       }else{
        res.render('admin/login')   
       }
    },

    getAdminHome:(req,res)=>{
        const admin = req.session.admin
        if(admin){
            res.render('admin/home')
        }else{
            res.render('admin/login')
        }
       
    },
    postAdminLogin:(req,res)=>{ 
        if(req.body.email ===  process.env.ADMIN_EMAIL  && req.body.password === process.env.ADMIN_PASSWORD){
            req.session.admin = process.env.ADMIN_EMAIL
            res.redirect('/admin/home')
        }else if(!req.body.email){
            res.render('admin/login',{notEmail:"Email required!!!"})
        }else if(!req.body.password){
            res.render('admin/login',{invalid:"Password required!!!"})
        }else{
            res.render('admin/login',{invalid:'Invali email or password!!!'})
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
        console.log(productData);
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
    }

   


}