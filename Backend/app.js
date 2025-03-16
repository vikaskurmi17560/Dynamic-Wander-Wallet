const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables early
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const user_route = require("./src/routes/user-routes");
const trip_routes = require("./src/routes/trip-routes");
const budget_routes = require("./src/routes/budget-routes");
const checkpoint_routes = require("./src/routes/checkpoint-routes");
const hotel_routes = require("./src/routes/hotel-routes");
const restaurant_routes = require("./src/routes/restaurant-routes");

app.use('/api/v1/user', user_route);
app.use('/api/v1/trips', trip_routes);
app.use('/api/v1/budgets', budget_routes);
app.use('/api/v1/checkpoints', checkpoint_routes);
app.use('/api/v1/hotel', hotel_routes);
app.use('/api/v1/restaurant', restaurant_routes);

module.exports = app;
