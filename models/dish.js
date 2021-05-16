const mongoose = require('mongoose')

var DishSchema = new mongoose.Schema({
    title :
    {
        type:String,
        required:"Required",
    },
    price :
    {
        type:Number,
        required:"Required",
    },
    category:
    {
        type:String,
        required:true,
    },
    discount:
    {
        type:Number,
        required:true,
    },
    quantity:
    {
        type:Number,
        required:true,
    },
    image:
    {
        type:String,
        required:true,
    }
});

mongoose.model('dishes', DishSchema); 