const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 1. REGISTER USER
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill in all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. LOGOUT USER
exports.logoutUser = (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: "Logged Out" });
};

// --- NEW PROFILE FUNCTIONS (இவைதான் விடுபட்டிருக்கலாம்) ---

// 4. GET USER PROFILE
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 5. UPDATE USER PROFILE & ADDRESS
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.avatar = req.body.avatar || user.avatar;
            // Address Update
            user.address = {
                street: req.body.address?.street || user.address?.street || "",
                city: req.body.address?.city || user.address?.city || "",
                state: req.body.address?.state || user.address?.state || "",
                zip: req.body.address?.zip || user.address?.zip || "",
                phone: req.body.address?.phone || user.address?.phone || ""
            };

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                address: updatedUser.address,
                token: generateToken(updatedUser._id),
                 avatar: updatedUser.avatar, 
                token: req.headers.authorization.split(" ")[1]
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 6. CHANGE PASSWORD
exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (user && (await bcrypt.compare(oldPassword, user.password))) {
            user.password = newPassword; 
            await user.save();
            res.json({ message: "Password updated successfully" });
        } else {
            res.status(401).json({ message: "Invalid old password" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};