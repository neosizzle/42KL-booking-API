const axios = require("axios")

/*
** OAuth endpoint with 42 access token
*/
const userAuth = async (req, res, next) =>
{
	let token;

	//console.log(req.headers)
	if (!req.headers.authorization)
		return res.status(400).json({error : "authentication failed"});
	token = req.headers.authorization.replace("OAuth ", "");
	axios.get(`https://api.intra.42.fr/oauth/token/info?access_token=${token}`)
	.then(()=> next())
	.catch((err)=> {
		if (err.response)
			return res.status(err.response.status).json({error : "bad auth token"})
		return res.status(400).json({error : "authentication failed"})
	})
}

module.exports = userAuth