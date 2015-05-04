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