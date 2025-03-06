const mongoose = require('mongoose');


const NewsSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true
    },
    text:{
        type: String,
        required: true,
    },
    cathegory:{
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    images:{
        type: String,
        required: true,
    },
    like:{
        type: Number,
        default: 0,
        min: 0  // Ensure the value is not negative
    },
    dislike:{
        type: Number,
        default: 0,
        min: 0  // Ensure the value is not negative
    },  
    tags:[
        {
            type: mongoose.Schema.Types.ObjectId, // Reference to the Tag model
            ref: 'Tag',
            required: true
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

// Index for faster searching
NewsSchema.index({ title: "text", text: "text" }); // Index title and text fields for full-text search

module.exports = mongoose.model('News', NewsSchema);
