const Budget = require("../models/budget");
const Hotel = require("../models/hotel");
const Restauatant = require("../models/restaurants");

exports.createBudget = async (req, res) => {
    try {
        const budget = await Budget.create(req.body);
        res.status(201).json({
            success:true,
            message:"Create Budget successfully",
            budget
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getBudgetByTrip = async (req, res) => {
    try {
        const tripId=req.query
        const budget = await Budget.findOne({ tripId:tripId })
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
