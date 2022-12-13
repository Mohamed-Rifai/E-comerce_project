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
router.get('/add-to-wishlist/:id',verifyLogin.verifyLoginUser,userController.addToWishList)
router.get('/viewWishList',verifyLogin.verifyLoginUser,userController.viewWishList) 
router.post('/wishlist-remove',verifyLogin.verifyLoginUser,userController.removeFromWishlist)
router.get('/cart/:id',verifyLogin.verifyLoginUser,userController.addToCart)
router.get('/viewCart',verifyLogin.verifyLoginUser,userController.viewCart)
router.post('/removeProduct',userController.removeProduct)
router.post('/changeQuantity',userController.changeQuantity,userController.totalAmount)
router.get('/viewProfile',verifyLogin.verifyLoginUser ,userController.viewProfile)
router.get('/editProfile',verifyLogin.verifyLoginUser,userController.editProfile) 
router.post('/postEditProfile',userController.postEditProfile)
router.get('/checkout',verifyLogin.verifyLoginUser,userController.getCheckOutPage)
router.post('/addNewAddress',userController.addNewAddress)
router.post('/placeOrder',userController.placeOrder)
router.get('/orderSuccess',verifyLogin.verifyLoginUser,userController.orderSuccess)
router.get("/orderDetails", verifyLogin.verifyLoginUser, userController.orderDetails);
router.get('/orderedProduct/:id',verifyLogin.verifyLoginUser,userController.orderedProduct)
router.get('/cancelOrder/:id',userController.cancelOrder)


module.exports=router