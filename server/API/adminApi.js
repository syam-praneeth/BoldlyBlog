const exp = require('express');
const admin = exp.Router();

admin.get('/',(req,res)=>{
    res.send("User API is working");
})

module.exports = admin;