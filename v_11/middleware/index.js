var Campground = require("../models/campgrounds");
var Comment = require("../models/comments");

// all the middleware goes here 

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next){
	if(req.isAuthenticated()){ // <= this line checks if the User is logged in
	   Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back");
			console.log(err); 
		} else {
				// does user own this campground?
				if(foundCampground.author.id.equals(req.user.id)){
					 next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}	
		}
	}); //if not redirect 
	   } else {
		   req.flash("error","You need to be logged in to do that");
		   res.redirect("back");
		   //res.redirect("/campgrounds");
	   }
		
};


middlewareObj.checkCommentOwnership = function (req, res, next){
	if(req.isAuthenticated()){ // <= this line checks if the User is logged in
	   Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err || !foundComment){
			req.flash("error","Comment not found");
			res.redirect("back");
			console.log(err);
		} else {
				// does user own this comment?
				if(foundComment.author.id.equals(req.user.id)){ //req.user.id comes from passport 
					 next();
				} else {
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}	
		}
	}); //if not redirect 
	   } else {
		   req.flash("error", "You need to be logged in to do that");
		   res.redirect("back");
	   }
	
};	


middlewareObj.isLoggedIn = function (req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","Please kindly login!");
	res.redirect("/login");
};

	
module.exports = middlewareObj;