const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budget-controller');

router.post('/create', budgetController.createBudget);
router.get('/getall', budgetController.getBudgetByTrip);

module.exports = router;
