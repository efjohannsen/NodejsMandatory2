//importerer express library
const express = require("express");
//instancierer express modulet
const app = express();

const jwt = require('jsonwebtoken');
//giver brugere adgang til filerne i mappen public
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: true}))
var cookieParser = require('cookie-parser');
app.use(cookieParser());

const bodyParser = require('body-parser')
app.use(bodyParser.json())

const authLimiter = require("./util/rateLimiter.js");
app.use("/index", authLimiter);

const authRoutes = require("./routes/auth.js");
app.use(authRoutes);

const fs = require('fs');

const indexPage = fs.readFileSync(__dirname + '/public/index/index.html');
const page1 = fs.readFileSync(__dirname + '/public/page1/page1.html');
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html');
const registerPage = fs.readFileSync(__dirname + '/public/register/register.html');

//HTTP request handlers for alle endpoints som vores side skal håndtere
app.get("/index", (req, res) => {
    res.send(indexPage + footerPage);
});

app.get("/register", (req, res) => {
    res.send(registerPage + footerPage);
})

app.get('/page1', authenticateToken, (req, res) => {
    //res.sendFile(__dirname  + "/public/html/page1.html")
    res.send(page1 + footerPage)
})

app.get('/page2', (req, res) => {
    res.sendFile(__dirname  + "/public/html/page2.html")
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