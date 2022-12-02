const express = require('express')
const userSchema = require('../model/user-schema')
const bcrypt = require('bcrypt')
const body = require('body-parser')


 async function checkEmail(userEmail){
    const userFound = await userSchema.findOne({ email: userEmail })
    if(userFound){
        return true
    }else{
        return false
    }
}
 
module.exports={ 

// render home page
gethome:(req,res)=>{ 
const user = req.session.user
if(user){

    customer = true
    res.render('user/home',{customer})
}else{
    customer = false
    res.render('user/home',{customer})
}  
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
    try{
        if(req.body.email){
            const userExists = await checkEmail(req.body.email)

            if(userExists == true){
                res.redirect('/signup')
            }else{
                const hash = await bcrypt.hash(req.body.password,10)
                const newUser = new userSchema({
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    password:hash  
                })
                newUser.save().then(()=>{
                   req.session.user = req.body.email
                    res.redirect('/')
                })
            }
        } 
    }catch(error){
        console.log(error)
    }
},

 postlogin: async(req,res)=>{
    const email = req.body.email
    const password = req.body.password
   const userData = await userSchema.findOne({ email: email })

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
 }
}
