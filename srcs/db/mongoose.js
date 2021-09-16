/*
* This is the file where a connection to the database is established
*/
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser : true,
})
