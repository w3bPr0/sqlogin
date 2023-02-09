const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');



//create connection
const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'designtime'
});

//connect

db.connect((err) => {
    if (err){
        throw err;
    }
    console.log('MySql Connected...');
});

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("assets"));

// Create database
app.get('/createdb', (req, res) => {
    let cdb = 'CREATE DATABASE designtime';
    db.query(cdb, (err, result) => {
        if (err) throw err;
        console.log(result);
        // res.sendFile('Database created');
        console.log('DB created');
    });
   
    
});


// create database users table
app.get('/createusers', (req, res) => {
    
    let sql = 'CREATE TABLE users (id int AUTO_INCREMENT, username VARCHAR(255), email VARCHAR(255), password VARCHAR(255), PRIMARY KEY (id))';
    db.query(sql, (err) => {
        if (err) throw err;
        console.log('table created');
    });
    
});

// rendering signup page
app.get('/suscribe', (req, res) => {
    res.sendFile(__dirname +'/suscribe.html');
});


// rendering signin page
app.get('/signin', (req, res) => {
    res.sendFile(__dirname +'/signin.html');
});

//signup User
app.post('/suscribe', (req, res) => {
    let post = {username: req.body.UN, email: req.body.em, password: req.body.PW};
    let sql = 'INSERT INTO users SET ?';
    db.query(sql, post, (err, result) => {
        if (err) throw err;
        res.send('Subscription Successful');
    });
});

// Authenticate user 
app.post('/signin', (req, res) => {
    let sql = `SELECT * FROM users WHERE email = '${req.body.em}'`;
    db.query(sql, (err, results) => {
        if (err) throw err;
        
        results.forEach(result => {
        console.log(result.email);
        console.log(result.password);
        console.log(req.body.em);
        console.log(req.body.PW);
            if (result.email === req.body.em && result.password === req.body.PW){
                res.send('Login Successful...');
            } else{
                res.redirect('/signin');
            };
        });
            
    });
});

// connecting to host
app.listen('3000', ()=>{
    console.log('server started on port 3000');
});