var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");


// INDEX route
// this route displays everything that is there in the campgrounds array of objects or the MongoDB
router.get("/campgrounds", function(req,res){
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
router.get("/campgrounds/new", function(req,res){
	res.render("campgrounds/new");
});

// CREATE route - which adds new data from the New route (above form route) to the database 
//post route 
router.post("/campgrounds", function(req,res){	
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

router.get("/campgrounds/:id", function(req,res){
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

module.exports = router;
