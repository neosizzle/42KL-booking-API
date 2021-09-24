/*
**Seeder, to fill database with initial data
*/

/*
** Imports
*/
var seeder = require("mongoose-seed");
require("dotenv").config();
const seed_180_GF = require("./seed/182-181-180GF");
const seed_180_1F = require("./seed/182-181-1801F");
const seed_190_GF = require("./seed/190-191GF");
const seed_190_1F = require("./seed/190-1911F");


// Connect to MongoDB via Mongoose
seeder.connect(process.env.MONGODB_URL, function() {
 
  // Load Mongoose models
  seeder.loadModels([
    "srcs/models/Seats",
	"srcs/models/Users",
	"srcs/models/Bookings"
  ]);
 
  // Clear specified collections
  seeder.clearModels(["Seat", "User", "Booking"], function() {
 
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect();
    });
 
  });
});
 
// Data array containing seed data - documents organized by Model
var data = [
    {
        "model": "Seat",
        "documents": [
           seed_180_GF,
		   seed_180_1F,
		   seed_190_GF,
		   seed_190_1F
        ]
    },
	{
        "model": "User",
        "documents": [
            {
				"intra_id" : "1234567",
				"intra_name" : "test",
				"email" : "example@mail.com",
				"admin" : 0
			},
			{
				"intra_id" : "123s4567",
				"intra_name" : "asdf",
				"email" : "examle@mail.com",
				"admin" : 0
			},
			{
				"intra_id" : "123456sdf2354357",
				"intra_name" : "user",
				"email" : "eupppppe@mail.com",
				"admin" : 0
			},
			{
				"intra_id" : "one1234sdBsdf234jv8dn3",
				"intra_name" : "asd",
				"email" : "nomail@mail.com",
				"admin" : 0
			},
        ]
    }
];