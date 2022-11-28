const express = require('express')


module.exports={

    getAdminLogin:(req,res)=>{
        res.render('admin/login')
    }
}