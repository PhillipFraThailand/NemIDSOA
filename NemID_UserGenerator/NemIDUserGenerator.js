// Phillip Eismark

// import packages
const { response, json } = require('express');
const sqlite3 = require('sqlite3')
var express = require('express')

//var db = new sqlite3.Database('NemIDUsers.sqlite')
var db = new sqlite3.Database('/Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/NemID_UserGenerator/NemIDUsers.sqlite')

// 8088 is specified by the assignment
const PORT = 8088

// call the express function which returns an express application
var app = express()

// setup express to use json
app.use(express.json());

// index
app.get('/', (req, res) => {
    console.log("NEW REQUEST")
    res.status(200).send({message: "Welcome to the index"});
});

// test
app.get('/test', (req, res) => {
    console.log("NEW REQUEST")
    res.status(200).send({message: "Server is up and running... "});
});
// create response of nemID and statuscode
app.post('/generate-nemId', (req,res) => {  
    console.log("POST on /generate-nemId");
    body = JSON.stringify(req.body);

    idRight = req.body.cpr.slice(7,11);
    idLeft = generateRandom(1000,9999);
    
    let response = {
        "nemId": idRight + idLeft
    }

    console.log('sending response: ', response)
    res.status(201).send(response);
});

// create, update, delete, list all, list one by id (gender)
// crud for users and gender change code to created and not 200 which is just ok
app.post('/create-user', (req, res) => {
    console.log(req);
    let data = req.body;
    let query = "INSERT INTO User(Email, Cpr, NemId, GenderId) VALUES(?,?,?,?)"
    db.run(query,[data.Email, data.Cpr, data.NemId, data.GenderId], (err) => {
        if (err){
            console.log(err)
        }
    });
    return res.status(201).send({"Response":"OK Creating..."})
});

//expects column to update, value to set column to, identifier, identifier value
// CRUD for User
app.patch('/update-user', (req, res) => {
    let data = req.body;
    let query = `UPDATE User SET ${data.Column} = "${data.Value}" WHERE ${data.Identifier}="${data.IdentifierValue}"`;
    db.run(query, (err) => {
        if (err){
            console.log(err)
            console.log(query)
        }
    });
    return res.status(202).send({'Response': 'OK Updating...'})
});

app.delete('/delete-user', (req,res) => {
    let data = req.body;
    let query = `DELETE FROM User WHERE ${data.Identifier} = ${data.IdentifierValue}`
    db.run(query, (err) => {
        if (err) {
            console.log(err);
        }
        return res.status(202).send({"Response": "OK Deleting..."})
    });
});

app.get('/get-user', (req,res) => {
    let data = req.body;
    let query = `SELECT * FROM User WHERE ${data.Identifier}=${data.IdentifierValue}`;
    db.each(query, (err, row) => {
        if (err) {
            console.log(err);
        } else {
            return res.status(200).send(row)
        }
    });
});

app.get('/get-users', async (req, res) => {
    let data = req.body;
    let query = "SELECT * FROM User";
    console.log(data);
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
            return res.status(200).send(rows)
        }
    });
});

//next task is to create a gender label with id's 
//  1 for male, 2 female, 3 binary
// then we need to update all users to have a 1 or 2 or 3 for genderId
// CRUD for Gender

// start the server
app.listen(PORT, (err) => {
    if(err){
        console.log(err)
        return;
    }
    console.log('Listening on port: ', PORT )
});

// generate random numbers and round it off
function generateRandom (min, max) {
    return Math.floor (
        Math.random() * (max - min) + min
        )
}
// node /Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/NemID_UserGenerator/NemIDUserGenerator.js
// nodemon /Users/phillipeismark/Documents/SystemIntegration/si_mandatory_assignment_1/NemID_UserGenerator/NemIDUserGenerator.js