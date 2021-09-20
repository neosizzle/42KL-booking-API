/*
** this file contains the routes for /seats/* endpoints
*/

const express = require('express');
const router = express.Router();
const Seat = require("../models/Seats")
const { generate_avail } = require("../utils/generate_avail")

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

module.exports = router;

