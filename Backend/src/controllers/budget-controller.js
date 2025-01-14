const Budget = require('../models/budget');

// Create a new budget record
exports.createBudget = async (req, res) => {
  try {
    const budget = new Budget(req.body);
    const savedBudget = await budget.save();
    res.status(201).json(savedBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get budget by Trip ID
exports.getBudgetByTripId = async (req, res) => {
  try {
    const budget = await Budget.findOne({ tripId: req.params.tripId });
    if (!budget) {
      return res.status(404).json({ error: 'Budget record not found for this trip' });
    }
    res.status(200).json(budget);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update budget details for a trip
exports.updateBudgetDetails = async (req, res) => {
  try {
    const { budgetDetails, totalSpent } = req.body;
    const updatedBudget = await Budget.findOneAndUpdate(
      { tripId: req.params.tripId },
      {
        $set: { budgetDetails },
        $inc: { totalSpent },
      },
      { new: true, runValidators: true }
    );

    if (!updatedBudget) {
      return res.status(404).json({ error: 'Budget record not found for this trip' });
    }

    res.status(200).json(updatedBudget);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a budget record
exports.deleteBudget = async (req, res) => {
  try {
    const deletedBudget = await Budget.findOneAndDelete({ tripId: req.params.tripId });
    if (!deletedBudget) {
      return res.status(404).json({ error: 'Budget record not found for this trip' });
    }
    res.status(200).json({ message: 'Budget record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
