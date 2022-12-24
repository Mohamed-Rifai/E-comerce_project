const express = require('express')
const adminRoutes = express()
const adminController = require('../controls/adminController')
const verifyLogin = require('../middleware/session')

 
  
adminRoutes.get('/',adminController.getAdminLogin)

adminRoutes.post('/login',adminController.postAdminLogin)

adminRoutes.get('/salesReport',verifyLogin.verifyLoginAdmin,adminController.salesReport)

adminRoutes.get('/dailyReport',verifyLogin.verifyLoginAdmin,adminController.dailyReport)

adminRoutes.get('/monthlyReport',verifyLogin.verifyLoginAdmin,adminController.monthlyReport)

adminRoutes.get('/logout',adminController.adminLogout)

adminRoutes.get('/userDetails',verifyLogin.verifyLoginAdmin,adminController.getAllUsers)

adminRoutes.get('/blockUser/:id',verifyLogin.verifyLoginAdmin,adminController.blockUser)

adminRoutes.get('/unBlockUser/:id',verifyLogin.verifyLoginAdmin,adminController.unBlockUser) 

adminRoutes.get('/addProduct',verifyLogin.verifyLoginAdmin,adminController.addProduct)  

adminRoutes.get('/productDetails',verifyLogin.verifyLoginAdmin,adminController.productDetails)

adminRoutes.post('/postProduct',adminController.postProduct)   

adminRoutes.get('/edit-product/:id',verifyLogin.verifyLoginAdmin,adminController.editProduct) 

adminRoutes.post('/post-editProduct/:id',verifyLogin.verifyLoginAdmin,adminController.postEditProduct)

adminRoutes.get('/deleteProduct/:id',verifyLogin.verifyLoginAdmin,adminController.deleteProduct) 

adminRoutes.get('/restoreProduct/:id',verifyLogin.verifyLoginAdmin,adminController.restoreProduct) 

adminRoutes.get('/category',verifyLogin.verifyLoginAdmin,adminController.getCategory) 

adminRoutes.post('/addCategory',verifyLogin.verifyLoginAdmin,adminController.addCategory) 

adminRoutes.post('/editCategory/:id',verifyLogin.verifyLoginAdmin,adminController.editCategory) 

adminRoutes.get('/delete-category/:id',verifyLogin.verifyLoginAdmin,adminController.deleteCategory)

adminRoutes.get('/restore-category/:id',verifyLogin.verifyLoginAdmin,adminController.restoreCategory)

adminRoutes.get('/coupon',verifyLogin.verifyLoginAdmin,adminController.getCouponPage)

adminRoutes.post('/addCoupon',verifyLogin.verifyLoginAdmin,adminController.addCoupon)

adminRoutes.get('/deleteCoupon/:id',verifyLogin.verifyLoginAdmin,adminController.deleteCoupon)

adminRoutes.get('/restoreCoupon/:id',verifyLogin.verifyLoginAdmin,adminController.restoreCoupon)

adminRoutes.post('/editCoupon/:id',verifyLogin.verifyLoginAdmin,adminController.editCoupon)

adminRoutes.get('/orders',verifyLogin.verifyLoginAdmin,adminController.getOrders)

adminRoutes.get('/orderedProduct/:id',verifyLogin.verifyLoginAdmin,adminController.getOrderedProduct)

adminRoutes.post('/orderStatusChange/:id',verifyLogin.verifyLoginAdmin,adminController.orderStatusChange)

adminRoutes.get('/getBanner',verifyLogin.verifyLoginAdmin,adminController.getBanner)

adminRoutes.post('/addBanner',verifyLogin.verifyLoginAdmin,adminController.addBanner)

adminRoutes.post('/edit-banner/:id',verifyLogin.verifyLoginAdmin,adminController.editBanner)

adminRoutes.get('/delete-banner/:id',verifyLogin.verifyLoginAdmin,adminController.deleteBanner)

adminRoutes.get('/restore-banner/:id',verifyLogin.verifyLoginAdmin,adminController.restoreBanner)

module.exports  = adminRoutes