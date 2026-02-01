const express = require('express');
const { createOrder, myOrders, getAllOrders, updateOrder, getSingleOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');
const router = express.Router();

router.route('/order').post(isAuthenticatedUser, createOrder);
router.route('/myorders').get(isAuthenticatedUser, myOrders);

// --- Admin Routes ---
router.route('/admin/orders').get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route('/admin/order/:id').put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder);

// Get Single Order Route
router.route('/order/:id').get(isAuthenticatedUser, getSingleOrder);
module.exports = router;