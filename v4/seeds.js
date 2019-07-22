var mongoose = require("mongoose"); 
var Campground = require("./models/campgrounds.js");
var Comment = require("./models/comments.js");

var data = 
	[
		{ 		
		 	name: "Kilimanjaro", 
			image: "http://www.tmb.ie/wp/wp-content/uploads/2015/07/How-to-prepare-for-Kilimanjaro.jpg",
			description: "In Tanzania - highest peak in Africa"
		},
		{ 		
		 	name: "Fuji", 
			image: "https://media-cdn.tripadvisor.com/media/photo-s/15/e8/48/79/1-day-mt-fuji-bus-tour.jpg",
			description: "In Japan - dormant volacno "
		},
		{ 		
		 	name: "K2", 
			image: "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2018/07/07/Photos/Processed/thinair1-kIRG--621x414@LiveMint.jpg",
			description: "In Pakistan - second tallest in the world"
		}
];


function seedDB(){
	//Remove all campgrounds 
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
			console.log("removed campgrounds");
	// Add a few campgrounds 
	for (var i =0; i<data.length; i++){
		Campground.create(data[i], function(err, campground){
			if(err){
				console.log(err);
			} else {
				console.log("added a campground");
				//create a comment
				Comment.create({
					text:"It very cold up there, wisha I brought more jackets",
					author: "Tony Stark"
				}, function(err,comment){
					if(err){
						console.log(err);
					}
					else {
						campground.comments.push(comment);	
						campground.save();
						console.log("Created New Comment");
					}
					
					
				});
				
			}
		});
	}

	});
}
							  
module.exports = seedDB;
