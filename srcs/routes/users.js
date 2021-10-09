/*
** this file contains the routes for /users/* endpoints
*/

/*
** Imports
*/
const express = require('express');
const router = express.Router();
const User = require("../models/Users");
const axios = require("axios")
const userAuth = require("../middleware/userAuth")

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
** The access token can be provided to add the user inside db
** In case of user not found
** 
** 1. Attempt to user object in the database
** 	- If error and token is provided
**		- Check if user is in 42 network db
**			- if yes, add new user in db and return result
**			- if no, Throw error
** 	- If error and no token,
**  	- throw err
** 	- if success, send result back to caller
*/
router.get('/users/:name', async (req, res)=>{
	let name;
	let	result;
	let token;
	let response;

	name = req.params.name;
	token = req.query.token;
	try
	{
		result = await User.findOne({intra_name : name}).populate('bookings');
		if (!result && !token)
			return res.status(404).json({error : "Not found"});
		else if (!result)
		{
			response = await axios.get(`https://api.intra.42.fr/v2/users?access_token=${token}&campus_id=34&filter[login]=${name}`)
			if (response.data.length == 0) return res.status(404).json({error : "Not found"});
			result = new User({
				intra_id : response.data[0].id,
				intra_name : response.data[0].login,
				email : response.data[0].email,
				admin : response.data[0]["staff?"]
			})
			await result.save();
		}
		res.json({
			data : result,
			bookings : result.bookings
		});
	}
	catch (e)
	{
		console.log(e)
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
router.post('/users', userAuth, async (req, res)=>{
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
			bookings : []
		});
	}
	catch (e)
	{
		console.error(e.message)
		res.status(500).json({error : e.message});
	}
})

module.exports = router;

