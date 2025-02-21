const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes, createHash } = require("crypto");
const { WelcomeEmail } = require("../services/welcome-email");
const sendEmail = require("../services/Reset-Password-email");
const { uploadSingleImage } = require("../services/cloudinary");

exports.signup = async (req, res) => {
    const { name, email, phone_no, gender, password , confirm_password} = req.body;

    try {
        
        const userExists = await Users.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        
        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: "Passwords do not match"
            });
        }


       
        const newUser = await Users.create({
            name,
            email,
            phone_no, 
            gender,
            password
        });

     
        await WelcomeEmail(email);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error("Error during user signup:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
       
        const userExists = await Users.findOne({ email });
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        
        const isPasswordMatched = await bcrypt.compare(password, userExists.password);

        if (!isPasswordMatched) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            });
        }

        const payload = {
            email: userExists.email,
            name: userExists.name,
            _id: userExists._id
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        return res.status(200).json({
            token,
            user:userExists,
            success: true,
            message: "Login successful"
        });
    } catch (error) {
        console.error("Error during login:", error.message);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


exports.forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;

      
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format.",
            });
        }

        const user = await Users.findOne({ email });
        
      
        if (!user) {
            return res.status(200).json({
                success: true,
                message: "If the email exists, a password reset link has been sent.",
            });
        }

       
        const resetToken = crypto.randomBytes(32).toString("hex");

       
        user.reset_password_token = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.reset_password_token_expire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes

       
        await user.save({ validateBeforeSave: false });

     
        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        
        await sendEmail({
            email: user.email,
            subject: "Password Reset Request",
            resetUrl,
        });

        return res.status(200).json({
            success: true,
            message: "If the email exists, a password reset link has been sent.",
        });
    } catch (error) {
        console.error("Error in forgetPassword:", error);

        
        return res.status(500).json({
            success: false,
            message: "An error occurred. Please try again later.",
        });
    }
};


exports.resetPassword = async (req, res) => {


    try {
        const { token } = req.query;
        const { password, confirm_password } = req.body;
        const hashToken = createHash("sha256").update(token).digest("hex");
        const User_Exist = await Users.findOne({
            reset_password_token: hashToken,
            reset_password_token_expire: { $gt: Date.now() }
        });

        if (!User_Exist) {
            return res.status(500).json({
                success: false,
                message: "Token expire or not exists",
            })
        }
        User_Exist.password = password;
        User_Exist.confirm_password = confirm_password;
        User_Exist.reset_password_token = undefined;
        User_Exist.reset_password_token_expire = undefined;
        await User_Exist.save();
        return res.status(200).json({
            success: true,
            message: "Reset Password Successfully",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "error",
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        let { name, phone_no, email, bio } = req.body; // Added `email`
        const { user_id } = req.query; // Ensure user_id is sent as a query parameter
        let updated_object = {};

        // Check and add text fields
        if (name) updated_object.name = name;
        if (email) updated_object.email = email;
        if (bio) updated_object.bio = bio;
        if (phone_no) updated_object.phone_no = phone_no;

        // Handle multiple file uploads
        if (req.files) {
            if (req.files.profile) {
                const uploadedProfile = await uploadSingleImage(req.files.profile[0].path);
                if (uploadedProfile) {
                    updated_object.profile = uploadedProfile.secure_url;
                }
            }
            if (req.files.banner) {
                const uploadedBanner = await uploadSingleImage(req.files.banner[0].path);
                if (uploadedBanner) {
                    updated_object.banner = uploadedBanner.secure_url;
                }
            }
        }

        // Update user in database
        const update_user = await Users.findByIdAndUpdate(user_id, updated_object, { 
            new: true, 
            runValidators: true 
        });

        if (!update_user) {
            return res.status(404).json({ message: "User not found!" });
        }

        return res.status(200).json({ message: "User updated successfully!", update_user });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { user_id } = req.query; // Extract user ID from query parameters

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }

        // Fetch user by ID correctly
        const userExists = await Users.findOne({ _id: user_id });

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "User does not exist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User exists",
            user: userExists,
        });

    } catch (error) {
        console.error("Error fetching user:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message, // Include error details for debugging
        });
    }
};