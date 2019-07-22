var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");


// Root Route: 
router.get("/", function(req,res){
	res.render("landing");
});

// =====================
// AUTH ROUTES
// =====================


///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// REGISTER ROUTES 
// Show Register form
router.get("/register", function(req,res){
	res.render("register");
});
// Handle Sign Up Logic 
router.post("/register", function(req,res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success","Welcome to Yelpcamp" + " " + user.username.charAt(0).toUpperCase() + user.username.slice(1) + "!");
			res.redirect("/campgrounds");
		}); 
	});
});


////\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// LOGIN ROUTES 

// show login form 
router.get("/login", function(req, res){
	res.render("login");
});
// Handle the the Login logic passport.authenticate is a middleware 
//router.post("/login", middleware, callback// this the structure of this this method for the Login logic 
router.post("/login", function (req,res,next){
	passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: true,
      	successFlash: "Welcome back, " + req.body.username.charAt(0).toUpperCase() + req.body.username.slice(1) + "!"
	})(req,res);	
});

// LOG OUT Route and logic 
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You Logged Out");
	res.redirect("/campgrounds");	
});


module.exports = router;