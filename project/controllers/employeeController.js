const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Employee = mongoose.model('Employee');
const csv = require('csvtojson');
const { publishMessage } = require('./emailWorker')
const { consumeMessage } = require('./emailWorker')

router.post('/add', (req, res) => {
    insertRecord(req, res);
});

function insertRecord(req, res) {
    var employee = new Employee();
    employee.firstName = req.body.firstName;
    employee.email = req.body.email;
    employee.lastName = req.body.lastName;
    employee.age = req.body.age;
    Employee.find({ email: req.body.email }, function (err, docs) {
        if (docs.length) {
            res.status(200).json({ message: "Email-id already registered" });
        } else {
            employee.save((err, doc) => {
                if (!err)
                    res.status(200).json({ message: "User Added successfully" });
                else {
                    res.status(200).json({ message: err.message });
                    console.log('Error during record insertion : ' + err);
                }
            });
        }
    })
}

router.post('/newsletterpublish', (req, res) => {

    csvData = req.files.users.data.toString('utf8');
    csv()
        .fromString(csvData)
        .then(function (jsonArrayObj) {
            console.log(jsonArrayObj);

            for (let index = 0; index < jsonArrayObj.length; index++) {
                Employee.find({ email: jsonArrayObj[index].email }, function (err, docs) {
                    //Mail will be queued for only ids that are added
                    if (docs.length) {
                        let bodydata = docs[0].firstName + ' ' + docs[0].lastName + ' ' + jsonArrayObj[index].content;
                        const emailOptions = {
                            mail: jsonArrayObj[index].email,
                            subject: jsonArrayObj[index].name,
                            text: bodydata
                        }
                        // call rabbitmq service to app mail to queue
                        publishMessage(emailOptions);
                    }
                })
            }
            //Add consume method here to send emails directly without api
        })
    return res.status(202).send({
        message: 'Email Added to Queue'
    })
});

router.post('/newsletterconsume', (req, res) => {
    consumeMessage();
    return res.status(202).send({
        message: 'Email Consumed from Queue'
    })
})

module.exports = router;