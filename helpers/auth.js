module.exports = {

    // Check if user Logged In
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Not Authorized');
        res.redirect('/users/login');
    },

    // Check If user not Logged In
    ensureGuest: function(req, res, next) {
        if(req.isAuthenticated()) {
            res.redirect('/');
        } else {
            return next();
        }
    },
}