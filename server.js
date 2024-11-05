const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const hospitalAdminRoutes = require('./routes/hospital-admin');

dotenv.config();

const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'karthik_the_bot_of_bots', // Change to your secret key
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure: true only if using HTTPS
}));

// Define routes after setting up middleware
app.use('/api/hospital-admin', hospitalAdminRoutes);

// CORS middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const hospitalRoutes = require('./routes/hospital');
const patientRoutes = require('./routes/patient');
const appointmentRoutes = require('./routes/appointment');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');


// Use Routes
app.use('/api/patient', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('./routes/hospital', hospitalRoutes);
app.use('/api/doctor', doctorRoutes);


// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {}).then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.log('Error connecting to MongoDB:', error));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
