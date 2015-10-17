/**
* Users.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
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
  }
};

