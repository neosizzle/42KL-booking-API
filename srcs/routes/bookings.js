/*
** this file contains the routes for /bookings/* endpoints
*/

const express = require('express');
const { consoleLogEnabled } = require('mongoose-seed');
const router = express.Router();
const Booking = require("../models/Bookings")
const Seat = require("../models/Seats");
const User = require('../models/Users');

/*
** List all bookings
**
** 1. Attempt to get all the booking objects in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/bookings', async (req, res)=>
{
	let	result;

	try
	{
		result = await Booking.find({});
		res.json({
			data : result
		});
	}
	catch (e)
	{
		result = {
			error : e.message
		}
		res.status(500).json(result);
	}
})

/*
** Get one booking from database which given the id
**
** 1. Attempt to get booking object in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/bookings/:id', async (req, res)=>
{
	let	result;

	try
	{
		result = await Booking.findById(req.params.id).populate("seat");
		res.json({
			data : result,
			seat : result.seat
		});
	}
	catch (e)
	{
		result = {
			error : e.message
		}
		res.status(500).json(result);
	}
})

/*
** Creates a new booking in the database
** 
** 1. Create new booking obejct
** 2. Try to looks for invalid seats (trying to book the same seat at the same time)
** 3. Search for the seat wanted to be booked and valid user, throw error if non exist
** 4. Compare the last booked time with current booked time. If they match, throw error for repeated booking
** 5. Update seat details
** 6. Add booking object to database
*/
router.post('/bookings', async (req, res)=>{
	let	new_booking;
	let	seat;
	let	user;
	let	count;

	//might need to delete key property in the future
	new_booking = new Booking(req.body);
	try
	{
		seat = await Seat.findOne({name : new_booking.seat_name})
		user = await User.findOne({intra_name : new_booking.booked_by});
		count = await Booking.countDocuments({booked_by : new_booking.booked_by, booked_date : new_booking.booked_date})
		if (count > 0)
			throw new Error("Can only book once per day");
		if (!user)
			throw new Error("Invalid User");
		if (!seat)
			throw new Error("Seat not found");
		if (seat.last_booked && (seat.last_booked.getTime() == new_booking.booked_date.getTime()) &&
			seat.last_booked_by == new_booking.booked_by)
			throw new Error("Seat occupied");
		if (seat.last_booked && (seat.last_booked.getTime() == new_booking.booked_date.getTime()))
			throw new Error("Seat occupied");
		seat.last_booked = new_booking.booked_date;
		seat.last_booked_by = new_booking.booked_by;
		await new_booking.save();
		await seat.save();
		res.json({
			data : new_booking
		});
	}
	catch (e)
	{
		res.status(500).json({error : e.message});
	}
})

module.exports = router;

