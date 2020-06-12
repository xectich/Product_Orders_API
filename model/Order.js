const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    date:{
        type:Date,
        default:Date.now
    },
    products:[{
        type:String
    }],
    status:{
        type: String,
        enum: ['Pending', 'Processing','Delivered','Cancelled'],
        default: 'Pending'
    }
});

module.exports = mongoose.model('Order', orderSchema);