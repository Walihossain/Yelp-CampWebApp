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
			console.log(err);
			res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
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
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){	
});

// LOG OUT Route and logic 
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/campgrounds");	
});


// MIDDLE WARE 
//isLoggedIn - middleware 
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;