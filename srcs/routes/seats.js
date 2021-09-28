/*
** this file contains the routes for /seats/* endpoints
*/

const express = require('express');
const Booking = require('../models/Bookings');
const router = express.Router();
const Seat = require("../models/Seats")
const { generate_avail } = require("../utils/generate_avail");
const sendDeletionEmail = require("../utils/send_del_email")
const moment = require("moment");
const User = require('../models/Users');
const adminAuth = require("../middleware/adminAuth");


/*
** List all seats
**
** 1. Attempt to get all the seats objects in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/seats', async (req, res)=>
{
	let	result;

	try
	{
		result = await Seat.find({});
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
** Find seats which has the section provided and also provides availability vector
** according to the date provided
** 
** 1. Attempt find in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/seats/section_date/', async (req, res)=>{
	let section;
	let date;
	let	result;

	section = req.query.section;
	date = new Date(req.query.date);
	if (!section || !date)
		return res.status(401).json({error : "Bad request"});
	try
	{
		result = await Seat.find({section : section});
		if (!result || result.length == 0)
			return res.status(404).json({error : "Not found"});
		res.json({
			data : result,
			is_avail : await generate_avail(result, date)
		});
	}
	catch (e)
	{
		result = {
			error : e.message
		}
		console.error(result);
		res.status(500).json(result);		
	}
})

/*
** Find one seat which has the name provided and also provide past bookings
** 
** 1. Attempt to the seat object in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/seats/:name', async (req, res)=>{
	let name;
	let	result;

	name = req.params.name;
	try
	{
		result = await Seat.findOne({name : name}).populate('booking');
		if (!result)
			return res.status(404).json({error : "Not found"});
		res.json({
			data : result,
			bookings : result.booking
		});
	}
	catch (e)
	{
		result = {
			error : e.message
		}
		console.error(result);
		res.status(500).json(result);		
	}
})

/*
** Creates a new seat in the database
** 
** 1. Attempt to create new seat in database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.post('/seats', async (req, res)=>{
	let	new_seat;
	new_seat = new Seat(req.body);

	try
	{
		//might need to delete key property in the future
		await new_seat.save();
		res.json({
			data : req.body
		});
	}
	catch (e)
	{
		res.status(500).json({error : e.message});
	}
})


/*
** Marks a seat as activated given the name
*/
router.patch('/seats/activate/:name', adminAuth, async (req,res) => {
	let	seat;

	try
	{
		seat = await Seat.findOneAndUpdate({name : req.params.name} , {is_activated : true})
		if (!seat)
			return res.status(404).json({error : "Not found"});
		return res.json({
			data : seat
		});
	}
	catch (error) 
	{
		console.error(error);
		res.status(500).json({error : error.message});
	}
})

/*
** Marks a seat as deactivated given the name, also deletes upcoming bookings that
** are made on this seat
*/
router.patch('/seats/deactivate/:name', adminAuth, async (req,res) => {
	let	seat;
	let bookings;
	let currDate;
	let user;

	try
	{
		currDate = moment().format("YYYY-MM-DD");
		seat = await Seat.findOneAndUpdate({name : req.params.name} , {is_activated : false})
		bookings = await Booking.find({seat_name : req.params.name, booked_date : {$gte : currDate}})
		bookings.forEach(async (booking) => {
			user = await User.findOne({intra_name : booking.booked_by});
			sendDeletionEmail(booking, user.email);
		});
		await Booking.deleteMany({seat_name : req.params.name, booked_date : {$gte : currDate}})
		if (!seat)
			return res.status(404).json({error : "Not found"});
		return res.json({
			data : seat
		});
	}
	catch (error) 
	{
		console.error(error);
		res.status(500).json({error : error.message});
	}
})

module.exports = router;

