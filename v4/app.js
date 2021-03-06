var express 	= require("express");
var app 	    = express();

// connected to seeds.js file - check out video 323 and 324
var seedDB = require("./seeds.js");
//seedDB();

// line 5 and line 6 is needed when we use POST request and try to extact data from a form of that post request
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));

// Connecting to MongoDB
var mongoose    = require("mongoose"); // added as part of intalling mongoose and connecting to MongoDB for yelpcamp
mongoose.connect('mongodb://localhost:27017/yelp_camp_v5', { useNewUrlParser: true }); // this creates yelpcamp database in MongoDB 

// importing Camground Schema in the models folder using module.exports =  
var Campground = require("./models/campgrounds.js");

// importing comment Schema in the models folder using module.exortes
var Comment = require("./models/comments.js");


app.set("view engine", "ejs");


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
				res.render("campgrounds/index", {campgrounds : allcampgrounds});
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
app.get("/campgrounds/:id/comments/new",function(req,res){
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
app.post("/campgrounds/:id/comments", function(req, res){
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




app.listen(3000, function(req,res){
	console.log("The yelpCamp Server is up");
});