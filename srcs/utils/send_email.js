const axios = require("axios");
require('dotenv').config();

const sendConfirmationEmail = (new_booking, to_email) =>
{
	let booked_date;
	let	booked_by;
	let seat_name;
	let seat_section;
	let	payload;

	booked_date = new_booking.booked_date;
	booked_by = new_booking.booked_by;
	seat_name = new_booking.seat_name;
	seat_section = new_booking.seat_section;
	payload = {
		service_id : process.env.EMAILJS_SERVICE_ID,
		template_id: process.env.EMAILJS_TEMPLATE_ID,
		user_id: process.env.EMAILJS_USER_ID,
		accessToken : process.env.EMAILJS_ACCESS_TOKEN,
		template_params : {
			booked_date : booked_date,
			booked_by : booked_by,
			seat_section : seat_section,
			seat_name : seat_name,
			to_email : to_email
		}
	}

	axios.post('https://api.emailjs.com/api/v1.0/email/send', payload)
	.then ((response) => console.log(`Email send to ${to_email}: ${response.data}`))
	.catch ((error) => console.error(error))

}

module.exports = sendConfirmationEmail