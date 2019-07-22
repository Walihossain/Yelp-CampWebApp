var mongoose = require("mongoose"); 
var Campground = require("./models/campgrounds.js");
var Comment = require("./models/comments.js");

var data = 
	[
		{ 		
		 	name: "Kilimanjaro", 
			image: "http://www.tmb.ie/wp/wp-content/uploads/2015/07/How-to-prepare-for-Kilimanjaro.jpg",
			description: "Mountain mountain mountain camping, camping mountain camping camping camping camping. Mountain camping camping camping camping, 					mountain camping camping mountain camping mountain camping. Mountain mountain camping camping mountain camping camping, camping camping camping 				camping camping mountain camping."
		},
		{ 		
		 	name: "Fuji", 
			image: "https://media-cdn.tripadvisor.com/media/photo-s/15/e8/48/79/1-day-mt-fuji-bus-tour.jpg",
			description: " You yourself fought the decadence of Gotham for years with all your strength, all your resources, all your moral authority. And the  			only victory you achieved was a lie. Now, you understand? Gotham is beyond saving and must be allowed to die.Oh, hee-hee, aha. Ha, ooh, hee,            		 ha-ha, ha-ha. And I thought my jokes were bad."
		},
		{ 		
		 	name: "K2", 
			image: "https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2018/07/07/Photos/Processed/thinair1-kIRG--621x414@LiveMint.jpg",
			description: "Trails are drying out quickly. Out here you will find the most legal features including log rides, jumps and rock rolls in South Tahoe 				including the new jumps, berms, rollers and hips TAMBA and SBTS built in 2014. It is steep. This trail ends at the intersection of Middle Earth. 				Great views over the valley."
		}
];


function seedDB(){
	//Remove all campgrounds 
	Campground.remove({}, function(err){
		if(err){
			console.log(err);
		}
			console.log("removed campgrounds");
	// // Add a few campgrounds 
	// for (var i =0; i<data.length; i++){
	// 	Campground.create(data[i], function(err, campground){
	// 		if(err){
	// 			console.log(err);
	// 		} else {
	// 			console.log("added a campground");
	// 			//create a comment
	// 			Comment.create({
	// 				text:"It very cold up there, wisha I brought more jackets",
	// 				author: "Tony Stark"
	// 			}, function(err,comment){
	// 				if(err){
	// 					console.log(err);
	// 				}
	// 				else {
	// 					campground.comments.push(comment);	
	// 					campground.save();
	// 					console.log("Created New Comment");
	// 				}
					
					
	// 			});
				
	// 		}
	// 	});
	// }

	});
}
							  
module.exports = seedDB;
