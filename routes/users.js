const express = require ('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require ('../models/user');
const user = require('../controllers/users');
const passport = require('passport');

router.route('/register')
.get(user.registerUser)
.post(catchAsync( user.createUser))

router.route('/login')
.get(user.loginUser)
.post( passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), user.returnToLink)

router.get('/logout', user.logoutUser)




module.exports = router;