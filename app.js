const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDatabase = require('./config/connectDatabase');
const cookieParser = require("cookie-parser");

dotenv.config({ path: path.join(__dirname, '.env') });

// Database Connection
connectDatabase();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
     origin: [
        "http://localhost:5173", 
        "https://smartphone-frontend-mtei5zj4f-rajeshs-projects-27e217c3.vercel.app",
          "https://rajesh-smartphone-store.vercel.app/"  // இதுதான் உங்கள் Vercel Link
    ], // Frontend URL
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Import Routes
const products = require('./routes/product');
const orders = require('./routes/order');
const users = require('./routes/user'); // User route-ஐ இணைக்கவும்

// Use Routes
app.use('/api/products', products);
app.use('/api/product', products);
app.use('/api', orders);
app.use('/api/users', users); // User Login/Register-க்கான route

// Health Check
app.get('/', (req, res) => {
    res.send("Server is Working! 🚀");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening to Port ${PORT} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;