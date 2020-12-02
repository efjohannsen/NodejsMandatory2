//importerer express library
const express = require("express");
//instancierer express modulet
const app = express();
const nodemailer = require('nodemailer');
require('dotenv').config();

const jwt = require('jsonwebtoken');
//giver brugere adgang til filerne i mappen public
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}))
var cookieParser = require('cookie-parser');
app.use(cookieParser());

//tror bodyparser er inkluderet i Express og følder med i URL-encoded
const bodyParser = require('body-parser')
app.use(bodyParser.json())

const authLimiter = require("./util/rateLimiter.js");
app.use("/index", authLimiter);

const authRoutes = require("./routes/auth.js");
app.use(authRoutes);

const contactUs = require('./routes/contactRoute.js');
app.use(contactUs)


const fs = require('fs');

const headerPage = fs.readFileSync(__dirname + '/public/header/header.html').toString();
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html').toString();
const indexPage = fs.readFileSync(__dirname + '/public/index/index.html').toString();
const pageOne = fs.readFileSync(__dirname + '/public/pageOne/pageOne.html').toString();
const registerPage = fs.readFileSync(__dirname + '/public/register/register.html').toString();
const loginPage = fs.readFileSync(__dirname + '/public/login/login.html').toString();
const contactForm = fs.readFileSync(__dirname + '/public/contact/contactForm.html').toString();


//HTTP request handlers for alle endpoints som vores side skal håndtere
app.get("/", (req, res) => {
    return res.send(headerPage + indexPage + footerPage);
});

app.get("/login", (req, res) => {
    return res.send(loginPage);
})

app.get("/register", (req, res) => {
    res.send(registerPage);
})

//page need authorization to access
app.get('/pageOne', authenticateToken, (req, res) => {
    res.send(pageOne);
})

app.get('/contactForm', (req, res) => {
    res.send(contactForm);
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) { return res.sendStatus(401) }
        req.user = user;
        next(); 
    });
    
};



app.get("/*", (req, res) => {
    return res.redirect("/index");
});

//port sættes til 9090 hvis den ikke allerede er defineret i .env
const port = process.env.PORT || 9090;

//portens status skrives til loggen
app.listen(port, (error) => {
    if(error) {
        console.log("Port error: " + error);
    } else {
        console.log(`Server running on port: ${port}`);
    }
});