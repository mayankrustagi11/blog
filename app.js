const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');

const app = express();

// Load Routes
const index = require('./routes/index');
const users = require('./routes/users');
const blogs = require('./routes/blogs');

// Load Models
require('./models/User');
require('./models/Blog');
require('./models/Follows');

// Load Keys
const keys = require('./config/keys');

// Passport Configuration
require('./config/passport')(passport);

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Mongoose Middleware
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI)
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// Express Handlebars Middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash Middleware
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// Use Routes
app.use('/', index);
app.use('/about', index);
app.use('/users', users);
app.use('/blogs', blogs);
 
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});