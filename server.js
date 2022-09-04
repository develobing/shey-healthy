require('dotenv').config();
require('./config/dbConfig');

const express = require('express');
const logger = require('morgan');
const app = express();
const port = process.env.PORT || 5005;

// Middleware
app.use(express.json());
app.use(logger('dev'));

// Routes
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => console.log(`Node server started at port ${port}`));
