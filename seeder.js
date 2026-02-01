const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDatabase = require('./config/connectDatabase');

// 1. productModel-ஐ இங்கே மேலே Import செய்ய வேண்டும் (இதுதான் பிழைக்கான காரணம்)
const productModel = require('./models/productModel');

// 2. JSON ஃபைலை சரியான பாதையில் இருந்து எடுத்தல்
const products = require('./data/products.json');

// 3. .env ஃபைலை சரியாக அமைத்தல்
dotenv.config({ path: './.env' });

// Database உடன் இணைத்தல்
connectDatabase();

const seedProducts = async () => {
    try {
        // பழைய டேட்டாவை அழித்தல்
        await productModel.deleteMany();
        console.log('Old products deleted...');

        // JSON-ல் இல்லாத Camera/Battery போன்றவற்றைச் சேர்த்தல்
        const updatedProducts = products.map(product => {
            return {
                ...product,
                _id: undefined, 
                id: undefined,  
                camera: product.camera || "50MP",       
                battery: product.battery || "5000mAh",  
                ratings: 4.5,
                numOfReviews: Math.floor(Math.random() * 100) 
            };
        });

        // புதிய டேட்டாவை ஏற்றுதல்
        await productModel.insertMany(updatedProducts);
        console.log('✅ All Products Added Successfully!');
        
        // முடித்ததும் வெளியேறுதல்
        process.exit();
        
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
};

seedProducts();