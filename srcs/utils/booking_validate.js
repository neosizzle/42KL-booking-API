const moment = require('moment');
const Bookings = require('../models/Bookings');
const Seats = require('../models/Seats');

/*
** Helper function to check if seat is avail at current date
** 
** @param MongooseDocument seat	The seat object
** @param Date date				The date that we want to check with
*/
const is_avail = async (seat, date) =>
{
	if (await Bookings.findOne({seat_name : seat.name, booked_date : date}))
		return false;
	else
		return true;
}

/*
** Helper function to validate booking
** 
** 1. Checks for booking limit per user (2)
** 2. Checks for 1 User trying to book 2 seats at the same day
** 3. Checks for Invalid user
** 4. Checks for Invalid seat
** 5. Checks for 2 users tring to book the same seat
** 6. Checks for 1 user tryung to book 1 seat 2 times
** 
** @param seat			The seat object that the yser is trying to book
** @param user			The user that is trying to book the seat
** @param count		The number of bookigns made by same user on same day 
** @param new_booking	The booking object the user is trying to make
** @param callback		The callback function to call
** 
*/
const validate_booking = async (seat, user, count, new_booking, callback)=>
{
	let curr_date;
	let	booked_date;
	let	diff_days;
	let	i;
	let	bookings_ahead;

	curr_date = moment().startOf('day');
	booked_date = moment(new_booking.booked_date).startOf('day');
	diff_days = booked_date.diff(curr_date, "days");
	bookings_ahead = 0;
	if (!user)
		return callback("Invalid user");
	if (!seat)
		return callback("Seat not found");
	i = user.bookings.length;
	while (--i >= 0) {
		if (moment(user.bookings[i].booked_date).startOf('day') > curr_date)
			bookings_ahead++;
		if (bookings_ahead >= 2)
			return callback("At most 2 upcoming bookings per user");
	}
	if (diff_days < 1)
		return callback("Can only book in future days");
	if (diff_days > 5)
		return callback("Can only book at most 5 days ahead");
	if (count > 0)
		return callback("Can only book one seat per day");
	if (!seat.is_activated)
		return callback("Seat not activated for booking!")
	if (! await is_avail(seat, new_booking.booked_date))
		return callback("Seat occupied");
	callback(null);
}

module.exports = {
	validate_booking
}