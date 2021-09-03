//jshint esversion:6
require('dotenv').config()

const express = require("express")
const ejs = require("ejs")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const encrypt = require('mongoose-encryption');
port = 3000

const app = express()

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))
app.set('view engine', 'ejs');

console.log(process.env.API_KEY);
console.log(process.env.SECRET);

app.get("/", function(req, res){
    res.render("home")
    // res.render('index', {foo: 'FOO'});  
})

app.get("/login", function(req, res){
    res.render("login")
})

app.get("/register", function(req, res){
    res.render("register")
})

app.post("/register", function(req, res){

    const newUser = new User({ 
        email: req.body.username,
        password: req.body.password 
    });

    newUser.save(function(error) {
        if(error){
            console.log(error);
        }else{
            res.render("secrets")
            // console.log("New User Registered");
        }
    })
})

app.post("/login", function(req, res) {
    const username = req.body.username
    const password = req.body.password
    
    User.findOne({email: username}, function(error, foundUser) {
        if(error){
            console.log(error);
        }else{
            if(foundUser){
                if(foundUser.password == password){
                    res.render("secrets")
                }
            }            
        }
    })
    
})

// app.get('/users/:userId', function (req, res) {
//     res.send(req.params)
// })

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
    email: String,
    password: String
})

// const secret = process.env.SOME_LONG_UNGUESSABLE_STRING;

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = mongoose.model('User', userSchema);


app.listen(port, function(){
    console.log(`App listening at http://localhost:${port}`)
})

