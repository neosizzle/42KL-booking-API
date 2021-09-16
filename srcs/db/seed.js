/*
**Seeder, to fill database with initial data
*/

/*
** Imports
*/
var seeder = require("mongoose-seed");
require("dotenv").config(); 

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
            {
                "name": "A00",
                "section" : "floor1"
            },
			{
                "name": "A01",
                "section" : "floor1"
            },
			{
                "name": "A02",
                "section" : "floor1"
            },
			{
                "name": "A03",
                "section" : "floor1"
            },
			{
                "name": "A04",
                "section" : "floor1"
            },
			{
                "name": "B00",
                "section" : "floor1"
            },
            {
                "name": "B01",
                "section": "floor2",
            },
			{
                "name": "B02",
                "section": "floor2",
            },
			{
                "name": "B03",
                "section": "floor2",
            },
			{
                "name": "B04",
                "section": "floor2",
            }
        ]
    },
	{
        "model": "User",
        "documents": [
            {
				"intra_id" : "1234567",
				"intra_name" : "jng",
				"email" : "example@mail.com",
				"admin" : 0
			},
			{
				"intra_id" : "123s4567",
				"intra_name" : "jsg",
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