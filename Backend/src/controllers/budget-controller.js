const Budget = require("../models/budget");

exports.createBudget = async (req, res) => {
    try {
        const budget = new Budget(req.body);
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBudgetByTrip = async (req, res) => {
    try {
        const budget = await Budget.findOne({ tripId: req.params.tripId })
            .populate("hotelBudgets foodBudgets transportBudgets");
        if (!budget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json(budget);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);
        if (!budget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json({ message: "Budget deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
