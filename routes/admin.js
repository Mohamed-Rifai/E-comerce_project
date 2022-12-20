const express = require('express')
const adminRoutes = express()
const adminController = require('../controls/adminController')
const verifyLogin = require('../middleware/session')

// middleware
adminRoutes.use(express.json());
adminRoutes.use(express.urlencoded({ extended: true }));
 
  
adminRoutes.get('/',adminController.getAdminLogin)
adminRoutes.post('/login',adminController.postAdminLogin)
adminRoutes.get('/logout',adminController.adminLogout)
adminRoutes.get('/userDetails',verifyLogin.verifyLoginAdmin,adminController.getAllUsers)
adminRoutes.get('/blockUser/:id',adminController.blockUser)
adminRoutes.get('/unBlockUser/:id',adminController.unBlockUser) 
adminRoutes.get('/addProduct',verifyLogin.verifyLoginAdmin,adminController.addProduct)       
adminRoutes.get('/productDetails',verifyLogin.verifyLoginAdmin,adminController.productDetails)
adminRoutes.post('/postProduct',adminController.postProduct)   
adminRoutes.get('/edit-product/:id',verifyLogin.verifyLoginAdmin,adminController.editProduct)  
adminRoutes.post('/post-editProduct/:id',adminController.postEditProduct) 
adminRoutes.get('/deleteProduct/:id',verifyLogin.verifyLoginAdmin,adminController.deleteProduct) 
adminRoutes.get('/restoreProduct/:id',verifyLogin.verifyLoginAdmin,adminController.restoreProduct) 
adminRoutes.get('/category',verifyLogin.verifyLoginAdmin,adminController.getCategory)   
adminRoutes.post('/addCategory',adminController.addCategory) 
adminRoutes.post('/editCategory/:id',adminController.editCategory) 
adminRoutes.get('/delete-category/:id',verifyLogin.verifyLoginAdmin,adminController.deleteCategory)
adminRoutes.get('/restore-category/:id',verifyLogin.verifyLoginAdmin,adminController.restoreCategory)
adminRoutes.get('/coupon',verifyLogin.verifyLoginAdmin,adminController.getCouponPage)
adminRoutes.post('/addCoupon',adminController.addCoupon)
adminRoutes.get('/deleteCoupon/:id',verifyLogin.verifyLoginAdmin,adminController.deleteCoupon)
adminRoutes.get('/restoreCoupon/:id',verifyLogin.verifyLoginAdmin,adminController.restoreCoupon)
adminRoutes.post('/editCoupon/:id',verifyLogin.verifyLoginAdmin,adminController.editCoupon)
adminRoutes.get('/orders',verifyLogin.verifyLoginAdmin,adminController.getOrders)
adminRoutes.get('/orderedProduct/:id',verifyLogin.verifyLoginAdmin,adminController.getOrderedProduct)
adminRoutes.post('/orderStatusChange/:id',verifyLogin.verifyLoginAdmin,adminController.orderStatusChange)

module.exports  = adminRoutes