const mongoose = require('mongoose');
var DishModel = mongoose.model('dishes');
var CategoryModel = mongoose.model('categories');
const cloudinary = require('cloudinary');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

exports.getOrders = (req, res, next) =>
{
    res.render('admin/orders');
}


exports.getNewItem = async (req, res, next) =>
{
    await CategoryModel.find({}).then(categories=>
    {
        return res.render('admin/add-item', {categories:[ ...categories]});
    });
}

exports.postNewItem = async (req, res, next) =>
{
    console.log(req.file);
    var result= await cloudinary.uploader.upload(req.file.path);
    console.log(result);
    const path = result.url;
    var title = req.body.title;
    var price = req.body.price;
    var category = req.body.category;
    var discount = req.body.discount;
    var quantity = req.body.quantity;

    var dish = new DishModel({image:path,title:title, price:price, 
            category:category,discount:discount, quantity:quantity});
        
    dish.save();
    res.redirect('/admin/orders');
    
}