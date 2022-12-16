const express = require('express')
const path = require('path')
const session = require('express-session')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const fileUpload = require('express-fileupload')
require('dotenv').config()
require('./config/database-connetion')

// express app
const app = express()
 
//view engine setup
app.set("view engine", "ejs");
app.set('views');  
// to access public files
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(__dirname))
app.use(session({
    secret: "thisismysecretkey",  
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    resave: false,
}))
app.use(fileUpload())
//to privent store cache
app.use((req, res, next) => {
    res.set(
        "Cache-Control",
        "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );
    next()
})
// routes
app.use('/',userRoutes)
app.use('/admin',adminRoutes)
   
// port setting
app.listen(3000,(req,res)=>{
    console.log('Server listening to port 3000');
})  