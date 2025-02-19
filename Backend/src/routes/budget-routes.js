const express = require('express');
const budgetController = require('../controllers/budget-controller');
const router = express.Router();

router.get('/getall', budgetController.getAllBudgets);
router.post('/create', budgetController.createBudget);

module.exports = router;
