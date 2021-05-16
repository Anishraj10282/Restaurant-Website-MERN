const mongoose = require('mongoose');
const { use } = require('../routes/restaurant');

const DishModel =  mongoose.model('dishes');
const CategoryModel = mongoose.model('categories');
const UserModel = mongoose.model('users');

exports.getHome = (req, res, next)=>
{
    res.render('restaurant/home');
}

exports.getReservation = (req, res, next)=>
{
    res.render('restaurant/reservation');
}


exports.getAbout = (req, res, next) =>
{
    res.render('restaurant/about');
}

exports.getMenu = async (req, res, next) =>
{
    var answer = [];
    var categories = await CategoryModel.find({});
    for(var i=0;i<categories.length;i++)
    {
        var category= categories[i];
        var categoryDishes = await DishModel.find({category:category._id});
        answer.push({category:category.name, dishes:[...categoryDishes]});
    }
    res.render('restaurant/menu', {category:answer});
}


exports.getOrderOnline = async (req, res, next)=>
{
    var answer = [];
    var categories = await CategoryModel.find({});
    for(var i=0;i<categories.length;i++)
    {
        var category= categories[i];
        var categoryDishes = await DishModel.find({category:category._id});
        answer.push({category:category.name, dishes:[...categoryDishes]});
    }
    res.render('restaurant/order_online', {category:answer});
}

exports.postOrderOnline = async (req, res, next)=>
{
    Object.keys(req.body).forEach(function(key)
    {
        console.log(key, req.body[key]);
    });   
    res.redirect('menu');
}

exports.getLogIn = (req, res, next)=>
{
    res.render('restaurant/login');
}

exports.getSignUp = (req, res, next)=>
{
    res.render('restaurant/signup');
}

exports.postLogIn = async (req, res, next)=>
{
    const password = req.body.password;
    const phone = req.body.phone;
    const user = await UserModel.findOne({phone:phone});

    if(!user){
        return res.render('restaurant/login');
    }
       
    else {
        if(user.password!=req.body.password)
            return res.render('restaurant/login');
        return res.redirect('/order-online')
    };
}

exports.postSignUp = (req, res, next)=>
{
    let user = new UserModel();
    user.name = req.body.name;
    user.phone = req.body.phone;
    user.password = req.body.password;
    user.save();

    res.render('restaurant/login');
}


exports.postAddTocart = async (req, res, next) =>
{
    var pre_orders = req.body;
    var order_keys = Object.keys(req.body);
    var orders = [];
    var total = 0;
    for(var i=0;i<order_keys.length;i++)
    {
        const k = order_keys[i];
        if(pre_orders[k]!='')
        {
            orders.push({_id:k, qty:pre_orders[k]});
        }
    }

    var answer = [];
    var total_after_discount = 0;
    for(var i=0;i<orders.length;i++)
    {
        const id = orders[i]._id;
        const qty = orders[i].qty;
        const dish = await DishModel.findOne({_id:id});
        total += dish.price * qty; 
        total_after_discount += dish.price * (1 - dish.discount/100) * qty;
        answer.push({image:dish.image, price:dish.price,title:dish.title,
            discount:dish.discount, _id:dish._id,qty:qty});
    }

    res.render('restaurant/cart', {orders:answer, total:total.toFixed(2), 
            total_after_discount:total_after_discount.toFixed(2), 
            discount:(total-total_after_discount).toFixed(2)}, );
}