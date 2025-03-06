const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const mongoConnect = require('./utils/mongodb');

// routes
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const newsRoutes = require('./routes/news');

//admin
const {createAdminAccout} = require('./admin/admin')
// Serve the static files from the React app
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


// An api endpoint that returns a short list of items
app.use(express.static(path.join(__dirname, 'client/build')));
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parses form-urlencoded request
app.use(cors({
    origin: 'http://localhost:5173', // Specify the frontend origin
    credentials: true, // Allow cookies and authentication headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));




mongoConnect();
createAdminAccout()
app.use('/user-news', newsRoutes); // news routes
app.use('/news', adminRoutes); // admin routes
app.use('/user', userRoutes); // user routes

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});