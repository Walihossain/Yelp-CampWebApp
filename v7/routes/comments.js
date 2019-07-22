var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");


// =====================
// COMMENTS ROUTES
// =====================


// NEW - directs to page with form for entering comments
router.get("/campgrounds/:id/comments/new",isLoggedIn ,function(req,res){
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
router.post("/campgrounds/:id/comments",isLoggedIn , function(req, res){
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

// MIDDLE WARE 
//isLoggedIn - middleware 
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}


module.exports = router;