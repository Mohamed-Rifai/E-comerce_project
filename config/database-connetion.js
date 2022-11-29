const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(process.env.MONG_URI).then(()=>{
    console.log('data base connected')
})
.catch((err)=>{
    
    console.log(err)
})