const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true,
        trim: true, // Remove extra spaces
        lowercase: true // Standardizes tags (e.g., "AI" and "ai" are treated the same)
    }
})

module.exports = mongoose.model('Tag', TagSchema);

