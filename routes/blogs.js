const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Blog Model
require('../models/Blog');
const Blog = mongoose.model('Blogs');

// Load User Model
require('../models/User');
const User = mongoose.model('User');

// Load Follow Model
require('../models/Follows');
const Follow = mongoose.model('Follow');

// Blog Index Page Route
router.get('/', ensureAuthenticated, (req, res) => {
 Blog.find({user: req.user.id})
 .sort({date: 'desc'})
 .then(blogs => {
    res.render('blogs/index', {
    blogs: blogs
    });
});
});
  
// Add Blog Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('blogs/add');
});

// Process Add Form
router.post('/', ensureAuthenticated, (req, res) => {
let errors = [];

if(!req.body.title) {
    errors.push({text: 'Please add a title'});
}
if(!req.body.details) {
    errors.push({text: 'Please add some details'});
}

// If Errors
if(errors.length > 0) {
    res.render('blogs/add', {
    errors: errors,
    title: req.body.title,
    details: req.body.details
    });
}
// No Errors
 else {
    const newBlog = {
    title: req.body.title,
    details: req.body.details,
    user: req.user.id
    };
// Create New Object
    new Blog(newBlog)
    .save()
    .then(blog => {
    req.flash('success_msg', 'Blog Posted');
    res.redirect('/blogs');
    });
}
});

// Get Blog Posts From followed Users
router.get('/feed', ensureAuthenticated, (req, res) => {
    let ids = []

    Follow.find({
        follower: req.user.id,
        followee: {$ne: req.user.id}
    })
    .populate('follower')
    .populate('followee')
    .then(follows => {

        follows.forEach(followee => {
            ids.push(followee._id);
        });

        Blog.find({user: {$in: ids} })
        .then(blogs => {
            res.render('blogs/feed', {
                blogs: blogs
            });
        });
    });   
});

module.exports = router;

 