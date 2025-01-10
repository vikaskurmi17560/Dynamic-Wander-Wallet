const Users = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { randomBytes, createHash } = require("crypto");
const { WelcomeEmail } = require("../services/welcome-email");
const sendEmail = require("../services/Reset-Password-email");

exports.signup = async (req, res) => {
    const { name, email, Address, phone_no, role, gender, password , preferences , expertise , confirm_password } = req.body;

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

        if (role === 'customer' && (!preferences || !preferences.maxBudget)) {
            return res.status(400).json({ message: "Max budget is required for customers." });
        }
        if (role === 'tripPlanner' && (!expertise || !expertise.yearsOfExperience)) {
            return res.status(400).json({ message: "Years of experience is required for trip planners." });
        }

       
        const newUser = await Users.create({
            name,
            email,
            Address,
            phone_no,
            role,
            preferences, 
            expertise,
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
        const { name, email, Address, phone_no, role, preferences , expertise } = req.body;
        const { user_id } = req.query;
  const updated_object = {};
  if (name) {
    updated_object.name = name;
  }
  
  if (email) {
    updated_object.email = email;
  }
  if (Address) {
    updated_object.Address = Address;
  }
  if (phone_no) {
    updated_object.phone_no = phone_no;
  }
  if (role) {
    updated_object.role = role;
  }
  if (preferences) {
    updated_object.preferences = preferences;
  }
  if(expertise){
    updated_object.expertise = expertise;
  }
        const update_user = await User.findByIdAndUpdate(user_id, updated_object, { new: true, runValidators: true });
        if (!update_user) {
            return res.status(404).json({ message: "User not found!" });
        }
        return res.status(200).json({ message: "User updated successfully!", update_user });
    } catch (error) {
       return res.status(500).json({ message: error.message });
    }
}