const express = require('express');
const dotenv = require('dotenv')

const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoute');
const transactionRoute = require('./routes/transactionRoute');
const budgetRoute = require('./routes/budgetRoute');

dotenv.config();
const app = express();

connectDB;

app.use('/auth', authRoutes);
app.use('/transaction', transactionRoute);
app.use('/budget', budgetRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));