/**
 * MainController
 *
 * @description :: Server-side logic for managing mains
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
//User.findOne({name:'Jessie'}).exec(function findOneCB(err, found){
//console.log('We found '+found.name);
//});
/*
 phoneNumber: 'STRING',
 password: 'STRING',
 socketId: 'STRING',
 token: 'STRING',
 activeTimestamp: 'STRING',
 displayName: 'STRING',
 password: 'STRING',
 phoneNumber: 'STRING',
 lastLoginTimestamp: 'STRING',
 status: 'STRING',
 userStatus:'STRING',
 profilePhotoURL:'STRING'
 */

/*
 status code
 500: db error
 400: username already taken or wrong password
 404: user not found
 */
var MainController = {
  index: function (req, res) {
    res.view();
  },
  signup: function (req, res) {
    var phonenumber = req.param("phonenumber");
    var password = req.param("password");
    console.log("start signup: phone number " + phonenumber + "--password: " + password);
    Users.findOne({phoneNumber: phonenumber}).exec(function (err, result) {
      console.log("Result signup " + result);
      if (err) {
        res.send(500, {error: "DB Error"});
      } else if (result) {
        res.send(400, {error: "phone number already Taken"});
      } else {
        var hasher = require("password-hash");
        password = hasher.generate(password);
        console.log("create user");
        Users.create({phoneNumber: phonenumber, password: password}).exec(function (error, result) {
          if (error) {
            res.send(500, {error: "DB Error"});
          } else {
            req.session.result = result;
            res.send(result);
          }
        });
      }
    });
  },
  login: function (req, res) {
    var phonenumber = req.param("phonenumber");
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

  },

  synccontact: function (req, res) {
    console.log("sync contact start");
    var arrayPhoneNumber = req.param("listphonenumber");
    console.log("sycn contact : list phone number " + arrayPhoneNumber);
    var phoneNumberActive = [];
    async.forEach(arrayPhoneNumber, function(item, callback) {
      console.log('sycn contact search phone number ' + item);
      Users.findOne({phoneNumber: item}).exec(function (err, result) {
        if (err) {
          console.log("DB Error " + item);
          return callback("DB Error ");
        } else {
          if (result) {
            phoneNumberActive.push(item);
            console.log("sycn contact User Found " + item);
          } else {
            console.log("sycn contact User not Found " + item);
          }
          callback();
        }
      });
    }, function(err){
      console.log('Processed finish '+phoneNumberActive);
      if( err ) {
        console.error(err.message);
      } else {
        res.send(phoneNumberActive);
        console.log('Processed successfully');
      }
    });
  }
};
module.exports = MainController;




