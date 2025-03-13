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
      name: {
         type: String,
          required: true
         },
      latitude: {
         type: Number,
          required: true
         },
      longitude: { 
        type: Number, 
        required: true
       }
    },
    destination: {
      name: { 
        type: String,
         required: true
         },
      latitude: { 
        type: Number,
         required: true 
        },
      longitude: {
         type: Number,
          required: true 
        }
    },
    checkpoints: [{
     type:mongoose.Schema.Types.ObjectId,
     ref:"Checkpoints"
    }],
    Total_budget: {
      type:mongoose.Schema.Types.ObjectId,
      ref:'BudgetBreakdown'
    },
    createdAt: { type: Date, default: Date.now }
  });
  
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

