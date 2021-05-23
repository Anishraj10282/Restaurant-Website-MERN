const express = require('express');
const CategoryModel = require('../models/category');
const DishModel = require('../models/dish');
const UserModel = require('../models/user');
const OrderModel = require('../models/orders');
const router = express.Router();
const restaurantController = require('../controllers/restaurant');

const isAuth = require('../middleware/isAuth');


router.get('', isAuth, restaurantController.getHome);
router.get('/about', isAuth, restaurantController.getAbout);
router.get('/reservation', isAuth, restaurantController.getReservation);
router.get('/menu', isAuth, restaurantController.getMenu);
router.get('/order-online', isAuth, restaurantController.getOrderOnline);
router.post('/order-online', isAuth, restaurantController.postOrderOnline);
router.get('/login', restaurantController.getLogIn);
router.post('/login', restaurantController.postLogIn);
router.get('/signup', restaurantController.getSignUp);
router.post('/signup', restaurantController.postSignUp);
router.post('/add-to-cart', isAuth, restaurantController.postAddTocart);
router.post('/continue-to-pay', isAuth, restaurantController.continueToPay);
router.get('/logout', restaurantController.getLogout);

module.exports = router;