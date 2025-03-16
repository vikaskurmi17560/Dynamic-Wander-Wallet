const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tripName: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
},
  { timestamps: true }
);

module.exports = mongoose.model('Trip', tripSchema);





//   +---------------------+
//   |        User         |
//   +---------------------+
//             |
//             |
//             ▼
//   +---------------------+
//   |        Trip         |
//   +---------------------+
//             |
// ---------------------------------------------
// |                                           |
// ▼                                           ▼
// +---------------------+                     +--------------------+
// |    Budget          |                     |  Checkpoints       |
// +---------------------+                     +--------------------+
// | transport_budget   |      +-------------->| source, destination|
// | hotel_budget      |      |               | transport_price    |
// | food_budget       |      |               | hotels []          |
// | totalBudget       |      |               | restaurants []     |
// +---------------------+    |               +--------------------+
//              |
//              |
//              ▼
// +---------------------+
// |      Hotels         |
// +---------------------+
// | name                |
// | location            |
// | type (budget/luxury)|
// | price               |
// +---------------------+
//              |
//              ▼
// +---------------------+
// |    Restaurants      |
// +---------------------+
// | name                |
// | location            |
// | type (Lunch/Dinner) |
// | price               |
// +---------------------+

