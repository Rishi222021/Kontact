const path = require('path');
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());//for resolving error or resourse sharing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/contacts', require('./routes/contactRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.use(errorHandler);

// Serve Frontend
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, './frontend/dist')));

    app.get('*', (req, res) =>
        res.sendFile(
            path.resolve(__dirname, 'frontend', 'dist', 'index.html')
        )
    );
} else {
    app.get('/', (req, res) => res.send('Please set to production'));
}

app.listen(PORT, () => console.log(`Server started on port ${PORT}`.yellow.bold));
