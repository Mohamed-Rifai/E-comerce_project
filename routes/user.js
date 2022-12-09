const express = require('express')
const router = express()
const userController = require('../controls/userController')
const verifyLogin = require('../middleware/session')

// middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/',userController.gethome)
router.get('/login',userController.getlogin)
router.get('/signup',userController.getsignup)
router.post('/signup',userController.postsignup) 
router.get('/otpPage',userController.getOtpPage)
router.post('/otp',userController.postOtp)
router.post('/login',userController.postlogin)
router.get('/logout',userController.userLogout)
router.get('/shop',verifyLogin.verifyLoginUser, userController.getShopPage)
router.get('/product-view/:id',verifyLogin.verifyLoginUser ,userController.productView) 
router.get('/cart/:id',userController.addToCart)
router.get('/viewCart',verifyLogin.verifyLoginUser,userController.viewCart)
router.post('/removeProduct',userController.removeProduct)
router.post('/changeQuantity',userController.changeQuantity,userController.totalAmount)
router.get('/viewProfile',userController.viewProfile)
router.get('/editProfile',userController.editProfile) 
router.post('/postEditProfile',userController.postEditProfile)



module.exports=router