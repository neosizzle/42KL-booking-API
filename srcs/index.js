/*
* Imports
*/
const express = require('express');
const bodyParser = require('body-parser')
require('dotenv').config();
require("./db/mongoose");

/*
** Initialize constants
*/
const app = express();
const PORT = process.env.PORT || 3000;
const bookingsRouter = require('./routes/bookings.js');
const usersRouter = require('./routes/users.js');
const seatsRouter = require('./routes/seats.js');

/*
** Server configuration
*/
app.set('port', PORT);
app.use(bodyParser.json());

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

/*
** Launch server
*/
app.listen(app.get('port'), server =>{
	console.info(`Server listen on port ${app.get('port')}`);
})