const express = require('express');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const UserModel = require('./models/user');
const cloudinary = require('cloudinary').v2;
const Stripe = require('stripe')(''); 


cloudinary.config({ 
    // set  your cloundianry api keys
  });
  

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', 'views');

const MONGO_URI = 'mongodb://localhost:27017/justEatIt';





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

const store = new MongoDbStore({
    uri:MONGO_URI,
    collection:'sessions',
})


app.use(session(
    {
        secret:'my secret',
        resave:false,
        store:store,
        saveUninitialized:false,
        cookie:{}
    }
));


app.use((req, res, next)=>
{
    if(!req.session.user)
    {
        return next();
    }

    UserModel.findById(req.session.user._id).then(
        user=>
        {
            req.user = user,
            next();
        }).catch(err=>
            {
                console.log(err);
            });
})

require('./models/dish');

const errorController = require('./controllers/error');
const restaurantRouter = require('./routes/restaurant');
const adminRouter = require('./routes/admin');
const user = require('./models/user');


app.use('/',restaurantRouter);
app.use('/admin',adminRouter);
app.use(errorController.get404Page);

app.listen(3000,()=>
{
    console.log('Serer Started');
});



