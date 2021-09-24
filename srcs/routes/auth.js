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
	url_str = `https://api.intra.42.fr/oauth/token?grant_type=${process.env.GRANT_TYPE_42}&client_id=${process.env.API_UID_42}&client_secret=${process.env.API_SECRET_42}&code=${code}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth`;
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


module.exports = router;