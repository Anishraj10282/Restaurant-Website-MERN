const mongoose = require('mongoose');

const OrdersSchema = new mongoose.Schema({
    userId : {
        type:String,
        required:true,
    },
    timeStamp:
    {
        type:Date,
        required:true,
    },
    totalAmount:
    {
        type:Number,
        required:true,
    },
    items:{
        type:Array,
        require:true,
    }
})

module.exports = mongoose.model('orders', OrdersSchema);