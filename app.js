const express = require("express");
const app = express(); 

app.use(express.static("public"));



app.get("/index", (req, res) => {
    return res.sendFile(__dirname + "/public/html/index.html");
});




const port = process.env.PORT || 9090; 

app.listen(port, (error) => {
    if(error){
        console.log("Port error: " + error);
    }
    else{
        console.log(`Server running on port: ${port}`);
    }
})