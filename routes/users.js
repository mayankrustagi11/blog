const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load User Model
require('../models/User');
const User = mongoose.model('User');

// Login Route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Register Route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Register Form Submit
router.post('/register', (req, res) => {
    let errors = [];

    if(req.body.password != req.body.password2) {
        errors.push({text: 'Passwords do not Match'});
    }

    if(req.body.password.length < 6) {
        errors.push({text: 'Password must be atleast 6 characters'});
    }

    if(errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            fname: req.body.fname,
            lname: req.body.lname,
            username: req.body.username
        });
    } else {
        User.findOne({username: req.body.username})
        .then(user => {
            if(user) {
                req.flash('error_msg', 'Username already registered');
                res.redirect('/users/register');
            } else {
                const newUser = new User({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    username: req.body.username,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered');
                            res.redirect('/users/login');
                        })
                        .catch(err => {
                            console.log(err);
                            return;
                        });
                    });
                });
            }
        });
    }
});

// Login Form Submit
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  })

// Logout Route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});

// Follow Route
router.get('/follow', ensureAuthenticated, (req, res) => {
    res.render('users/follow');
});

// Follow User Submit
router.post('/follow/:id', (req, res) => {
    res.send('Follow');
});

module.exports = router;