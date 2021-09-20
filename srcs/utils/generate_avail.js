const Seats = require("../models/Seats")
const Bookings = require("../models/Bookings")

/*
** This function will generate the availability array for the 
** Seats given in result in accordance to the date given
** 
** @param MongooseDocument result[]	The seats documents
** @param Date date					The date object to check the availability on
** @return int[] result				The avail vector, 1 if yes, 0 if no
*/
const generate_avail = async (result, date) =>
{
	let	i;
	let res;

	i = -1;
	res = new Array(result.length);
	while (++i < result.length)
	{
		if (!await Bookings.findOne({seat_name : result[i].name, booked_date : date}))
			res[i] = 1;
		else
			res[i] = 0;
	}
	return res;
}

module.exports = {
	generate_avail
}