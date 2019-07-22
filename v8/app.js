var express 	= require("express");
var app 	    = express();

// connected to seeds.js file - check out video 323 and 324
var seedDB = require("./seeds.js");
seedDB();

// line 9 and line 10 is needed when we use POST request and try to extact data from a form of that post request
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));

// Connecting to MongoDB
var mongoose    = require("mongoose"); // added as part of intalling mongoose and connecting to MongoDB for yelpcamp
mongoose.connect('mongodb://localhost:27017/yelp_camp_v8', { useNewUrlParser: true }); // this creates yelpcamp database in MongoDB 

// importing Camground Schema in the models folder using module.exports =  
var Campground = require("./models/campgrounds.js");

// importing comment Schema in the models folder using module.exortes
var Comment = require("./models/comments.js");

// requiring routes - entered after refactoring 
var campgroundRoutes = 	require("./routes/campgrounds.js");
var commentRoutes 	 = 	require("./routes/comments.js");
var indexRoutes 	 = 	require("./routes/index.js");

//+++++++++++++++++++++++++++++++++++
//AUTH CONFIG CODE
// +++++++++++++++++++++++++++++++++++
// packages needed for Auth // PASSPORT
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user.js"); // This code connects to the model schemea in models dir 

// Passport Configuration 
app.use(require("express-session")({
	secret: "You shall not pass",
	resave: false,
	saveUninitialized: false
}));
// The above code app.require express session should be before app.use passport initialize and app.use passport session
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//+++++++++++++++++++++++++++++++++++
//AUTH CONFIG CODE END
// +++++++++++++++++++++++++++++++++++

// MIDDLEWARE for passing req.user to every page to show/hide the Login Sign up and Logout links on the Navbar 
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});


app.set("view engine", "ejs");

// linking the public dir to the code 
app.use(express.static(__dirname + "/public"));

// The below lines tells express to use the routes, using the router inside the routes dir.  
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);


// SERVER 
app.listen(3000, function(req,res){
	console.log("The yelpCamp Server is up");
});