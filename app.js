//importerer express library
const express = require("express");
//instancierer express modulet
const app = express();
//giver brugere adgang til filerne i mappen public
app.use(express.static("public"));

const authLimiter = require("./util/rateLimiter.js");

app.use("/index", authLimiter);

//HTTP request handlers for alle endpoints som vores side skal håndtere
app.get("/index", (req, res) => {
    return res.sendFile(__dirname + "/public/html/index.html");
});



//redirect HTTP request handler
app.get("/", (req, res) => {
    return res.redirect("/index");
});

app.get("/page1", (req, res) => {
    return res.sendFile(__dirname + "/public/html/page1.html");
});

app.get("/page2", (req, res) => {
    return res.sendFile(__dirname + "/public/html/page2.html");
});

app.get("/page3", (req, res) => {
    return res.sendFile(__dirname + "/public/html/page3.html");
});

app.get("/register", (req, res) => {
    return res.sendFile(__dirname + "/public/html/register.html");
});

app.post("/formtest", (req, res) => {
    return res.send(req.body);
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