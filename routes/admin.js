const express = require('express')
const adminRoutes = express()
const adminController = require('../controls/adminController')

adminRoutes.get('/',adminController.getAdminLogin)



module.exports  = adminRoutes