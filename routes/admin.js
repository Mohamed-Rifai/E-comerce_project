const express = require('express')
const adminRoutes = express()
const adminController = require('../controls/adminController')

// middleware
adminRoutes.use(express.json());
adminRoutes.use(express.urlencoded({ extended: true }));
 
  
adminRoutes.get('/',adminController.getAdminLogin)
adminRoutes.get('/home',adminController.getAdminHome)
adminRoutes.post('/login',adminController.postAdminLogin)
adminRoutes.get('/logout',adminController.adminLogout)
adminRoutes.get('/userDetails',adminController.getAllUsers)
adminRoutes.get('/blockUser/:id',adminController.blockUser)
adminRoutes.get('/unBlockUser/:id',adminController.unBlockUser) 
adminRoutes.get('/addProduct',adminController.addProduct)    
adminRoutes.get('/productDetails',adminController.productDetails)
adminRoutes.post('/postProduct',adminController.postProduct)   
adminRoutes.get('/edit-product/:id',adminController.editProduct)  
adminRoutes.post('/post-editProduct/:id',adminController.postEditProduct) 
adminRoutes.get('/deleteProduct/:id',adminController.deleteProduct) 
adminRoutes.get('/restoreProduct/:id',adminController.restoreProduct) 
adminRoutes.get('/category',adminController.getCategory)   
adminRoutes.post('/addCategory',adminController.addCategory) 
adminRoutes.post('/editCategory/:id',adminController.editCategory) 
adminRoutes.get('/delete-category/:id',adminController.deleteCategory)



module.exports  = adminRoutes