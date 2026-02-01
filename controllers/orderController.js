const orderModel = require('../models/orderModel');
const productModel = require('../models/productModel');

// Create New Order
exports.createOrder = async (req, res) => {
    try {
        // Frontend-ல் இருந்து { cartItems } என்று வருகிறதா அல்லது நேரடியாக வருகிறதா என்று பார்க்கிறோம்
        const cartItems = req.body.cartItems || req.body; 

        // Validation
        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        let totalAmount = 0;
        let orderItems = [];

        // ஒவ்வொரு பொருளாகச் சரிபார்த்தல்
        for (const item of cartItems) {
            const product = await productModel.findById(item._id);
            
            // பழைய ID பிரச்சனை இருந்தால் கண்டுபிடித்தல்
            if (!product) {
                return res.status(404).json({ 
                    success: false, 
                    message: `Product not found with ID: ${item._id}. Please clear cart and try again.` 
                });
            }

            totalAmount += product.price * item.quantity;
            
            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: item.quantity
            });
        }

        // Create Order
        const order = await orderModel.create({
            cartItems: orderItems,
            amount: totalAmount,
            status: 'Processing',
            user: req.user ? req.user.id : null // User ID (இருந்தால்)
        });

        res.status(201).json({
            success: true,
            order
        });

    } catch (error) {
        console.error("Order Controller Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get My Orders
exports.myOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user.id });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();
        let totalAmount = 0;
        orders.forEach(order => {
            totalAmount += order.amount;
        });

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- புதியது: ADMIN - Update Order Status ---
exports.updateOrder = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.status === "Delivered") {
            return res.status(400).json({ message: "You have already delivered this order" });
        }

        order.status = req.body.status;
        await order.save();

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- புதியது: Create Product (Admin) ---
// இதை productController.js-லும் வைக்கலாம், ஆனால் இங்கேயே இருந்தால் குழப்பம் குறையும்
exports.createProductAdmin = async (req, res) => {
    try {
        const product = await productModel.create(req.body);
        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getSingleOrder = async (req, res, next) => {
    try {
        const order = await orderModel.findById(req.params.id).populate('user', 'name email');
        if (!order) return res.status(404).json({ message: "Order not found with this ID" });

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// exports.createOrder மற்றும் exports.myOrders ஏற்கனவே உள்ளது.
// கீழே உள்ளதை மட்டும் புதிதாகச் சேர்க்கவும்:
// module.exports = { ...exports };