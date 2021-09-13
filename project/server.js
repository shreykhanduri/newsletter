require('./models/db');

const express = require('express');
const cors = require('cors');
var fileupload = require("express-fileupload");

const employeeController = require('./controllers/employeeController');

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(fileupload())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(3000, () => {
    console.log('Express server started at port : 3000');
});

app.use('/employee', employeeController);