/*
** this file contains the routes for /bookings/* endpoints
*/

const express = require('express');
const router = express.Router();
const Booking = require("../models/Bookings")
const Seat = require("../models/Seats");
const User = require('../models/Users');
const Ticket = require("../models/Tickets");
const { validate_booking } = require("../utils/booking_validate");
const sendConfirmationEmail = require("../utils/send_email");
const sendDeletionEmail = require("../utils/send_del_email")
const userAuth = require("../middleware/userAuth")

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
** Get all the booking from user given 
**
** 1. Attempt to get booking object in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/bookings/:user', async (req, res)=>
{
	let	result;

	try
	{
		result = await Booking.find({booked_by : req.params.user}).populate("seat");
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
** Get all the booking for a given date
*/
router.get('/bookings/date/:date', async (req, res)=>
{
	let	result;

	try
	{
		result = await Booking.find({booked_date : req.params.date}).populate("seat");
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
** Gets booking ticket constraints
*/
router.get('/booking_ticket', async (req, res, next)=>{
	let ticket;

	try{
		ticket = await Ticket.findOne({})
		if (!ticket)
		{
			return res.json({
				data : {
					"days_in_advance" : 5,
					"max_booking_instances" : 2
				}
			});
		}
		return res.json({
			data : ticket
		});
	}
	catch(e)
	{
		return res.status(500).json({error : e.message})
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
router.post('/bookings', userAuth, async (req, res)=>{
	let	new_booking;
	let	seat;
	let	user;
	let	count;
	let error;

	//might need to delete key property in the future
	new_booking = {
		...req.body,
		seat_section : null
	}
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
		new_booking.seat_section = seat.section;
		await new Booking(new_booking).save();
		sendConfirmationEmail(new_booking, user.email)
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
** Edit booking ticket constraints
*/
router.patch('/booking_ticket', async (req, res, next)=>{

	let newTicket;
	let result;

	newTicket = req.body;
	try{
		result = await Ticket.findOneAndUpdate({}, newTicket);
		if (!result)
		{
			newTicket = new Ticket(req.body)
			await newTicket.save();
		}
		return res.json({data : result})
	}
	catch(e)
	{
		res.status(500).json({error : e.message});
	}
})

/*
** Deletes a booking fron the database given the booking id
** Also removes seat last_booked and last_booked_by
*/
router.delete('/bookings/:id', userAuth, async (req, res)=>
{
	let booking;
	let user;

	try {
		booking = await Booking.findByIdAndDelete(req.params.id);
		if (!booking)
			return res.status(404).json({error : "Booking not found"});
		user = await User.findOne({intra_name : booking.booked_by});
		sendDeletionEmail(booking, user.email);
		res.status(200).json({data : booking});
	}
	catch (error) {
		console.log(error)
		return res.status(500).json({error : error.message});
	}
})

module.exports = router;

