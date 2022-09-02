const express = require ('express');
const router = express.Router({mergeParams:true});
const Review = require('../models/review');
const Campground = require('../models/campground');
const review = require('../controllers/reviews');
const ExpressError = require ('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema, reviewSchema } = require('../schema');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');



router.post('/', isLoggedIn, validateReview, catchAsync(review.postReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(review.deleteReview));



module.exports = router;