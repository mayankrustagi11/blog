const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    followee: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

mongoose.model('Follow', FollowSchema);