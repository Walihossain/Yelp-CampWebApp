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
mongoose.connect('mongodb://localhost:27017/yelp_camp_v6', { useNewUrlParser: true }); // this creates yelpcamp database in MongoDB 

// importing Camground Schema in the models folder using module.exports =  
var Campground = require("./models/campgrounds.js");

// importing comment Schema in the models folder using module.exortes
var Comment = require("./models/comments.js");


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


app.get("/", function(req,res){
	res.render("landing");
});


// INDEX route
// this route displays everything that is there in the campgrounds array of objects or the MongoDB
app.get("/campgrounds", function(req,res){
	Campground.find({}, function(err, allcampgrounds){
				if(err){
					console.log("Error getting site");
					console.log(err);
				}
				else{
				 	//console.log("Campground retrieved!");
					//console.log(allcampgrounds);
				res.render("campgrounds/index", {campgrounds : allcampgrounds, currentUser : req.user});
				}
	});
	
});

// NEW Route - directs to page with form for submitting campgrounds
// this is the route for the form, the form is directed to hit the post route below, see the form tag inside new.ejs 
app.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new");
});

// CREATE route - which adds new data from the New route (above form route) to the database 
//post route 
app.post("/campgrounds", function(req,res){	
	//get data from form
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	// creating an object of name and image, because this is how the data is structured inside the var campgrounds array up top, or inside our mongoDB. 
	var newCampground = {name : name, image : image, description : desc};	
	//console.log(newCampground);
	// Adding data from form in the data base use .create
	Campground.create(newCampground,function(err, newlyCampground){
		if(err){
			console.log("Could not load user data");
			console.log(err);
		}
		else{
			//console.log("User Data loaded");
			//console.log(newlyCampground);
			res.redirect("/campgrounds"); 
		}
	});
	
	// this line is not needed // campgrounds.push(newCampground); // add to campgrounds array - we have replaced this with saving the incoming data from the form into the database// 
	
	// redirect to campgrounds
	// res.redirect("/campgrounds"); // the default for redirect to redirect as a GET request // this call is not inside the Campground.create
});


//SHOW route - to show description of each individual campsite

app.get("/campgrounds/:id", function(req,res){
		// find the campground with the id in the req
		Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
				if(err){
					console.log(err);
				}
				else{
					//console.log(foundCampground);
					// render the details of that campground in the Show template
					res.render("campgrounds/show",{campground : foundCampground});
				}
		});
				 
	   });

// =====================
// COMMENTS ROUTES
// =====================


// NEW - directs to page with form for entering comments
app.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req,res){
	//find campground using id 
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		}else{
			// pass the found id to the comments/new ejs file to be rendered. 
			res.render("comments/new", {campground : foundCampground});
		}						
	});	
});

// CREATE - posts data from the form in the above route into the comments DB using .create	
app.post("/campgrounds/:id/comments",isLoggedIn , function(req, res){
	// look up campground using ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {		
			Comment.create(req.body.comments, function(err, comment){
				if(err){
					console.log(err);
				} else {
					foundCampground.comments.push(comment);  
					foundCampground.save();
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
	
	// create new comment 
	// connect new comment to campground being worked with 
	// redirect - campground show page 
});


// =====================
// AUTH ROUTES
// =====================


///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
// REGISTER ROUTES 
// Show Register form
app.get("/register", function(req,res){
	res.render("register");
});
// Handle Sign Up Logic 
app.post("/register", function(req,res){
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
app.get("/login", function(req, res){
	res.render("login");
});
// Handle the the Login logic passport.authenticate is a middleware 
//app.post("/login", middleware, callback// this the structure of this this method for the Login logic 
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req,res){	
});

// LOG OUT Route and logic 
app.get("/logout", function(req, res){
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





// SERVER 
app.listen(3000, function(req,res){
	console.log("The yelpCamp Server is up");
});