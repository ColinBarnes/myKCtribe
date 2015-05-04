var mongoose = require('mongoose'),
	jwt = require('jsonwebtoken'),
	bcrypt = require('bcrypt'),
	nodemailer = require('nodemailer'),
	Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 10,
    secret = 'holy cow';

// User Schema ========================================================================
var userSchema = new Schema({
	first_name: String,
	last_name: String,
	display_name: String, // default to First and Last name
	phone_number: String,
	email: { type: String, required: true, index: { unique: true } },
	password: {type: String, required: true },
	best_contact: String, // preferred method of contact
	address: String, // street address not including city, state, zip
	city: String,
	state: String,
	zip: String,

});

// Email Setup ========================================================================

var smtpTransport  = nodemailer.createTransport("Mandrill",{
	auth: {
		user: "craigbjorndesigns+mandrill@gmail.com",
		pass: "qEyOmyZPJM6oAANVZL_fPw"
	}
});

// Route Methods ======================================================================

/*
 * Middleware and compare function from http://devsmash.com/blog/password-authentication-with-mongoose-and-bcrypt
 */

// Middleware to automatically hash the password on save 
userSchema.pre('save', function(next) {
    var user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // Hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // Override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callBack) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return callBack(err);
        callBack(null, isMatch);
    });
};

// Return the fields that any logged in user should be able to see
userSchema.methods.getPublicFields = function () {
	return {
		first_name: this.first_name,
		last_name: this.last_name,
		display_name: this.display_name,
		phone_number: this.phone_number,
		email: this.email,
		best_contact: this.best_contact,
		address: this.address,
		city: this.city,
		state: this.state,
		zip: this.zip
	};
};

var User = mongoose.model('Users', userSchema);

// Authenticate the user
exports.authenticate = function (req, res) {
	if(!(req.body.email === 'colin' && req.body.password === 'password')){
		res.send(401, 'Not a valid email and password: ' + req.body.email + ' and ' + req.body.password);
		return;
	}
	var token = jwt.sign({email: req.body.email}, secret, {expireInMinutes: 60*5});
	res.send({token: token});

	/*
	// Find the user with the given email and see if the passwords match
	User.findOne({email: req.body.email}, function (err, user) {
		user.comparePassword(req.body.password, function (err, isMatch) {
			if(isMatch) {
				var token = jwt.sign({email: user.email, id: user._id}, secret, {expireInMinutes: 60*5});
				res.send({token: token});
			} else {
				res.send(401, 'Not a valid email and password: ' + req.body.email + ' and ' + req.body.password);
				return;
			}
		});
	});
	*/
};

exports.addUser = function (req, res) {
	/*
	* Need to check if new user is Administrator
	* and if the given email arealdy exists.
	* Send back an error if email already exists,
	* otherwise create the user and send them an
	* email with the token and their id.
	*/
	console.log(req.body.email);
	res.send(req.body.email);
};

exports.userById = function (req, res) {
	User.findById(req.params.id, function (err, user) {
		if(err) return console.log(err);
		res.send(user.getPublicFields());
	});
};

exports.updateUser = function (req, res) {

	// Only users can update themselves
	if ( req.params.id === req.user.id) {
		User.findById(req.params.id, function (err, user) {
			if(err) return console.log(err);

			user.first_name = req.body.first_name;
			user.last_name = req.body.last_name;
			user.display_name = req.body.display_name;
			user.phone_number = req.body.phone_number;
			user.email = req.body.email;
			user.password = req.body.password; // Automatically salted by middleware
			user.best_contact = req.body.best_contact;
			user.address = req.body.address;
			user.city = req.body.city;
			user.state = req.body.state;
			user.zip = req.body.zip;

			user.save(function (err) {
				if(err) return console.log(err);

				res.send(user);
			});
		});
	} else {
		// Don't have access to modify this user
		res.send(401, "Can't modify this user");
	}
};