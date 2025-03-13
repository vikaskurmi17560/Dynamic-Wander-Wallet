const express = require('express');
const budgetController = require('../controllers/budget-controller');
const router = express.Router();

router.post('/create', budgetController.createBudget);
router.get('/getall', budgetController.getBudgetByTrip);

module.exports = router;
