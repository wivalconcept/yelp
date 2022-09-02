if(process.env.NODE_ENV != "production"){
    require ('dotenv').config();
}


const express = require('express');
const methodOverride = require('method-override')
const path= require('path');
const mongoose = require ('mongoose');
const ejsMate = require ("ejs-mate");
const Joi = require ('joi');
const session = require('express-session')
const flash = require ('connect-flash')
const MongoStore = require('connect-mongo');

const { campgroundSchema, reviewSchema } = require('./schema.js')
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review')

const userRoutes = require('./routes/users');
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const User = require('./models/user')
const passport = require('passport');
const LocalStrategy = require('passport-local');


// const dbUrl= process.env.DB_URL;
const dbUrl = process.env.DB_URL||'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl,{

    useNewUrlParser: true,
    useUnifiedTopology:true
  
});
const db =  mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
})



const app = express();
app.engine('ejs',ejsMate);
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use('/public', express.static(path.join(__dirname,'public')))
app.use(mongoSanitize());
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        frameguard: false ,
    })
  );

    const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const sessionConfig= {
    name:'session',
    secret,
  saveUninitialized: false, // don't create session until something stored
  resave: false, //don't save session if unmodified
  store: MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600 // time period in seconds
  }),   
    cookie:{
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true
    }
}
app. use(session(sessionConfig))
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})



app.get('/', (req,res)=>{
    res.render('home')
})

app.use('/',userRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/reviews', reviewsRoutes);

app.all('*',(req,res, next)=>{
    next(new ExpressError('Page Not Found', 404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500} = err;
    if(!err.message) err.message= "Something went wrong";
    res.status(statusCode).render("error",{err});
})

app.listen(3000, ()=>{
    console.log('App Listening on port 3000')
})
// app.get('/campgrounds', catchAsync( async (req,res)=>{
//     const campgrounds = await Campground.find({});

//     res.render('campgrounds/index', {campgrounds})
// }))

// app.get('/campgrounds/new',(req,res)=>{
//     res.render('campgrounds/new')
// })

// app.post('/campgrounds', validateCampground, catchAsync(async (req,res)=>{
//     // if(!req.body.campground) throw new ExpressError('Invalid Campground Data',400);
//     const campground = new Campground(req.body.campground);
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`)
//     // res.send(req.body)
// }))

// app.get('/campgrounds/:id', catchAsync(async (req,res)=>{

//     const campground = await Campground.findById(req.params.id).populate('reviews')
//     // console.log(campground);
//     res.render('campgrounds/show', {campground})
// }))

// app.get('/campgrounds/:id/edit', catchAsync( async (req,res)=>{

//     const campground = await Campground.findById(req.params.id)
//     res.render('campgrounds/edit', {campground})
// }))

// app.put('/campgrounds/:id', validateCampground, catchAsync( async (req,res)=>{
//     const {id} = req.params;
//     const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground})
//     res.redirect(`/campgrounds/${campground._id}`)
// }))

// app.delete('/campgrounds/:id', catchAsync( async (req,res)=>{
//     const {id} = req.params;
//     await Campground.findByIdAndDelete(id);
//     res.redirect('/campgrounds');
// }))

// app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req,res)=>{

//     const campground = await Campground.findById(req.params.id);
//     const review = new Review(req.body.review);
//     campground.reviews.push(review);
//     await review.save();
//     await campground.save();
//     res.redirect(`/campgrounds/${campground._id}`);
    

// }))
// app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req,res)=>{

//     const { id, reviewId } = req.params;
//     await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     // req.flash("success", "Deleted review!");
//     res.redirect(`/campgrounds/${id}`);
// }))

