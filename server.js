var express = require('express'),
	mongoose = require('mongoose'),
	expressJwt = require('express-jwt'),
	jwt = require('jsonwebtoken'),
	events = require('./routes/events'),
	authentication = require('./routes/authentication'),
	users = require('./routes/users');

var secret = 'holy cow';

// Create the Express app
var app = express();

app.use('/api', expressJwt({secret: secret})); // Replace secret
app.use(express.json());

// Setup the database
mongoose.connect('mongodb://localhost/kctribe');

// Routes ==================================================
app.post('/authenticate', users.authenticate);

// User Endpoints
app.post('/api/v1/users', users.addUser);
app.get('/api/v1/users/:id', users.userById);
app.put('/api/v1/users/:id', users.updateUser);

// ------ For Testing ------
app.get('/api/v1/restricted', function (req, res) {
	console.log('user ' + req.user.email + 'is requesting restricted access');
	res.json({test: 'foo'});
});

// Event Endpoints
app.get('/api/v1/events', events.allEvents);
app.post('/api/v1/events', events.createEvent);
app.get('/api/v1/events/:id', events.eventById);
app.put('/api/v1/events/:id', events.updateEvent);


app.use(express.static(__dirname));
app.listen(8080);
console.log("Connected...");