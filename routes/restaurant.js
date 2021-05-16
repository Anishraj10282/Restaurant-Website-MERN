const express = require('express');
const CategoryModel = require('../models/category');
const DishModel = require('../models/dish');
const UserModel = require('../models/user');
const router = express.Router();
const restaurantController = require('../controllers/restaurant');


router.get('', restaurantController.getHome);
router.get('/about',restaurantController.getAbout);
router.get('/reservation',restaurantController.getReservation);
router.get('/menu', restaurantController.getMenu);
router.get('/order-online', restaurantController.getOrderOnline);
router.post('/order-online', restaurantController.postOrderOnline);
router.get('/login', restaurantController.getLogIn);
router.post('/login', restaurantController.postLogIn);
router.get('/signup', restaurantController.getSignUp);
router.post('/signup', restaurantController.postSignUp);
router.post('/add-to-cart', restaurantController.postAddTocart);

module.exports = router;