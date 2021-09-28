const User = require("../models/Users")

/*
** Middleware that will take the userid from the header
** And check if the user is admin or not in db
*/
const adminAuth = async (req, res, next) =>
{
	let userID;
	let user;

	try
	{
		userID = req.header("userID")
		user = await User.findOne({intra_id : userID});
		if (!user)
			return res.status(400).json({"error" : "Invalid header"})
		if (!user.admin)
			return res.status(401).json({"error" : "Admin authentication failed"})
		next();
	}
	catch (error)
	{
		return res.status(500).json({"error" : "Admin authentication failed"})
	}
}

module.exports = adminAuth