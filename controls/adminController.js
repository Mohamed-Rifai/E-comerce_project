const express = require('express')
const body = require('body-parser')
require('dotenv').config()
const user = require('../model/user-schema')
const aEmail = process.env.ADMIN_EMAIL
const aPassword =process.env.ADMIN_PASSWORD

module.exports={
   
    getAdminLogin:(req,res)=>{
       const admin = req.session.admin
       if(admin){
        res.render('admin/home')
       }else{
        res.render('admin/login')   
       }
    },

    getAdminHome:(req,res)=>{
        const admin = req.session.admin
        if(admin){
            res.render('admin/home')
        }else{
            res.render('admin/login')
        }
       
    },
    postAdminLogin:(req,res)=>{ 
        if(req.body.email === aEmail  && req.body.password === aPassword){
            req.session.admin = aEmail
            res.redirect('/admin/home')
        }else if(!req.body.email){
            res.render('admin/login',{notEmail:"Email required!!!"})
        }else if(!req.body.password){
            res.render('admin/login',{invalid:"Password required!!!"})
        }else{
            res.render('admin/login',{invalid:'Invali email or password!!!'})
        }

    },
    adminLogout:(req,res)=>{
        req.session.destroy()
        res.redirect('/admin')
    },
    getAllUsers:async(req,res)=>{
        const admin = req.session.admin
        console.log(admin);
        if(admin){
            const users =await user.find()
            console.log(users);
            res.render('admin/userDetails',{users})
        }else{
            res.redirect('/admin')
        }
       
    }

}