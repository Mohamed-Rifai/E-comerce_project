const express = require('express')
const userSchema = require('../model/user-schema')
const bcrypt = require('bcrypt')
const body = require('body-parser')



 
module.exports={ 

// render home page
gethome:(req,res)=>{   
    res.render('user/home')

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
       console.log('signup working');
    try{
        const hash = await bcrypt.hash(req.body.password,10)
        const newUser = new userSchema({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password:hash
           
        })

        newUser.save().then((data)=>{
            console.log(data)
            res.redirect('/')
        })
        
       

    }catch(error){
        console.log(error)
    }
   

   
},

 postlogin: async(req,res)=>{
    res.redirect('/')
 }


}
