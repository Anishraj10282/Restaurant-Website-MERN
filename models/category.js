const mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:true,
    }
});

mongoose.model('categories', CategorySchema);