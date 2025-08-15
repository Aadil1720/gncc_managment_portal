require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const { protect } = require('./middleware/auth');
const cors = require('cors');


const app= express();

connectDB();


app.use(cors());


// Middlewares
app.use(express.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/students', protect,require('./routes/studentRoutes'));
app.use('/api/fees', protect,require('./routes/feesRoutes'));
app.use('/api/expenditures', require('./routes/expenditureRoutes'));//protect
app.use('/api/match-incomes',require('./routes/MatchIncomeRoutes'));//protect
app.use('/api/reports', protect,require('./routes/reportRoute'));
app.use('/api/auth',require('./routes/authRoutes'))

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});