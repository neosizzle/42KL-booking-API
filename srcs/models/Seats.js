/*
** This file declared the model for seats object
*/

/*
** Imports
*/
const mongoose = require('mongoose')

/*
** Schema declaration
** 
** name -				The seat name
** section -			The seat section
** last_booked - 		Date of last booking
** last_booked_by	-	Username of the person who last booked
*/
const seatSchema = mongoose.Schema({
	name : {
		type : String,
		unique : true,
		required : true
	},
	section : {
		type : String,
		required : true
	},
	last_booked : {
		type : Date,
		default : null,
		required : false
	},
	last_booked_by : {
		type : String,
		default : null,
		required : false
	}
}, {timestamps : true, autoIndex: true});

/*
** Declare virtuals (Foreign keys)
**
** booknig Maps to an instances of Booking objects that has the seat name
*/
seatSchema.virtual('booking', {
	ref : 'Booking',
	localField : "name",
	foreignField : "seat_name",
})

/*
** Export schema to model
*/
const Seat = mongoose.model("Seat", seatSchema);

module.exports = Seat;