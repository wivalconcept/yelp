const Campground = require('../models/campground');
const Review = require('../models/review');
const User = require('../models/user');

module.exports.registerUser = (req,res)=>{
    res.render('users/register')
}
module.exports.createUser = async(req,res,next)=>{
    try{
    const{email,username,password}= req.body;
    const user = new User({email,username});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser, err =>{
        if(err) return next(err);
    req.flash('success','Welcome to Yelp Camp')
    res.redirect('/campgrounds');
    });
    
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }

    // res.send(req.body)
}
module.exports.loginUser = (req,res)=>{
    res.render('users/login')

}
module.exports.returnToLink = (req,res)=>{
    req.flash('success','Welcome Back');
        const redirectUrl = req.session.returnTo || '/campgrounds';
    
    res.redirect(redirectUrl);
    delete req.session.returnTo;
}
module.exports.logoutUser = (req,res, next) =>{
    req.logout(function (err) {
        if (err) {
          return next(err);
        }
        // if you're using express-flash
        req.flash('success', 'You have Logout');
        res.redirect('/login');
      });
}