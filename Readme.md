# 42KL Booking System API
This is the development repo for the API used by 42KLs Booking System. It is written with the following frameworks: 
- Nodejs
- Expressjs
- Mongoosejs

And it communicates with a MongoDB database.

## Installation
### Prerequisites
Before cloning the repo, make sure you have installed the following on your machine.

- [Nodejs](https://nodejs.org/en/download/)
- [MongoDB community edition](https://www.mongodb.com/try/download/community) (Remember to launch)
- [Git CLI](https://git-scm.com/downloads)
- [Postman](https://www.postman.com/downloads/) (For testing the API)
- [MongoDB compass](https://www.mongodb.com/try/download/compass) (Database GUI)

The installation process for the Programs above are quite straightforward for all OSes, the default settings for all of them will do.


### Making sure everything is correctly installed
To test your MongoDB is correctly installed, launch your MongoDB Compass and you should see something like this :
![im sry if this image expired](https://imgur.com/WYZOCNE.png)
And what you are going to do now is to connect to the MongoDB database that you just launched after installing. It is hosted on localhost and the port is 27017 by default.
1. To connect, Click on new connection.
2. Paste `mongodb://localhost:27017/42klbooking` into the prompt
3. If no error occurs, viola! You've connected to your own MongoDB database.

- To test Nodejs, run `node -v` in any terminal. It should show the version
- To test Git, run `git --version` in any terminal. It should show the version.

## Cloning and setting up
The following steps are important, as the set up the environment for you to run and test the API. Run the following commands in your working directory

1. `git clone https://github.com/neosizzle/42KL-booking-API.git`
2. `npm install` (Downloads and installs the frameworks / packages needed for the API)
3. `touch .env`
4. Copy all contents from `.env.example` to `.env`. Those are our environment variables. It would be different for every machine.
5. In the second line, replace it with `MONGODB_URL=mongodb://localhost:27017/42klbooking` . If you are using another mongoDB provider, paste your own connection string instead.
6. `npm run start` to start the program.

> If you want to populte your data with dummy values beforehand, run npm run seed

## Testing
1. Launch Postman.
2. Click the Import button beside the big orange New at the top left.
3. Click on the Link tab and paste the following: `https://www.getpostman.com/collections/272a46b1d4ccbc7b390b`
4. You should see a bunch of requests in the collection, feel free to tinker around and discover what they do when you send those requests.

## Documentation
- `GET /` Returns a very generic welcome message
- `GET /bookings` Returns all the bookings that are created in the system
- `GET /bookings/:id` Returns the booking detail which has obejctID `:id`
- `GET /seats` Returns all the seats that are created in the system
- `GET /users` Returns all the users that are created in the system
- `GET /users/:name` Returns the user which has intra username `:name`
- `POST /users` Adds a user to the system. Request body required.
- `POST /bookings` Adds a booking to the system. Request body required.
- `POST /seats` Adds a seat to the system. Request body required.

>Some elements might still be unstable, please to tell me if something goes wrong!

> Explanation on how stuff works coming soon!