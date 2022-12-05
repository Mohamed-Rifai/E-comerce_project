const user = require('../model/user-schema')
const bcrypt = require('bcrypt')
const products = require('../model/product-schema')
const mailer = require('../middleware/otpValidation')


let name;
let email;
let phone;
let password;

//  async function checkEmail(userEmail){
//     const userFound = await userSchema.findOne({ email: userEmail })
//     if(userFound){
//         return true
//     }else{
//         return false
//     }
// }
 
module.exports={ 

// render home page
gethome:async(req,res)=>{ 
const session = req.session.user
const product = await products.find({delete:false})
if(session){
  customer = true
}else{
    customer = false
}  
  res.render('user/home',{customer,product})
},
// render login 
 getlogin:(req,res)=>{
    res.render('user/login')
},
// render signup
 getsignup:(req,res)=>{
    res.render('user/signup')
},
// user signup/send data to database

 postsignup: async(req,res)=>{
 
    const hash = await bcrypt.hash(req.body.password,10)

    name = req.body.name
    email = req.body.email
    phone = req.body.phone
    password = hash

    const mailDetails = {
        from : 'rifaeeckm@gmail.com',
        to : email,
        subject : 'Otp for cadbury',
        html: `<p>Your OTP for registering in Cadbury is ${mailer.OTP}</p>`,
    }
    const userData = await user.findOne({email : email})

    if(userData){
        res.render('user/signup',{err_message: 'User already exists'})
    }else{
        mailer.mailTransporter.sendMail(mailDetails,function(err){
            if(err){
                console.log(err);
            }else{
                res.redirect('/otpPage')
            }
        })
    }
 
},
  getOtpPage : (req,res)=>{
        res.render('user/otp')
  },

  postOtp: (req,res)=>{
 const otp = req.body.otp
   if(mailer.OTP === otp){
     user.create({
        name: name,
        phone: phone,
        email: email,
        password: password
     }).then(()=>{
        res.redirect('/login')
     })
   }else{
    res.render('user/otp',{invalid:'invalid otp'})
   }

  },

 postlogin: async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
   const userData = await user.findOne({ email: email })

    try{
        if(userData){
            if(userData.isBlocked ===false){
            const passwordMatch = await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                req.session.user = req.body.email
                res.redirect('/')
            }else{
                res.render('user/login',{invalid:'Invalid password or email'})
            }
        }else{
            res.render('user/login',{blocked:"You can't login!!! "})
        }
        }else{
            res.render('user/login',{invalid:'Invalid password or email'})
        }
    }catch(error){
        console.log(error);
    }
 },
 userLogout: (req,res)=>{
    req.session.destroy()
    res.redirect('/')
 },

 getShopPage:(req,res)=>{
      res.render('user/shop')
 },
 productView:async(req,res)=>{
    const id = req.params.id
    const product = await products.findOne({_id:id})
    res.render('user/product-view',{product})
 }
}
