const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");


dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user_route = require("./src/routes/user-routes");
const trip_routes = require("./src/routes/trip-routes");

const checkpoint_routes = require("./src/routes/checkpoint-routes");
const hotel_routes = require("./src/routes/hotel-routes");
const restaurant_routes = require("./src/routes/restaurant-routes");
const post_routes = require("./src/routes/post-routes");


app.use('/api/v1/user', user_route);
app.use('/api/v1/trip', trip_routes);
app.use('/api/v1/checkpoint', checkpoint_routes);
app.use('/api/v1/hotel', hotel_routes);
app.use('/api/v1/restaurant', restaurant_routes);
app.use('/api/v1/post', post_routes);

module.exports = app;
