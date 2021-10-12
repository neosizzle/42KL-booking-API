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
	"srcs/models/Bookings",
	"srcs/models/Tickets"
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
				"intra_name" : "testadmin",
				"intra_id" : "admin",
				"email" : "jh_ngg@ymail.com",
				"admin" : true
			}
        ]
    },
	{
		"model" : "Ticket",
		"documents" : [
			{
				"days_in_advance" : 5,
				"max_booking_instances" : 2
			}
		]
	}
];