/*
** This file declared the model for Users object
*/

/*
** Imports
*/
const mongoose = require('mongoose')

/*
** Schema declaration
** 
** intra_id		The intranet id of the user (suppose they have any)
** inrta_name	The intranet username of the user
** email		The email of the user
** admin		1 if user is admin and 0 if not
*/
// NOTE: We dont store passwords here, since authentication is done by 42network API.
// Every entry here should be a valid user.
const userSchema = mongoose.Schema({
	intra_id : {
		type : String,
		index : {unique: true},
		required : true
	},
	intra_name : {
		type : String,
		index : {unique: true},
		required : true
	},
	email : {
		type : String,
		index : {unique: true},
		required : true
	},
	admin : {
		type : Boolean,
		required : true
	}
}, {timestamps : true, autoIndex: true});

/*
** Declare virtuals (Foreign keys)
** 
** bookings		This will map to all the booking objects
** 			 	that has their booked_by field matching intra_name
*/
userSchema.virtual("bookings", {
	ref : "Booking",
	localField : "intra_name",
	foreignField : "booked_by"
});

/*
** Export schema to model
*/
const User = mongoose.model("User", userSchema);

module.exports = User;