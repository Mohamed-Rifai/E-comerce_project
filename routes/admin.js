const express = require('express')
const { unBlockUser } = require('../controls/adminController')
const adminRoutes = express()
const adminController = require('../controls/adminController')

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



module.exports  = adminRoutes