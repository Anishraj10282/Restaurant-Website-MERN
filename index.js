const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    
  });
  

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/justEatIt', {useNewUrlParser: true, useUnifiedTopology: true},(err)=>
{
    if(!err)
    {
        console.log('Successfully connected');
    }
    else 
    {
        console.log('Error connecting to database');
    }
});
require('./models/dish');

const errorController = require('./controllers/error');
const restaurantRouter = require('./routes/restaurant');
const adminRouter = require('./routes/admin');


app.use('/',restaurantRouter);
app.use('/admin',adminRouter);
app.use(errorController.get404Page);

app.listen(3000,()=>
{
    console.log('Serer Started');
});



