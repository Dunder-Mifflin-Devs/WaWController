const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const httpErrors = require('http-errors');
const session=require("express-session")


module.exports = {
    auth: function(req,res,next){

        },
    //if the user is authenticated, then they will be successfully logged out and the session destroyed
    logout: function(req,res,next){
      if(req.isAuthenticated()){
        req.logout(()=>{
            console.log('User has logged out')
            req.session.destroy(()=>{
              console.log('Session successfully destroyed')
              res.send('/')
            })
        })
      }else{
        console.log("Error : Failed to destroy the session during logout.", err);
        res.status(205)("/profile");
        }}
}
        
 


    

