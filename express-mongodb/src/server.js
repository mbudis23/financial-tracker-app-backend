const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoute');
const transactionRoute = require('./routes/transactionRoute');
const budgetRoute = require('./routes/budgetRoute');
const reportRoute = require('./routes/reportRoute');
const { authenticate } = require('./middlewares/authMiddleware');

dotenv.config();
const app = express();

app.use(bodyParser.json());

connectDB;

app.use('/', authRoutes);
app.use('/transactions', authenticate, transactionRoute);
app.use('/budgets', authenticate, budgetRoute);
app.use('/reports', authenticate, reportRoute)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));