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
** section -			The seat section (floor, block etc)
** transformation -		The CSS transformation properties for this seat to be rendered on screen
** x_offs and y_offs-	The x and y offset of the seat for rendering it on front end
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
	x_offs : {
		type : String,
		default : null,
		required : false,
	},
	y_offs : {
		type : String,
		default : null,
		required : false,
	},
	transformation : {
		type : String,
		default : null,
		required : false,
	},
	is_activated : {
		type : Boolean,
		default : false,
		required : true,
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