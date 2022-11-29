const express = require('express')
const adminRoutes = express()
const adminController = require('../controls/adminController')

adminRoutes.get('/',adminController.getAdminLogin)
adminRoutes.get('/home',adminController.getAdminHome)
adminRoutes.post('/login',adminController.postAdminLogin)
adminRoutes.get('/logout',adminController.adminLogout)



module.exports  = adminRoutes