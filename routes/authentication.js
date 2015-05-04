var mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	Schema = mongoose.Schema;

var secret = 'holy cow';

exports.authenticate = function (req, res) {
	// To Do: Authenticate username and password
	// If invalid return a proper 401 error
	if(!(req.body.email === 'colin' && req.body.password === 'password')){
		res.send(401, 'Not a valid email and password: ' + req.body.email + ' and ' + req.body.password);
		return;
	}
	
	var profile = {
		first_name: 'Colin',
		last_name: 'Barnes',
		email: 'colin.h.t.barnes@gmail.com'
	};

	var token = jwt.sign(profile, secret, {expiresInMintes: 60*5});
	res.send({token: token});
};