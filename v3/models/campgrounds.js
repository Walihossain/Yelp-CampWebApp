var mongoose = require("mongoose");

//Setting up SCHEMA and compiling model
var campgroundSchema = new mongoose.Schema({
	name : String,
	image: String,
	description: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"   
		}
	]
}); 

// Compiling Model
module.exports = mongoose.model("Campground", campgroundSchema);
