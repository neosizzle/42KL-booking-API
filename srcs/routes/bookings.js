/*
** this file contains the routes for /bookings/* endpoints
*/

const express = require('express');
const router = express.Router();
const Booking = require("../models/Bookings")
const Seat = require("../models/Seats");
const User = require('../models/Users');
const { validate_booking } = require("../utils/booking_validate")

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
** 3. Validate booking
** 4. Update seat details
** 5. Add booking object to database
** 6. If any error happens, return the error message 
*/
router.post('/bookings', async (req, res)=>{
	let	new_booking;
	let	seat;
	let	user;
	let	count;
	let error;

	//might need to delete key property in the future
	new_booking = new Booking(req.body);
	try
	{
		seat = await Seat.findOne({name : new_booking.seat_name})
		user = await User.findOne({intra_name : new_booking.booked_by}).populate('bookings');
		count = await Booking.countDocuments({booked_by : new_booking.booked_by, booked_date : new_booking.booked_date})
		await validate_booking(seat, user, count, new_booking, (err) => 
		{
			if (err)
			{
				error = new Error(err);
				error.code = "CUSTOM"
				throw error;
			}
		})
		await new_booking.save();
		await seat.save();
		res.json({
			data : new_booking
		});
	}
	catch (e)
	{
		if (e.code == "CUSTOM")
			return res.status(400).json({error : e.message});
		res.status(500).json({error : e.message});
	}
})

/*
** Deletes a booking fron the database given the booking id
** Also removes seat last_booked and last_booked_by
*/
router.delete('/bookings/:id', async (req, res)=>
{
	let booking;

	try {
		booking = await Booking.findByIdAndDelete(req.params.id);
		if (!booking)
			return res.status(404).json({error : "Booking not found"});
		res.status(200).json({data : booking})
	}
	catch (error) {
		console.log(error)
		return res.status(500).json({error : error.message});
	}
})

module.exports = router;

