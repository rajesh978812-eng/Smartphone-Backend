const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        unique: true,
        trim: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please enter a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minLength: [6, "Password must be up to 6 characters"]
    },
     role: {
        type: String,
        default: 'user' // எல்லோரும் முதலில் சாதாரண User தான்
    },
     avatar: { 
        type: String, 
        default: "" 
    },
     address: {
        street: { type: String, default: '' },
        city: { type: String, default: '' },
        state: { type: String, default: '' },
        zip: { type: String, default: '' },
        phone: { type: String, default: '' }
    },
    
    createdAt: { type: Date, default: Date.now }

}, {
    timestamps: true
});

// --- முக்கிய மாற்றம் (FIXED HERE) ---
// 'next' என்பதை நீக்கிவிட்டு, வெறும் async/await மட்டும் பயன்படுத்துகிறோம்.
userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;