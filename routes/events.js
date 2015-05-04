var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Event Schema
var eventSchema = new Schema({
	dt_start: Date, // Date/Time start
	dt_end: Date, // Date/Time end
	r_rule: [{ // Recurrence rule
		param: String,
		value: String
	}],
	organizer: String, // Event organizer
	categories: [String], // Event categories
	description: String, // A detailed description of the event
	summary: String, // A brief explanation of the event
	geo: { // Geographical coordinates of the event
		lat: Number,
		lon: Number,
	},
	location: String, // Location of the event
	image: String, // url to an image for the event
});

var Event = mongoose.model('Events', eventSchema);

exports.allEvents = function (req, res) {
	events = [
		{
			'description': 'Neon Indian Party',
			'summary': 'Lets paint ourselves and get crazy',
			'start': new Date(2014, 4, 20),
			'end': new Date(2014,4,21),
			'location': 'Trotts House'
		},
		{
			'description': 'Potluck',
			'summary': 'Everybody bring some amazing food',
			'start': new Date(2014, 4, 28),
			'end': new Date(2014, 4, 29),
			'location': 'Hideaway House'
		},
		{
			'description': 'CommuniTea',
			'summary': 'Drink tea everyone!',
			'start': new Date(2014, 4, 30),
			'end': new Date(2014, 4, 31),
			'location': 'Bunchstead'
		},
		{
			'description': 'Cool Event',
			'summary': 'Everybody in the club',
			'start': new Date(2014, 4, 14),
			'end': new Date(2014, 4, 15),
			'location': 'Party Place'
		},
		{
			'description': 'Sweet Times',
			'summary': 'Get all excited, because this one is going to be off the chain',
			'start': new Date(2014, 4, 6),
			'end': new Date(2014, 4, 7),
			'location': 'Hideaway House'
		},
		{
			'description': 'That one thing',
			'summary': 'Oh my god I cant even wait for this to go down ',
			'start': new Date(2014, 4, 15),
			'end': new Date(2014, 4, 18),
			'location': 'Hideaway House'
		},
		{
			'description': 'Lorem Ipsum Partium',
			'summary': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sodales quis nulla quis egestas. Morbi est nisl, adipiscing vulputate libero ac, aliquam mattis tortor. Phasellus pulvinar laoreet dolor, quis tempor sapien imperdiet lacinia. Cras dignissim vel mi eget ullamcorper. Donec nec augue eget magna fermentum pulvinar vel quis neque. Cras id aliquam eros. Aenean dictum aliquet arcu quis molestie. Ut felis tortor, luctus accumsan metus in, interdum posuere quam. Duis leo augue, mollis et elit eget, commodo consequat tortor. Vivamus a volutpat eros. Sed in pellentesque magna. Integer quis lobortis purus, vitae congue tortor. Vestibulum velit erat, tincidunt in leo nec, pulvinar consequat sem. Ut metus elit, blandit vitae dui et, tempus auctor magna. Praesent adipiscing risus enim, ac pharetra nunc mattis ut. Ut felis turpis, dictum a mi in, posuere aliquet mauris.',
			'start': new Date(2014, 4, 10),
			'end': new Date(2014, 4, 11),
			'location': 'Hideaway House'
		},
		{
			'description': 'PARTY OF THE CENTURY',
			'summary': 'This one will be the best of them all',
			'start': new Date(2014, 4, 28),
			'end': new Date(2014, 4, 29),
			'location': 'Hideaway House'
		},
		{
			'description': 'Potluck',
			'summary': 'Everybody bring some amazing food',
			'start': new Date(2014, 4, 1),
			'end': new Date(2014, 4, 2),
			'location': 'Hideaway House'
		},
		{
			'description': 'Potluck',
			'summary': 'Everybody bring some amazing food',
			'start': new Date(2014, 4, 28),
			'end': new Date(2014, 4, 29),
			'location': 'Hideaway House'
		},
		{
			'description': 'Potluck',
			'summary': 'Everybody bring some amazing food',
			'start': new Date(2014, 4, 28),
			'end': new Date(2014, 4, 29),
			'location': 'Hideaway House'
		},
		{
			'description': 'Potluck',
			'summary': 'Everybody bring some amazing food',
			'start': new Date(2014, 4, 28),
			'end': new Date(2014, 4, 29),
			'location': 'Hideaway House'
		}

	];
	res.send(events);
};

exports.createEvent = function (req, res) {
	console.log("Create an event");
	var e = new Event();
	e.dt_start = req.body.dt_start;
	e.dt_end = req.body.dt_end;
	e.description = req.body.description;
	e.summary = req.body.summary;
	e.location = req.body.location;
	e.save(function (err) {
		if(err) {
			return console.log(err);
		} else {
			return console.log("created");
		}
	});
	res.send(e);
};

exports.updateEvent = function (req, res) {
	Event.findById(req.params.id, function (err, event) {
		if(err) return console.log(err);

		event.dt_start = req.body.dt_start;
		event.dt_end = req.body.dt_end;
		event.description = req.body.description;
		event.summary = req.body.summary;
		event.location = req.body.location;
		event.save(function (err) {
			if(err) return console.log(err);

			res.send(event);
		});
	});

};

exports.eventById = function (req, res) {
	Event.findById(req.params.id, function (err, event) {
		if(err) return console.log(err);
		res.send(event);
	});

};