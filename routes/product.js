const express = require('express');
const router = express.Router();

// அனைத்து Controller Function-களையும் Import செய்தல்
const { 
    getProducts, 
    getSingleProduct, 
    createProduct, 
    deleteProduct, 
    createProductReview 
} = require('../controllers/productController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// --- PUBLIC ROUTES (அனைவரும் பார்க்கலாம்) ---

// 1. Get All Products
router.route('/').get(getProducts);

// 2. Review Route (User Must be Logged In)
// முக்கியம்: இது '/:id' route-க்கு மேலே இருக்க வேண்டும்
router.route('/review').put(isAuthenticatedUser, createProductReview);

// 3. Get Single Product (By ID)
router.route('/:id').get(getSingleProduct);


// --- ADMIN ROUTES (நிர்வாகிகள் மட்டும்) ---

// 4. Create Product
router.route('/admin/product/new').post(isAuthenticatedUser, authorizeRoles('admin'), createProduct);

// 5. Delete Product
router.route('/admin/product/:id').delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

module.exports = router;