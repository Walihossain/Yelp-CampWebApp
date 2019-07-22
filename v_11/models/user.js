var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose"); 

// setting up Schemea for taking in user name and password

var userSchema = new mongoose.Schema({
	username: String,
	password: String
}); 

// this line is need for passport local mongoose to take the wheel and create some methods that is added to our User model 
userSchema.plugin(passportLocalMongoose);

// export to app.js file
module.exports = mongoose.model("User", userSchema);


