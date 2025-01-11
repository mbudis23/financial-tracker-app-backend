const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // Pastikan path ini benar
const logger = require('./utils/logger'); // Import logger yang telah Anda buat
const morgan = require('morgan')
const cookieParser = require('cookie-parser');


// Import routes dan middleware
const authRoutes = require('./routes/authRoute');
const transactionRoute = require('./routes/transactionRoute');
const budgetRoute = require('./routes/budgetRoute');
const reportRoute = require('./routes/reportRoute');
const { authenticate } = require('./middlewares/authMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware untuk body parsing
app.use(bodyParser.json());

// Middleware untuk logging HTTP request dengan morgan
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()), // Pastikan logger.info tersedia
        },
    })
);


// Middleware untuk cookie parser
app.use(cookieParser());


// Koneksi ke database
connectDB(); // Jalankan koneksi database

// Routing
app.use('/', authRoutes);
app.use('/transactions', authenticate, transactionRoute);
app.use('/budgets', authenticate, budgetRoute);
app.use('/reports', authenticate, reportRoute);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => (`Server running on port ${PORT}`));