const ProductModel = require('../models/productModel');

// 1. Create Product (Admin Only)
exports.createProduct = async (req, res, next) => {
    try {
        // புதிய Product உருவாக்கும் Logic
        const product = await ProductModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product Created Successfully",
            product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Get All Products (For Home & Product Page)
exports.getProducts = async (req, res, next) => {
    try {
        // அனைத்து Product-களையும் Database-ல் இருந்து எடுத்தல்
        const products = await ProductModel.find({});
        
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch products. Server Error."
        });
    }
};

// 3. Get Single Product (For Details Page)
exports.getSingleProduct = async (req, res, next) => {
    try {
        // ID-ஐ வைத்து குறிப்பிட்ட Product-ஐ தேடுதல்
        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        // ID தவறாக இருந்தால் வரும் பிழையை கையாளுதல்
        res.status(404).json({
            success: false,
            message: 'Product not found (Invalid ID)'
        });
    }
};

// 4. Delete Product (Admin Only)
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await ProductModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Product-ஐ நீக்குதல்
        await ProductModel.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product Deleted Successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 5. Create or Update Product Review (User Feature)
exports.createProductReview = async (req, res, next) => {
    try {
        const { rating, comment, productId } = req.body;

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // பாதுகாப்பு: reviews array இல்லையென்றால் உருவாக்கு
        if (!product.reviews) {
            product.reviews = [];
        }

        // பயனர் ஏற்கனவே Review செய்துள்ளாரா என சோதித்தல்
        const isReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            // பழைய Review-ஐ Update செய்தல்
            product.reviews.forEach((review) => {
                if (review.user.toString() === req.user._id.toString()) {
                    review.comment = comment;
                    review.rating = rating;
                }
            });
        } else {
            // புதிய Review-ஐ சேர்த்தல்
            product.reviews.push(review);
            product.numOfReviews = product.reviews.length;
        }

        // Average Rating கணக்கிடுதல்
        let avg = 0;
        product.reviews.forEach((rev) => {
            avg += rev.rating;
        });
        product.ratings = avg / product.reviews.length;

        await product.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Review Submitted Successfully"
        });
    } catch (error) {
        console.error("Review Error:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};