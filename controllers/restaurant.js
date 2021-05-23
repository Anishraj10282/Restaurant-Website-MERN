const mongoose = require('mongoose');
const { use } = require('../routes/restaurant');

const DishModel =  mongoose.model('dishes');
const CategoryModel = mongoose.model('categories');
const UserModel = mongoose.model('users');
const OrderModel = mongoose.model('orders');
const Stripe = require('stripe')('//stripe secret key');

exports.getHome = (req, res, next)=>
{
    var userName = req.user.name;
    var userId = req.user._id;
    res.render('restaurant/home',{userName:userName, userId:userId});
}

exports.getReservation = (req, res, next)=>
{
    res.render('restaurant/reservation', {userName:req.user.name});
}


exports.getAbout = (req, res, next) =>
{
    res.render('restaurant/about', {userName:req.user.name});
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
    res.render('restaurant/menu', {category:answer, userName:req.user.name});
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
    res.render('restaurant/order_online', {category:answer, userName:req.user.name});
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
        else
        {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save();
            return res.redirect('/');
        }
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


    return Stripe.checkout.sessions.create({
        payment_method_types:['card'],
        line_items:answer.map(p=>{
            return {
                currency:'inr',
                name:+p.title * 100,
                amount:+p.price * 100,
                quantity:p.qty,
            }
        }),
        success_url:req.protocol + '://' + req.get('host') + '',
        cancel_url:req.protocol + '://' + req.get('host') + '/order_online',
    }).then(session=>
        {
            res.render('restaurant/cart', {userName:req.user.name,orders:answer, total:total.toFixed(2), 
                total_after_discount:total_after_discount.toFixed(2), 
                discount:(total-total_after_discount).toFixed(2), sessionId:session.id});
        }
    
    )

   
}


exports.continueToPay = (req, res, next)=>
{
    var newOrder = new OrderModel();

    newOrder.userId = req.user._id;
    newOrder.timeStamp = Date.now();
    newOrder.totalAmount = +req.body.total_price;

    var orderKeys = Object.keys(req.body);
    var orders = [];

    for(var i=0;i<orderKeys.length;i++)
    {
        const k = orderKeys[i];
        if(req.body[k]!='total_price')
        {
            orders.push({_id:k, qty:req.body[k]});
        }
    }
    newOrder.items=orders;
    newOrder.save();
    res.redirect('errors/404');
}


exports.getLogout = (req, res, next)=>
{
    req.session.destroy(err=>
        {
            res.redirect('/');
        })
}