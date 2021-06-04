var bodyParser = require("body-parser"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer"),
mongoose       = require("mongoose"),
express        = require("express"),
app            = express();

// APP 
mongoose.connect('mongodb+srv://rgtech:KtuWP5YbG2MUNpdl@cluster0.tuitl.mongodb.net/covid19?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});

// mongoose.connect('mongodb://localhost:27017/IET_COVID_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var contactSchema = new mongoose.Schema({
	name:String,
	email:String,
	message:String
});

var Contact=mongoose.model("Contact",contactSchema);
var Blog = mongoose.model("Blog", blogSchema);

	




app.get("/", function(req, res){
   res.render("landing");
});

// INDEX
app.get("/blogs", function(req, res){
   Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR!");
       } else {
          res.render("index", {blogs: blogs}); 
       }
   });
});

// NEW
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// CREATE 
app.post("/blogs", function(req, res){
    // create blog
    console.log(req.body);
	req.body.blog.body = req.sanitize(req.body.blog.body)
    console.log("===========")
    console.log(req.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        } else {
            //then, redirect to the index
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, foundBlog){
       if(err){
           res.redirect("/blogs");
       } else {
           res.render("show", {blog: foundBlog});
       }
   })
});

// EDIT
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
})


// UPDATE 
app.put("/blogs/:id", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body)
   Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
      if(err){
          res.redirect("/blogs");
      }  else {
          res.redirect("/blogs/" + req.params.id);
      }
   });
});

app.delete("/blogs/:id", function(req, res){
   Blog.findById(req.params.id, function(err, blog){
       if(err){
           console.log(err);
       } else {
           blog.remove();
           res.redirect("/blogs");
       }
   }); 
});

app.get("/cases",function(req,res){
	res.render("cases");
});

app.get("/help",function(req,res){
	res.render("contact");
})

app.post("/help",function(req,res){
	console.log(req.body);
	Contact.create(req.body.contact,function(err){
		if(err){
			console.log(err);
			res.redirect("/help");
		}else{
			res.redirect("/blogs")
		}
	})
})

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("IET");
});

// app.listen(3000,function(){
// 	console.log("IET");
// });
