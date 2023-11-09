const passport = require("passport");
const validator = require("validator");
const User = require("../models/User");
const httpErrors = require('http-errors');
const session=require("express-session")


module.exports = {
    auth: function(req,res,next){

        },
    // if the user is authenticated, then they will be successfully logged out and the session destroyed
    logout: function(req,res){
     
    }
}
        
 


    

