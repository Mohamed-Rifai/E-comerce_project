const express = require('express')
const app = express()
const path = require('path')
const session = require('express-session')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const fileUpload = require('express-fileupload')
const cors = require("cors"); 
require('dotenv').config()
require('./config/database-connetion')



 

app.set('views');  
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(__dirname))


app.use(session({
    secret: "thisismysecretkey",  
    saveUninitialized: true,
    cookie: { maxAge: 6000000 },
    resave: false,
}))

app.use(cors()); 
app.use(fileUpload())
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 


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
app.listen(process.env.PORT,()=>
 console.log('Server listening to port '))  