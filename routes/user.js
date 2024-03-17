const express = require('express')
const router = express()
const userController = require('../controls/userController')
const verifyLogin = require('../middleware/session')



    
router.get('/',userController.gethome)

router.get('/login',userController.getlogin)

router.get('/signup',userController.getsignup)

router.post('/signup',userController.postsignup)

router.get('/otpPage',userController.getOtpPage)

router.post('/otp',userController.postOtp) 

router.post('/login',userController.postlogin) 

router.get('/forgot-password',userController.forgotPassword)

router.post('/post-forgot-password',userController.postForgotPassword)

router.get('/forgot-otp-page',userController.forgotOtpPage)

router.post('/post-forgot-otp',userController.postForgetOtp)

router.post('/forgot-new-password',userController.forgotNewPassword)

router.get('/logout',userController.userLogout) 

router.get('/shop',verifyLogin.verifyLoginUser, userController.getShopPage)

router.get('/category-wise/:id',verifyLogin.verifyLoginUser,userController.getCategoryWisePage) 

router.get('/product-view/:id',verifyLogin.verifyLoginUser ,userController.productView) 

router.get('/add-to-wishlist/:id',verifyLogin.verifyLoginUser,userController.addToWishList)

router.get('/viewWishList',verifyLogin.verifyLoginUser,userController.viewWishList) 

router.post('/wishlist-remove',verifyLogin.verifyLoginUser,userController.removeFromWishlist)

router.get('/cart/:id',verifyLogin.verifyLoginUser,userController.addToCart)

router.get('/viewCart',verifyLogin.verifyLoginUser,userController.viewCart)

router.post('/removeProduct',verifyLogin.verifyLoginUser,userController.removeProduct)

router.post('/changeQuantity',verifyLogin.verifyLoginUser,userController.changeQuantity,userController.totalAmount)

router.get('/viewProfile',verifyLogin.verifyLoginUser ,userController.viewProfile)

router.get('/editProfile',verifyLogin.verifyLoginUser,userController.editProfile) 

router.post('/postEditProfile',verifyLogin.verifyLoginUser,userController.postEditProfile)

router.get('/changePassword',verifyLogin.verifyLoginUser,userController.getChangePassword)

router.post('/postChangePassword',verifyLogin.verifyLoginUser,userController.postChangePassword)

router.get('/checkout',verifyLogin.verifyLoginUser,userController.getCheckOutPage)

router.post('/addNewAddress',verifyLogin.verifyLoginUser,userController.addNewAddress)

router.post('/placeOrder',verifyLogin.verifyLoginUser,userController.placeOrder)  

router.get('/orderSuccess',verifyLogin.verifyLoginUser,userController.orderSuccess)

router.get("/orderDetails", verifyLogin.verifyLoginUser, userController.orderDetails);

router.get('/orderedProduct/:id',verifyLogin.verifyLoginUser,userController.orderedProduct)

router.get('/cancelOrder/:id',verifyLogin.verifyLoginUser,userController.cancelOrder)


module.exports=router