const express=require("express");
const app=express();
const _ =require("lodash");
const ejs = require("ejs");
const bodyParser=require("body-parser");
const port=process.env.PORT||3000;
const mongoose=require("mongoose");
//const popup = require('popups');
const alert = require('alert');
const postSchema={
    title:{
      type:String,
      unique:true,
      dropDups:true
    },
    content:String,
    author:String,
    dateSince:Date
};
const Post = mongoose.model("Post",postSchema);


app.use(bodyParser.urlencoded({extended:true}))
app.set('view engine','ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
app.use(express.static(__dirname + '\\public'));


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";





app.get("/",function(req,res){
  Post.find({},function(err,posts){
    res.render("home",{
    bodyText:homeStartingContent,
    posts:posts
  });
});
});


app.get("/about",function(req,res){
  res.render("about",{bodyText:aboutContent});
});

app.get("/contact",function(req,res){
  res.render("contact",{bodyText:contactContent});
});

app.get("/compose",function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res)
{
  let titleArea=_.capitalize(req.body.composeTitle);
  let textArea=req.body.composeText;
  let titleAuthor=req.body.composingAuthor;
  const date=new Date();
  const post = new Post({
    title:titleArea,
    content:textArea,
    author:titleAuthor,
    dateSince:date
  });
console.log(titleAuthor);
  post.save(function(err){
    if(!err)
    {
      res.redirect("/");
    }
    else{
      alert("Please enter a unique title");
      console.log("Please enter a unique title");
      res.redirect("/compose");
    }
  });

  //posts.push(post);
});


app.get("/posts/:postName",function(req,res){
  //takes care of the kababcase or lower upper case issues
  const requestedPostId = _.capitalize(req.params.postName);
  //const requestedPostId = _.capitalize(req.params.postName);
  const date=new Date();
  console.log(requestedPostId);
  Post.findOne({title:requestedPostId},function(err,post){
    //console.log("Found"+post.dateSince);
    const months = ["Jan", "Feb", "Mar", "April", "May", "Jun", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const d = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day=d[post.dateSince.getDay()]+" "+months[post.dateSince.getDate()]+" "+post.dateSince.getDay()+", "+post.dateSince.getFullYear()+" | "+post.dateSince.getHours()+":"+post.dateSince.getMinutes();
    res.render("post",{
      title:post.title,
      bodyText: post.content,
      author:post.author,
      dateSince:day
    });
  });
});


app.listen(port,function(){
  console.log("Listening at port "+port);
});
