const bodyparser = require("body-parser"),
	  mongoose = require("mongoose"),
	  expressSanitizer = require("express-sanitizer"),
      express = require("express"),
	  app = express(),
      methodOverride = require("method-override");
// mongoose.connect('mongodb://localhost:27017/restful-blog-app', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// });
//App setup
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(expressSanitizer());//always goes after bodyparser.
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
//mongoose/model/config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date ,default: Date.now}
});

const Blog = mongoose.model("Blog",blogSchema);

//Restful Routes

app.get("/", (req, res)=>{
	res.redirect("/blogs");
});
// Index Route
app.get("/blogs",(req, res)=>{
	Blog.find({},(err,blogs)=>{
		if(err){
			console.log("Error!!")
		} else {
			res.render("index" ,{blogs: blogs})
		}
	});
	});
//New Route
app.get("/blogs/new",(req,res)=>{
	res.render("new");
})
//Create Route.

app.post("/blogs",(req,res)=>{
	req.body.blog.body = req.sanitize(req.body.blog.body);
	//Creat blog
	Blog.create(req.body.blog ,(err,newBlog)=>{
		if(err){
			res.render("new");
		}else{
	//then, redirect to the index
			res.redirect("/blogs");
		}
	})
});
//Show Route
app.get("/blogs/:id", (req, res)=>{
	Blog.findById(req.params.id, (err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("show",{blog:foundBlog})
		}
	})
});
//Edit Route
app.get("/blogs/:id/edit",(req,res)=>{
	Blog.findById(req.params.id, (err,foundBlog)=>{
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("edit",{blog: foundBlog})
		}
		 })
});
//Update Route
app.put("/blogs/:id",(req,res)=>{
	
	
	Blog.findByIdAndUpdate(req.params.id,req.body.blog, (err,UpdatedBlog)=>{
		if(err){
			res.redirect("/blogs")
		}else {
			res.redirect("/blogs/" + req.params.id);
		}
	})
	
});
//Destroy Route
app.delete("/blogs/:id",(req,res)=>{
	// destroy blog
	Blog.findByIdAndRemove(req.params.id,(err)=>{
		if(err){
			res.redirect("/blogs")
		}else {
			res.redirect("/blogs")
		}
	})
	
});
//For heroku
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is listening!!!"); 
});
//Tell Express to listen for requests(start server)
app.listen(3000, ()=> { 
  console.log('The YelpCamp Server has Started!');
});