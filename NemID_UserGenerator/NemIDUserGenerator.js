// Phillip Eismark

// import packages
const { response } = require('express');
var express = require('express')

// 8088 is specified by the assignment
const PORT = 8088

// call the express function which returns an express application
var app = express()

// setup express to use json
app.use(express.json());

// index
app.get('/', (req, res) => {
    console.log("***** NEW REQUEST *****")
    res.status(200).send({message: "Welcome to the index"});
});

// test
app.get('/test', (req, res) => {
    console.log(req)
    res.status(200).send({message: "Server is up and running... "});
});

// send back a nemId from last 4 of cpr and 4 random numbers
app.post('/generate-nemId', (req,res) => {  
    console.log("***** NEW REQUEST *****")
    body = JSON.stringify(req.body);
    console.log("recieved POST on /generate-nemId");

    idRight = req.body.cpr.slice(7,11);
    idLeft = generateRandom(1000,9999);

    let response = {
        "nemId": idRight + idLeft
    }

    console.log('sending response: ', response)
    res.status(201).send(response);
});

// start the server
app.listen(PORT, (err) => {
    if(err){
        console.log(err)
        return;
    }
    console.log('Listening on port: ', PORT )
});

// function to generate random numbers and round it off
function generateRandom (min, max) {
    return Math.floor (
        Math.random() * (max - min) + min
        )
}

// To run i need the absolute path for some reason. Also even if PWD shows the exact same path it will not work without it.
// node /Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/NemID_UserGenerator/NemIDUserGenerator.js
// nodemon /Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/NemID_UserGenerator/NemIDUserGenerator.js
