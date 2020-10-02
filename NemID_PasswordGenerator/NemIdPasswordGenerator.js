// Steffen And Pratima
const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.json());

app.post('/generate-password-nemID', (req, res) =>{
    console.log("nemId: " + req.body.nemId);
    console.log("CPR: " + req.body.cpr);

    firstValue = req.body.nemId.slice(0,2);
    lastValue = req.body.cpr.slice(1,3);
    let generatedCode = {
        "nemIdPassword": firstValue+lastValue
    };

    console.log("Generated code: " + generatedCode)
    res.status(200).send(generatedCode);
});



//Test that server is up and running
app.get('/test', (req, res) => {
    res.status(200).send({ message: "Server is running just fine on port 8089... " })
});

app.listen(8089, (err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("Listening on port 8089");
    }
});


// nodemon /Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/NemID_PasswordGenerator/NemIdPasswordGenerator.js