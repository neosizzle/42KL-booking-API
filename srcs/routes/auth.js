/*
** this file contains the routes for /auth/* endpoints
*/

const axios = require("axios");
const express = require('express');
const router = express.Router();
require('dotenv').config();

/*
** This will call the 42 Networks API to get an access token given the OAuth code
*/
router.post('/auth/get_token/:code', (req,res)=>
{
	let	code;
	let	url_str;

	code = req.params.code;
	url_str = `https://api.intra.42.fr/oauth/token?grant_type=${process.env.GRANT_TYPE_42}&client_id=${process.env.API_UID_42}&client_secret=${process.env.API_SECRET_42}&code=${code}&redirect_uri=${process.env.TOKEN_REDIR_URI_42}`;
	axios.post(url_str)
	.then((response) => 
	{
		//console.log(response.data)
		res.send(response.data);
	})
	.catch((err) => 
	{
		console.log(err)
		res.status(500).send(err.message)
	})
})

/*
** This endpoint serves as a proxy to add Access-Control-Allow-Origin to me endpoitn 
** for 42 network API
*/
router.get("/auth/me/:token", (req,res) => 
{
	let	token;
	let	url;

	token = req.params.token;
	url = `https://api.intra.42.fr/v2/me?access_token=${token}`;
	axios.get(url)
	.then((response) => 
	{
		//console.log(response.data)
		res.send(response.data);
	})
	.catch((err) => 
	{
		console.log(err)
		res.status(500).send(err.message)
	})
})

/*
** This endpoint will get all the users in 42KL campus given the token
*/
router.get("/auth/campus_users/", (req,res) => 
{
	let	token;
	let	url;
	let login;

	token = req.query.token;
	login = req.query.login;
	url = `https://api.intra.42.fr/v2/users?access_token=${token}&campus_id=34&filter[login]=${login}`;
	axios.get(url)
	.then((response) => 
	{
		//console.log(response.data)
		res.send(response.data);
	})
	.catch((err) => 
	{
		console.log(err)
		res.status(500).send(err.message)
	})
})

module.exports = router;