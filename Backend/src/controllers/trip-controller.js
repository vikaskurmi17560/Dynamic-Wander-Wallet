const Trip = require('../models/trip');
const { uploadSingleImage ,uploadMultipleImages } = require("../services/cloudinary");


// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const savedTrip = await Trip.create(req.body);
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Get all trips for a user
exports.getTripsByUser = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const trips = await Trip.find({ userId }).lean();

    res.status(200).json({
      success: true,
      message: "Get Trip by trip_id successfully",
      trips
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all trips for a user
exports.getTripsByid = async (req, res) => {
  try {
    const { trip_id } = req.query;
    if (!trip_id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const trips = await Trip.findOne({ _id: trip_id });

    res.status(200).json({
      success: true,
      message: "Get Trip by trip_id successfully",
      trips
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};


// Delete a trip by ID
exports.deleteTrip = async (req, res) => {
  try {
    const { trip_id } = req.query;

    if (!trip_id) {
      return res.status(400).json({ error: "Trip ID is required" });
    }

    const deletedTrip = await Trip.findByIdAndDelete(trip_id); 

    if (!deletedTrip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json({
      success: true,
      message: "Trip deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch the TripData Through Id

exports.getTripId = async (req, res) => {
  try {
    const { _id } = req.body;
    const trip = await Trip.findById(_id);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: "Error fetching trip" });
  }
}
// Get All Trips
exports.getAllTrip = async (req, res) => {
  try {

    const trip = await Trip.find();

    if (!trip) {
      return res.status(404).json({ error: "Trip is not here" });
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ error: "Error fetching All trip" });
  }
}

exports.uploadImagesByTripId = async(req,res)=>{
   try {
         
         const { trip_id } = req.query; // Ensure user_id is sent as a query parameter
         let updated_object = {};
 
 
         // Handle multiple file uploads
         if (req.files) {
             if (req.files.cover_image) {
                 const uploadedCoverImage = await uploadSingleImage(req.files.cover_image[0].path);
                 if (uploadedCoverImage) {
                     updated_object.cover_image = uploadedCoverImage.secure_url;
                 }
             }
             if (req.files && req.files.image && req.files.image.length > 0) {
              const uploadedImages = await uploadMultipleImages(req.files.image.map(file => file.path));
              if (uploadedImages && uploadedImages.length > 0) {
                  updated_object.image = uploadedImages.map(img => img.secure_url); // Storing all URLs
              }
          }
          
         }
 
         // Update user in database
         const update_trip = await Trip.findByIdAndUpdate(trip_id, updated_object, { 
             new: true, 
             runValidators: true 
         });
 
         if (!update_trip) {
             return res.status(404).json({ message: "Trip not found!" });
         }
 
         return res.status(200).json({ message: "Trip updated successfully!", update_trip});
 
     } catch (error) {
         return res.status(500).json({ message: error.message });
     }
}