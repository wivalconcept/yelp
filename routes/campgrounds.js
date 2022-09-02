const express = require ('express');
const router = express.Router();
const Campground = require('../models/campground');
const campground = require ('../controllers/campgrounds')
const ExpressError = require ('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('../schema')
const {isLoggedIn, isAuthor,validateCampground} = require('../middleware');
const { populate } = require('../models/campground');

const multer  = require('multer');
const { storage } =require('../cloudinary');
const upload = multer({ storage });



router.route('/')
.get(catchAsync(campground.index ))
.post(isLoggedIn, upload.array('image'),validateCampground, catchAsync(campground.createCampground))
// .post(upload.array('image'),(req,res)=>{
//     console.log(req.body, req.files);
//     res.send('It Worked');
// })

router.get('/new',isLoggedIn, campground.renderNewForm);

router.route('/:id')
.get( catchAsync(campground.showCampground))
.put(isLoggedIn, isAuthor, upload.array('image'),validateCampground, catchAsync( campground.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync( campground.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync( campground.editCampground));





module.exports = router;