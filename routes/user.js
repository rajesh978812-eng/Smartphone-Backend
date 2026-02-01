const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, updatePassword } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);

// --- NEW ROUTES ---
router.get("/profile", isAuthenticatedUser, getUserProfile);
router.put("/profile", isAuthenticatedUser, updateUserProfile);
router.put("/password", isAuthenticatedUser, updatePassword);

module.exports = router;