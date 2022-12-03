const express = require('express')
const router = express()
const userController = require('../controls/userController')

// middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/',userController.gethome)
router.get('/login',userController.getlogin)
router.get('/signup',userController.getsignup)
router.post('/signup',userController.postsignup) 
router.post('/login',userController.postlogin)
router.get('/logout',userController.userLogout)
router.get('/shop',userController.getShopPage)
router.get('/product-view/:id',userController.productView)




module.exports=router