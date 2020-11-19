//importerer express library
const express = require("express");
//instancierer express modulet
const app = express();
//giver brugere adgang til filerne i mappen public
app.use(express.static("public"));

//HTTP request handlers for alle endpoints som vores side skal håndtere.
app.get("/index", (req, res) => {
    return res.sendFile(__dirname + "/public/html/index.html");
});

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

const port = process.env.PORT || 9090; 

app.listen(port, (error) => {
    if(error){
        console.log("Port error: " + error);
    }
    else{
        console.log(`Server running on port: ${port}`);
    }
});