/*
** This file declared the model for booking object
*/

/*
** Imports
*/
const mongoose = require('mongoose')

/*
** Schema declaration
** 
** booked_date 		The date of booking in the form of yyyy-mm-dd
** booked_by 	 	The intra username of student who made the booking
** seat_name		The seats name
*/
const bookingSchema = mongoose.Schema({
	booked_date : {
		type : Date,
		required : true
	},
	booked_by : {
        type : String,
		required : true,
		index : true
	},
	seat_name : {
		type : String,
		required : true
	}
}, {timestamps : true, autoIndex : true});

/*
** Declare virtuals (Foreign keys)
**
** seat	Maps to an instance of Seat object that has the seat name
*/
bookingSchema.virtual('seat', {
	ref : 'Seat',
	localField : "seat_name",
	foreignField : "name",
	justOne : true
})

/*
** Export schema to model
*/
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;