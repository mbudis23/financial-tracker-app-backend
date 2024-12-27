const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoute');
const transactionRoute = require('./routes/transactionRoute');
const budgetRoute = require('./routes/budgetRoute');
const { authenticate } = require('./middlewares/authMiddleware');

dotenv.config();
const app = express();

app.use(bodyParser.json());

connectDB;

app.use('/auth', authRoutes);
app.use('/transaction', authenticate, transactionRoute);
app.use('/budget', authenticate, budgetRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));