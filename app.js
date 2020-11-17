const express = require('express');
const app = express(); 




const port = process.env.PORT || 9090; 

app.listen(port, (error) => {
    if(error){
        console.log('Port error: ' + error);
    }
    else{
        console.log('Server running on port: ' + Number(port));
    }
})