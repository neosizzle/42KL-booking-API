/*
** this file contains the routes for /users/* endpoints
*/

/*
** Imports
*/
const express = require('express');
const router = express.Router();
const User = require("../models/Users");

/*
** List all the users in the collection
** 
** 1. Attempt to get all the user objects in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/users', async (req, res)=>
{
	let	result;

	try
	{
		result = await User.find({});
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
** Find one user which has the name provided
** 
** 1. Attempt to user object in the database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.get('/users/:name', async (req, res)=>{
	let name;
	let	result;
	let temp;

	name = req.params.name;
	try
	{
		result = await User.findOne({intra_name : name}).populate('bookings');
		if (!result)
			return res.status(404).json({error : "Not found"});
		res.json({
			data : result,
			bookings : result.bookings
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
** Creates a new user in the database
** 
** 1. Attempt to create new user in database
** 	- If error, send error message and set status
** 	- if success, send result back to caller
*/
router.post('/users', async (req, res)=>{
	let	new_user;
	let existing_user;

	new_user = new User(req.body);
	existing_user = await User.findOne({intra_name : new_user.intra_name}).populate("bookings");
	try
	{
		//might need to delete key property in the future
		if (new_user.intra_name && existing_user)
			return res.json({
				data : existing_user,
				bookings : existing_user.bookings
			});
		await new_user.save();
		res.json({
			data : new_user,
			bookings : new_user.bookings
		});
	}
	catch (e)
	{
		console.error(e.message)
		res.status(500).json({error : e.message});
	}
})

module.exports = router;

