var express = require("express");
var router = express.Router();
var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");
var middleware = require("../middleware");


// =====================
// COMMENTS ROUTES
// =====================

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// NEW - directs to page with form for entering comments

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn ,function(req,res){
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

router.post("/campgrounds/:id/comments", middleware.isLoggedIn , function(req, res){
	// look up campground using ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error","Something went wrong");
			console.log(err);
			res.redirect("/campgrounds");
		} else {		
			Comment.create(req.body.comments, function(err, comment){
				if(err){
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//Save comment 
					comment.save();
					foundCampground.comments.push(comment);  
					foundCampground.save();
					//console.log(comment);
					req.flash("success","Successfully added comment!");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
	
	// create new comment 
	// connect new comment to campground being worked with 
	// redirect - campground show page 
});


//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// EDIT route 

router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			req.flash("error", "Campground not found");
			res.redirect("back");
		}
		Comment.findById(req.params.comment_id, function(err, foundComment){
				if(err){
					res.redirect("back");
				} else {
					res.render("comments/edit", {campground_id : req.params.id, comment: foundComment });	//try using Campground.findbyId along with this code
					// console.log(req.params.id);
					// console.log("Break");
					// console.log(foundComment);
				}
		});	
	});		
});

// UPDATE route 

router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comments, function(err, updatedComment){
			if(err){
				res.redirect("back");
			}
			else {
				res.redirect("/campgrounds/"+req.params.id);
			}
		});	
	});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//DESTROY Route 

router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res){
	 Comment.findByIdAndRemove(req.params.comment_id, function(err){
	 	if(err){
	 		console.log(err);
	 	} else {
			req.flash("success","Comment deleted!");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

module.exports = router;