/*
** This file declared the model for ticket object
*/

/*
** Imports
*/
const mongoose = require('mongoose')

/*
** Schema declaration
** 
** days_in_advance			How many days in advance can be booked
** max_booking_instances	How many active bookings one can have at the same time
*/
const ticketSchema = mongoose.Schema({
	days_in_advance : {
		type : Number,
		required : true,
		min: [2, 'Must be at least 2'],
	},
	max_booking_instances : {
		type : Number,
		required : true,
		min : [1, 'Must be at least 1']
	}
}, {timestamps : true, autoIndex : true});

// Pre hook for `findOneAndUpdate`
ticketSchema.pre('findOneAndUpdate', function(next) {
	this.options.runValidators = true;
	next();
});

/*
** Export schema to model
*/
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;