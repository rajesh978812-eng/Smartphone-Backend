const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String,
            price: Number,
            image: String,
            quantity: { type: Number, required: true } // Frontend sends 'quantity'
        }
    ],
    amount: { type: Number, required: true },
    status: {
        type: String,
        default: 'Processing',
        enum: ['Processing', 'Shipped', 'Delivered']
    },
    createdAt: { type: Date, default: Date.now }
});

const orderModel = mongoose.model('Order', orderSchema);
module.exports = orderModel;