const user = require('../model/user-schema')
const products = require('../model/product-schema')
const categories = require('../model/category-schema')



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
        const admin = req.session.admin
        
        if(admin){
            const users =await user.find()
            res.render('admin/userDetails',{users})
        }else{
            res.redirect('/admin')
        }
       
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
        const admin = req.session.admin
        if(admin){
            const product = await products.find()
            res.render('admin/productDetails',{product})
        }
       
    },
    //products send to database
    postProduct:async(req,res)=>{
        const image = req.files.image
        console.log(image);
        const product = new products({ 
             name:req.body.name,
             price:req.body.price,
             category:req.body.category,
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
      const admin = req.session.admin
      if(admin){       
            const category = await categories.find()
            let submitErr = req.session.submitErr   
            req.session.submitErr = ""  
            res.render('admin/category',{category, submitErr})  
        } else{
            
        res.redirect('/admin')
      }
  

    },
    addCategory:async (req,res)=>{
        if(req.body.name){
            const name = req.body.name
            const catgry = await categories.findOne({category_name:name})
            if(catgry){
                //must pass massage 
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
            req.session.submitErr = "oops some data missing!!!"
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
                    //must pass massage
                    res.redirect('/admin/category')
                }     
        }else{
            //must pass massage
            res.redirect('/admin/category')
        }  
    },
    deleteCategory:async(req,res)=>{
        const id = req.params.id
        console.log(id);
        await categories.deleteOne({_id:id})
            res.redirect('/admin/category')
    
       

    }


}