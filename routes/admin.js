const express = require('express');
const router = express.Router();
const CategoryModel = require('../models/category');
const DishModel = require('../models/dish');
const adminController = require('../controllers/admin');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });


router.get('/orders',  adminController.getOrders);
router.get('/add-item', adminController.getNewItem);
router.post('/add-item',upload.single('avatar'),adminController.postNewItem);
module.exports = router;