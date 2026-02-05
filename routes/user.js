const express = require("express");
const router = express.Router();

// --- முக்கிய மாற்றம்: User Model-ஐ இங்கே Import செய்ய வேண்டும் ---
const User = require("../models/userModel"); 
// (குறிப்பு: உங்கள் folder-ல் 'models/userModel.js' பெயர் சரியாக உள்ளதா என பார்க்கவும்)

const { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, updatePassword } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// --- NEW ROUTES ---
router.get("/profile", isAuthenticatedUser, getUserProfile);
router.put("/profile", isAuthenticatedUser, updateUserProfile);
router.put("/password", isAuthenticatedUser, updatePassword);

// --- FORGOT PASSWORD (SIMPLE RESET) ---
router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // 1. பயனரைக் கண்டுபிடி
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    // 2. பாஸ்வேர்டை மாற்று
    user.password = newPassword; 
    await user.save();

    res.json({ message: "Password updated successfully! Login now." });

  } catch (error) {
    console.error("Forgot Password Error:", error); // Error வந்தால் Console-ல் காட்டும்
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;