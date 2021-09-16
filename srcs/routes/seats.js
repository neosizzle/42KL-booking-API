/*
** this file contains the routes for /seats/* endpoints
*/

const express = require('express');
const router = express.Router();
const Seat = require("../models/Seats")

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
** Find one seat which has the name provided
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
		result = await Seat.findOne({name : name});
		if (!result)
			return res.status(404).json({error : "Not found"});
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

