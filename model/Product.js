const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    category:{
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    price:{
        type: String,
        required: true,
        min: 1,
        max: 1024
    }
});

module.exports = mongoose.model('Product', productSchema);