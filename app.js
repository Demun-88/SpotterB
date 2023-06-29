require("dotenv").config();
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const app = express();
const https = require("https");
const session = require("express-session");
const passport = require("passport");
const passportlocalmongoose = require("passport-local-mongoose");
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure:false}
}));
const userschema = new mongoose.Schema({
    username: String,
    password: String,
});
let current_user ;
userschema.plugin(passportlocalmongoose);
const usermodel = new mongoose.model("user",userschema);
app.use(passport.initialize());
app.use(passport.session());
passport.use(usermodel.createStrategy());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

const postschema = new mongoose.Schema({
    uname: String,
    content: String
});
const postmodel = new mongoose.model("post",postschema);

app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');
app.get("/",(req,res) => {
    
    res.render("index");
}
);

app.get("/myaccount",async function(req,res) {
    if (req.isAuthenticated())
    {
        const userdata = await postmodel.find({uname:current_user});
        res.render("myaccount",{curr_user:current_user,postdata:userdata});
    }
    else {
        res.redirect("/login");
    }
});

app.post("/delete",async function(req,res){
    const id= req.body.dltid;
    await postmodel.findByIdAndDelete(id);
    res.redirect("/myaccount");
})


app.get("/exercises",function(req,res){
    res.render("exercise");
});
let current_exercise = [];
app.post("/exercises",async function(req,res){
    const url=process.env.URL+"name=" + req.body.name +"&muscle=" + req.body.muscle + "&type=" + req.body.type + "&Difficulty=" + req.body.Difficulty;
    let storage;
    const options = {
        method:'GET',
        headers:{
            'X-api-key':process.env.KEY
        }
    }
    const request = https.request(url, options, function (response) {
        response.on('data', function (data) {
            storage = JSON.parse(data);
            tweet(storage);
        });
    })
    function tweet(data){
        data.forEach((x) => {
            current_exercise.push(x);
        });
        res.render("results",{curr_exercises:data});
        
    }
    request.on("error",function(err){
        console.log(err);
    })
    request.write("");
    request.end();
    
});

app.get("/details/:dest",async function(req,res){
    let details={
        name: 'Standing behind-the-back wrist curl',
        type: 'strength',
        muscle: 'forearms',
        equipment: 'barbell',
        difficulty: 'beginner',
        instructions: "Start by standing straight and holding a barbell behind your glutes at arm's length while using a pronated grip (palms will be facing back away from the glutes) and having your hands shoulder width apart from each other. You should be looking straight forward while your feet are shoulder width apart from each other. This is the starting position. While exhaling, slowly elevate the barbell up by curling your wrist in a semi-circular motion towards the ceiling. Note: Your wrist should be the only body part moving for this exercise. Hold the contraction for a second and lower the barbell back down to the starting position while inhaling. Repeat for the recommended amount of repetitions. When finished, lower the barbell down to the squat rack or the floor by bending the knees. Tip: It is easiest to either pick it up from a squat rack or have a partner hand it to you.  Variations: You can also perform this exercise with dumbbells using the same movements as described above. Another option is to use one dumbbell at a time for better isolation."
      };
    let videodetails;
    let query= "how+to+do+"+req.params.dest;
    if(current_exercise.length>0){
        current_exercise.forEach(function(curr){
        x= curr.name;
        x=x.replaceAll(" ","+").toLowerCase();
        x=x.replaceAll("-","+");
        x=x.replaceAll("/","+");
        if(x==req.params.dest){
            details=curr;
        }
        })
    }
    let url = process.env.G_URL + process.env.G_KEY + "&q=" + query ;
    https.get(url,function(response){
        let chunks = [];
        response.on("data",function(data){
            chunks.push(data);
        })
        response.on("end",function(){
            var result = JSON.parse(Buffer.concat(chunks));
            res.render("details",{details:details,videos:result.items});
        })
    }).on("error",(err) => {
        console.log(err);
    });
});

app.get("/login", function(req,res){
    res.render("login");
});

app.post("/login",function(req,res){
    const user = new usermodel({
        name: req.body.name,
        password: req.body.password,
    })
    req.login(user,function(err,result){
        if(err){
            console.log(err);
            res.redirect("/login");
        }
        else{
            passport.authenticate("local",{failureRedirect:"/login",failureMessage:true})(req,res,function(){
                res.redirect("/gymbros");
            })
        }
    })
});

app.get("/signup",function(req,res){
    res.render("signup");
});
app.post("/signup",function(req,res){
    usermodel.register({username:req.body.username},req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.redirect("/signup");
        }
        else{
            passport.authenticate('local',{failureRedirect:"/signup",failureMessage:true})(req,res,function(){
                res.redirect("/gymbros");
            })
        }
    })
});
app.get("/gymbros",async function(req,res){
    if(req.isAuthenticated()){
        current_user = req.user.username;
        const p = await postmodel.find();
        res.render("gymbros",{curr_user:current_user,postdata:p});
    }
    else{
        res.redirect("/login");
    }
});

app.get("/logout",function(req,res){
    req.logout(function(err,result){
        if(err){
            console.log(err);
            res.redirect("/gymbros");
        }
        else{
            current_user = "";
            res.redirect("/login");
        }
    })
});

app.get("/create",function(req,res){
    if(req.isAuthenticated()){
        res.render("create",{curr_user:current_user});
    }   
    else {
        res.redirect("/login");
    }
});

app.post("/create",async function(req,res){
    const post = new postmodel({
        uname: current_user,
        content: req.body.cnt
    })
    post.save();
    res.redirect("/gymbros");
})
app.listen(process.env.PORT || 3000,() => {console.log("Server is running");});


