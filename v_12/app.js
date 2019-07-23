var express 	= require("express");
var app 	    = express();

// connected to seeds.js file - check out video 323 and 324
var seedDB = require("./seeds.js");
//seedDB();

// line 9 and line 10 is needed when we use POST request and try to extact data from a form of that post request
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));


// Connecting to MongoDB
var mongoose    = require("mongoose"); // added as part of intalling mongoose and connecting to MongoDB for yelpcamp

var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_v12"; //when run locally DATBASEURL is emply or url = the local url link
mongoose.connect(url, { useNewUrlParser: true });// this creates yelpcamp database in MongoDB Cloud Atlas 

// process.env.DATABASEURL is an enviroment variable fed by the environment the code is being run on. 
//console.log(process.env.DATABASEURL);
// DATABASE variable for heroku is saved in the Config Var section of the heroku ui page, which populates DATABASEURL with the below link from cloubatlas

//export DATABASEURL = "'mongodb://localhost:27017/yelp_camp_v12'" //this line neeeds to added to the local env using cmd
//mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', { useNewUrlParser: true });
//mongoose.connect("mongodb+srv://wnh149dB:149mongoYelp@yelpcampcluster-vkazf.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });


// importing Camground Schema in the models folder using module.exports =  
var Campground = require("./models/campgrounds.js");

// importing comment Schema in the models folder using module.exortes
var Comment = require("./models/comments.js");

// needed for edit and update of campgrounds and comments ie PUT and DELETE routes 
var methodOverride = require("method-override");

// needed for flash messages 
var flash = require("connect-flash");
// asking express to use flash 
app.use(flash());

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

// this is used for not putting ejs behind every route 
app.set("view engine", "ejs");

// linking the public dir to the code 
app.use(express.static(__dirname + "/public"));

// asking express to use method override 
app.use(methodOverride("_method"));

// The below lines tells express to use the routes, using the router inside the routes dir.  
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);

// SERVER 
// app.listen(3000, function(req,res){
// 	console.log("The yelpCamp Server is up");
// });

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("YelpCamp server Has Started!");
});