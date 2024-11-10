const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const hospitalAdminRoutes = require('./routes/hospital-admin');

// Load environment variables
dotenv.config();

const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware to allow requests from the frontend
app.use(cors({
    origin: 'http://localhost:3000', // Update this if your frontend runs on a different port
    credentials: true,
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.log('Error connecting to MongoDB:', error));

// Session middleware with MongoDB store
app.use(session({
    secret: process.env.SESSION_SECRET || 'karthik_the_bot_of_bots', // Use environment variable for the secret key
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 1 day expiration
    }),
    cookie: {
        httpOnly: true, // Helps mitigate XSS attacks
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
    }
}));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const hospitalRoutes = require('./routes/hospital');
const patientRoutes = require('./routes/patient');
const appointmentRoutes = require('./routes/appointment');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const prescriptionRoutes = require('./routes/prescription');
const feedbackRoutes = require('./routes/feedback');

// Define API routes
app.use('/api/hospital-admin', hospitalAdminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/hospital', hospitalRoutes); // Fixed the route definition
app.use('/api/doctor', doctorRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/feedback', feedbackRoutes);

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Logout route
app.get('/api/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ message: 'Logged out successfully' });
    });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
