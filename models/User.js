const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema 
const UserSchema = new Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followed: [{
        followedUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

mongoose.model('User', UserSchema);