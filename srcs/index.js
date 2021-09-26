/*
* Imports
*/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config();
require("./db/mongoose");

/*
** Initialize constants
*/
const app = express();
const PORT = process.env.PORT || 4000;
const bookingsRouter = require('./routes/bookings.js');
const usersRouter = require('./routes/users.js');
const seatsRouter = require('./routes/seats.js');
const authRouter = require('./routes/auth.js');

/*
** Server configuration
*/
app.set('port', PORT);
app.use(bodyParser.json());
app.use((req, res, next) => {
	//res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
	//res.header("Access-Control-Allow-Origin", "https://booking-42kl.web.app");
	res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
	next();
  });

/*
** Root endpoint
*/
app.get('/', (req, res, next) =>{
	res.send("<h1>This is the root of 42KL booking API</h1>");
})

/*
** Import routers
*/
app.use(bookingsRouter);
app.use(seatsRouter);
app.use(usersRouter);
app.use(authRouter);

/*
** Launch server
*/
app.listen(app.get('port'), server =>{
	console.info(`Server listen on port ${app.get('port')}`);
})