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

const fs = require('fs');

const indexPage = fs.readFileSync(__dirname + '/public/index/index.html').toString();
const page1 = fs.readFileSync(__dirname + '/public/page1/page1.html').toString();
const footerPage = fs.readFileSync(__dirname + '/public/footer/footer.html').toString();
const registerPage = fs.readFileSync(__dirname + '/public/register/register.html').toString();
const sendEmailpage = fs.readFileSync(__dirname + '/public/sendEmail/sendEmail.html').toString();
//const navigationBar = fs.readFileSync(__dirname + '/public/navigation/nav.html');

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

app.get('/sendEmail', authenticateToken, (req, res) => {
    res.send(sendEmailpage + footerPage);
})
/*
app.get('/navigation', (req, res) => {
    res.send(navigationBar);
})
*/

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
//Maybe move into seperate file?
app.post('/send', async(req, res) => {
    const getEmail = req.body.email;
    const getSubject = req.body.subject;    
    const getContent = req.body.content; 

    const output = `
        <h3>Contact Information</h3>
        <ul>
            <li>From: ${req.body.email}</li>
            <li>Name: ${req.body.name}</li>
            <li>Subject: ${req.body.subject}</li>
        </ul>
        <h3>Content</h3>
        <p>${req.body.content}</p>
        `;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'gmail',
        secure: false, 
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }, 
        tls: {
            rejectUnauthorized:false
        }
    });

    const mailOptions = {
        from: getEmail,
        to: process.env.EMAIL,
        subject: getSubject, 
        content: getContent,
        html: output
    };

    transporter.sendMail(mailOptions, (err, data) => {
        if(err){
            console.log(`Error: ${err}`);
            res.status(401).send();
        } else {
            res.status(200).send('Email sent');
        }
    });

    console.log(req.body);
});

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