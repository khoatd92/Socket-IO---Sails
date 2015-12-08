/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var app = require('express')();
var keyGenerateToken = 'kinghandsome';
app.use(morgan('dev'));

var MainController = {

  index: function (req, res) {
    res.view();
  },

  signup: function (req, res) {
    var phoneNumber = req.param("phoneNumber");
    var password = req.param("password");
    console.log("start signup: phone number " + phoneNumber + "--password: " + password);
    Users.findOne({phoneNumber: phoneNumber}).exec(function (err, result) {
      if (err) {
        res.send(500, {error: "DB Error"});
      } else if (result) {
        res.send(404, {error: "phone number already Taken"});
      } else {
        var hasher = require("password-hash");
        password = hasher.generate(password);
        console.log("create user");
        var token = jwt.sign(phoneNumber, keyGenerateToken, {
          expiresIn: 1440 // expires in 24 hours
        });
        Users.create({
          phoneNumber: phoneNumber,
          password: password,
          token: token,
          activeTimestamp: +new Date()
        }).exec(function (error, user) {
          if (error) {
            res.send(500, {error: "DB Error"});
          } else {
            console.log('return result signup ')
            res.send(200, user);
          }
        });
      }
    });
  },
  login: function (req, res) {
    var phonenumber = req.param("phoneNumber");
    var password = req.param("password");
    console.log("start login function : phonenumber " + phonenumber + "- password " + password);
    Users.findOne({phoneNumber: phonenumber}).exec(function (err, result) {
      console.log("Result login " + result);
      if (err) {
        res.send(500, {error: "DB Error"});
      } else {
        if (result) {
          var hasher = require("password-hash");
          if (hasher.verify(password, result.password)) {
            res.send(result);
          } else {
            res.send(400, {error: "Wrong Password"});
          }
        } else {
          res.send(404, {error: "User not Found"});
        }
      }
    });
  },

  chat: function (req, res) {
    var data_from_client = req.params.all();
    console.log("chat function req.method  "+req.method );
    console.log("chat function "+data_from_client.phoneNumber);
    if(req.isSocket && req.method === 'POST'){
      console.log("This is the message from connected client So add new conversation");
    } else if(req.isSocket){
      console.log("subscribe client to model changes");
    }
  },

  synccontact: function (req, res) {
    console.log("sync contact start");
    var arrayPhoneNumber = req.param("listphonenumber");
    var phoneNumber = req.param("phoneNumber");
    console.log("sycn contact : list phone number " + arrayPhoneNumber);
    var phoneNumberActive = [];
    async.forEach(arrayPhoneNumber, function (item, callback) {
      console.log('sycn contact search phone number ' + item);
      Users.findOne({phoneNumber: item}).exec(function (err, result) {
        if (err) {
          console.log("DB Error " + item);
          return callback("DB Error ");
        } else {
          if (result) {
            Users.subscribe(result.socketId, result.phoneNumber);
            phoneNumberActive.push(item);
            console.log("sycn contact User Found " + item);
          } else {
            console.log("sycn contact User not Found " + item);
          }
          callback();
        }
      });
    }, function (err) {
      console.log('Processed finish ' + phoneNumberActive);
      if (err) {
        console.error(err.message);
      } else {
        Users.update({phoneNumber: phoneNumber}, {listFriendByPhoneNumber: phoneNumberActive}).exec(function afterwards(err, updated) {
          if (err) {
            return;
          }
          console.log('Add phone number after sync');
        });
        res.send(phoneNumberActive);
        console.log('Processed successfully');
      }
    });
  }
};
module.exports = MainController;




