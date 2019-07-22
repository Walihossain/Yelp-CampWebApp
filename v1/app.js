var express = require("express");
var app = express();

// line 5 and line 6 is needed when we use POST request and try to extact data from a form of that post request
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended : true}));

// temporarily keeping to avoid scoping issue
var campgrounds = 
		[
		{name : "Fish Tail", image:"https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732d72d1934bcd5f_340.jpg"},
		{name : "Everest", image:"https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732d72d1934bcd5f_340.jpg"},
		{name : "K2", image:"https://pixabay.com/get/54e6d0434957a514f6da8c7dda793f7f1636dfe2564c704c732d73dc974ac55c_340.jpg"},
		{name : "Fish Tail", image:"https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732d72d1934bcd5f_340.jpg"},
		{name : "Everest", image:"https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732d72d1934bcd5f_340.jpg"},
		{name : "K2", image:"https://pixabay.com/get/54e6d0434957a514f6da8c7dda793f7f1636dfe2564c704c732d73dc974ac55c_340.jpg"},
		{name : "Fish Tail", image:"https://pixabay.com/get/57e2d54b4852ad14f6da8c7dda793f7f1636dfe2564c704c732d72d1934bcd5f_340.jpg"},
		{name : "Everest", image:"https://pixabay.com/get/57e1dd4a4350a514f6da8c7dda793f7f1636dfe2564c704c732d72d1934bcd5f_340.jpg"},
		{name : "K2", image:"https://pixabay.com/get/54e6d0434957a514f6da8c7dda793f7f1636dfe2564c704c732d73dc974ac55c_340.jpg"}
		];

app.set("view engine", "ejs");

app.get("/", function(req,res){
	res.render("landing");
});

// this route displays everything that is there in the campgrounds array of objects
app.get("/campgrounds", function(req,res){
	// var campgrounds = 
	// 	[
	// 	{name : "Fish Tail", image:"https://steemitimages.com/DQmdW1MXXUSU7auV5cBziaU377Ucx1vEQxEaKzVy6mchpz4/image.png"},
	// 	{name : "Everest", image:"https://cdn.britannica.com/s:500x350/17/83817-004-C5DB59F8.jpg"},
	// 	{name : "K2", image:"https://www.telegraph.co.uk/content/dam/Travel/ski/K2-mountain-Andrzej-Bargiel-first-ski-descent-by-Piotr-Pawlus-Red-Bull-Content-			Pool.jpg?imwidth=450"}
	// 	];
	res.render("campgrounds", {campgrounds : campgrounds});
	
});


//post route 
app.post("/campgrounds", function(req,res){	
	//get data from form
	var name = req.body.name;
	var image = req.body.image;
	// creating an object of name and image, because this is how the data is structured inside the var campgrounds array up top. 
	var newCampground = {name : name, image : image};	
	// add to campgrounds array
	campgrounds.push(newCampground);
	// redirect to campgrounds
	res.redirect("/campgrounds"); // the default for redirect to redirect as a GET request
});

// this the route for the form, the for is directed to hit the post route above, 
app.get("/campgrounds/new", function(req,res){
	res.render("new.ejs");
});


app.listen(3000, function(req,res){
	console.log("The yelpCamp Server is up");
});