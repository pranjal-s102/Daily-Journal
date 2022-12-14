require('dotenv').config();//eNVIROMENT variables
const express=require("express");
const app=express();
const _ =require("lodash");
const ejs = require("ejs");
const bodyParser=require("body-parser");
const port=process.env.PORT||3000||3001;
const mongoose=require("mongoose");
const alert = require('alert');
const nodemailer = require("nodemailer");
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
//mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});
mongoose.connect(process.env.DBLINK,{useNewUrlParser:true});
app.use(express.static(__dirname + '\\public'));


const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Please don't shy away from providing any suggestion/pointing out any bug (`??????????) <br> P.s. Please be gentle with your critcism I'm an emotional person .(???????????????) <br> Thanks!???(?????`)/";





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

app.get("/posts",function(req,res){
  res.redirect("/");
})

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
let day=d[post.dateSince.getDay()]+" "+months[post.dateSince.getMonth()]+" "+post.dateSince.getDate()+", "+post.dateSince.getFullYear()+" | "+post.dateSince.getHours()+":"+post.dateSince.getMinutes();
    res.render("post",{
      title:post.title,
      bodyText: post.content,
      author:post.author,
      dateSince:day
    });
  });
});


app.post("/contactus",function(req,res){
  const name=req.body.user;
  const mail=req.body.userID;
  const message=req.body.mailContent;
  const subject=req.body.mailSubject;

  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASSWORD
  }
});

var mailOptions = {
  from: process.env.MAIL,
  to: process.env.RECEIVER,
  subject: "From "+name+" "+mail+" regarding "+subject,
  text: message
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
res.redirect("/");
});

app.listen(port,function(){
  console.log("Listening at port "+port);
});
