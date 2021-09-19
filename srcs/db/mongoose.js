/*
* This is the file where a connection to the database is established
*/
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true,
})
.then((data) => 
{
	console.log("Connection to DB established")
})
.catch((err) => 
{
	console.log("Connection to DB failed")
	console.log(err)
})