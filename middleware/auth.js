const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.isAuthenticatedUser = async (req, res, next) => {
    let token;

    // 1. Header-ல் "Bearer <token>" என்று வருகிறதா எனப் பார்க்கிறோம்
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // "Bearer " என்ற வார்த்தையை நீக்கிவிட்டு Token-ஐ மட்டும் எடுக்கிறோம்
            token = req.headers.authorization.split(' ')[1];

            // Token-ஐ சரிபார்த்தல்
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User-ஐக் கண்டுபிடித்து req.user-ல் சேமித்தல்
            req.user = await User.findById(decoded.id).select('-password');

            next(); // அடுத்த கட்டத்திற்குச் செல் (Controller)
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
};
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message:` Role (${req.user.role}) is not allowed to access this resource `});
        }
        next();
    }
};