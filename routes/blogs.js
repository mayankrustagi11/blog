const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

// Load Blog Model
require('../models/Blog');
const Blog = mongoose.model('Blogs');

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

if(errors.length > 0) {
    res.render('blogs/add', {
    errors: errors,
    title: req.body.title,
    details: req.body.details
    });
} else {
    const newBlog = {
    title: req.body.title,
    details: req.body.details,
    user: req.user.id
    };

    new Blog(newBlog)
    .save()
    .then(blog => {
    req.flash('success_msg', 'Blog Posted');
    res.redirect('/blogs');
    });
}
});

module.exports = router;

