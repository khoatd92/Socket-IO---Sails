/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function(req, res, next) {
  //
  //// User is allowed, proceed to the next policy,
  //// or if this is the last policy, the controller
  //if (req.session.authenticated) {
  //  return next();
  //}
  //
  //// User is not allowed
  //// (default res.forbidden() behavior can be overridden in `config/403.js`)
  //return res.forbidden('You are not permitted to perform this action.');
  var jwt    = require('jsonwebtoken');
  // check header or url parameters or post parameters for token
  var token =   req.param('token') ;
  console.log("token police "+token);
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'kinghandsome', function(err, decoded) {
      if (err) {
        console.log("Failed to authenticate token. ");
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        console.log("verified token ");
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    console.log("No token provided.");
    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};
