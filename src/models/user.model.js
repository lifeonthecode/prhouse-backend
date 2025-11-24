const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        url: String,
        public_id: String,
        bio: String
    },

}, { timestamps: true });

const User = model('user', userSchema);
module.exports = User;