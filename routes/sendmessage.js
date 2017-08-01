/**
 * Created by nishu on 28/7/17.
 */

var express = require('express');
var mysql = require('mysql');
const fs = require('fs');


exports.SendMessage = function (req, res, next) {

    console.log(req.body)
    var accountSid = 'ACf0f66ceef15628f4f10d547a5363b204';
    var authToken = 'bd8077b7fd9643308cb40adcbfa74aa6';

//require the Twilio module and create a REST client
    var client = require('twilio')(accountSid, authToken);

    client.messages.create({
        to: req.body.phone,
        from: "+14159416552",
        body: req.body.message,
    }, function (err, message) {
        console.log(err);
        if (err != null) {
            res.end("2");
        } else {
            fs.readFile('sendmessage.json', 'utf8', function readFileCallback(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    obj = JSON.parse(data); //now it an object
                    obj.messages_details.push(req.body); //add some data
                    json = JSON.stringify(obj); //convert it back to json
                    fs.writeFile('sendmessage.json', json, 'utf8'); // write it back
                }
            });
            res.end("0")
        }
    });

};
exports.ReadMessage = function (req, res, next) {
    fs.readFile('sendmessage.json', 'utf8', function readFileCallback(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log(data)
            res.end(data)
        }
    });

};



