const dotenv = require('dotenv')
dotenv.config()

const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;


const mongoConnect = () => {
    mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to the database');
    })
    .catch((err) => {
        console.error('Failed to connect to the database', err);
    });
};

module.exports = mongoConnect;