const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // --- Basic Product Details ---
    name: { 
        type: String, 
        required: [true, "Please enter product name"],
        trim: true
    },
    brand: { 
        type: String, 
        required: [true, "Please enter product brand"]
    },
    price: { 
        type: Number, 
        required: [true, "Please enter product price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    mrp: { 
        type: Number, 
        required: [true, "Please enter MRP price"]
    }, 
    color: { type: String, required: true },
    
    // --- Specifications ---
    ram: { type: Number, required: true },
    storage: { type: Number, required: true },
    display: { type: String, required: true },
    camera: { type: String, default: "50MP" },
    battery: { type: String, default: "5000mAh" },
    
    // --- Image & Description ---
    image: { 
        type: String, 
        required: [true, "Please provide an image URL"]
    },
    description: { 
        type: String, 
        required: [true, "Please enter product description"]
    },
    
    // --- Ratings System ---
    ratings: { 
        type: Number, 
        default: 0 
    },
    numOfReviews: { 
        type: Number, 
        default: 0 
    },

    // --- REVIEWS ARRAY (இதுதான் முன்பு Missing - இப்போது சேர்க்கப்பட்டுள்ளது) ---
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
            comment: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],

    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;